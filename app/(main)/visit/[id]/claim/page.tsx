"use client";

import {
  useClaimEligibility,
  useCreateTourListingClaim,
  useTour,
} from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/constants";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function ClaimTourPage() {
  const params = useParams();
  const router = useRouter();
  const tourKey = typeof params.id === "string" ? params.id : "";
  const [hasToken, setHasToken] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState("");
  const [urlsText, setUrlsText] = useState("");
  const [error, setError] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const token = !!localStorage.getItem(AUTH_TOKEN_KEY);
    setHasToken(token);
    if (!token) {
      router.replace(
        `/auth/login?redirect=${encodeURIComponent(`/visit/${tourKey}/claim`)}`
      );
    }
  }, [router, tourKey]);

  const { data: tour, isPending: tourLoading } = useTour(tourKey);
  const { data: eligibility, isPending: eligLoading } = useClaimEligibility(tourKey, {
    enabled: mounted && hasToken && !!tourKey,
    retry: false,
  });
  const createMut = useCreateTourListingClaim();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const evidenceUrls = urlsText
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    try {
      const claim = await createMut.mutateAsync({
        tourIdOrSlug: tourKey,
        organizationId: eligibility?.organization?.id,
        evidenceNotes: notes.trim(),
        evidenceUrls: evidenceUrls.length ? evidenceUrls : undefined,
      });
      setSubmittedId(claim.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Claim submission failed");
    }
  }

  if (!mounted || !hasToken) {
    return (
      <div className="py-24 text-center font-mono text-[10px] uppercase tracking-widest text-stone-500">
        Loading…
      </div>
    );
  }

  if (tourLoading || eligLoading) {
    return (
      <div className="py-24 text-center font-mono text-[10px] uppercase tracking-widest text-stone-500">
        Loading claim form…
      </div>
    );
  }

  if (submittedId) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 space-y-6">
        <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white">
          Claim submitted — pending Gesi verification.
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Your claim for <span className="font-medium">{tour?.name ?? "this listing"}</span> is
          awaiting Admin review. The listing remains Gesi-curated until an Admin approves the claim.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/partner/claims/${submittedId}`}
            className="inline-flex min-h-[44px] items-center bg-stone-900 px-4 text-xs font-mono uppercase tracking-widest text-white"
          >
            View claim
          </Link>
          <Link
            href={`/visit/${tourKey}`}
            className="inline-flex min-h-[44px] items-center border border-stone-300 px-4 text-xs font-mono uppercase tracking-widest"
          >
            Back to tour
          </Link>
        </div>
      </div>
    );
  }

  if (!eligibility?.eligible) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 space-y-4">
        <h1 className="text-2xl font-black tracking-tight">Cannot claim this listing</h1>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          {eligibility?.message ??
            "You are not eligible to claim this listing. Become a verified tourism partner first."}
        </p>
        <Link href="/partner" className="text-orange-700 dark:text-orange-400 underline text-sm">
          Partner workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 space-y-8">
      <div>
        <p className="text-xs text-stone-500 mb-1">
          <Link href={`/visit/${tourKey}`} className="hover:text-orange-600">
            {tour?.name ?? "Tour"}
          </Link>
          <span className="mx-1">/</span>
          Claim
        </p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-white">
          Claim this listing
        </h1>
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          Submit evidence that this Gesi-curated listing represents your organization. Claiming does
          not transfer ownership until Gesi Admin approves.
        </p>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5 border border-stone-200 dark:border-stone-800 p-5 sm:p-6">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-stone-500">Organization</p>
          <p className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">
            {eligibility.organization?.name}
          </p>
        </div>

        <label className="block text-sm">
          <span className="text-stone-600 dark:text-stone-400">
            Why are you claiming this listing? *
          </span>
          <textarea
            required
            minLength={20}
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full border border-stone-300 dark:border-stone-700 bg-transparent px-3 py-2.5"
            placeholder="Explain how this experience represents your organization…"
          />
        </label>

        <label className="block text-sm">
          <span className="text-stone-600 dark:text-stone-400">
            Supporting evidence URLs (optional, one per line)
          </span>
          <textarea
            rows={3}
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            className="mt-1 w-full border border-stone-300 dark:border-stone-700 bg-transparent px-3 py-2.5 font-mono text-xs"
            placeholder="https://…"
          />
        </label>

        <button
          type="submit"
          disabled={createMut.isPending}
          className="inline-flex min-h-[48px] items-center justify-center bg-stone-900 px-6 text-sm font-semibold uppercase tracking-wider text-white disabled:opacity-50 dark:bg-amber-600"
        >
          {createMut.isPending ? "Submitting…" : "Submit claim"}
        </button>
      </form>
    </div>
  );
}
