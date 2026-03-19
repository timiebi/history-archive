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
    <section className="py-24 bg-stone-100 dark:bg-stone-900/30 border-y border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative p-4 bg-white dark:bg-stone-800 shadow-2xl rotate-1">
            <div className="relative aspect-4/3 w-full overflow-hidden">
              <Image
                src={img}
                alt={title}
                fill
                className="object-cover"
                unoptimized={img.startsWith("http")}
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-orange-800 dark:text-orange-500 font-bold text-xs uppercase tracking-widest">
              <span className="w-8 h-px bg-current" />
              Featured Exhibition · <span className="text-stone-500">{sourceLabel}</span>
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-[0.9]">
              {title}
            </h2>
            <p className="font-serif text-lg text-stone-600 dark:text-stone-400 italic line-clamp-4">
              &quot;{excerpt.slice(0, 200)}{excerpt.length > 200 ? "…" : ""}&quot;
            </p>
            <Link
              href={href}
              className="pt-4 flex items-center gap-4 group font-black uppercase text-xs tracking-[0.2em] cursor-pointer"
            >
              Enter the Exhibition
              <span className="w-12 h-12 cursor-pointer rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}