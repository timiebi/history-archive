"use client";

import { ArchiveModuleGrid } from "@/components/home/archiveModularGrid";
import { ContributionSection } from "@/components/home/contributionSection";
import { Hero } from "@/components/home/hero";
import { RegionNav } from "@/components/home/regionNav";
import { FeaturedSpotlight } from "@/components/home/stories";
import { StoryGrid } from "@/components/stories/StoryGrid";
import { useStories } from "@/lib/api";
import { storyToStoryDisplay } from "@/lib/api/mappers";
import type { Story } from "@/lib/api/types";
import Link from "next/link";
import { useMemo } from "react";

const HOME_STORIES_LIMIT = 6;

type InitialStories = { items?: unknown[]; total?: number };
type InitialContributors = { items?: { id: string; name: string; email?: string }[] };

export function HomePageClient({
  initialStories,
  initialContributors,
}: {
  initialStories: InitialStories;
  initialContributors: InitialContributors;
}) {
  const params = { limit: HOME_STORIES_LIMIT, page: 1 };
  const { data: storiesData, isSuccess, isPending } = useStories(params, {
    initialData:
      initialStories?.items?.length
        ? { items: initialStories.items as Story[] }
        : undefined,
  });

  const stories = useMemo(() => {
    if (!isSuccess || !storiesData?.items?.length) return [];
    return (storiesData.items as Story[]).map((s) => {
      const d = storyToStoryDisplay(s);
      return {
        id: d.id,
        title: d.title,
        category: d.category ?? "",
        region: d.region ?? "",
        year: d.year ?? "",
        image: d.image ?? "",
        author: d.author,
        source: d.source,
        sourceUrl: d.sourceUrl,
        externalSource: d.externalSource,
        excerpt: d.excerpt,
      };
    });
  }, [isSuccess, storiesData?.items]);

  const featuredStory = stories[0] ?? null;
  const totalFromApi = (storiesData as { total?: number })?.total ?? 0;
  const hasMoreStories = totalFromApi > HOME_STORIES_LIMIT;

  return (
    <main className="bg-[#fafaf9] dark:bg-[#0c0a09] transition-colors duration-300">
      <section className="relative">
        <Hero />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block" aria-hidden>
          <div className="w-px h-12 bg-linear-to-b from-orange-800 to-transparent animate-scroll-hint" />
        </div>
      </section>

      <section className="relative z-10 -mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <ArchiveModuleGrid />
        </div>
      </section>

      <div className="py-20 border-b border-stone-100 dark:border-stone-900">
        <RegionNav />
      </div>

      <FeaturedSpotlight story={featuredStory} />

      <section id="stories" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-700 animate-pulse" />
                <span className="text-orange-800 dark:text-orange-500 font-black tracking-[0.4em] uppercase text-[10px]">
                  Database_Access // Port_80
                </span>
              </div>
              <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8]">
                Explore <br />
                <span className="text-stone-300 dark:text-stone-800">The Records.</span>
              </h2>
            </div>
            <div className="max-w-xs border-l border-stone-200 dark:border-stone-800 pl-8">
              <p className="text-stone-500 font-serif italic text-lg leading-relaxed">
                Filtered access to the Sovereign archives. Selecting historical nodes from across the continent.
              </p>
            </div>
          </div>
        </div>

        {isPending ? (
          <p className="text-center py-20 text-stone-500 font-mono text-sm uppercase tracking-widest">Loading stories…</p>
        ) : stories.length === 0 ? (
          <p className="text-center py-20 text-stone-500 font-mono text-sm uppercase tracking-widest">No stories yet. Check back soon or contribute your own.</p>
        ) : (
          <>
            <StoryGrid stories={stories} />
            {hasMoreStories && (
              <div className="max-w-7xl mx-auto px-6 mt-12 text-center">
                <Link
                  href="/stories"
                  className="inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-orange-700 hover:text-orange-800 dark:text-orange-500"
                >
                  View all records →
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      <div className="bg-stone-100 dark:bg-stone-950/50">
        <ContributionSection initialContributors={initialContributors} />
      </div>
    </main>
  );
}
