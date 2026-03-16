"use client";

import { useStory, useToggleStoryReaction } from "@/lib/api";
import { Heart, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";

export function StoryDetailClient({ id }: { id: string }) {
  const { data: story, isPending, isError } = useStory(id);
  const [userId, setUserId] = useState<string | null>(null);
  const toggleReaction = useToggleStoryReaction(id);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const u = localStorage.getItem("archive_user");
      if (u) setUserId((JSON.parse(u) as { id?: string }).id ?? null);
    } catch {
      setUserId(null);
    }
  }, []);

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
  const sections = (story.sections as { text: string; image?: string }[] | undefined) ?? [];
  const hasSections = sections.length > 0;
  const s = {
    title: story.title,
    category: typeof story.category === "object" && story.category?.name ? story.category.name : (story as { category?: string }).category ?? "",
    publishedAt: story.publishedAt ?? story.year ?? "",
    author: story.author ?? "",
    content: story.content ?? "",
    cover: cover && String(cover).trim() ? cover : "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1200",
    source: (story as { source?: string }).source ?? "",
    externalSource: (story as { externalSource?: string }).externalSource ?? "",
  };

  return (
    <article className="bg-[#fcfaf7] dark:bg-stone-950 min-h-screen pb-20">
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
