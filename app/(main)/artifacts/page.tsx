"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const ARTIFACTS = [
 {
    id: "benin-head",
    name: "Commemorative Head of an Oba",
    origin: "Kingdom of Benin, Nigeria",
    material: "Bronze",
    year: "Circa 16th Century",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1200",
    hdImage: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2000",
    description: "A masterpiece of the cire perdue (lost-wax) technique, this commemorative head (Uhunmwun Elao) represents the idealized features of a deceased Oba. The high, beaded collar and reticulated headdress signify the supreme spiritual authority of Edo royalty.",
    dimensions: "H: 50 cm, W: 25 cm",
    culture: "Edo People",
    location: "Benin City, Nigeria",
    currentLocation: "British Museum, London"
  },
  {
    id: "lydenburg-mask",
    name: "Lydenburg Head",
    origin: "Mpumalanga, South Africa",
    material: "Terracotta (fired clay)",
    year: "Circa 500 - 800 AD",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1200",
    hdImage: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2000",
    description: "One of the oldest known African ritual sculptures south of the equator. The synthesis of human and zoomorphic features suggests their use in early Iron Age initiation rites or ancestral representations.",
    dimensions: "H: 30 cm, W: 20 cm",
    culture: "Early Iron Age Bantu-speakers",
    location: "Lydenburg Valley, South Africa",
    currentLocation: "Iziko South African Museum, Cape Town"
  },
  {
    id: "golden-rhino",
    name: "Golden Rhinoceros of Mapungubwe",
    origin: "Kingdom of Mapungubwe, South Africa",
    material: "Gold foil over wood",
    year: "Circa 1075 - 1290 AD",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200",
    hdImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2000",
    description: "Recovered from the royal 'Gold Grave', this rhinoceros confirms Mapungubwe as a nexus of a global trade network. It symbolizes the King’s sovereignty and the sophisticated metallurgy of the Shona ancestors.",
    dimensions: "H: 14 cm, L: 17 cm",
    culture: "Proto-Shona",
    location: "Mapungubwe Hill, South Africa",
    currentLocation: "University of Pretoria, South Africa"
  }
 
];

function ArtifactCard({ artifact }: { artifact: any }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <Link href={`/artifacts/${artifact.id}`}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative group h-125 w-full bg-stone-100 dark:bg-stone-900 overflow-hidden cursor-none border border-stone-200 dark:border-stone-800"
      >
        {/* Content Overlay */}
        <div 
          style={{ transform: "translateZ(40px)" }}
          className="absolute inset-0 z-20 p-10 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        >
          <span className="text-orange-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-3">
            {artifact.origin} — {artifact.year}
          </span>
          <h3 className="text-white text-3xl font-black uppercase italic tracking-tighter leading-none mb-4">
            {artifact.name}
          </h3>
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-orange-800" />
            <p className="text-stone-300 text-[10px] font-black uppercase tracking-widest">
              View Analysis_
            </p>
          </div>
        </div>

        {/* Image */}
        <motion.img
          src={artifact.image}
          alt={artifact.name}
          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-80 dark:opacity-50 group-hover:opacity-100"
        />
        
        {/* Scanning Line Animation */}
        <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-orange-500/50 opacity-0 group-hover:opacity-100 group-hover:top-full transition-all duration-[3s] ease-linear" />
      </motion.div>
    </Link>
  );
}

export default function ArtifactsPage() {
  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] transition-colors duration-500">
      {/* Dynamic Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[60px_60px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]" />
      </div>

      {/* Editorial Header - Matches Stories Page */}
      <section className="relative z-10 px-6 pt-40 pb-20 max-w-7xl mx-auto border-b border-stone-200 dark:border-stone-800">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
        >
          <span className="text-orange-800 dark:text-orange-600 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">
            Vault Access: Verified_
          </span>
          <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] text-stone-900 dark:text-white">
            The <br /> <span className="text-stone-400 dark:text-stone-700">Artifacts.</span>
          </h1>
          <p className="mt-8 text-stone-500 dark:text-stone-400 max-w-md font-serif italic text-lg leading-relaxed">
            A forensic examination of material history, from royal bronzes to ancient terracotta.
          </p>
        </motion.div>
      </section>

      {/* Artifacts Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200 dark:bg-stone-800 border border-stone-200 dark:border-stone-800">
          {ARTIFACTS.map((artifact) => (
            <div key={artifact.id} className="bg-[#fafaf9] dark:bg-[#0c0a09] p-4">
                <ArtifactCard artifact={artifact} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}