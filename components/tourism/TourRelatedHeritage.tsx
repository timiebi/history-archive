"use client";

import {
  useArtifacts,
  useCultures,
  useManuscript,
  useStory,
  useTimeline,
} from "@/lib/api";
import type { Artifact } from "@/lib/api/client";
import type { Culture, Manuscript, Story, TimelineDetail } from "@/lib/api/types";
import type { Tour } from "@/lib/tourism";
import { ArrowRight, ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function SectionShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4" aria-label={title}>
      <h2 className="text-xl font-black uppercase italic tracking-tight text-stone-900 dark:text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}

function EmptyNote({ message }: { message: string }) {
  return (
    <div className="bg-white/70 dark:bg-stone-950/70 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-6">
      <p className="text-xs text-stone-500 dark:text-stone-400 font-serif italic leading-relaxed">
        {message}
      </p>
    </div>
  );
}

function LoadingNote() {
  return (
    <p className="text-[9px] font-mono uppercase tracking-widest text-stone-400 animate-pulse">
      Loading Gesi archive…
    </p>
  );
}

function ErrorNote({ label }: { label: string }) {
  return (
    <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500">
      Could not load {label}. Try again later.
    </p>
  );
}

function storyHref(story: Story): string {
  if (story.externalSource && story.externalId) {
    return `/stories/external/${encodeURIComponent(story.externalSource)}/${encodeURIComponent(story.externalId)}`;
  }
  return `/stories/${story.id}`;
}

function RelatedStoryCard({ id }: { id: string }) {
  const { data: story, isPending, isError } = useStory(id);

  if (isPending) return <LoadingNote />;
  if (isError || !story) return <ErrorNote label="story" />;

  const image = story.image || story.cover;
  const excerpt =
    story.excerpt ||
    (typeof story.content === "string" ? story.content.slice(0, 160) : "") ||
    "";

  return (
    <Link
      href={storyHref(story)}
      className="group flex flex-col bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-850/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all"
    >
      <div className="relative aspect-video bg-stone-100 dark:bg-stone-850">
        {image ? (
          <Image src={image} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400">
            <ImageOff size={22} />
          </div>
        )}
      </div>
      <div className="p-5 space-y-2 flex-1 flex flex-col">
        <span className="text-[8px] font-mono uppercase tracking-widest text-orange-800 dark:text-orange-500">
          Story
        </span>
        <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white leading-tight group-hover:text-primary transition">
          {story.title}
        </h3>
        {excerpt ? (
          <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic line-clamp-3 leading-relaxed">
            {excerpt}
            {excerpt.length >= 160 ? "…" : ""}
          </p>
        ) : null}
        <span className="mt-auto pt-2 inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase tracking-widest text-primary">
          Read in archive <ArrowRight size={10} />
        </span>
      </div>
    </Link>
  );
}

function RelatedTimelineCard({ id }: { id: string }) {
  const { data: timeline, isPending, isError } = useTimeline(id);

  if (isPending) return <LoadingNote />;
  if (isError || !timeline) return <ErrorNote label="timeline" />;

  const t = timeline as TimelineDetail;
  const years =
    t.endYear != null ? `${t.startYear} – ${t.endYear}` : `${t.startYear}`;

  return (
    <Link
      href={`/timelines/${t.id}`}
      className="block bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-850/60 rounded-2xl p-6 space-y-3 hover:shadow-lg transition-all group"
    >
      <span className="text-[8px] font-mono uppercase tracking-widest text-orange-800 dark:text-orange-500">
        Timeline
      </span>
      <h3 className="text-base font-black uppercase italic tracking-tight text-stone-900 dark:text-white group-hover:text-primary transition">
        {t.name}
      </h3>
      <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500">{years}</p>
      {t.description ? (
        <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic line-clamp-4 leading-relaxed">
          {t.description}
        </p>
      ) : null}
      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase tracking-widest text-primary">
        Open timeline <ArrowRight size={10} />
      </span>
    </Link>
  );
}

function RelatedCultureCard({ culture }: { culture: Culture }) {
  return (
    <Link
      href="/cultures"
      className="block bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-850/60 rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
    >
      <div className="relative aspect-[16/10] bg-stone-100 dark:bg-stone-850">
        {culture.image ? (
          <Image src={culture.image} alt={culture.name} fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400">
            <ImageOff size={22} />
          </div>
        )}
      </div>
      <div className="p-5 space-y-2">
        <span className="text-[8px] font-mono uppercase tracking-widest text-orange-800 dark:text-orange-500">
          Culture
        </span>
        <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white group-hover:text-primary transition">
          {culture.name}
        </h3>
        <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500">{culture.region}</p>
        {culture.description ? (
          <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic line-clamp-3">
            {culture.description}
          </p>
        ) : null}
        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase tracking-widest text-primary">
          Browse cultures <ArrowRight size={10} />
        </span>
      </div>
    </Link>
  );
}

function RelatedArtifactCard({ artifact }: { artifact: Artifact }) {
  return (
    <Link
      href={`/artifacts/${artifact.id}`}
      className="block bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-850/60 rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
    >
      <div className="relative aspect-square bg-stone-100 dark:bg-stone-850">
        {artifact.image ? (
          <Image src={artifact.image} alt={artifact.name} fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400">
            <ImageOff size={22} />
          </div>
        )}
      </div>
      <div className="p-4 space-y-1.5">
        <span className="text-[8px] font-mono uppercase tracking-widest text-orange-800 dark:text-orange-500">
          Artifact
        </span>
        <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white leading-tight group-hover:text-primary transition">
          {artifact.name}
        </h3>
        <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500">
          {artifact.origin} · {artifact.year}
        </p>
      </div>
    </Link>
  );
}

function RelatedManuscriptCard({ id }: { id: string }) {
  const { data: manuscript, isPending, isError } = useManuscript(id);

  if (isPending) return <LoadingNote />;
  if (isError || !manuscript) return <ErrorNote label="archive record" />;

  const m = manuscript as Manuscript;

  return (
    <Link
      href={`/library/${m.id}`}
      className="block bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-850/60 rounded-2xl p-5 space-y-2 hover:shadow-lg transition-all group"
    >
      <span className="text-[8px] font-mono uppercase tracking-widest text-orange-800 dark:text-orange-500">
        Archive
      </span>
      <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white group-hover:text-primary transition">
        {m.title}
      </h3>
      <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500">
        {m.author} · {m.era}
      </p>
      {m.summary ? (
        <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic line-clamp-3">{m.summary}</p>
      ) : null}
      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase tracking-widest text-primary">
        Open manuscript <ArrowRight size={10} />
      </span>
    </Link>
  );
}

/**
 * Phase 2 — Tourism consumes existing Gesi hooks only.
 * Empty related ID arrays → elegant empty state (no invented content).
 */
export function TourRelatedHeritage({ tour }: { tour: Tour }) {
  const cultureIds = tour.relatedCultureIds;
  const artifactIds = tour.relatedArtifactIds;
  const libraryIds = tour.relatedLibraryIds;

  const culturesQuery = useCultures(undefined, {
    enabled: cultureIds.length > 0,
  });
  const artifactsQuery = useArtifacts({
    enabled: artifactIds.length > 0,
  });

  const relatedCultures =
    culturesQuery.data?.items?.filter((c) => cultureIds.includes(c.id)) ?? [];
  const relatedArtifacts =
    (artifactsQuery.data ?? []).filter((a) => artifactIds.includes(a.id)) ?? [];

  return (
    <div className="space-y-12">
      {/* Stories */}
      <SectionShell title="Related Stories">
        {tour.relatedStoryIds.length === 0 ? (
          <EmptyNote message="No linked Stories for this destination yet. When archive relationships are added, they will appear here." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tour.relatedStoryIds.map((id) => (
              <RelatedStoryCard key={id} id={id} />
            ))}
          </div>
        )}
      </SectionShell>

      {/* Timelines */}
      <SectionShell title="Related Timeline">
        {tour.relatedTimelineIds.length === 0 ? (
          <EmptyNote message="No linked Timeline for this destination yet." />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tour.relatedTimelineIds.map((id) => (
              <RelatedTimelineCard key={id} id={id} />
            ))}
          </div>
        )}
      </SectionShell>

      {/* Cultures */}
      <SectionShell title="Related Cultures">
        {cultureIds.length === 0 ? (
          <EmptyNote message="No linked Cultures for this destination yet." />
        ) : culturesQuery.isPending ? (
          <LoadingNote />
        ) : culturesQuery.isError ? (
          <ErrorNote label="cultures" />
        ) : relatedCultures.length === 0 ? (
          <EmptyNote message="Linked culture IDs were not found in the live archive." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedCultures.map((c) => (
              <RelatedCultureCard key={c.id} culture={c} />
            ))}
          </div>
        )}
      </SectionShell>

      {/* Artifacts */}
      <SectionShell title="Related Artifacts">
        {artifactIds.length === 0 ? (
          <EmptyNote message="No linked Artifacts for this destination yet." />
        ) : artifactsQuery.isPending ? (
          <LoadingNote />
        ) : artifactsQuery.isError ? (
          <ErrorNote label="artifacts" />
        ) : relatedArtifacts.length === 0 ? (
          <EmptyNote message="Linked artifact IDs were not found in the live archive." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {relatedArtifacts.map((a) => (
              <RelatedArtifactCard key={a.id} artifact={a} />
            ))}
          </div>
        )}
      </SectionShell>

      {/* Library / Archive */}
      <SectionShell title="Related Archive Records">
        {libraryIds.length === 0 ? (
          <EmptyNote message="No linked Library / Archive records for this destination yet." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {libraryIds.map((id) => (
              <RelatedManuscriptCard key={id} id={id} />
            ))}
          </div>
        )}
      </SectionShell>

      {/* Map context — existing /map only; no Map code changes */}
      <SectionShell title="Map context">
        <div className="bg-white/70 dark:bg-stone-950/70 border border-stone-200/50 dark:border-stone-850/60 rounded-2xl p-6 space-y-3">
          <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed">
            {tour.mapLocation.label}
            {tour.mapLocation.countryId
              ? " — linked to an existing Gesi country node when you open the map."
              : " — explore the existing Gesi geospatial interface."}
          </p>
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-widest text-primary hover:text-orange-850"
          >
            Open interactive map <ArrowRight size={10} />
          </Link>
          {!tour.mapLocation.countryId ? (
            <p className="text-[8px] font-mono uppercase tracking-widest text-stone-400">
              Deep-link by country ID is prepared on the tour model; /map does not currently accept query params.
            </p>
          ) : null}
        </div>
      </SectionShell>
    </div>
  );
}
