export function ContributionSection() {
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

        <div className="flex flex-wrap justify-center gap-8">
          <button className="relative cursor-pointer px-10 py-5 bg-transparent border border-stone-700 hover:border-orange-800 transition-all group overflow-hidden">
            <span className="relative z-10 text-xs font-black uppercase tracking-[0.3em]">Become a Contributor</span>
            <div className="absolute inset-0 bg-stone-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="absolute inset-0 z-20 flex items-center justify-center text-stone-900 text-xs font-black uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              Apply Now
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}