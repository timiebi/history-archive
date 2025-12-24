import { motion } from "framer-motion";
import Link from "next/link";
export function CultureCard({
  name,
  region,
  description,
  slug,
  image,
  index
}: {
  name: string;
  region: string;
  description: string;
  slug: string;
  image: string;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7 }}
      className="group relative flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-stone-200 dark:bg-stone-900 mb-6 border border-stone-200 dark:border-stone-800">
        <img
          src={image}
          alt={name}
          
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        {/* Subtle Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Region Tag */}
        <div className="absolute top-4 left-4">
          <span className="bg-[#fafaf9] text-stone-900 px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm">
            {region}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 space-y-4">
        <div className="flex justify-between items-baseline">
          <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-orange-800 transition-colors">
            {name}
          </h3>
          <span className="text-[10px] font-mono text-stone-400 italic">No. 0{index + 1}</span>
        </div>

        <p className="text-stone-600 dark:text-stone-400 font-serif leading-relaxed text-[15px] italic">
          {description}
        </p>

        <Link
          href={`/cultures/${slug}`}
          className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] pt-4 group-hover:text-orange-800 transition-all"
        >
          Explore Tradition
          <span className="w-8 h-px bg-stone-300 dark:bg-stone-700 group-hover:w-12 group-hover:bg-orange-800 transition-all" />
        </Link>
      </div>
    </motion.article>
  );
}