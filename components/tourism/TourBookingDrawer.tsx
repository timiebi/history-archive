"use client";

import { TourBookingWidget } from "@/components/tourism/TourBookingWidget";
import type { Tour } from "@/lib/tourism";
import { Compass, MapPin, X } from "lucide-react";
import { useEffect } from "react";

export type TourBookingDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tour: Tour;
};

/**
 * Responsive booking shell for Tour Detail:
 * - Desktop: centered premium modal
 * - Mobile: near-full-height bottom sheet
 * Hosts existing TourBookingWidget (request-only demo; no payment).
 */
export function TourBookingDrawer({ open, onOpenChange, tour }: TourBookingDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-booking-drawer-title"
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close trip request"
        className="absolute inset-0 bg-black/75 backdrop-blur-xs cursor-pointer border-0"
        onClick={() => onOpenChange(false)}
      />

      <div
        className={`absolute inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-2xl md:max-h-[90vh] h-[92vh] md:h-auto bg-white dark:bg-[#0c0a09] border border-stone-200/50 dark:border-stone-850/60 rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-out ${
          open ? "translate-y-0 scale-100" : "translate-y-24 md:translate-y-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — selected tour identity */}
        <div className="shrink-0 border-b border-stone-200/40 dark:border-stone-850/40 px-5 pt-4 pb-4 md:px-8 md:pt-6 space-y-3">
          <div className="md:hidden w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-700 mx-auto mb-1" aria-hidden />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-primary animate-spin-slow shrink-0" />
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500">
                  Plan your visit
                </span>
              </div>
              <h2
                id="tour-booking-drawer-title"
                className="text-lg md:text-xl font-black uppercase italic tracking-tight text-stone-900 dark:text-white leading-tight"
              >
                {tour.name}
              </h2>
              <p className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-stone-500">
                <MapPin size={10} className="text-orange-500 shrink-0" />
                <span className="truncate">
                  {tour.dest} · from ${tour.price}/person
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 text-stone-600 rounded-full cursor-pointer shrink-0 transition"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 md:px-8 md:py-6">
          {open ? (
            <TourBookingWidget
              key={tour.id}
              tour={tour}
              allowTourSelect={false}
              embedded
              onComplete={() => onOpenChange(false)}
            />
          ) : null}
        </div>

        <div className="shrink-0 border-t border-stone-200/40 dark:border-stone-850/40 px-5 py-3 md:px-8 md:py-4 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="py-2.5 px-5 border border-stone-250 dark:border-stone-800 text-[10px] font-mono font-black uppercase tracking-widest text-stone-600 dark:text-stone-455 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg cursor-pointer transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
