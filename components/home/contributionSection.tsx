"use client";

import Link from "next/link";
import { useContributors } from "@/lib/api";

type InitialContributors = { items?: { id: string; name: string; email?: string }[] };

type ContributorItem = { id: string; name: string; email: string; createdAt?: string };

export function ContributionSection({ initialContributors }: { initialContributors?: InitialContributors } = {}) {
  const { data, isSuccess } = useContributors({
    initialData: initialContributors?.items?.length
      ? { items: initialContributors.items as ContributorItem[] }
      : undefined,
  });
  const contributors = (data?.items ?? []) as { id: string; name: string; email?: string }[];

  return (
    <section className="relative py-32 bg-[#0c0a09] text-stone-100 overflow-hidden">
      {/* Background Texture - Subtle African Motif */}
      <div className="absolute inset-0 opacity-8 bg-[url('/patterns/mudcloth.png')] bg-repeat pointer-events-none select-none z-0" />
      
      {/* Ambient gold radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-140 h-140 rounded-full bg-linear-to-br from-amber-600/5 to-orange-700/5 blur-3xl pointer-events-none select-none z-0" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="mb-12 inline-block">
          <div className="h-20 w-px bg-linear-to-b from-transparent via-orange-700/60 to-transparent mx-auto" />
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 leading-tight text-white select-none">
          Every Tribe has a <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-500 font-extrabold italic">Voice.</span> <br />
          Every Village a <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-500 font-extrabold italic">Story.</span>
        </h2>
        
        <p className="text-stone-400 font-serif text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed">
          The Great Library of the Continent is never finished. We invite historians, elders, and 
          storytellers to contribute their verified records to Gesi.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 mb-20">
          <Link
            href="/auth/signup?role=contributor"
            className="relative cursor-pointer inline-flex items-center justify-center px-10 py-5 bg-white/5 border border-stone-850 hover:border-orange-500/50 text-white font-mono text-[10px] font-black uppercase tracking-[0.3em] rounded-xs transition-all duration-300 group overflow-hidden hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] active:scale-98"
          >
            <span className="relative z-10 transition-colors duration-300">Become a Contributor</span>
            <div className="absolute inset-0 bg-linear-to-r from-amber-600 to-orange-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
          </Link>
          <Link
            href="/contribute"
            className="relative cursor-pointer inline-flex items-center justify-center px-10 py-5 bg-transparent border border-orange-800 text-orange-400 hover:bg-orange-800/10 hover:text-orange-300 transition-all duration-300 text-[10px] font-mono font-black uppercase tracking-[0.3em] rounded-xs active:scale-98"
          >
            Submit a Story
          </Link>
        </div>

        {isSuccess && contributors.length > 0 && (
          <div className="pt-14 border-t border-stone-900/60">
            <p className="text-[9px] font-mono font-black uppercase tracking-[0.45em] text-stone-600 mb-6">Gesi contributors</p>
            <div className="flex flex-wrap justify-center gap-3">
              {contributors.slice(0, 12).map((c) => (
                <span
                  key={c.id}
                  className="px-4 py-2 bg-stone-950/40 border border-stone-900/80 text-stone-400 hover:text-stone-200 hover:border-stone-800 text-[9px] font-mono uppercase tracking-wider rounded-xs transition-colors duration-300"
                >
                  {c.name}
                </span>
              ))}
              {contributors.length > 12 && (
                <span className="px-4 py-2 text-stone-600 text-[9px] font-mono uppercase tracking-widest font-black flex items-center">
                  +{contributors.length - 12} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}