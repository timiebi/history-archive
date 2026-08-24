"use client";

import { TourDetailClient } from "@/components/tourism/TourDetailClient";
import { useTour } from "@/lib/api";
import Link from "next/link";

export function TourDetailPageClient({ id }: { id: string }) {
  const { data: tour, isPending, isError } = useTour(id);

  if (isPending) {
    return (
      <div className="py-24 flex items-center justify-center">
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest animate-pulse">
          Loading expedition…
        </p>
      </div>
    );
  }

  if (isError || !tour) {
    return (
      <div className="py-24 max-w-xl mx-auto px-6 text-center space-y-4">
        <h1 className="text-2xl font-black uppercase tracking-tight text-stone-900 dark:text-white">
          Tour not found
        </h1>
        <p className="text-stone-500 font-serif italic text-sm">
          This expedition is unavailable or unpublished.
        </p>
        <Link
          href="/visit"
          className="inline-flex text-[10px] font-mono font-black uppercase tracking-widest text-orange-600 hover:underline"
        >
          Back to Tours
        </Link>
      </div>
    );
  }

  return <TourDetailClient tour={tour} />;
}
