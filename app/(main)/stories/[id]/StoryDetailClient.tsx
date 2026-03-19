"use client";

import { useMarkNotificationRead, useStory, useToggleStoryReaction } from "@/lib/api";
import { Heart, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

function normalizeSections(input: unknown): Array<{ text: string; image?: string }> {
  if (!Array.isArray(input)) return [];
  return input
    .map((section) => {
      const text = typeof section === "object" && section && "text" in section ? (section as { text?: unknown }).text : "";
      const image =
        typeof section === "object" && section && "image" in section ? (section as { image?: unknown }).image : undefined;
      return {
        text: typeof text === "string" ? text : String(text ?? ""),
        image: typeof image === "string" ? image : undefined,
      };
    })
    .filter((section) => section.text.trim().length > 0 || section.image?.trim());
}

export function StoryDetailClient({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const { data: story, isPending, isError } = useStory(id);
  const [userId, setUserId] = useState<string | null>(null);
  const toggleReaction = useToggleStoryReaction(id);
  const markNotificationRead = useMarkNotificationRead();
  const queueRef = useRef<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const u = localStorage.getItem("archive_user");
      if (u) setUserId((JSON.parse(u) as { id?: string }).id ?? null);
    } catch {
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    const notificationId = searchParams.get("notificationId");
    if (!notificationId) return;
    markNotificationRead.mutate(notificationId);
  }, [markNotificationRead, searchParams]);

  const stopSpeaking = () => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    queueRef.current = [];
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the user navigates to another story while TTS is playing,
  // cancel immediately so audio never continues from the previous story.
  useEffect(() => {
    stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const reactions = (story?.reactions as { id: string; type: string; userId: string }[] | undefined) ?? [];
  const myReaction = userId ? reactions.find((r) => r.userId === userId)?.type : null;
  const isInternal = story && (story.source as string) !== "EXTERNAL";

  if (isPending) {
    return (
      <article className="bg-[#fcfaf7] dark:bg-stone-950 min-h-screen pb-20 flex items-center justify-center">
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest">Loading story…</p>
      </article>
    );
  }

  if (isError || !story) {
    return (
      <article className="bg-[#fcfaf7] dark:bg-stone-950 min-h-screen pb-20 flex items-center justify-center">
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest">Story not found. It may have been removed or the link is incorrect.</p>
      </article>
    );
  }

  const cover = story.cover ?? story.image;
  const sections = normalizeSections(story.sections);
  const hasSections = sections.length > 0;
  const s = {
    title: story.title,
    category: typeof story.category === "object" && story.category?.name ? story.category.name : (story as { category?: string }).category ?? "",
    publishedAt: story.publishedAt ?? story.year ?? "",
    author: story.author ?? "",
    content: typeof story.content === "string" ? story.content : String(story.content ?? ""),
    cover: cover && String(cover).trim() ? cover : "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1200",
    source: (story as { source?: string }).source ?? "",
    externalSource: (story as { externalSource?: string }).externalSource ?? "",
  };

  // v1 requirement: read only the story body (no labels like Era/Author)
  const storyBodyText = hasSections
    ? sections.map((section) => section.text).join("\n\n").trim()
    : (s.content ?? "").trim();

  const chunkText = (text: string, maxChars = 2500) => {
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
  };

  const speakStoryBody = () => {
    if (typeof window === "undefined") return;
    setTtsError(null);

    if (!("speechSynthesis" in window)) {
      setTtsError("Text-to-speech is not supported in this browser.");
      return;
    }
    if (!storyBodyText) {
      setTtsError("Story text is not available for reading.");
      return;
    }

    stopSpeaking();

    const browserLang = navigator.language || "en-US";
    const browserBase = browserLang.split("-")[0];
    const voices = window.speechSynthesis.getVoices?.() ?? [];
    const voice =
      voices.find((v) => v.lang === browserLang) ||
      voices.find((v) => v.lang?.startsWith(browserBase)) ||
      voices[0];

    queueRef.current = chunkText(storyBodyText);
    setIsSpeaking(true);

    const speakNext = () => {
      const next = queueRef.current.shift();
      if (!next) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(next);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || browserLang;
      utterance.rate = 1;
      utterance.onend = speakNext;
      utterance.onerror = speakNext;
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  return (
    <article className="bg-[#fcfaf7] dark:bg-stone-950 min-h-screen pb-32 md:pb-20">
      <header className="relative h-[60vh] md:h-[80vh] w-full">
        <img src={s.cover} alt={s.title} className="object-cover h-full w-full" />
        <div className="absolute inset-0 bg-linear-to-t from-[#fcfaf7] dark:from-stone-950 via-stone-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20">
          <div className="max-w-4xl mx-auto">
            <span className="bg-orange-700 text-white px-4 py-1 text-[10px] font-black tracking-[0.3em] uppercase mb-6 inline-block">
              {s.category}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] text-stone-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] dark:text-white">
              {s.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 border-b border-stone-200 dark:border-stone-800 flex flex-wrap gap-8 items-center text-xs font-bold uppercase tracking-widest text-stone-500">
        <div>Era: <span className="text-stone-900 dark:text-stone-100">{s.publishedAt || "—"}</span></div>
        <div className="h-1 w-1 rounded-full bg-orange-600" />
        <div>Author: <span className="text-stone-900 dark:text-stone-100">{s.author || "Archive"}</span></div>
        {(s.externalSource || s.source) && (
          <>
            <div className="h-1 w-1 rounded-full bg-orange-600" />
            <div>Source: <span className="text-stone-900 dark:text-stone-100">{s.externalSource || s.source}</span></div>
          </>
        )}
        {isInternal && userId && (
          <>
            <div className="h-1 w-1 rounded-full bg-orange-600" />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => toggleReaction.mutate("LIKE")}
                disabled={toggleReaction.isPending}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed ${myReaction === "LIKE" ? "text-orange-700" : "text-stone-400 hover:text-stone-600"}`}
                aria-pressed={myReaction === "LIKE"}
              >
                <ThumbsUp size={16} />
                <span>Like</span>
              </button>
              <button
                type="button"
                onClick={() => toggleReaction.mutate("HEART")}
                disabled={toggleReaction.isPending}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed ${myReaction === "HEART" ? "text-orange-700" : "text-stone-400 hover:text-stone-600"}`}
                aria-pressed={myReaction === "HEART"}
              >
                <Heart size={16} />
                <span>Heart</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* v1 TTS controls (fixed so users can stop anytime) */}
      <div className="hidden md:block fixed right-6 top-24 z-50">
        <div className="bg-[#fcfaf7] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 w-[240px] space-y-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={speakStoryBody}
              disabled={!storyBodyText || isSpeaking}
              className="rounded-none font-mono text-[10px] uppercase cursor-pointer px-3 py-3 min-h-[44px] bg-orange-700 text-white hover:bg-orange-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {isSpeaking ? "Reading…" : "Read"}
            </button>
            <button
              type="button"
              onClick={stopSpeaking}
              disabled={!isSpeaking}
              className="rounded-none font-mono text-[10px] uppercase cursor-pointer px-3 py-3 min-h-[44px] bg-transparent border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              Stop
            </button>
          </div>
          {ttsError && (
            <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400">{ttsError}</p>
          )}
        </div>
      </div>

      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-[#fcfaf7] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-3">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={speakStoryBody}
              disabled={!storyBodyText || isSpeaking}
              className="rounded-none font-mono text-[10px] uppercase cursor-pointer px-4 py-2 min-h-[44px] bg-orange-700 text-white hover:bg-orange-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {isSpeaking ? "Reading…" : "Read"}
            </button>
            <button
              type="button"
              onClick={stopSpeaking}
              disabled={!isSpeaking}
              className="rounded-none font-mono text-[10px] uppercase cursor-pointer px-4 py-2 min-h-[44px] bg-transparent border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              Stop
            </button>
          </div>
          {ttsError && (
            <p className="mt-2 text-[10px] font-mono uppercase text-red-600 dark:text-red-400">{ttsError}</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {hasSections ? (
          <div className="space-y-16 md:space-y-24">
            {sections.map((section, i) => (
              <section key={i} className="space-y-8">
                <div className="prose prose-stone lg:prose-xl dark:prose-invert max-w-none">
                  <p className="font-serif leading-relaxed first-letter:text-6xl first-letter:font-black first-letter:text-orange-700 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.85]">
                    {section.text}
                  </p>
                </div>
                {section.image?.trim() ? (
                  <figure className="my-10">
                    <img
                      src={section.image}
                      alt=""
                      className="w-full aspect-video object-cover rounded-sm"
                    />
                  </figure>
                ) : null}
              </section>
            ))}
          </div>
        ) : (
          <div className="prose prose-stone lg:prose-2xl dark:prose-invert prose-dropcap:text-orange-700">
            <p className="font-serif leading-relaxed first-letter:text-8xl first-letter:font-black first-letter:text-orange-700 first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8]">
              {s.content}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
