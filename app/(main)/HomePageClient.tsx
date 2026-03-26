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
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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
  const [page, setPage] = useState(1);
  const params = { limit: HOME_STORIES_LIMIT, page };
  const { data: storiesData, isSuccess, isPending } = useStories(params, {
    initialData:
      page === 1 && initialStories?.items?.length
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
  const totalFromApi = (storiesData as { total?: number })?.total ?? initialStories?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalFromApi / HOME_STORIES_LIMIT));
  const hasMoreStories = totalFromApi > HOME_STORIES_LIMIT;
  const canPrev = page > 1;
  const canNext = page < totalPages;

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

      <section id="stories" className="py-32 relative" aria-labelledby="home-stories-heading">
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-5">
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-500 tracking-tight">
                Stories
              </p>
              <h2
                id="home-stories-heading"
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.02]"
              >
                Explore stories
                <br />
                <span className="text-stone-400 dark:text-stone-500 font-semibold">
                  from the archive.
                </span>
              </h2>
            </div>
            <div className="max-w-md border-l border-stone-200 dark:border-stone-800 pl-8">
              <p className="text-stone-600 dark:text-stone-400 text-base leading-relaxed">
                Narratives from communities, contributors, and partner collections. Browse below, jump in by
                region above, or open a full story to read more.
              </p>
            </div>
          </div>
        </div>

        {isPending ? (
          <p className="text-center py-20 text-stone-500 text-sm">Loading stories…</p>
        ) : stories.length === 0 ? (
          <p className="text-center py-20 text-stone-500 text-sm max-w-md mx-auto px-4">
            No stories yet. Check back soon or contribute your own.
          </p>
        ) : (
          <>
            <StoryGrid stories={stories} />
            <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              {hasMoreStories && totalPages > 1 && (
                <nav className="flex items-center gap-2" aria-label="Stories pagination">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!canPrev}
                    className="p-2 rounded border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500 min-w-24 text-center">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={!canNext}
                    className="p-2 rounded border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>
              )}
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-orange-700 hover:text-orange-800 dark:text-orange-500 cursor-pointer"
              >
                View all stories →
              </Link>
            </div>
          </>
        )}
      </section>

      <div className="bg-stone-100 dark:bg-stone-950/50">
        <ContributionSection initialContributors={initialContributors} />
      </div>
    </main>
  );
}
