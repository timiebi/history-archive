/**
 * Hosts allowed for `next/image` optimization (must match `next.config` remotePatterns).
 * Any other URL is served with `unoptimized` so LCP still gets priority + sizing hints.
 */
export function shouldUseNextImageOptimizer(src: string): boolean {
  try {
    const u = new URL(src);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const h = u.hostname.toLowerCase();
    if (h === "images.unsplash.com") return true;
    if (h === "res.cloudinary.com" || h.endsWith(".res.cloudinary.com")) return true;
    if (h.endsWith(".cloudinary.com")) return true;
    return false;
  } catch {
    return false;
  }
}
