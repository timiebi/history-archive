"use client";

import { useTours } from "@/lib/api";
import { TourListingTrustBadge } from "@/components/tourism/TourClaimListingCta";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function ToursContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTour = searchParams.get("tour") || "";
  const initialRegion = searchParams.get("region") || "";

  const [selectedTourId, setSelectedTourId] = useState(initialTour);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState(initialRegion || "All");

  // Legacy deep link ?tour=id → canonical detail page
  useEffect(() => {
    if (initialTour) {
      router.replace(`/visit/${initialTour}`);
    }
  }, [initialTour, router]);

  const { data: tours = [], isPending, isError } = useTours({
    region: selectedRegionFilter === "All" ? undefined : selectedRegionFilter,
    limit: 50,
  });

  const filteredTours = useMemo(() => tours, [tours]);

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-16 pb-24 md:pb-32 lg:pb-40">
      {/* Editorial Page Header */}
      <header className="max-w-3xl space-y-4">
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-orange-850 dark:text-orange-500 block">
          Gesi Tours & Expeditions
        </span>
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white leading-none">
          Walk the Soils <br /> of Empires
        </h1>
        <p className="text-stone-600 dark:text-stone-400 font-serif italic text-lg leading-relaxed max-w-2xl">
          Heritage expeditions curated by Gesi, plus listings from verified tourism partners. Explore
          destinations with local custodians and conservation context — request a trip; bookings are
          coordinated after your enquiry.
        </p>
      </header>

      {/* Region Filter Ribbon */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200/50 dark:border-stone-850/60 pb-6">
        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-500 mr-4">
          Filter Region:
        </span>
        {["All", "West", "East", "Central", "North", "Southern"].map((reg) => (
          <button
            key={reg}
            type="button"
            onClick={() => setSelectedRegionFilter(reg)}
            className={`px-4 py-2 font-mono text-[9px] font-black uppercase tracking-widest border rounded-full transition-all cursor-pointer ${
              selectedRegionFilter === reg
                ? "bg-stone-900 border-stone-900 text-white dark:bg-stone-100 dark:border-stone-100 dark:text-stone-900"
                : "bg-transparent border-stone-250 dark:border-stone-800 text-stone-600 dark:text-stone-455 hover:bg-stone-100 dark:hover:bg-stone-900"
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Expeditions Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isPending ? (
          <p className="col-span-full text-sm text-stone-500 font-mono uppercase tracking-widest animate-pulse">
            Loading expeditions…
          </p>
        ) : isError ? (
          <p className="col-span-full text-sm text-red-600 dark:text-red-400 font-serif italic">
            Unable to load tours from the archive. Please try again shortly.
          </p>
        ) : filteredTours.length === 0 ? (
          <p className="col-span-full text-sm text-stone-500 font-serif italic">
            No expeditions match this region filter yet.
          </p>
        ) : (
          filteredTours.map((tour) => (
            <div
              key={tour.id}
              className={`group flex flex-col md:flex-row bg-white dark:bg-stone-900 border rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 ${
                selectedTourId === tour.slug || selectedTourId === tour.id
                  ? "border-orange-600 dark:border-orange-500 ring-1 ring-orange-600/40"
                  : "border-stone-200/50 dark:border-stone-850/60"
              }`}
            >
              <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto min-h-[220px]">
                {tour.img ? (
                  <Image
                    src={tour.img}
                    alt={tour.name}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800" />
                )}
                <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-stone-950/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-stone-950/85 backdrop-blur-xs border border-white/10 text-white font-mono text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm">
                  {tour.region}
                </span>
                <div className="absolute top-4 right-4">
                  <TourListingTrustBadge
                    listingKind={tour.listingKind}
                    partnerName={tour.partnerOrganization?.name}
                    className="items-end"
                  />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-[9px] font-mono text-stone-500 uppercase tracking-widest">
                      <MapPin size={10} className="text-orange-500" />
                      <span>{tour.dest}</span>
                    </div>
                    <span className="text-[9px] font-mono text-amber-500 font-bold">★ {tour.rating}</span>
                  </div>

                  <h3 className="text-xl font-black uppercase text-stone-900 dark:text-white leading-tight">
                    {tour.name}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed line-clamp-2">
                    {tour.desc}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {tour.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[8px] font-mono bg-stone-100 dark:bg-stone-850/80 px-2 py-0.5 text-stone-600 dark:text-stone-400 uppercase tracking-widest rounded-xs"
                      >
                        • {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-stone-150 dark:border-stone-850/60 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-mono uppercase text-stone-500 block">Pricing:</span>
                    <span className="text-base font-mono font-black text-stone-950 dark:text-white">${tour.price}</span>
                    <span className="text-[8px] font-mono text-stone-400"> / person</span>
                  </div>

                  <Link
                    href={`/visit/${tour.slug}`}
                    onClick={() => setSelectedTourId(tour.slug)}
                    className="py-2.5 px-4 bg-stone-900 dark:bg-stone-800 hover:bg-primary dark:hover:bg-primary text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 transition active:scale-98"
                  >
                    <span>Choose</span>
                    <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] pt-28 pb-32 flex items-center justify-center">
          <p className="text-stone-500 font-mono text-sm uppercase tracking-widest animate-pulse">Loading Gesi Tours…</p>
        </main>
      }
    >
      <ToursContent />
    </Suspense>
  );
}
