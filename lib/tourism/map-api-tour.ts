import type { Tour } from "./types";

/** API tour payload from Nest TourismModule */
export type ApiTour = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  locationLabel: string;
  location: string;
  countryLabel: string;
  region: string;
  price: number;
  duration: string;
  ratingDisplay?: string | null;
  heroImageUrl: string;
  operatorsLabel?: string | null;
  overview: string;
  story: string;
  historicalSignificance: string;
  difficulty?: string | null;
  groupSize?: string | null;
  bestSeason?: string | null;
  meetingPoint?: string | null;
  highlights?: string[];
  status?: string;
  listingKind?: string;
  trustLabel?: string;
  partnerOrganization?: {
    name: string;
    slug?: string;
    logoUrl?: string | null;
    country?: string;
  } | null;
  countryId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  mapLabel?: string | null;
  images?: { url: string; isHero?: boolean; sortOrder?: number }[];
  itineraryDays?: { dayNumber: number; title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  experienceItems?: { title: string; description: string }[];
  included?: string[];
  excluded?: string[];
  relatedStoryIds?: string[];
  relatedTimelineIds?: string[];
  relatedCultureIds?: string[];
  relatedArtifactIds?: string[];
  relatedLibraryIds?: string[];
  mapLocation?: {
    label?: string;
    countryHint?: string;
    countryId?: string;
    lat?: number;
    lng?: number;
  };
};

export function mapApiTourToTour(api: ApiTour): Tour {
  const imageUrls =
    api.images?.map((i) => i.url).filter(Boolean) ??
    (api.heroImageUrl ? [api.heroImageUrl] : []);

  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    desc: api.shortDescription,
    dest: api.locationLabel,
    location: api.location,
    country: api.countryLabel,
    region: api.region,
    price: api.price,
    duration: api.duration,
    rating: api.ratingDisplay ?? "",
    img: api.heroImageUrl || imageUrls[0] || "",
    images: imageUrls.length ? imageUrls : api.heroImageUrl ? [api.heroImageUrl] : [],
    highlights: api.highlights ?? [],
    operators: api.operatorsLabel ?? "",
    overview: api.overview,
    story: api.story,
    historicalSignificance: api.historicalSignificance,
    experienceItems: (api.experienceItems ?? []).map((e) => ({
      title: e.title,
      description: e.description,
    })),
    itinerary: (api.itineraryDays ?? []).map((d) => ({
      day: d.dayNumber,
      title: d.title,
      description: d.description,
    })),
    difficulty: api.difficulty ?? "",
    groupSize: api.groupSize ?? "",
    bestSeason: api.bestSeason ?? "",
    meetingPoint: api.meetingPoint ?? "",
    included: api.included ?? [],
    excluded: api.excluded ?? [],
    faq: (api.faqs ?? []).map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
    mapLocation: {
      label: api.mapLocation?.label || api.mapLabel || api.locationLabel,
      countryHint: api.mapLocation?.countryHint || api.countryLabel,
      countryId: api.mapLocation?.countryId || api.countryId || undefined,
      lat: api.mapLocation?.lat ?? api.latitude ?? undefined,
      lng: api.mapLocation?.lng ?? api.longitude ?? undefined,
    },
    relatedStoryIds: api.relatedStoryIds ?? [],
    relatedTimelineIds: api.relatedTimelineIds ?? [],
    relatedCultureIds: api.relatedCultureIds ?? [],
    relatedArtifactIds: api.relatedArtifactIds ?? [],
    relatedLibraryIds: api.relatedLibraryIds ?? [],
    listingKind: (api.listingKind as Tour["listingKind"]) ?? "GESI_CURATED",
    trustLabel: api.trustLabel,
    partnerOrganization: api.partnerOrganization ?? null,
    status: (api.status as Tour["status"]) ?? "PUBLISHED",
  };
}
