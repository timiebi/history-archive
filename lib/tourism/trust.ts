import type { TourListingKind } from "./types";

export function listingKindTrustLabel(kind?: TourListingKind | string | null): string {
  if (kind === "PARTNER_VERIFIED") return "Verified partner";
  return "Gesi curated";
}

export function isPartnerVerifiedListing(kind?: TourListingKind | string | null): boolean {
  return kind === "PARTNER_VERIFIED";
}

export function isGesiCuratedListing(kind?: TourListingKind | string | null): boolean {
  return !kind || kind === "GESI_CURATED";
}
