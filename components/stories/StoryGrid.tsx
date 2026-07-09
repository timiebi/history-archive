"use client";

import { useToggleStoryReaction } from "@/lib/api";
import { shouldUseNextImageOptimizer } from "@/lib/image-optimizer";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Story {
  id: string;
  title: string;
  category: string;
  region: string;
  year: string;
  image: string;
  excerpt?: string;
  author?: string;
  source?: "CONTRIBUTOR" | "ADMIN" | "EXTERNAL";
  sourceUrl?: string;
  externalSource?: string;
  reactions?: { id: string; type: string; userId: string }[];
}

function StoryCardReaction({ story, userId }: { story: Story; userId: string | null }) {
  const toggle = useToggleStoryReaction(story.id);
  const isInternal = story.source !== "EXTERNAL";
  const myReaction = userId && (story.reactions ?? []).find((r) => r.userId === userId)?.type;
  if (!isInternal || !userId) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle.mutate("HEART");
      }}
      disabled={toggle.isPending}
      className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-colors z-10 cursor-pointer ${myReaction === "HEART" ? "bg-orange-700 text-white" : "bg-white/80 dark:bg-stone-900/80 text-stone-500 hover:text-orange-700"}`}
      aria-label={myReaction === "HEART" ? "Remove heart" : "Heart"}
    >
      <Heart size={14} fill={myReaction === "HEART" ? "currentColor" : "none"} />
    </button>
  );
}

export function StoryGrid({ stories }: { stories: Story[] }) {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const u = localStorage.getItem("archive_user");
      if (u) setUserId((JSON.parse(u) as { id?: string }).id ?? null);
    } catch {
      setUserId(null);
    }
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-l-4 border-orange-800 pl-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white leading-none">
            Latest <span className="text-stone-400">Records</span>
          </h2>
          <p className="mt-4 text-stone-500 dark:text-stone-400 max-w-md font-serif italic">
            "Chronicles of kingdoms, architectural marvels, and the voices of ancestors."
          </p>
        </div>
      </div>

      {/* The Grid */}
      <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <article key={story.id} className="group relative flex flex-col cursor-pointer bg-white/40 dark:bg-stone-900/20 backdrop-blur-md p-4 border border-stone-200/40 dark:border-stone-850/30 rounded-lg hover:shadow-xl hover:shadow-orange-700/2.5 transition-all duration-300 select-none">
            {/* Image Container: fixed aspect box, image fills and covers */}
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-md bg-stone-200 dark:bg-stone-800 mb-6 shadow-sm">
              <StoryCardReaction story={story} userId={userId} />
              <Image
                src={story.image || "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800"}
                alt={story.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                unoptimized={!shouldUseNextImageOptimizer(story.image || "")}
              />
              
              {/* Image Vignette Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-stone-950/45 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300 z-1" />
              
              {/* Region, Source & Contributor Tags */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                <span className="bg-stone-950/85 dark:bg-stone-950/90 backdrop-blur-md text-stone-200 border border-white/10 px-2.5 py-1 text-[9px] font-extrabold tracking-wider uppercase rounded-xs">
                  {story.region || "Africa"}
                </span>
                {story.source === "CONTRIBUTOR" && (
                  <span className="bg-orange-800/90 backdrop-blur-md text-white border border-orange-500/20 px-2.5 py-1 text-[8px] font-black tracking-wider uppercase rounded-xs">
                    Contributor
                  </span>
                )}
                {story.externalSource && (
                  <span className="bg-stone-800/90 backdrop-blur-md text-white border border-stone-700/20 px-2.5 py-1 text-[8px] font-black tracking-wider uppercase rounded-xs">
                    {story.externalSource}
                  </span>
                )}
              </div>

              {/* Year Tag - Floating Bottom Right */}
              <div className="absolute bottom-3 right-3 bg-stone-950/85 dark:bg-stone-950/90 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-xs z-10">
                <p className="text-[9px] font-mono font-bold text-orange-500 tracking-wider">
                  {story.year}
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 px-1">
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.25em] text-orange-800 dark:text-orange-500 mb-2">
                {story.category}
              </span>
              
              <h3 className="text-xl md:text-2xl font-black leading-tight text-stone-900 dark:text-stone-100 group-hover:text-orange-800 dark:group-hover:text-orange-500 transition-colors duration-300 mb-3">
                <a
                  href={story.source === "EXTERNAL" && story.externalSource ? `/stories/external/${encodeURIComponent(story.externalSource)}/${encodeURIComponent(story.id)}` : `/stories/${story.id}`}
                  className="cursor-pointer"
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  {story.title}
                </a>
              </h3>

              {story.excerpt && (
                <p className="text-stone-600 dark:text-stone-400 text-xs md:text-sm font-serif italic line-clamp-2 leading-relaxed mb-6">
                  &quot;{story.excerpt.slice(0, 110)}{story.excerpt.length > 110 ? "..." : ""}&quot;
                </p>
              )}

              {/* Divider and Footer */}
              <div className="mt-auto pt-4 border-t border-stone-200/50 dark:border-stone-850/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-800 group-hover:scale-130 transition-transform duration-300" />
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 group-hover:text-orange-800 dark:group-hover:text-orange-500 transition-colors">
                    View Record
                  </span>
                </div>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300 text-stone-500 group-hover:text-orange-800 dark:group-hover:text-orange-500">
                  &rarr;
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}