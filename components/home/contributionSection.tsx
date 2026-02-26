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
      <div className="absolute inset-0 opacity-10 bg-[url('/patterns/mudcloth.png')] bg-repeat" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="mb-10 inline-block">
          <div className="h-16 w-px bg-linear-to-b from-transparent via-orange-800 to-transparent mx-auto" />
        </div>
        
        <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 leading-tight">
          Every Tribe has a <span className="text-stone-500 italic">Voice.</span> <br />
          Every Village a <span className="text-stone-500 italic">Story.</span>
        </h2>
        
        <p className="text-stone-400 font-serif text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          The Great Library of the Continent is never finished. We invite historians, elders, and 
          storytellers to contribute their verified records to the archive.
        </p>

        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <Link
            href="/auth/signup?role=contributor"
            className="relative cursor-pointer inline-block px-10 py-5 bg-transparent border border-stone-700 hover:border-orange-800 transition-all group overflow-hidden"
          >
            <span className="relative z-10 text-xs font-black uppercase tracking-[0.3em]">Become a Contributor</span>
            <div className="absolute inset-0 bg-stone-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="absolute inset-0 z-20 flex items-center justify-center text-stone-900 text-xs font-black uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              Apply Now
            </span>
          </Link>
          <Link
            href="/contribute"
            className="relative cursor-pointer inline-block px-10 py-5 bg-transparent border border-orange-800 text-orange-800 hover:bg-orange-800 hover:text-stone-900 transition-all text-xs font-black uppercase tracking-[0.3em]"
          >
            Submit a Story
          </Link>
        </div>

        {isSuccess && contributors.length > 0 && (
          <div className="pt-12 border-t border-stone-800">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500 mb-6">Our contributors</p>
            <div className="flex flex-wrap justify-center gap-4">
              {contributors.slice(0, 12).map((c) => (
                <span
                  key={c.id}
                  className="px-4 py-2 border border-stone-700 text-stone-300 text-[10px] font-mono uppercase tracking-wider"
                >
                  {c.name}
                </span>
              ))}
              {contributors.length > 12 && (
                <span className="px-4 py-2 text-stone-500 text-[10px] font-mono">+{contributors.length - 12} more</span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}