"use client";

import { useClaimEligibility } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/constants";
import type { Tour } from "@/lib/tourism";
import {
  isGesiCuratedListing,
  listingKindTrustLabel,
} from "@/lib/tourism/trust";
import Link from "next/link";
import { useEffect, useState } from "react";

export function TourListingTrustBadge({
  listingKind,
  partnerName,
  className = "",
}: {
  listingKind?: string;
  partnerName?: string | null;
  className?: string;
}) {
  const label = listingKindTrustLabel(listingKind);
  return (
    <span
      className={`inline-flex flex-col gap-0.5 items-start ${className}`}
    >
      <span className="inline-flex items-center bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-mono text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm">
        {label}
      </span>
      {listingKind === "PARTNER_VERIFIED" && partnerName ? (
        <span className="text-[8px] font-mono text-stone-500 tracking-wide">
          {partnerName}
        </span>
      ) : null}
    </span>
  );
}

/** Honest claim CTA — only for Gesi-curated public tours. Never implies ownership. */
export function TourClaimListingCta({ tour }: { tour: Tour }) {
  const [hasToken, setHasToken] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasToken(!!localStorage.getItem(AUTH_TOKEN_KEY));
  }, []);

  const isCurated = isGesiCuratedListing(tour.listingKind);
  const tourKey = tour.slug || tour.id;

  const { data: eligibility, isPending } = useClaimEligibility(tourKey, {
    enabled: mounted && hasToken && isCurated,
    retry: false,
  });

  if (!isCurated) return null;

  if (!mounted) return null;

  if (!hasToken) {
    return (
      <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-2">
        <p className="font-mono text-[9px] uppercase tracking-widest text-stone-500">
          Tourism partners
        </p>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Does this Gesi-curated listing represent your tourism business? Verified partners can
          request to claim it. Claiming requires Gesi Admin approval and does not mean you own this
          listing today.
        </p>
        <Link
          href={`/auth/login?redirect=${encodeURIComponent(`/visit/${tourKey}/claim`)}`}
          className="inline-flex min-h-[44px] items-center text-[10px] font-mono font-black uppercase tracking-widest text-orange-700 dark:text-orange-400 hover:underline"
        >
          Sign in to claim this listing
        </Link>
      </div>
    );
  }

  if (isPending) {
    return (
      <p className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
        Checking claim eligibility…
      </p>
    );
  }

  if (eligibility?.eligible) {
    return (
      <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-3">
        <p className="font-mono text-[9px] uppercase tracking-widest text-stone-500">
          Claim this listing
        </p>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          If this Gesi-curated expedition genuinely represents{" "}
          <span className="font-medium text-stone-800 dark:text-stone-200">
            {eligibility.organization?.name}
          </span>
          , you can submit a claim with evidence. Gesi Admin must approve before the listing becomes
          a verified partner listing.
        </p>
        <Link
          href={`/visit/${encodeURIComponent(tourKey)}/claim`}
          className="inline-flex min-h-[44px] items-center bg-stone-900 dark:bg-amber-700 px-4 text-[10px] font-mono font-black uppercase tracking-widest text-white"
        >
          Claim this listing
        </Link>
      </div>
    );
  }

  if (eligibility?.reason === "ACTIVE_CLAIM_EXISTS") {
    return (
      <div className="border border-amber-200 dark:border-amber-900 rounded-xl p-4 space-y-2 text-sm">
        <p className="font-medium text-amber-900 dark:text-amber-200">Claim already submitted</p>
        <p className="text-stone-600 dark:text-stone-400">
          {eligibility.message ?? "You have an active claim for this listing."}
        </p>
        <Link
          href={`/partner/claims/${eligibility.existingClaimId}`}
          className="inline-flex text-[10px] font-mono uppercase tracking-widest text-orange-700 dark:text-orange-400 hover:underline"
        >
          View claim status
        </Link>
      </div>
    );
  }

  if (eligibility?.reason === "ORG_NOT_VERIFIED" || eligibility?.reason === "NOT_PARTNER") {
    return (
      <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-2">
        <p className="font-mono text-[9px] uppercase tracking-widest text-stone-500">
          Claim this listing
        </p>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          {eligibility.message ??
            "You need to become a verified tourism partner before claiming curated listings."}
        </p>
        <Link
          href="/partner"
          className="inline-flex min-h-[44px] items-center text-[10px] font-mono font-black uppercase tracking-widest text-orange-700 dark:text-orange-400 hover:underline"
        >
          Become a verified partner
        </Link>
      </div>
    );
  }

  return null;
}
