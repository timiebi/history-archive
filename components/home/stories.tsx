import { shouldUseNextImageOptimizer } from "@/lib/image-optimizer";
import Image from "next/image";
import Link from "next/link";

export interface FeaturedStory {
  id: string;
  title: string;
  excerpt?: string;
  image?: string;
  author?: string;
  source?: string;
  externalSource?: string;
  sourceUrl?: string;
}

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1200";

export function FeaturedSpotlight({ story }: { story?: FeaturedStory | null }) {
  const img = story?.image || PLACEHOLDER_IMG;
  const title = story?.title || "The Stone Walls of Zimbabwe";
  const excerpt = story?.excerpt || "A testament to the architectural brilliance of the Shona people, rising from the earth without a drop of mortar.";
  const sourceLabel = story?.externalSource ?? story?.source ?? "Archive";
  const href = story?.source === "EXTERNAL" && story?.externalSource
    ? `/stories/external/${encodeURIComponent(story.externalSource)}/${encodeURIComponent(story.id)}`
    : story ? `/stories/${story.id}` : "/stories";

  return (
    <section className="py-28 bg-[#fafaf9]/50 dark:bg-[#0c0a09]/20 border-y border-stone-200 dark:border-stone-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Gallery Exhibition Frame */}
          <div className="lg:col-span-7 relative p-4 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 ease-out select-none">
            <div className="absolute inset-2 border border-orange-800/10 dark:border-orange-500/5 pointer-events-none z-10" />
            <div className="relative aspect-4/3 w-full overflow-hidden">
              <Image
                src={img}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-103"
                unoptimized={!shouldUseNextImageOptimizer(img)}
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>
          
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-orange-800 dark:text-orange-500 font-extrabold text-[10px] uppercase tracking-[0.25em]">
              <span className="w-8 h-px bg-current" />
              Featured Exhibition · <span className="text-stone-500 font-medium">{sourceLabel}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-[0.9] text-stone-950 dark:text-white">
              {title}
            </h2>
            
            <p className="font-serif text-lg text-stone-600 dark:text-stone-400 italic line-clamp-4 leading-relaxed">
              &quot;{excerpt.slice(0, 200)}{excerpt.length > 200 ? "…" : ""}&quot;
            </p>
            
            <Link
              href={href}
              className="pt-4 inline-flex items-center gap-4 group font-black uppercase text-[10px] tracking-[0.25em] text-orange-850 dark:text-orange-400 cursor-pointer"
            >
              <span className="cursor-pointer group-hover:text-orange-700 transition-colors">Enter the Exhibition</span>
              <span className="w-11 h-11 cursor-pointer rounded-full border border-stone-300 dark:border-stone-800 flex items-center justify-center group-hover:bg-orange-800 group-hover:border-orange-800 group-hover:text-white transition-all duration-300">
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">&rarr;</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}