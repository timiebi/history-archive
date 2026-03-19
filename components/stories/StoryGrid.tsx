"use client";

import { useToggleStoryReaction } from "@/lib/api";
import { Heart } from "lucide-react";
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
      <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <article key={story.id} className="group relative flex flex-col cursor-pointer">
            {/* Image Container: fixed aspect box, image fills and covers */}
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-sm bg-stone-200 dark:bg-stone-800 mb-6">
              <StoryCardReaction story={story} userId={userId} />
              <img
                src={story.image || "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800"}
                alt={story.title}
                className="absolute inset-0 w-full h-full object-cover transition duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Region, Source & Contributor Tags */}
              <div className="absolute top-0 left-0 flex flex-wrap gap-1">
                <span className="bg-stone-900 text-stone-100 px-3 py-1 text-[10px] font-black tracking-widest uppercase">
                  {story.region || "Africa"}
                </span>
                {story.source === "CONTRIBUTOR" && (
                  <span className="bg-orange-800 text-white px-3 py-1 text-[9px] font-black tracking-widest uppercase">
                    Contributor
                  </span>
                )}
                {story.externalSource && (
                  <span className="bg-stone-600 text-white px-3 py-1 text-[9px] font-black tracking-widest uppercase">
                    {story.externalSource}
                  </span>
                )}
              </div>

              {/* Year Tag - Floating Bottom Right */}
              <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm px-3 py-1 border border-stone-200 dark:border-stone-800">
                <p className="text-[10px] font-bold text-orange-800 dark:text-orange-500 tracking-tighter">
                  {story.year}
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2">
                {story.category}
              </span>
              
              <h3 className="text-2xl font-bold leading-tight text-stone-900 dark:text-stone-100 group-hover:text-orange-800 dark:group-hover:text-orange-500 transition-colors duration-300 mb-4">
                <a
                  href={story.source === "EXTERNAL" && story.externalSource ? `/stories/external/${encodeURIComponent(story.externalSource)}/${encodeURIComponent(story.id)}` : `/stories/${story.id}`}
                  className="cursor-pointer"
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  {story.title}
                </a>
              </h3>

              {/* Divider and Footer */}
              <div className="mt-auto pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-800" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                    View Record
                  </span>
                </div>
                <span className="group-hover:translate-x-2 transition-transform duration-300 text-stone-400">
                  →
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}