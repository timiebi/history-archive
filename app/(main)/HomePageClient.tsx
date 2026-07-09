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
import { HOME_STORIES_PAGE_SIZE } from "@/lib/home-stories";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

const HOME_STORIES_LIMIT = HOME_STORIES_PAGE_SIZE;

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
    /** Server already fetched the same page/limit — avoid an immediate duplicate request. */
    staleTime: page === 1 && initialStories?.items?.length ? 5 * 60 * 1000 : 60 * 1000,
    refetchOnMount: page === 1 && initialStories?.items?.length ? false : undefined,
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

      <div className="py-20 border-b border-stone-200/50 dark:border-stone-850/60">
        <RegionNav />
      </div>

      <FeaturedSpotlight story={featuredStory} />

      {/* Heritage Tourism Spotlight Section */}
      <section className="py-24 bg-stone-50/50 dark:bg-stone-950/20 border-b border-stone-200/50 dark:border-stone-850/60" aria-labelledby="tourism-spotlight-heading">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-orange-850 dark:text-orange-500 block">
                Preservation & Tourism
              </span>
              <h2 id="tourism-spotlight-heading" className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">
                Walk the Soils of Empires
              </h2>
              <p className="text-stone-600 dark:text-stone-400 font-serif italic text-sm sm:text-base max-w-2xl">
                Experience heritage first-hand. We collaborate with local historical custodians and booking agencies to offer verified guided itineraries.
              </p>
            </div>
            <Link
              href="/visit"
              className="inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-primary hover:text-orange-800 dark:text-orange-400 cursor-pointer shrink-0"
            >
              Explore All Safaris &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "mali",
                name: "Mud Architecture Trail",
                desc: "Explore the ancient adobe mosques of Djenné and library reserves of Timbuktu.",
                dest: "Djenné & Timbuktu, Mali",
                price: "$1,480",
                img: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600",
              },
              {
                id: "zimbabwe",
                name: "Stone Citadel Journey",
                desc: "Stand amongst the massive mortarless granite enclosures of Great Zimbabwe.",
                dest: "Masvingo, Zimbabwe",
                price: "$980",
                img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
              },
              {
                id: "egypt",
                name: "Giza & Nile Antiquity Safari",
                desc: "Walk the Sphinx temple complexes and navigate the Nile on a traditional felucca.",
                dest: "Giza, Egypt",
                price: "$1,150",
                img: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=600",
              }
            ].map((tour) => (
              <div key={tour.id} className="group relative flex flex-col bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-850/60 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={tour.img}
                    alt={tour.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white text-[9px] font-mono uppercase tracking-wider flex items-center gap-1">
                    <span className="text-orange-500">★</span> <span>4.9 ratings</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                      {tour.dest}
                    </span>
                    <h3 className="text-lg font-black uppercase text-stone-900 dark:text-white leading-tight">
                      {tour.name}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed line-clamp-2">
                      {tour.desc}
                    </p>
                  </div>
                  <div className="border-t border-stone-100 dark:border-stone-850/60 pt-4 flex items-center justify-between">
                    <div className="text-[9px] font-mono uppercase text-stone-500">
                      From: <span className="text-stone-950 dark:text-white font-bold">{tour.price}</span>
                    </div>
                    <Link
                      href={`/visit?tour=${tour.id}`}
                      className="text-[9px] font-mono font-black uppercase tracking-widest text-primary hover:text-orange-850 dark:hover:text-orange-400 flex items-center gap-1"
                    >
                      <span>Book Tour</span> &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                  from Gesi.
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
