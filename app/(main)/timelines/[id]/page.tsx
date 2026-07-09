"use client";

import { useTimeline } from "@/lib/api";
import { shouldUseNextImageOptimizer } from "@/lib/image-optimizer";
import Image from "next/image";
import type {
  TimelineDetail,
  TimelineDetailStory,
  TimelineDetailManuscript,
  TimelineDetailArtifact,
} from "@/lib/api/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FileText, BookOpen, Archive } from "lucide-react";

/** Normalized timeline with stories/manuscripts/artifacts always arrays */
type TimelineDetailNormalized = Omit<TimelineDetail, "stories" | "manuscripts" | "artifacts"> & {
  stories: TimelineDetailStory[];
  manuscripts: TimelineDetailManuscript[];
  artifacts: TimelineDetailArtifact[];
};

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

function normalizeTimeline(data: TimelineDetail | null | undefined): TimelineDetailNormalized | null {
  if (!data) return null;
  return {
    ...data,
    stories: data.stories ?? [],
    manuscripts: data.manuscripts ?? [],
    artifacts: data.artifacts ?? [],
  };
}

export default function TimelineDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;
  const { data, isPending, isError } = useTimeline(id);
  const timeline = normalizeTimeline(data);

  if (!id) {
    return (
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex items-center justify-center">
        <p className="text-sm text-stone-500">Invalid timeline link.</p>
      </main>
    );
  }

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex items-center justify-center">
        <p className="text-sm text-stone-500">Loading timeline…</p>
      </main>
    );
  }

  if (isError || !timeline) {
    return (
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex flex-col items-center justify-center px-6">
        <p className="text-sm text-stone-500 mb-4">We couldn&apos;t find that timeline.</p>
        <Link href="/timelines" className="text-orange-700 text-sm font-medium hover:underline">
          ← All timelines
        </Link>
      </main>
    );
  }

  const { name, description, startYear, endYear, stories, manuscripts, artifacts, source, externalContext } = timeline;
  const yearRange = `${formatYear(startYear)}${endYear != null ? ` – ${formatYear(endYear)}` : ""}`;

  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/timelines" className="inline-block text-orange-700 font-mono text-[10px] uppercase tracking-widest mb-8 hover:underline">
          ← All timelines
        </Link>

        <header className="mb-12">
          <span className="text-orange-700 font-mono text-[10px] uppercase tracking-[0.3em] block mb-2">
            {yearRange}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white leading-tight">
            {name}
          </h1>
          {description && (
            <p className="mt-4 text-stone-500 dark:text-stone-400 font-serif italic max-w-2xl">
              {description}
            </p>
          )}
        </header>

        <section className="mb-14">
          <h2 className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-black uppercase tracking-widest text-xs mb-6">
            <FileText size={16} /> Stories
          </h2>
          {stories.length === 0 ? (
            <p className="text-stone-500 font-mono text-sm">No stories on this timeline yet.</p>
          ) : (
            <ul className="space-y-4">
              {stories.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/stories/${s.id}`}
                    className="block border border-stone-200 dark:border-stone-800 rounded-none p-5 hover:border-orange-400 dark:hover:border-orange-600 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                  >
                    <h3 className="font-semibold text-stone-900 dark:text-white">{s.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-stone-500 text-xs">
                      {s.category?.name && <span>{s.category.name}</span>}
                      {s.country?.name && <span>{s.country.name}</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mb-14">
          <h2 className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-semibold text-base mb-6">
            <BookOpen size={18} aria-hidden /> Library
          </h2>
          {manuscripts.length === 0 ? (
            <p className="text-stone-500 text-sm">No library items linked to this timeline yet.</p>
          ) : (
            <ul className="space-y-3">
              {manuscripts.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/library/${m.id}`}
                    className="block border border-stone-200 dark:border-stone-800 rounded-none p-4 hover:border-orange-400 dark:hover:border-orange-600 transition-colors"
                  >
                    <span className="font-medium text-stone-900 dark:text-white">{m.title}</span>
                    <span className="text-stone-500 text-xs ml-2">— {m.author} · {m.era}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-semibold text-base mb-6">
            <Archive size={18} aria-hidden /> Artifacts
          </h2>
          {artifacts.length === 0 ? (
            <p className="text-stone-500 text-sm">No artifacts linked to this timeline yet.</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {artifacts.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/artifacts/${a.id}`}
                    className="block border border-stone-200 dark:border-stone-800 rounded-none overflow-hidden hover:border-orange-400 dark:hover:border-orange-600 transition-colors"
                  >
                    {a.image ? (
                      <div className="aspect-4/3 bg-stone-200 dark:bg-stone-800 relative">
                        <Image
                          src={a.image}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, 250px"
                          className="object-cover"
                          unoptimized={!shouldUseNextImageOptimizer(a.image)}
                        />
                      </div>
                    ) : null}
                    <div className="p-4">
                      <span className="font-medium text-stone-900 dark:text-white">{a.name}</span>
                      <p className="text-stone-500 text-xs mt-1">{a.origin} · {a.year}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {source === "EXTERNAL_FALLBACK" ? (
          <section className="mt-14 p-6 border border-stone-200 dark:border-stone-800">
            <p className="text-stone-500 text-xs font-medium mb-2">Reference context</p>
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              Additional context may be available from external sources. All content is displayed in-app; no external links.
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
