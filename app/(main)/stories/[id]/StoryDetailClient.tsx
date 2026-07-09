"use client";

import { StoryHeroImage } from "@/components/stories/StoryHeroImage";
import { useMarkNotificationRead, useStory, useToggleStoryReaction } from "@/lib/api";
import { shouldUseNextImageOptimizer } from "@/lib/image-optimizer";
import { scrollToPlanYourVisitSection } from "@/lib/scroll-to-plan-visit";
import { useShowPlanVisitCta } from "@/lib/use-show-plan-visit-cta";
import { 
  Heart, 
  MapPin, 
  ThumbsUp, 
  Volume2, 
  Bot, 
  Play, 
  Pause, 
  Square, 
  ChevronUp, 
  Sliders, 
  Type, 
  VolumeX,
  Sparkles,
  Compass,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";

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
  const showVisitCta = useShowPlanVisitCta(id);
  const [userId, setUserId] = useState<string | null>(null);
  const toggleReaction = useToggleStoryReaction(id);
  const markNotificationRead = useMarkNotificationRead();
  
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  
  // UX State
  const [fontSizeScale, setFontSizeScale] = useState<"normal" | "large" | "extra">("normal");
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<0 | 1 | 2>(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load User Id
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const u = localStorage.getItem("archive_user");
      if (u) setUserId((JSON.parse(u) as { id?: string }).id ?? null);
    } catch {
      setUserId(null);
    }
  }, []);

  // Mark notification read
  useEffect(() => {
    const notificationId = searchParams.get("notificationId");
    if (!notificationId) return;
    markNotificationRead.mutate(notificationId);
  }, [markNotificationRead, searchParams]);

  // Load Synthesis Voices
  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadVoices = () => {
      if ("speechSynthesis" in window) {
        const available = window.speechSynthesis.getVoices() ?? [];
        setVoices(available);
        
        // Auto-select English or system default
        const def = available.find(v => v.default) || available.find(v => v.lang.startsWith("en")) || available[0];
        if (def) setSelectedVoiceURI(def.voiceURI);
      }
    };
    loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Track Reading Progress and Scroll Depth
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollPercent((window.scrollY / total) * 100);
      }
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hands-free Auto-Scroll effect
  useEffect(() => {
    if (autoScrollSpeed === 0) return;
    const interval = setInterval(() => {
      window.scrollBy({ top: 1, behavior: "auto" });
    }, autoScrollSpeed === 1 ? 55 : 30);
    return () => clearInterval(interval);
  }, [autoScrollSpeed]);

  const cover = story?.cover ?? story?.image;
  const sections = useMemo(() => normalizeSections(story?.sections), [story]);
  const hasSections = sections.length > 0;

  const s = useMemo(() => {
    if (!story) return null;
    return {
      title: story.title,
      category: typeof story.category === "object" && story.category?.name ? story.category.name : (story as { category?: string }).category ?? "",
      publishedAt: story.publishedAt ?? story.year ?? "",
      author: story.author ?? "",
      content: typeof story.content === "string" ? story.content : String(story.content ?? ""),
      cover: cover && String(cover).trim() ? cover : "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1200",
      source: (story as { source?: string }).source ?? "",
      externalSource: (story as { externalSource?: string }).externalSource ?? "",
    };
  }, [story, cover]);

  // Split text content into paragraphs to align with voice indexing if has no structural sections
  const textBlocks = useMemo(() => {
    if (!s) return [];
    if (hasSections) {
      return sections.map((sec) => sec.text);
    }
    return (s.content ?? "").split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  }, [s, hasSections, sections]);

  const stopSpeaking = () => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveParagraphIndex(null);
  };

  // Clean speaking on unmount
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  // Cancel speak when changing story ID
  useEffect(() => {
    stopSpeaking();
  }, [id]);

  const speakNext = (index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    // Stop any current reading
    window.speechSynthesis.cancel();

    if (index >= textBlocks.length || index < 0) {
      setIsSpeaking(false);
      setIsPaused(false);
      setActiveParagraphIndex(null);
      return;
    }

    setActiveParagraphIndex(index);
    setIsSpeaking(true);
    setIsPaused(false);

    const textToRead = textBlocks[index];
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Apply voice selections
    if (selectedVoiceURI) {
      const activeVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (activeVoice) utterance.voice = activeVoice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => {
      speakNext(index + 1);
    };

    utterance.onerror = (e) => {
      if (e.error !== "interrupted") {
        speakNext(index + 1);
      }
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const playTTS = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTtsError("Text-to-speech is not supported on this browser.");
      return;
    }
    if (textBlocks.length === 0) {
      setTtsError("No readable story text found.");
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    } else {
      speakNext(activeParagraphIndex ?? 0);
    }
  };

  const pauseTTS = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const speakFromIndex = (index: number) => {
    speakNext(index);
  };

  if (isPending) {
    return (
      <article className="bg-[#fafaf9] dark:bg-[#0c0a09] min-h-screen pb-20 flex items-center justify-center">
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest animate-pulse">Loading Gesi Record…</p>
      </article>
    );
  }

  if (isError || !story || !s) {
    return (
      <article className="bg-[#fafaf9] dark:bg-[#0c0a09] min-h-screen pb-20 flex items-center justify-center">
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest">Story not found. It may have been removed.</p>
      </article>
    );
  }

  const reactions = (story.reactions as { id: string; type: string; userId: string }[] | undefined) ?? [];
  const myReaction = userId ? reactions.find((r) => r.userId === userId)?.type : null;
  const isInternal = (story.source as string) !== "EXTERNAL";  // Font sizes map
  const fontSizeClass = 
    fontSizeScale === "large" 
      ? "text-lg md:text-xl leading-relaxed" 
      : fontSizeScale === "extra" 
      ? "text-xl md:text-2xl leading-loose" 
      : "text-base md:text-lg leading-relaxed";

  return (
    <article className="bg-[#fafaf9] dark:bg-[#0c0a09] min-h-screen pb-32">
      {/* Dynamic Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-orange-750 dark:bg-orange-500 z-55 transition-all duration-100" 
        style={{ width: `${scrollPercent}%` }}
      />

      <header className="relative h-[60vh] md:h-[80vh] w-full select-none">
        <StoryHeroImage src={s.cover} alt={s.title} />
        <div className="absolute inset-0 bg-linear-to-t from-[#fafaf9] dark:from-[#0c0a09] via-stone-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20">
          <div className="max-w-4xl mx-auto">
            <span className="bg-primary text-white px-4 py-1 text-[10px] font-mono font-black tracking-[0.3em] uppercase mb-6 inline-block rounded-xs">
              {s.category}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] text-stone-55 drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] dark:text-white">
              {s.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Metadata & Actions Ribbon */}
      <div className="max-w-4xl mx-auto px-6 py-8 border-b border-stone-200/60 dark:border-stone-850/60 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-xs font-mono font-bold uppercase tracking-widest text-stone-500">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <div>Era: <span className="text-stone-900 dark:text-stone-200">{s.publishedAt || "—"}</span></div>
          <div className="h-1.5 w-1.5 rounded-full bg-orange-600/60" />
          <div>Author: <span className="text-stone-900 dark:text-stone-200">{s.author || "Gesi Record"}</span></div>
          {(s.externalSource || s.source) && (
            <>
              <div className="h-1.5 w-1.5 rounded-full bg-orange-600/60" />
              <div>Source: <span className="text-stone-900 dark:text-stone-200">{s.externalSource || s.source}</span></div>
            </>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-5">
          {isInternal && userId && (
            <>
              <button
                type="button"
                onClick={() => toggleReaction.mutate("LIKE")}
                disabled={toggleReaction.isPending}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed ${myReaction === "LIKE" ? "text-orange-700" : "text-stone-400 hover:text-stone-600"}`}
                aria-pressed={myReaction === "LIKE"}
              >
                <ThumbsUp size={15} aria-hidden />
                <span>Like</span>
              </button>
              <button
                type="button"
                onClick={() => toggleReaction.mutate("HEART")}
                disabled={toggleReaction.isPending}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed ${myReaction === "HEART" ? "text-orange-700" : "text-stone-400 hover:text-stone-600"}`}
                aria-pressed={myReaction === "HEART"}
              >
                <Heart size={15} aria-hidden />
                <span>Heart</span>
              </button>
            </>
          )}
          {showVisitCta ? (
            <button
              type="button"
              onClick={scrollToPlanYourVisitSection}
              className="flex items-center gap-1.5 text-stone-400 hover:text-orange-700 dark:hover:text-orange-400 transition-colors cursor-pointer"
            >
              <MapPin size={15} aria-hidden />
              <span>Visit</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12 mt-12">
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="prose prose-stone dark:prose-invert max-w-none">
            {hasSections ? (
              <div className="space-y-16 md:space-y-24">
                {sections.map((section, i) => {
                  const active = activeParagraphIndex === i;
                  return (
                    <section key={i} className="space-y-8">
                      <div 
                        className={`relative group transition-all duration-300 rounded-lg ${
                          active 
                            ? "bg-orange-700/5 dark:bg-orange-500/5 border-l-2 border-orange-600 pl-4 py-3 scale-[1.01] shadow-[0_4px_20px_rgba(249,115,22,0.04)]" 
                            : "border-l-2 border-transparent pl-4 hover:border-stone-200 dark:hover:border-stone-850"
                        }`}
                      >
                        {/* Float hover speaker to read from this section */}
                        <button
                          type="button"
                          onClick={() => speakFromIndex(i)}
                          className="absolute -left-9 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-primary dark:text-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 hidden md:flex items-center justify-center hover:shadow-[0_0_10px_rgba(249,115,22,0.15)]"
                          title="Read from here"
                        >
                          <Volume2 size={13} />
                        </button>

                        <p className={`font-serif leading-relaxed text-stone-900 dark:text-stone-200 transition-opacity duration-300 ${fontSizeClass} ${!active && isSpeaking ? "opacity-60" : "opacity-100"}`}>
                          {i === 0 ? (
                            <span className="first-letter:text-6xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-[0.85] first-letter:font-serif">
                              {section.text}
                            </span>
                          ) : section.text}
                        </p>
                      </div>

                      {section.image?.trim() ? (
                        <figure className="my-10">
                          <div className="relative w-full aspect-video rounded-xs overflow-hidden border border-stone-200/30 dark:border-stone-850/40">
                            <Image
                              src={section.image}
                              alt=""
                              fill
                              sizes="(max-width: 1024px) 100vw, 896px"
                              className="object-cover"
                              unoptimized={!shouldUseNextImageOptimizer(section.image)}
                            />
                          </div>
                        </figure>
                      ) : null}
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {textBlocks.map((block, i) => {
                  const active = activeParagraphIndex === i;
                  return (
                    <div 
                      key={i}
                      className={`relative group transition-all duration-300 rounded-lg ${
                        active 
                          ? "bg-orange-700/5 dark:bg-orange-500/5 border-l-2 border-orange-600 pl-4 py-3 scale-[1.01] shadow-[0_4px_20px_rgba(249,115,22,0.04)]" 
                          : "border-l-2 border-transparent pl-4 hover:border-stone-200 dark:hover:border-stone-850"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => speakFromIndex(i)}
                        className="absolute -left-9 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-primary dark:text-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-sm active:scale-95 hidden md:flex items-center justify-center hover:shadow-[0_0_10px_rgba(249,115,22,0.15)]"
                        title="Read from here"
                      >
                        <Volume2 size={13} />
                      </button>

                      <p className={`font-serif leading-relaxed text-stone-900 dark:text-stone-200 transition-opacity duration-300 ${fontSizeClass} ${!active && isSpeaking ? "opacity-60" : "opacity-100"}`}>
                        {i === 0 ? (
                          <span className="first-letter:text-6xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-[0.85] first-letter:font-serif">
                            {block}
                          </span>
                        ) : block}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tourism Experience Card (End of Story) */}
            <div className="mt-16 bg-linear-to-br from-amber-700/5 to-orange-800/10 border border-orange-500/20 p-8 rounded-2xl space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Compass className="text-primary animate-spin-slow" size={20} />
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-primary">
                    Gesi Tourism Integration
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase text-stone-500">In Partnership with Booking.com</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-2">
                  <h3 className="text-xl font-black uppercase italic tracking-tight text-stone-900 dark:text-white leading-tight">
                    Ready to explore {s.category} first-hand?
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed">
                    Book guided heritage itineraries, local accommodation, and expert historical guides. Save 10% on preservation-certified packages.
                  </p>
                </div>
                <div className="md:col-span-1">
                  <Link
                    href={`/visit?destination=${encodeURIComponent(s.category)}`}
                    className="w-full py-4 px-6 bg-primary hover:bg-orange-850 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <span>Book Expedition</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Panel (Desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white/70 dark:bg-stone-950/70 backdrop-blur-md border border-stone-200/50 dark:border-stone-850/60 p-6 rounded-2xl shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-stone-200/40 dark:border-stone-850/40 pb-3">
                <Bot size={18} className="text-primary dark:text-orange-400" />
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-stone-900 dark:text-stone-200">
                  Gesi Reader Assistant
                </span>
              </div>

              {/* Speech Engine Controls */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {!isSpeaking || isPaused ? (
                    <button
                      type="button"
                      onClick={playTTS}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-orange-800 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-lg transition shadow-md hover:shadow-orange-800/10 cursor-pointer active:scale-98"
                    >
                      <Play size={12} fill="currentColor" />
                      <span>{isPaused ? "Resume" : "Voice Read"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={pauseTTS}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 hover:bg-stone-850 dark:bg-stone-800 dark:hover:bg-stone-750 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-lg transition cursor-pointer active:scale-98"
                    >
                      <Pause size={12} fill="currentColor" />
                      <span>Pause</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={stopSpeaking}
                    disabled={!isSpeaking && !isPaused}
                    className="p-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 rounded-lg transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Stop Voice"
                  >
                    <Square size={13} fill="currentColor" />
                  </button>
                </div>

                {ttsError && (
                  <p className="text-[10px] font-mono uppercase text-red-650 dark:text-red-400 bg-red-500/5 p-2 rounded-xs border border-red-500/10">
                    {ttsError}
                  </p>
                )}

                {/* Voice Accent Selector */}
                {voices.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-mono font-black uppercase tracking-widest text-stone-500 flex items-center gap-1">
                      <Sparkles size={10} /> Accent & Voice
                    </label>
                    <select
                      value={selectedVoiceURI || ""}
                      onChange={(e) => setSelectedVoiceURI(e.target.value)}
                      className="w-full text-[10px] font-mono p-2 bg-stone-100/50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-600 text-stone-800 dark:text-stone-200"
                    >
                      {voices.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Speech Configuration Sliders */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-mono font-black uppercase tracking-widest text-stone-500">
                      Speed: {rate}x
                    </label>
                    <input
                      type="range"
                      min="0.8"
                      max="1.8"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value))}
                      className="w-full accent-orange-700 cursor-pointer h-1 rounded-lg bg-stone-200 dark:bg-stone-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-mono font-black uppercase tracking-widest text-stone-500">
                      Pitch: {pitch}x
                    </label>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.1"
                      value={pitch}
                      onChange={(e) => setPitch(parseFloat(e.target.value))}
                      className="w-full accent-orange-700 cursor-pointer h-1 rounded-lg bg-stone-200 dark:bg-stone-800"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-200/40 dark:border-stone-850/40 my-4" />

              {/* Font Size & Auto-Scroll Sizers */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[8px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                    Text Scale
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { label: "Normal", value: "normal" },
                      { label: "Large", value: "large" },
                      { label: "Extra", value: "extra" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFontSizeScale(opt.value as "normal" | "large" | "extra")}
                        className={`py-1.5 px-2 text-[9px] font-mono font-black uppercase border rounded-md cursor-pointer transition-colors ${
                          fontSizeScale === opt.value
                            ? "bg-stone-900 border-stone-900 text-white dark:bg-stone-100 dark:border-stone-100 dark:text-stone-900"
                            : "bg-transparent border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[8px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                    Auto Scroll
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { label: "Off", value: 0 },
                      { label: "Slow", value: 1 },
                      { label: "Fast", value: 2 }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAutoScrollSpeed(opt.value as 0 | 1 | 2)}
                        className={`py-1.5 px-2 text-[9px] font-mono font-black uppercase border rounded-md cursor-pointer transition-colors ${
                          autoScrollSpeed === opt.value
                            ? "bg-stone-900 border-stone-900 text-white dark:bg-stone-100 dark:border-stone-100 dark:text-stone-900"
                            : "bg-transparent border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tourism Tour Spotlight Card in Sidebar */}
            <div className="bg-linear-to-br from-amber-700/5 to-orange-800/10 border border-orange-500/20 p-5 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                 <Compass size={16} className="text-primary animate-spin-slow" />
                 <span className="text-[10px] font-mono font-black uppercase tracking-widest text-primary">
                   Heritage Tour
                 </span>
              </div>
              <h4 className="text-sm font-black uppercase text-stone-900 dark:text-white leading-tight">
                Visit {s.category} In Person
              </h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed">
                Walk the soil where this history unfolded. Book custom guided expeditions to local monuments and preservation complexes.
              </p>
              <Link
                href={`/visit?destination=${encodeURIComponent(s.category)}`}
                className="w-full py-2.5 bg-primary hover:bg-orange-800 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Find Tours</span>
                <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Settings Panel Drawer & Trigger */}
      <button
        type="button"
        onClick={() => setMobileSettingsOpen(true)}
        className="lg:hidden fixed bottom-24 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-linear-to-r from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg border border-orange-700/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Bot size={15} />
        <span>Reader Assistant</span>
      </button>

      {/* Mobile Drawer (Bottom Sheet) */}
      <div
        className={`lg:hidden fixed inset-0 z-45 transition-all duration-300 ${
          mobileSettingsOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setMobileSettingsOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" />
        
        <div
          className={`absolute bottom-24 left-4 right-4 bg-[#fafaf9]/95 dark:bg-[#0c0a09]/95 backdrop-blur-xl border border-stone-200/50 dark:border-stone-850/60 p-6 rounded-2xl shadow-2xl transition-transform duration-300 ease-out space-y-6 ${
            mobileSettingsOpen ? "translate-y-0 scale-100" : "translate-y-24 scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-1 bg-stone-300 dark:bg-stone-800 rounded-full mx-auto" />
          
          <div className="flex items-center gap-2 border-b border-stone-200/40 dark:border-stone-850/40 pb-3">
            <Bot size={16} className="text-orange-700 dark:text-orange-400" />
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-stone-900 dark:text-stone-200">
              Gesi Mobile Reader Settings
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {!isSpeaking || isPaused ? (
                <button
                  type="button"
                  onClick={playTTS}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-lg transition active:scale-98 cursor-pointer"
                >
                  <Play size={12} fill="currentColor" />
                  <span>{isPaused ? "Resume" : "Voice Read"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={pauseTTS}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 dark:bg-stone-800 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-lg transition active:scale-98 cursor-pointer"
                >
                  <Pause size={12} fill="currentColor" />
                  <span>Pause</span>
                </button>
              )}

              <button
                type="button"
                onClick={stopSpeaking}
                disabled={!isSpeaking && !isPaused}
                className="p-3 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 rounded-lg transition cursor-pointer disabled:opacity-40"
              >
                <Square size={13} fill="currentColor" />
              </button>
            </div>

            {voices.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-[8px] font-mono font-black uppercase tracking-widest text-stone-500">
                  Select Accent Voice
                </label>
                <select
                  value={selectedVoiceURI || ""}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className="w-full text-[10px] font-mono p-2.5 bg-stone-100/50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-600 text-stone-805 dark:text-stone-200"
                >
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[8px] font-mono font-black uppercase tracking-widest text-stone-500">
                  Reading Speed ({rate}x)
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="1.8"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full accent-orange-700 cursor-pointer h-1 rounded-lg bg-stone-200 dark:bg-stone-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-mono font-black uppercase tracking-widest text-stone-500">
                  Reading Pitch ({pitch}x)
                </label>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-orange-700 cursor-pointer h-1 rounded-lg bg-stone-200 dark:bg-stone-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-stone-200/40 dark:border-stone-850/40 pt-4">
            <div className="space-y-1.5">
              <span className="text-[8px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                Text Scale
              </span>
              <div className="flex gap-1">
                {["normal", "large", "extra"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFontSizeScale(opt as "normal" | "large" | "extra")}
                    className={`flex-1 py-1.5 px-2 text-[9px] font-mono font-black uppercase border rounded-md cursor-pointer transition-colors ${
                      fontSizeScale === opt
                        ? "bg-stone-900 border-stone-900 text-white dark:bg-stone-100 dark:border-stone-100 dark:text-stone-900"
                        : "bg-transparent border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    {opt.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[8px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                Auto Scroll
              </span>
              <div className="flex gap-1">
                {[0, 1, 2].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAutoScrollSpeed(opt as 0 | 1 | 2)}
                    className={`flex-1 py-1.5 px-2 text-[9px] font-mono font-black uppercase border rounded-md cursor-pointer transition-colors ${
                      autoScrollSpeed === opt
                        ? "bg-stone-900 border-stone-900 text-white dark:bg-stone-100 dark:border-stone-100 dark:text-stone-900"
                        : "bg-transparent border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    {opt === 0 ? "Off" : opt === 1 ? "Slow" : "Fast"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileSettingsOpen(false)}
            className="w-full py-3 border border-stone-200 dark:border-stone-850/60 font-mono text-[9px] font-black uppercase tracking-widest text-stone-600 dark:text-stone-400 rounded-lg cursor-pointer hover:bg-stone-100/50 dark:hover:bg-stone-900/50 active:scale-98 transition-all"
          >
            Close Settings
          </button>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 left-6 z-40 p-3.5 bg-[#fafaf9] dark:bg-[#0c0a09] border border-stone-200 dark:border-stone-800 hover:border-orange-500/50 text-stone-700 dark:text-stone-300 rounded-full shadow-lg active:scale-95 transition-all cursor-pointer"
          title="Back to top"
        >
          <ChevronUp size={16} />
        </button>
      )}
    </article>
  );
}
