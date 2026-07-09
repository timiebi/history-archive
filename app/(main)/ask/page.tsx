"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Citation = { storyId: string; title: string };

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  reading?: { title: string; storyId: string };
};

function chunkText(text: string, maxChars = 2500) {
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length === 0) return [text];

  const chunks: string[] = [];
  let current = "";
  for (const p of paragraphs) {
    const next = current ? `${current}\n\n${p}` : p;
    if (next.length > maxChars && current) {
      chunks.push(current);
      current = p;
    } else {
      current = next;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text];
}

function pickVoice(voices: SpeechSynthesisVoice[], browserLang: string) {
  const base = browserLang.split("-")[0];
  return (
    voices.find((v) => v.lang === browserLang) ||
    voices.find((v) => v.lang?.startsWith(base)) ||
    voices[0]
  );
}

function extractReadTarget(message: string) {
  const trimmed = message.trim();
  if (!trimmed) return null;

  // If user writes: read "Story title"
  const quoted = trimmed.match(/[“"](.+?)[”"]/);
  if (quoted?.[1]) return quoted[1].trim();

  // If user writes: read story <something> / listen <something>
  const cleaned = trimmed
    .replace(/^\s*(read|listen)\s*(story)?\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || null;
}

export default function AskGesiPage() {
  const browserLanguage = useMemo(() => {
    if (typeof window === "undefined") return "en-US";
    return navigator.language || "en-US";
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Ask me about stories in Gesi. You can also say: read “Story title”.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const queueRef = useRef<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const stopSpeaking = () => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    queueRef.current = [];
    setIsSpeaking(false);
  };

  const speakText = (text: string) => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) {
      setTtsError("Text-to-speech is not supported in this browser.");
      return;
    }
    const clean = text?.trim();
    if (!clean) return;

    setTtsError(null);
    stopSpeaking();
    const voices = window.speechSynthesis.getVoices?.() ?? [];
    const voice = pickVoice(voices, browserLanguage);

    queueRef.current = chunkText(clean);
    setIsSpeaking(true);

    const speakNext = () => {
      const next = queueRef.current.shift();
      if (!next) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(next);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || browserLanguage;
      utterance.rate = 1;
      utterance.onend = speakNext;
      utterance.onerror = speakNext;
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  useEffect(() => {
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSend = async () => {
    const msg = input.trim();
    if (!msg || busy) return;

    setInput("");
    setBusy(true);

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: msg };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const maybeReadTarget = extractReadTarget(msg);
      const isReadIntent =
        /^\s*(read|listen)\b/i.test(msg) || /read\s+story/i.test(msg) || /listen\s+story/i.test(msg);

      if (isReadIntent && maybeReadTarget) {
        const readRes = await api.post<{ storyId: string; title: string; text: string }>("/ai/read", {
          target: maybeReadTarget,
        });

        const { storyId, title, text } = readRes.data;
        const readingAck: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Reading: ${title}`,
          reading: { title, storyId },
        };
        setMessages((prev) => [...prev, readingAck]);
        speakText(text);
        return;
      }

      const res = await api.post<{ answer: string; citations?: Citation[] }>("/ai/ask", {
        question: msg,
        browserLanguage,
      });

      const { answer, citations } = res.data ?? { answer: "" };
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer || "I don't have an answer yet.",
        citations: citations ?? [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            err instanceof Error ? err.message : "Something went wrong while talking to Gesi.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] py-24 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">
            Ask Gesi
          </h1>
          <p className="text-stone-500 font-serif italic">
            Ask questions, or say: <span className="font-mono">read “Story title”</span> to hear it aloud.
          </p>
        </div>

        <section className="rounded-none border border-stone-200 dark:border-stone-800 bg-transparent p-0 overflow-hidden">
          <div className="max-h-[60vh] overflow-auto p-4 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={[
                    "inline-block px-4 py-3 rounded-none border",
                    m.role === "user"
                      ? "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900 text-stone-900 dark:text-stone-100"
                      : "bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100",
                  ].join(" ")}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
                        Sources
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {m.citations.map((c) => (
                          <Link
                            key={c.storyId}
                            href={`/stories/${c.storyId}`}
                            className="text-[11px] font-mono underline underline-offset-2 text-orange-800 dark:text-orange-400"
                          >
                            {c.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {ttsError && (
              <p className="text-red-600 dark:text-red-400 font-mono text-xs">{ttsError}</p>
            )}
          </div>

          <div className="border-t border-stone-200 dark:border-stone-800 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={stopSpeaking}
                disabled={!isSpeaking}
                className="rounded-none font-mono text-[10px] uppercase px-4 py-2 min-h-[44px] bg-transparent border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Stop
              </button>
              <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
                {isSpeaking ? "Reading…" : "Ready"}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void onSend();
              }}
              className="flex gap-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Ask: "Who were the griots?" or read “Mansa Musa…”'
                className="flex-1 rounded-none border border-stone-200 dark:border-stone-800 bg-transparent px-4 py-3 font-mono text-sm outline-none focus:border-orange-800"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="rounded-none font-mono text-[10px] uppercase px-6 py-3 min-h-[44px] bg-orange-700 text-white hover:bg-orange-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? "Thinking…" : "Send"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

