"use client";

import { useTourismPartners } from "@/lib/api";
import type { TourismPartner } from "@/lib/api/types";
import { useEffect, useId, useRef, useState } from "react";

function isSafeHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function PartnerCard({
  partner,
  surface,
}: {
  partner: TourismPartner;
  surface: "article" | "panel";
}) {
  const webOk = isSafeHttpUrl(partner.websiteUrl);
  const bookOk = partner.bookingUrl && isSafeHttpUrl(partner.bookingUrl);
  const card =
    surface === "article"
      ? "border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950/80 p-5 sm:p-6"
      : "border border-stone-800 bg-stone-950/80 p-5 sm:p-6";
  const titleCls =
    surface === "article"
      ? "text-lg font-bold text-stone-900 dark:text-stone-100"
      : "text-lg font-bold text-white";
  const bodyCls =
    surface === "article" ? "text-sm text-stone-600 dark:text-stone-400" : "text-sm text-stone-300";
  const btnPrimary =
    surface === "article"
      ? "inline-flex items-center justify-center gap-2 min-h-[44px] px-4 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-mono text-[10px] uppercase tracking-widest hover:bg-orange-800 dark:hover:bg-orange-200 transition-colors"
      : "inline-flex items-center justify-center gap-2 min-h-[44px] px-4 bg-orange-800 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-colors";
  const btnSecondary =
    surface === "article"
      ? "inline-flex items-center justify-center gap-2 min-h-[44px] px-4 border border-stone-300 dark:border-stone-600 text-stone-800 dark:text-stone-200 font-mono text-[10px] uppercase tracking-widest hover:border-orange-700 hover:text-orange-800 dark:hover:text-orange-400 transition-colors"
      : "inline-flex items-center justify-center gap-2 min-h-[44px] px-4 border border-stone-600 text-stone-100 font-mono text-[10px] uppercase tracking-widest hover:border-orange-500 transition-colors";

  return (
    <li className={`flex flex-col shadow-sm ${card}`}>
      <div className="flex gap-4 items-start mb-4">
        {partner.logoUrl?.trim() && isSafeHttpUrl(partner.logoUrl) ? (
          <div className="shrink-0 w-14 h-14 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 flex items-center justify-center p-1">
            <img src={partner.logoUrl} alt="" className="max-w-full max-h-full object-contain" />
          </div>
        ) : null}
        <h3 className={`flex-1 min-w-0 leading-snug ${titleCls}`}>{partner.name}</h3>
      </div>
      {partner.description?.trim() ? (
        <p className={`leading-relaxed line-clamp-4 flex-1 mb-4 ${bodyCls}`}>{partner.description}</p>
      ) : null}
      <div className="flex flex-col sm:flex-row gap-2 mt-auto">
        {webOk ? (
          <a
            href={partner.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={btnPrimary}
          >
            Visit website
          </a>
        ) : null}
        {bookOk ? (
          <a
            href={partner.bookingUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className={btnSecondary}
          >
            Book now
          </a>
        ) : null}
      </div>
    </li>
  );
}

function RequestInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const titleId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) {
      setSent(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      onClose();
      setName("");
      setEmail("");
      setMessage("");
      setSent(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md border border-stone-200 dark:border-stone-800 bg-[#fcfaf7] dark:bg-stone-950 p-6 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="text-xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white mb-2">
          Request more info
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">Sends nowhere yet — UI only.</p>
        {sent ? (
          <p className="font-mono text-[10px] uppercase tracking-widest text-orange-800 dark:text-orange-400">
            Thanks — you can close this dialog.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-700/40"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-700/40"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-700/40 resize-y min-h-[100px]"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 font-mono text-[10px] uppercase tracking-widest border border-stone-300 dark:border-stone-600 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-4 font-mono text-[10px] uppercase tracking-widest bg-orange-700 text-white hover:bg-orange-800 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export type PlanYourVisitProps = {
  storyId?: string | null;
  cultureId?: string | null;
  className?: string;
  /** Culture map slide-over uses dark chrome */
  surface?: "article" | "panel";
};

/**
 * Tourism partners for a story or culture — loaded from GET /tourism/partners only.
 * Returns null when the API has no approved partners (no demo fallback).
 */
export function PlanYourVisit({
  storyId,
  cultureId,
  className = "",
  surface = "article",
}: PlanYourVisitProps) {
  const enabled = Boolean(storyId?.trim() || cultureId?.trim());
  const sentinelRef = useRef<HTMLDivElement>(null);
  /** Slide-over is small: fetch immediately. */
  const [nearViewport, setNearViewport] = useState(() => surface === "panel");

  useEffect(() => {
    if (surface === "panel" || !enabled) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNearViewport(true);
      },
      { root: null, rootMargin: "0px 0px 480px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, surface]);

  const { data: apiPartners = [], isPending } = useTourismPartners(
    { storyId, cultureId },
    { enabled: enabled && nearViewport }
  );
  const [infoOpen, setInfoOpen] = useState(false);

  const partners: TourismPartner[] = (() => {
    if (!enabled || isPending) return [];
    return apiPartners.length ? apiPartners : [];
  })();

  if (enabled && !nearViewport) {
    return <div ref={sentinelRef} className={`h-px w-full ${className}`} aria-hidden />;
  }

  if (enabled && isPending) {
    return (
      <section
        className={`mt-16 md:mt-20 border border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/30 px-5 py-6 sm:px-8 sm:py-8 ${className}`}
        aria-busy="true"
        aria-label="Loading tourism partners"
      >
        <div className="h-3 w-40 bg-stone-200 dark:bg-stone-800 rounded animate-pulse mb-4" />
        <div className="h-3 w-64 bg-stone-200 dark:bg-stone-800 rounded animate-pulse mb-8" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-36 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded animate-pulse" />
          <div className="h-36 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded animate-pulse" />
        </div>
        <p className="mt-6 text-stone-500 dark:text-stone-400 font-mono text-[10px] uppercase tracking-widest">
          Loading partners…
        </p>
      </section>
    );
  }

  if (!partners.length) return null;

  const shell =
    surface === "article"
      ? "border border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-900/40"
      : "border border-stone-800 bg-stone-950/60";

  const heading =
    surface === "article"
      ? "text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white"
      : "text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-white";

  const disclaimer =
    surface === "article"
      ? "text-xs text-stone-600 dark:text-stone-400 leading-relaxed"
      : "text-xs text-stone-400 leading-relaxed";

  const grid =
    surface === "panel" ? "grid gap-5 grid-cols-1" : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <section
        id="plan-your-visit"
        className={`scroll-mt-24 ${shell} ${className}`}
        aria-labelledby="plan-your-visit-heading"
      >
        <div className="border-b border-stone-200 dark:border-stone-800 px-5 py-4 sm:px-8 sm:py-5">
          <h2 id="plan-your-visit-heading" className={heading}>
            Plan your visit
          </h2>
          <p className={`mt-2 max-w-3xl ${disclaimer}`}>
            Outside partners — we don&apos;t book trips or run tours.
          </p>
        </div>

        <ul className={`list-none m-0 p-5 sm:p-8 ${grid}`}>
          {partners.map((p) => (
            <PartnerCard key={p.id} partner={p} surface={surface} />
          ))}
        </ul>

        <div className="px-5 pb-5 sm:px-8 sm:pb-6 flex flex-col sm:flex-row sm:items-center gap-4 border-t border-stone-200 dark:border-stone-800 pt-4">
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            className="font-mono text-[10px] uppercase tracking-widest text-orange-800 dark:text-orange-400 hover:underline min-h-[44px] text-left"
          >
            Request more info
          </button>
        </div>
      </section>

      <RequestInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
}
