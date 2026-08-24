import Link from "next/link";

export default function TourNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-4">
      <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-orange-850 dark:text-orange-500 block">
        Gesi Tours & Expeditions
      </span>
      <h1 className="text-4xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">
        Expedition not found
      </h1>
      <p className="text-stone-600 dark:text-stone-400 font-serif italic">
        This tour is not in the current catalogue.
      </p>
      <Link
        href="/visit"
        className="inline-flex text-[9px] font-mono font-black uppercase tracking-widest text-primary hover:text-orange-850"
      >
        ← Back to tours
      </Link>
    </div>
  );
}
