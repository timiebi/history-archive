import Image from "next/image";

export function FeaturedSpotlight() {
  return (
    <section className="py-24 bg-stone-100 dark:bg-stone-900/30 border-y border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Large Image with Frame */}
          <div className="lg:col-span-7 relative p-4 bg-white dark:bg-stone-800 shadow-2xl rotate-1">
            <div className="relative aspect-4/3 overflow-hidden">
              <Image
                src="/stories/zimbabwe2.jpg" 
                alt="Featured History" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-orange-800 dark:text-orange-500 font-bold text-xs uppercase tracking-widest">
              <span className="w-8 h-px bg-current" />
              Featured Exhibition
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-[0.9]">
              The Stone <br /> Walls of <br /> <span className="text-orange-800">Zimbabwe</span>
            </h2>
            <p className="font-serif text-lg text-stone-600 dark:text-stone-400 italic">
              "A testament to the architectural brilliance of the Shona people, rising from the earth without a drop of mortar."
            </p>
            <button className="pt-4 flex items-center gap-4 group font-black uppercase text-xs tracking-[0.2em]">
              Enter the Exhibition
              <span className="w-12 h-12 cursor-pointer rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}