
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
const STORIES = [
  {
    id: "mali-empire",
    title: "The Golden Age of Mali",
    category: "Kingdoms",
    excerpt: "How Mansa Musa turned a desert trading post into the world's center of wealth and learning.",
    image: "https://images.unsplash.com/photo-1590076215667-873d6f3731ad?q=80&w=1200",
    year: "1324 AD"
  },
  {
    id: "queen-aminas-walls",
    title: "The Walls of Zazzau",
    category: "Leadership",
    excerpt: "Exploring the military brilliance of Queen Amina and the massive fortifications that redefined Hausaland.",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1200",
    year: "1576 AD"
  },
  {
    id: "great-zimbabwe-architecture",
    title: "The House of Stone",
    category: "Architecture",
    excerpt: "A study of the sophisticated mortarless masonry of the Shona people in the heart of Southern Africa.",
    image: "https://images.unsplash.com/photo-1523733230460-120697af19be?q=80&w=1200",
    year: "1200 AD"
  },
  {
    id: "swahili-coast-trade",
    title: "Monsoon Trade & Minarets",
    category: "Maritime",
    excerpt: "The rise of the Swahili city-states and their ancient trade networks connecting Africa to China and India.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200",
    year: "900 AD"
  },
  {
    id: "nubian-pyramids",
    title: "The Black Pharaohs",
    category: "Kingdoms",
    excerpt: "The Kushite kings of Meroë who built more pyramids than their Egyptian neighbors to the north.",
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1200",
    year: "700 BCE"
  },
  {
    id: "benin-bronzes",
    title: "The Bronze Records",
    category: "Art",
    excerpt: "The intricate casting techniques of the Benin Empire that captured centuries of court history in metal.",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1200",
    year: "1440 AD"
  },
  {
    id: "aksum-obelisks",
    title: "The Empire of Aksum",
    category: "Innovation",
    excerpt: "How an ancient Ethiopian superpower became the first African kingdom to mint its own coinage.",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200",
    year: "100 AD"
  },
  {
    id: "ashanti-golden-stool",
    title: "The Golden Stool",
    category: "Spirituality",
    excerpt: "The sacred symbol of unity and sovereignty that descended from the heavens to unify the Ashanti Empire.",
    image: "https://images.unsplash.com/photo-1512100356956-c1226c996cd0?q=80&w=1200",
    year: "1701 AD"
  }
];




// Categories derived from the STORIES data
const CATEGORIES = ["All", "Kingdoms", "Leadership", "Architecture", "Maritime", "Art", "Innovation", "Spirituality"];

export default function StoriesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  // 1. SCROLL PROGRESS LOGIC
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax scroll effect for the background map
  const mapY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // Filter Logic
  const filteredStories = useMemo(() => {
    return STORIES.filter((story) => {
      const matchesCategory = activeCategory === "All" || story.category === activeCategory;
      const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            story.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const displayedStories = filteredStories.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] transition-colors duration-500">
      
      {/* 2. READING PROGRESS BAR */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-orange-800 z-100 origin-left"
        style={{ scaleX }}
      />

      {/* PARALLAX BACKGROUND MAP */}
      <motion.div style={{ y: mapY }} className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 flex justify-center items-center">
          <img
            src="/stories/africamap.svg"
            alt=""
            className="w-full max-w-[80vw] opacity-[0.04] dark:opacity-[0.02] blur-[1px] grayscale"
          />
        </div>
      </motion.div>

      {/* HEADER & SEARCH */}
      <section className="relative z-10 px-6 pt-40 pb-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-orange-800 dark:text-orange-600 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">
              The Oral & Written Record
            </span>
            <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8]">
              History <br /> <span className="text-stone-400">Unveiled.</span>
            </h1>
          </motion.div>

          <div className="w-full md:w-80 relative group">
            <input 
              type="text"
              placeholder="SEARCH ARCHIVE_"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-stone-300 dark:border-stone-800 py-2 font-mono text-[10px] uppercase tracking-widest focus:border-orange-800 outline-none transition-colors"
            />
            <div className="absolute bottom-0 left-0 h-0.5 bg-orange-800 w-0 group-focus-within:w-full transition-all duration-500" />
          </div>
        </div>

        {/* CATEGORY NAV */}
        <nav className="mt-20 flex flex-wrap gap-x-8 gap-y-4 border-b border-stone-200 dark:border-stone-800 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setVisibleCount(4); }}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeCategory === cat ? "text-orange-800" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div layoutId="underline" className="absolute -bottom-6.25 left-0 right-0 h-0.5 bg-orange-800" />
              )}
            </button>
          ))}
        </nav>
      </section>

      {/* STORIES GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="grid gap-px bg-stone-200 dark:bg-stone-800 border border-stone-200 dark:border-stone-800">
          <AnimatePresence mode="popLayout">
            {displayedStories.map((story, index) => (
              <motion.a 
                layout
                key={story.id} 
                href={`/stories/${story.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                className="group relative grid md:grid-cols-2 bg-[#fafaf9] dark:bg-[#0c0a09] overflow-hidden"
              >
                {/* IMAGE WITH "SCANNING" EFFECT */}
                <div className={`relative h-96 md:h-162.5overflow-hidden ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                  <img 
                    src={story.image} 
                    alt={story.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 scale-110 group-hover:scale-100 grayscale-[0.6] group-hover:grayscale-0" 
                  />
                  
                  {/* The Scanning Overlay */}
                  <div className="absolute inset-0 bg-orange-900/0 group-hover:bg-orange-900/10 transition-colors duration-500" />
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-orange-500/50 opacity-0 group-hover:opacity-100 group-hover:top-full transition-all duration-2000 ease-linear pointer-events-none" />

                  <div className="absolute top-8 left-8 text-white/50 font-mono text-[9px] tracking-widest bg-black/40 px-3 py-1 backdrop-blur-md border border-white/10">
                    DATA_REF: {story.id.toUpperCase()}
                  </div>
                </div>

                {/* TEXT CONTENT */}
                <div className="p-12 md:p-24 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-10">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-orange-800 bg-orange-800/5 px-2 py-1">
                      {story.category}
                    </span>
                    <span className="text-stone-400 font-mono text-[10px] uppercase tracking-widest border-b border-stone-200 dark:border-stone-800">
                      EST. {story.year}
                    </span>
                  </div>

                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] mb-10 group-hover:text-orange-800 transition-colors duration-500">
                    {story.title}
                  </h2>

                  <p className="text-stone-600 dark:text-stone-400 text-xl font-serif italic leading-relaxed mb-12 max-w-lg">
                    {story.excerpt}
                  </p>

                  <div className="mt-auto pt-10 border-t border-stone-100 dark:border-stone-900 flex items-center justify-between">
                    <div className="flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.4em]">
                      Explore Archive <span className="group-hover:translate-x-4 transition-transform duration-500 text-orange-800">→</span>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-stone-300 dark:bg-stone-800 group-hover:bg-orange-800 transition-colors duration-500" />
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>

        {/* LOAD MORE RECORDS */}
        {visibleCount < filteredStories.length && (
          <div className="flex justify-center py-32">
            <button 
              onClick={() => setVisibleCount(prev => prev + 2)}
              className="group cursor-pointer relative px-16 py-6 border border-stone-300 dark:border-stone-800 overflow-hidden"
            >
              <div className="absolute inset-0 bg-stone-900 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.6em] group-hover:text-white transition-colors">
                Decrypt More Records
              </span>
            </button>
          </div>
        )}
      </section>
    </main>
  );
}