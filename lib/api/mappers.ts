import type { Country, Story, Culture } from "./types";

/** UI shape for culture/empire cards and overlay (map + cultures pages) */
export interface CultureDisplay {
  id: string;
  name: string;
  region?: string;
  period?: string;
  capital?: string;
  language?: string;
  desc?: string;
  start?: number;
  end?: number;
  image?: string;
}

/** Placeholder when external APIs return null image (Wikipedia Search, Europeana, some Smithsonian) */
export const STORY_IMAGE_PLACEHOLDER = "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800";

/** UI shape for story cards (list and home) */
export interface StoryDisplay {
  id: string;
  title: string;
  category?: string;
  region?: string;
  excerpt?: string;
  image?: string;
  year?: string;
  author?: string;
  source?: "CONTRIBUTOR" | "ADMIN" | "EXTERNAL";
  sourceUrl?: string;
  externalSource?: string;
}

export function cultureToCultureDisplay(c: Culture): CultureDisplay {
  const t = c.timeline;
  const start = t?.startYear ?? (c as { startYear?: number }).startYear;
  const end = t?.endYear ?? (c as { endYear?: number }).endYear;
  const period =
    start != null && end != null ? `${start} – ${end}` : (c as { period?: string }).period;
  return {
    id: c.id,
    name: c.name,
    region: c.region,
    period,
    capital: c.capital,
    language: c.language,
    desc: c.description,
    start: start ?? undefined,
    end: end ?? undefined,
    image: c.image,
  };
}

export function countryToCultureDisplay(c: Country): CultureDisplay {
  const start = c.startYear ?? (c as { start_year?: number }).start_year;
  const end = c.endYear ?? (c as { end_year?: number }).end_year;
  const period =
    c.period ??
    (start != null && end != null ? `${start} – ${end}` : undefined);
  return {
    id: c.id,
    name: c.name,
    region: c.region,
    period,
    capital: c.capital,
    language: c.language,
    desc: (c as { desc?: string }).desc ?? c.description,
    start,
    end,
    image: c.image,
  };
}

export function storyToStoryDisplay(s: Story): StoryDisplay {
  const categoryName =
    typeof s.category === 'object' && s.category?.name
      ? s.category.name
      : (s as { category?: string }).category ??
        (s as { category_name?: string }).category_name;
  const region =
    (s as { region?: string }).region ??
    (typeof s.country === 'object' && s.country?.region ? s.country.region : undefined);
  const excerpt = s.excerpt ?? (s.content && typeof s.content === "string" ? s.content.slice(0, 200) + (s.content.length > 200 ? "…" : "") : undefined);
  const rawImage = s.image ?? (s as { cover?: string }).cover;
  return {
    id: s.id,
    title: s.title,
    category: categoryName,
    region,
    excerpt,
    image: rawImage && String(rawImage).trim() ? rawImage : STORY_IMAGE_PLACEHOLDER,
    year: s.year ?? s.publishedAt ?? (s as { published_at?: string }).published_at,
    author: s.author,
    source: s.source as StoryDisplay["source"],
    sourceUrl: (s as { sourceUrl?: string }).sourceUrl,
    externalSource: s.externalSource,
  };
}
