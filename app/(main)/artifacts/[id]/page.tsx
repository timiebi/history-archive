"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Layers, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";
import { use, useRef, useState } from "react";
import { useArtifacts } from "@/lib/api";

export default function ArtifactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: artifacts = [], isPending } = useArtifacts();
  const artifact = artifacts.find((a) => a.id === id) ?? null;

  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLightTable, setIsLightTable] = useState(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  if (isPending) {
    return (
      <div className="h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex items-center justify-center">
        <p className="text-sm text-stone-500">Loading artifact…</p>
      </div>
    );
  }
  if (!artifact) {
    return (
      <div className="h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex items-center justify-center">
        <p className="text-sm text-stone-500">Artifact not found.</p>
      </div>
    );
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      lastPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastPosition.current.x;
      const dy = e.clientY - lastPosition.current.y;
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleZoom = (factor: number) => {
    setZoomLevel(prev => {
      const next = Math.max(1, Math.min(5, prev * factor));
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  return (
    <main className={`min-h-screen mt-30 transition-colors duration-700 ${isLightTable ? "bg-white text-stone-900" : "bg-[#fafaf9] dark:bg-[#0c0a09] dark:text-white"}`}>
      
      {/* HEADER NAV */}
      <div className=" top-0 left-0 right-0 z-50 flex justify-between items-center p-8 pointer-events-none">
        <Link 
          href="/artifacts" 
          className="pointer-events-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-orange-700 transition-colors bg-white/10 dark:bg-black/10 backdrop-blur-md px-4 py-2 border border-stone-200 dark:border-stone-800"
        >
          <ArrowLeft size={14} aria-hidden /> Back to artifacts
        </Link>

        <button
          type="button"
          onClick={() => setIsLightTable(!isLightTable)}
          className="pointer-events-auto flex items-center gap-2 text-xs font-semibold bg-stone-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-sm transition-colors hover:bg-orange-700 dark:hover:bg-orange-600"
        >
          <Layers size={14} aria-hidden />{" "}
          {isLightTable ? "Standard view" : "Bright study view"}
        </button>
      </div>

      <section className="grid lg:grid-cols-2 h-screen">
        
        {/* LEFT SIDE: SCANNER */}
        <div className={`relative flex items-center justify-center overflow-hidden transition-colors duration-700 ${isLightTable ? "bg-stone-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px]" : "bg-stone-200 dark:bg-stone-950"}`}>
          <motion.div
            animate={{ scale: zoomLevel, x: position.x, y: position.y }}
            transition={isDragging ? { type: "tween", duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            className="relative w-full h-full touch-none"
            style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'crosshair' }}
          >
            <img
              src={artifact.hdImage ?? artifact.image ?? ""}
              alt={artifact.name}
              className={`object-contain w-full h-full p-12 pointer-events-none select-none transition-all duration-700 ${isLightTable ? "drop-shadow-2xl brightness-110 grayscale-0" : "grayscale-[0.2] dark:grayscale-0"}`}
            />
          </motion.div>

          <div
            className={`absolute top-20 left-12 text-xs z-20 tabular-nums ${isLightTable ? "text-stone-500" : "text-stone-600 dark:text-stone-400"}`}
          >
            <span className="block text-[10px] uppercase tracking-wide text-stone-500 dark:text-stone-500">
              {isLightTable ? "Bright background" : "Standard"}
            </span>
            Zoom {Math.round(zoomLevel * 100)}%
          </div>

          {/* CONTROLS */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 bg-white dark:bg-stone-900 px-8 py-4 border border-stone-200 dark:border-stone-800 shadow-2xl">
            <button onClick={() => handleZoom(0.8)} className="text-stone-400 hover:text-orange-700"><ZoomOut size={18}/></button>
            <button onClick={() => handleZoom(1.2)} className="text-stone-400 hover:text-orange-700"><ZoomIn size={18}/></button>
          </div>
        </div>

        {/* RIGHT SIDE: DATA */}
        <div className={`relative p-12 md:p-24 flex flex-col justify-center border-l transition-colors duration-700 ${isLightTable ? "bg-white border-stone-100" : "bg-[#fafaf9] dark:bg-[#0c0a09] border-stone-800"}`}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-orange-700 dark:text-orange-500 text-sm font-semibold mb-3 block">
              Artifact
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-8">
              {artifact.name}
            </h1>
            <p className="text-lg md:text-xl text-stone-600 dark:text-stone-300 leading-relaxed mb-12 max-w-xl">
              {artifact.description}
            </p>

            <div className="grid grid-cols-2 gap-x-12 gap-y-8 pt-12 border-t border-stone-200 dark:border-stone-800">
              {[
                { label: "Origin", value: artifact.origin ?? "" },
                { label: "Material", value: artifact.material ?? "" },
                { label: "Era", value: artifact.year ?? "" },
                { label: "Location", value: artifact.currentLocation ?? artifact.location ?? "" },
              ].map((spec, i) => (
                <div key={i}>
                  <dt className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">{spec.label}</dt>
                  <dd className="text-sm font-semibold text-stone-900 dark:text-stone-100">{spec.value}</dd>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* RELATED RECORDS SLIDER */}
      <section className={`py-32 px-6 border-t transition-colors duration-700 ${isLightTable ? "bg-stone-50 border-stone-100" : "bg-stone-100 dark:bg-stone-900/30 border-stone-800"}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-stone-900 dark:text-white">
            Related objects
          </h2>
          <div className="flex gap-8 overflow-x-auto no-scrollbar pb-12">
            {artifacts.filter((a) => a.id !== artifact.id).map((related) => (
              <Link key={related.id} href={`/artifacts/${related.id}`} className="min-w-100 group">
                <div className="aspect-4/5 bg-stone-200 dark:bg-stone-950 overflow-hidden mb-6 relative">
                  <img src={related.image ?? ""} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{related.name}</h3>
                <p className="text-xs text-stone-500">{related.origin ?? ""}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}