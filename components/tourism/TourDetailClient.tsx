"use client";

import { TourBookingDrawer } from "@/components/tourism/TourBookingDrawer";
import {
  TourClaimListingCta,
  TourListingTrustBadge,
} from "@/components/tourism/TourClaimListingCta";
import { TourRelatedHeritage } from "@/components/tourism/TourRelatedHeritage";
import type { Tour } from "@/lib/tourism";
import {
  ArrowRight,
  Calendar,
  Compass,
  ImageOff,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function TourDetailClient({ tour }: { tour: Tour }) {
  const gallery = tour.images?.length ? tour.images : tour.img ? [tour.img] : [];
  const [activeImage, setActiveImage] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const heroSrc = gallery[activeImage] ?? null;

  const openBooking = () => setBookingOpen(true);

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12 md:space-y-16 pb-28 md:pb-12">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-[9px] font-mono font-black uppercase tracking-widest text-stone-500"
      >
        <Link href="/visit" className="hover:text-primary transition">
          Tours & Travel
        </Link>
        <span aria-hidden>/</span>
        <span className="text-stone-900 dark:text-stone-300 line-clamp-1">{tour.name}</span>
      </nav>

      <header className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="space-y-3">
          <div className="relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200/50 dark:border-stone-850/60 bg-stone-100 dark:bg-stone-900">
            {heroSrc ? (
              <Image
                src={heroSrc}
                alt={tour.name}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-400">
                <ImageOff size={28} />
                <span className="text-[9px] font-mono uppercase tracking-widest">Image unavailable</span>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-stone-950/70 via-transparent to-transparent" />
            <span className="absolute top-4 left-4 bg-stone-950/85 backdrop-blur-xs border border-white/10 text-white font-mono text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm">
              {tour.region}
            </span>
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {gallery.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border transition cursor-pointer ${
                    activeImage === i
                      ? "border-orange-600 ring-1 ring-orange-600/40"
                      : "border-stone-200/50 dark:border-stone-850/60 opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between space-y-6 py-1">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-[9px] font-mono text-stone-500 uppercase tracking-widest">
              <span className="inline-flex items-center gap-1">
                <MapPin size={10} className="text-orange-500" />
                {tour.location}, {tour.country}
              </span>
              <span className="text-amber-500 font-bold">★ {tour.rating}</span>
              <TourListingTrustBadge
                listingKind={tour.listingKind}
                partnerName={tour.partnerOrganization?.name}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white leading-none">
              {tour.name}
            </h1>
            {tour.listingKind === "PARTNER_VERIFIED" && tour.partnerOrganization?.name ? (
              <p className="text-xs font-mono uppercase tracking-widest text-stone-500">
                Offered by verified partner · {tour.partnerOrganization.name}
              </p>
            ) : (
              <p className="text-xs font-mono uppercase tracking-widest text-stone-500">
                Gesi-curated heritage expedition
              </p>
            )}
            <p className="text-stone-600 dark:text-stone-400 font-serif italic text-lg leading-relaxed">
              {tour.desc}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tour.highlights.map((h) => (
                <span
                  key={h}
                  className="text-[8px] font-mono bg-stone-100 dark:bg-stone-850/80 px-2 py-0.5 text-stone-600 dark:text-stone-400 uppercase tracking-widest rounded-xs"
                >
                  • {h}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-[10px] uppercase">
              <div className="border border-stone-200/50 dark:border-stone-850/60 rounded-xl p-3">
                <span className="text-stone-400 flex items-center gap-1 mb-1">
                  <Calendar size={10} /> Duration
                </span>
                <span className="font-black text-stone-900 dark:text-white">{tour.duration}</span>
              </div>
              <div className="border border-stone-200/50 dark:border-stone-850/60 rounded-xl p-3">
                <span className="text-stone-400 flex items-center gap-1 mb-1">
                  <Users size={10} /> Group
                </span>
                <span className="font-black text-stone-900 dark:text-white">{tour.groupSize}</span>
              </div>
              <div className="border border-stone-200/50 dark:border-stone-850/60 rounded-xl p-3 col-span-2 sm:col-span-1">
                <span className="text-stone-400 block mb-1">From</span>
                <span className="font-black text-stone-900 dark:text-white">${tour.price}</span>
                <span className="text-stone-400"> / person</span>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-150 dark:border-stone-850/60 pt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openBooking}
              className="py-3 px-5 bg-stone-900 dark:bg-stone-800 hover:bg-primary dark:hover:bg-primary text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 transition active:scale-98 cursor-pointer"
            >
              <span>Request this tour</span>
              <ArrowRight size={10} />
            </button>
            <Link
              href="/visit"
              className="py-3 px-5 border border-stone-250 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 font-mono text-[9px] font-black uppercase tracking-widest rounded-lg transition"
            >
              All expeditions
            </Link>
          </div>

          <TourClaimListingCta tour={tour} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white/70 dark:bg-stone-950/70 border border-stone-200/50 dark:border-stone-850/60 p-8 rounded-2xl space-y-4">
            <h2 className="text-xl font-black uppercase italic tracking-tight text-stone-900 dark:text-white">
              Destination overview
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed">
              {tour.overview}
            </p>
          </section>

          <section className="bg-white/70 dark:bg-stone-950/70 border border-stone-200/50 dark:border-stone-850/60 p-8 rounded-2xl space-y-4">
            <h2 className="text-xl font-black uppercase italic tracking-tight text-stone-900 dark:text-white">
              Story behind the destination
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed">
              {tour.story}
            </p>
            {tour.relatedStoryIds.length > 0 ? (
              <p className="text-[9px] font-mono uppercase tracking-widest text-stone-400">
                Linked archive Stories appear below
              </p>
            ) : null}
          </section>

          <section className="bg-white/70 dark:bg-stone-950/70 border border-stone-200/50 dark:border-stone-850/60 p-8 rounded-2xl space-y-4">
            <h2 className="text-xl font-black uppercase italic tracking-tight text-stone-900 dark:text-white">
              Historical significance
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed">
              {tour.historicalSignificance}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase italic tracking-tight text-stone-900 dark:text-white">
              What you&apos;ll experience
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tour.experienceItems.map((item) => (
                <div
                  key={item.title}
                  className="bg-white dark:bg-stone-900 border border-stone-200/50 dark:border-stone-850/60 rounded-2xl p-5 space-y-2 shadow-xs"
                >
                  <h3 className="text-sm font-black uppercase text-stone-900 dark:text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white/70 dark:bg-stone-950/70 border border-stone-200/50 dark:border-stone-850/60 p-8 rounded-2xl space-y-5">
            <h2 className="text-xl font-black uppercase italic tracking-tight text-stone-900 dark:text-white">
              Itinerary
            </h2>
            <ol className="space-y-0">
              {tour.itinerary.map((day, index) => (
                <li key={day.day} className="relative flex gap-4 pb-6 last:pb-0">
                  {index < tour.itinerary.length - 1 && (
                    <span
                      className="absolute left-[15px] top-8 bottom-0 w-px bg-stone-200 dark:bg-stone-800"
                      aria-hidden
                    />
                  )}
                  <span className="relative z-10 shrink-0 w-8 h-8 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-mono text-[10px] font-black flex items-center justify-center">
                    {day.day}
                  </span>
                  <div className="pt-1 space-y-1 min-w-0">
                    <h3 className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-900 dark:text-white">
                      Day {day.day} — {day.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed">
                      {day.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/70 dark:bg-stone-950/70 border border-stone-200/50 dark:border-stone-850/60 p-6 rounded-2xl space-y-3">
              <h2 className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-900 dark:text-white">
                What&apos;s included
              </h2>
              <ul className="space-y-1.5">
                {tour.included.map((item) => (
                  <li
                    key={item}
                    className="text-[10px] font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400"
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/70 dark:bg-stone-950/70 border border-stone-200/50 dark:border-stone-850/60 p-6 rounded-2xl space-y-3">
              <h2 className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-900 dark:text-white">
                What&apos;s not included
              </h2>
              <ul className="space-y-1.5">
                {tour.excluded.map((item) => (
                  <li
                    key={item}
                    className="text-[10px] font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400"
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <TourRelatedHeritage tour={tour} />

          <section className="bg-white/70 dark:bg-stone-950/70 border border-stone-200/50 dark:border-stone-850/60 p-8 rounded-2xl space-y-4">
            <h2 className="text-xl font-black uppercase italic tracking-tight text-stone-900 dark:text-white">FAQ</h2>
            <div className="space-y-5">
              {tour.faq.map((item) => (
                <div key={item.question} className="space-y-1.5">
                  <h3 className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-900 dark:text-white">
                    {item.question}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="bg-white/70 dark:bg-stone-950/70 border border-stone-200/50 dark:border-stone-850/60 p-6 rounded-2xl space-y-4 font-mono text-[10px] uppercase text-stone-700 dark:text-stone-300">
            <h2 className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-900 dark:text-white">
              Tour information
            </h2>
            <div className="flex justify-between gap-4">
              <span className="text-stone-400">Duration</span>
              <span className="font-black text-stone-900 dark:text-white text-right">{tour.duration}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-stone-400">Difficulty</span>
              <span className="font-bold text-stone-900 dark:text-white text-right">{tour.difficulty}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-stone-400">Group size</span>
              <span className="text-stone-900 dark:text-white text-right">{tour.groupSize}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-stone-400">Best season</span>
              <span className="text-stone-900 dark:text-white text-right">{tour.bestSeason}</span>
            </div>
            <div className="border-t border-stone-200 dark:border-stone-800 pt-3 space-y-1">
              <span className="text-stone-400 block">Meeting point</span>
              <span className="normal-case tracking-normal text-[11px] font-serif italic text-stone-600 dark:text-stone-400">
                {tour.meetingPoint}
              </span>
            </div>
            <div className="border-t border-stone-200 dark:border-stone-800 pt-3 space-y-1">
              <span className="text-stone-400 block">Custodians</span>
              <span className="normal-case tracking-normal text-[11px] font-serif italic text-stone-600 dark:text-stone-400">
                {tour.operators}
              </span>
            </div>
            <div className="border-t border-stone-200 dark:border-stone-800 pt-3 flex justify-between font-black">
              <span className="text-stone-900 dark:text-white">From</span>
              <span className="text-primary">${tour.price}</span>
            </div>
            <button
              type="button"
              onClick={openBooking}
              className="hidden lg:flex w-full h-12 items-center justify-center gap-2 bg-primary hover:bg-orange-850 text-white font-mono text-[10px] font-black uppercase tracking-widest rounded-lg transition cursor-pointer"
            >
              Request this tour <ArrowRight size={12} />
            </button>
          </div>

          <div className="bg-white/70 dark:bg-stone-950/70 border border-stone-200/50 dark:border-stone-850/60 p-6 rounded-2xl space-y-3">
            <h2 className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-900 dark:text-white">
              Map location
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed">
              {tour.mapLocation.label}
            </p>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-200/50 dark:border-stone-850/60 bg-stone-950/20 flex items-center justify-center">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_40%,#c2410c33,transparent_55%)]" />
              <div className="relative z-10 text-center space-y-2 px-4">
                <Compass className="mx-auto text-primary" size={22} />
                <p className="text-[9px] font-mono uppercase tracking-widest text-stone-500">
                  Open the existing Gesi Map
                </p>
              </div>
            </div>
            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-widest text-primary hover:text-orange-850"
            >
              View on interactive map <ArrowRight size={10} />
            </Link>
          </div>

          <div className="bg-white/70 dark:bg-stone-950/70 border border-dashed border-stone-200 dark:border-stone-800 p-6 rounded-2xl space-y-2">
            <h2 className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-900 dark:text-white">
              Nearby heritage
            </h2>
            <p className="text-xs text-stone-500 font-serif italic leading-relaxed">
              Nearby sites will surface here as more archive locations are linked to this destination.
            </p>
          </div>
        </aside>
      </div>

      <section
        className="max-w-3xl mx-auto text-center space-y-5 py-4"
        aria-labelledby="plan-visit-heading"
      >
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-orange-850 dark:text-orange-500 block">
          Plan your visit
        </span>
        <h2
          id="plan-visit-heading"
          className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white"
        >
          Ready to go?
        </h2>
        <p className="text-stone-600 dark:text-stone-400 font-serif italic text-base">
          Request {tour.name} without leaving this page — no payment is taken in this flow.
        </p>
        <button
          type="button"
          onClick={openBooking}
          className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-primary hover:bg-orange-850 text-white font-mono text-[10px] font-black uppercase tracking-[0.25em] rounded-lg transition active:scale-98 cursor-pointer"
        >
          Request tour <ArrowRight size={12} />
        </button>
      </section>

      {!bookingOpen && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-stone-200/60 dark:border-stone-850/60 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-3 safe-area-pb">
          <div className="min-w-0">
            <span className="text-[8px] font-mono uppercase text-stone-500 block">From</span>
            <span className="text-sm font-mono font-black text-stone-900 dark:text-white">${tour.price}</span>
          </div>
          <button
            type="button"
            onClick={openBooking}
            className="shrink-0 py-3 px-4 bg-primary hover:bg-orange-850 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            Request tour <ArrowRight size={10} />
          </button>
        </div>
      )}

      <TourBookingDrawer open={bookingOpen} onOpenChange={setBookingOpen} tour={tour} />
    </div>
  );
}
