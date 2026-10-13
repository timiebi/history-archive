/** Decorative vector layers for the marketing hero (sun motifs around the portrait). */

/** Patterned sun ring — outward triangles, a zigzag band and a dotted inner ring. */
export function TribalSun({ className }: { className?: string }) {
  const teeth = Array.from({ length: 28 }, (_, i) => (i * 360) / 28);
  const zig = Array.from({ length: 56 }, (_, i) => {
    const r = i % 2 === 0 ? 62 : 52;
    const t = ((i * 360) / 56) * (Math.PI / 180);
    return `${(100 + r * Math.sin(t)).toFixed(2)},${(100 - r * Math.cos(t)).toFixed(2)}`;
  }).join(" ");
  const dots = Array.from({ length: 40 }, (_, i) => (i * 360) / 40);

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <g fill="currentColor">
        {teeth.map((deg) => (
          <polygon key={deg} points="94,25 106,25 100,4" transform={`rotate(${deg} 100 100)`} />
        ))}
      </g>
      <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeWidth="3" />
      <polygon points={zig} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <g fill="currentColor">
        {dots.map((deg) => (
          <circle key={deg} cx="100" cy="56" r="1.6" transform={`rotate(${deg} 100 100)`} />
        ))}
      </g>
    </svg>
  );
}

/** Thick tapered rays fanning out — the sunburst behind the shoulders. */
export function Sunburst({ className }: { className?: string }) {
  const rays = Array.from({ length: 30 }, (_, i) => (i * 360) / 30);
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <g fill="currentColor">
        {rays.map((deg) => (
          <polygon key={deg} points="98.5,58 101.5,58 104,2 96,2" transform={`rotate(${deg} 100 100)`} />
        ))}
      </g>
    </svg>
  );
}
