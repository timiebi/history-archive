/**
 * API types aligned with history-back-end Prisma schema.
 * Backend returns camelCase (e.g. startYear, publishedAt, externalSource).
 */

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  [key: string]: unknown;
}

export interface Country {
  id: string;
  name: string;
  slug?: string;
  region?: string;
  period?: string;
  capital?: string;
  language?: string;
  description?: string;
  startYear?: number;
  endYear?: number;
  image?: string;
  [key: string]: unknown;
}

export interface StorySection {
  text: string;
  image?: string;
}

export interface Story {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  cover?: string;
  sections?: StorySection[];
  year?: string;
  publishedAt?: string;
  author?: string;
  source?: "CONTRIBUTOR" | "ADMIN" | "EXTERNAL";
  externalSource?: string;
  externalId?: string;
  categoryId?: string;
  countryId?: string;
  category?: { id: string; name: string };
  country?: { id: string; name: string; region?: string };
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total?: number;
  page?: number;
  size?: number;
  pages?: number;
}

export interface ApiError {
  message?: string | string[];
  detail?: string | { msg?: string; loc?: string[] }[];
  statusCode?: number;
  error?: string;
}

/** Backend: GET /timelines – historical era/kingdom */
export interface Timeline {
  id: string;
  name: string;
  description?: string;
  startYear: number;
  endYear?: number;
  _count?: { stories: number };
  [key: string]: unknown;
}

/** Backend: GET /cultures */
export interface Culture {
  id: string;
  name: string;
  region: string;
  capital?: string;
  language?: string;
  description?: string;
  image?: string;
  timelineId?: string;
  timeline?: { id: string; name: string; startYear?: number; endYear?: number };
  [key: string]: unknown;
}

/** Backend: GET /library – manuscript (digital folio) */
export interface Manuscript {
  id: string;
  title: string;
  author: string;
  era: string;
  summary: string;
  pages?: number;
  tags: string[];
  contentUrl?: string;
  timelineId?: string;
  timeline?: Timeline | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
