"use client";

import { useManuscript } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export function ManuscriptDetailClient({ id }: { id: string }) {
  const { data: manuscript, isPending, isError } = useManuscript(id);

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] text-stone-900 flex items-center justify-center">
        <p className="text-sm text-stone-500">Loading manuscript…</p>
      </main>
    );
  }

  if (isError || !manuscript) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] text-stone-900 flex flex-col items-center justify-center gap-6 p-8">
        <p className="text-sm text-stone-500 text-center">Manuscript not found.</p>
        <Link href="/library" className="text-orange-700 text-sm font-medium hover:underline flex items-center gap-2">
          <ArrowLeft size={14} /> Back to Library
        </Link>
      </main>
    );
  }

  const timelineName = typeof manuscript.timeline === "object" && manuscript.timeline?.name
    ? manuscript.timeline.name
    : manuscript.era;
  const tags = Array.isArray(manuscript.tags) ? manuscript.tags : [];

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-stone-900 selection:bg-orange-200">
      <header className="border-b border-stone-300 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-8 py-6 flex items-center gap-6">
          <Link href="/library" className="p-2 text-stone-500 hover:text-orange-700 transition-colors" aria-label="Back to Library">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-xs text-stone-400 tabular-nums">
            Ref. {manuscript.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-8 py-12 md:py-20">
        <div className="flex items-start gap-6 mb-8">
          <div className="p-4 bg-stone-100 shrink-0">
            <BookOpen size={32} className="text-orange-700" />
          </div>
          <div>
            <span className="text-xs font-semibold text-orange-800 mb-2 block">{timelineName}</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
              {manuscript.title}
            </h1>
            <p className="text-stone-600 text-sm">
              By <span className="font-medium">{manuscript.author}</span>
            </p>
            {manuscript.pages != null && (
              <p className="text-stone-500 text-sm mt-1">{manuscript.pages} pages</p>
            )}
          </div>
        </div>

        <div className="prose prose-stone max-w-none">
          <p className="text-lg leading-relaxed text-stone-700">{manuscript.summary}</p>
        </div>

        {tags.length > 0 && (
          <div className="mt-10 pt-10 border-t border-stone-200 flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span key={tag} className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 bg-stone-200 text-stone-600">
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>

      <footer className="border-t border-stone-300 py-12 text-center">
        <Link href="/library" className="text-stone-500 text-sm hover:text-orange-700">
          ← Back to library
        </Link>
      </footer>
    </main>
  );
}
