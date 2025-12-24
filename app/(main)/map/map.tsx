"use client";

import { motion } from "framer-motion";

// These "path" values are currently placeholders. 
// You will need to adjust these coordinates based on your specific image.
const EMPIRE_REGIONS = [
  { id: "mali", name: "Mali Empire", path: "M140,220 L220,220 L200,300 L120,280 Z", color: "#c2410c" },
  { id: "aksum", name: "Kingdom of Aksum", path: "M410,210 L460,230 L440,280 L390,260 Z", color: "#2563eb" },
  { id: "zimbabwe", name: "Great Zimbabwe", path: "M360,480 L420,480 L420,550 L360,550 Z", color: "#059669" },
];

interface MapProps {
  activeNode: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void; // New prop for the overlay
}

export function AfricaMap({ activeNode, onHover, onClick }: MapProps) {
  return (
    <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center bg-stone-950/20 rounded-xl overflow-hidden border border-stone-800/50">
      
      {/* 1. THE BASE IMAGE */}
      <img 
        src="/map-africa.png" 
        className="absolute inset-0 w-full h-full object-contain opacity-30 invert grayscale brightness-[0.7] pointer-events-none"
        alt="Africa Base Map"
      />

      {/* 2. THE INTERACTIVE LAYER */}
      <svg 
        viewBox="0 0 600 800" // Standard coordinate space
        className="absolute inset-0 w-full h-full z-10"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {EMPIRE_REGIONS.map((region) => (
          <motion.path
            key={region.id}
            d={region.path}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: activeNode === region.id ? 0.6 : 0.1, // Always slightly visible for "discovery"
              fill: activeNode === region.id ? region.color : "rgba(255,255,255,0.05)",
              stroke: region.color,
              strokeWidth: activeNode === region.id ? 2 : 1,
            }}
            whileHover={{ opacity: 0.8, scale: 1.02 }}
            onMouseEnter={() => onHover(region.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(region.id)}
            className="cursor-pointer transition-all duration-300"
            style={{ transformOrigin: "center", pointerEvents: "all" }}
          />
        ))}

        {/* Trade Routes - Layered on top */}
        <motion.path
          d="M180,250 Q300,220 420,240"
          stroke="rgba(194,65,12,0.3)"
          strokeWidth="1"
          strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* 3. COORDINATE HELPER (Only during development) */}
      <div className="absolute bottom-4 left-4 font-mono text-[8px] text-stone-600 pointer-events-none">
        RENDER_MODE: GEOSPATIAL_OVERLAY // V1.0
      </div>
    </div>
  );
}