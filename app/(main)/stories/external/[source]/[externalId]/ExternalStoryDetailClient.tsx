"use client";

import { useStoryByExternalId } from "@/lib/api";
import Link from "next/link";

const PLACEHOLDER_COVER = "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1200";

export function ExternalStoryDetailClient({ source, externalId }: { source: string; externalId: string }) {
  const { data: story, isPending, isError } = useStoryByExternalId(source, externalId);

  if (isPending) {
    return (
      <article className="bg-[#fcfaf7] dark:bg-stone-950 min-h-screen pb-20 flex items-center justify-center">
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest">Loading story…</p>
      </article>
    );
  }

  if (isError || !story) {
    return (
      <article className="bg-[#fcfaf7] dark:bg-stone-950 min-h-screen pb-20 flex flex-col items-center justify-center gap-6 p-8">
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest text-center">Story not found or unable to load.</p>
        <Link href="/stories" className="text-orange-700 font-mono text-[10px] uppercase tracking-widest hover:underline">← Back to stories</Link>
      </article>
    );
  }

  const title = (story.title as string) ?? "Untitled";
  const content = (story.content as string) ?? "";
  const cover = (story.image as string)?.trim() ? (story.image as string) : PLACEHOLDER_COVER;
  const author = (story.author as string) ?? "";
  const sourceLabel = (story.externalSource as string) ?? source;
  const sections = (story.sections as { text: string; image?: string }[] | undefined) ?? [];
  const hasSections = sections.length > 0;

  return (
    <article className="bg-[#fcfaf7] dark:bg-stone-950 min-h-screen pb-20">
      <header className="relative h-[50vh] md:h-[70vh] w-full">
        <img src={cover} alt={title} className="object-cover h-full w-full" />
        <div className="absolute inset-0 bg-linear-to-t from-[#fcfaf7] dark:from-stone-950 via-stone-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20">
          <div className="max-w-4xl mx-auto">
            <span className="bg-orange-700 text-white px-4 py-1 text-[10px] font-black tracking-[0.3em] uppercase mb-6 inline-block">
              {sourceLabel}
            </span>
            <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] text-stone-900 dark:text-white">
              {title}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 border-b border-stone-200 dark:border-stone-800 flex flex-wrap gap-8 items-center text-xs font-bold uppercase tracking-widest text-stone-500">
        {author && (
          <>
            <div>Author: <span className="text-stone-900 dark:text-stone-100">{author}</span></div>
            <div className="h-1 w-1 rounded-full bg-orange-600" />
          </>
        )}
        <div>Source: <span className="text-stone-900 dark:text-stone-100">{sourceLabel}</span></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {hasSections ? (
          <div className="space-y-16 md:space-y-24">
            {sections.map((section, i) => (
              <section key={i} className="space-y-8">
                {section.text ? (
                  <div className="prose prose-stone lg:prose-xl dark:prose-invert max-w-none">
                    <p className="font-serif leading-relaxed first-letter:text-6xl first-letter:font-black first-letter:text-orange-700 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.85]">
                      {section.text}
                    </p>
                  </div>
                ) : null}
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
          <div className="prose prose-stone lg:prose-xl dark:prose-invert max-w-none">
            <div className="font-serif leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:text-orange-700 first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8]">
              {content}
            </div>
          </div>
        )}

        <div className="mt-16 pt-12 border-t border-stone-200 dark:border-stone-800">
          <p className="text-stone-400 font-mono text-[10px] uppercase tracking-widest">Content from {sourceLabel} · Read in full above</p>
        </div>
      </div>
    </article>
  );
}
