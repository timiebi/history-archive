"use client";

import { shouldUseNextImageOptimizer } from "@/lib/image-optimizer";
import Image from "next/image";

type StoryHeroImageProps = {
  src: string;
  alt: string;
  /** Hero is always viewport-wide; caps download width for LCP */
  sizes?: string;
  className?: string;
};

/**
 * Story / external story header cover — tuned for LCP (priority, fetchPriority, responsive `sizes`).
 */
export function StoryHeroImage({
  src,
  alt,
  sizes = "100vw",
  className = "object-cover",
}: StoryHeroImageProps) {
  const optimize = shouldUseNextImageOptimizer(src);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      fetchPriority="high"
      sizes={sizes}
      quality={80}
      className={className}
      unoptimized={!optimize}
    />
  );
}
