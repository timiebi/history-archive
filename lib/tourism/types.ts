/** Tourism domain types — frontend shape mapped from Tourism API. */

export type TourFaq = {
  question: string;
  answer: string;
};

export type TourItineraryDay = {
  day: number;
  title: string;
  description: string;
};

export type TourMapLocation = {
  label: string;
  lat?: number;
  lng?: number;
  countryHint?: string;
  countryId?: string;
};

export type TourListingKind = "GESI_CURATED" | "PARTNER_CLAIMED" | "PARTNER_VERIFIED";
export type TourStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/**
 * Canonical tourism experience shape used by /visit UI.
 * Populated from GET /tourism/tours via mapper — not hardcoded.
 */
export type Tour = {
  id: string;
  slug: string;
  name: string;
  /** Short catalogue blurb (legacy `desc`) */
  desc: string;
  /** Location line shown on cards (legacy `dest`) */
  dest: string;
  location: string;
  country: string;
  region: string;
  price: number;
  duration: string;
  rating: string;
  /** Primary cover image (legacy `img`) */
  img: string;
  images: string[];
  highlights: string[];
  operators: string;
  overview: string;
  story: string;
  historicalSignificance: string;
  experienceItems: { title: string; description: string }[];
  itinerary: TourItineraryDay[];
  difficulty: string;
  groupSize: string;
  bestSeason: string;
  meetingPoint: string;
  included: string[];
  excluded: string[];
  faq: TourFaq[];
  mapLocation: TourMapLocation;
  relatedStoryIds: string[];
  relatedTimelineIds: string[];
  relatedCultureIds: string[];
  relatedArtifactIds: string[];
  relatedLibraryIds: string[];
  listingKind?: TourListingKind;
  trustLabel?: string;
  partnerOrganization?: {
    name: string;
    slug?: string;
    logoUrl?: string | null;
    country?: string;
  } | null;
  status?: TourStatus;
};
