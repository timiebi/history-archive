"use client";

const regions = [
  { name: "West", label: "Gold & Empires" },
  { name: "North", label: "Sahara & Sea" },
  { name: "East", label: "Cradle of Humanity" },
  { name: "Central", label: "Heart of the Forest" },
  { name: "Southern", label: "The Stone Citadels" }
];

export function RegionNav() {
  return (
    <section className="py-12 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-px md:bg-stone-200 md:dark:bg-stone-800 border-stone-200 dark:border-stone-800">
          {regions.map((region) => (
            <button
              key={region.name}
              className="group cursor-pointer relative bg-[#fcfaf7] dark:bg-[#0c0a09] p-6 text-left transition-all hover:bg-stone-100 dark:hover:bg-stone-900"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-800 dark:text-orange-600 block mb-1">
                {region.name}
              </span>
              <p className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tighter group-hover:italic transition-all">
                {region.label}
              </p>
             
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-orange-800 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}