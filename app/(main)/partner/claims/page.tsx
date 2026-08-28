"use client";

import {
  usePartnerClaims,
  type ClaimStatus,
} from "@/lib/api";
import {
  usePartnerAuthGate,
  usePartnerWorkspace,
} from "@/components/partner/use-partner-workspace";
import Link from "next/link";
import { useState } from "react";

const FILTERS: { value: "" | ClaimStatus; label: string }[] = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "NEEDS_INFO", label: "Needs information" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

function statusTone(status: string): string {
  switch (status) {
    case "APPROVED":
      return "text-emerald-700 dark:text-emerald-400";
    case "PENDING":
      return "text-amber-700 dark:text-amber-400";
    case "NEEDS_INFO":
      return "text-sky-700 dark:text-sky-400";
    case "REJECTED":
      return "text-red-700 dark:text-red-400";
    default:
      return "text-stone-500";
  }
}

export default function PartnerClaimsPage() {
  const { mounted, hasToken } = usePartnerAuthGate();
  const { org, isPending: orgPending } = usePartnerWorkspace(mounted && hasToken);
  const [status, setStatus] = useState<"" | ClaimStatus>("");
  const verified = org?.status === "VERIFIED";

  const { data, isPending, isError, error, refetch } = usePartnerClaims(
    { status: status || undefined, limit: 50 },
    { enabled: mounted && hasToken && verified }
  );

  if (!mounted || !hasToken) return null;

  if (orgPending) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Loading…</p>
    );
  }

  if (!org || !verified) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-black tracking-tight">Listing claims</h1>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Only verified tourism partners can claim Gesi-curated listings.
        </p>
        <Link href="/partner" className="text-orange-700 underline text-sm">
          Back to workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-stone-50">
          Listing claims
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Claims for Gesi-curated tours that represent {org.name}. Admin approval is required before
          a listing becomes a verified partner listing.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value || "all"}
            type="button"
            onClick={() => setStatus(f.value)}
            className={`px-3 py-2 text-[10px] font-mono uppercase tracking-widest border min-h-[40px] ${
              status === f.value
                ? "border-orange-700 text-orange-800 dark:border-orange-400 dark:text-orange-400"
                : "border-stone-200 dark:border-stone-800 text-stone-500"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isError && (
        <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error?.message ?? "Failed to load claims"}
        </div>
      )}

      {isPending ? (
        <p className="text-sm text-stone-500">Loading claims…</p>
      ) : !data?.items.length ? (
        <div className="border border-stone-200 dark:border-stone-800 p-8 text-center text-sm text-stone-500">
          No claims yet. Open a Gesi-curated tour on{" "}
          <Link href="/visit" className="underline text-orange-700">
            /visit
          </Link>{" "}
          and use Claim this listing when eligible.
        </div>
      ) : (
        <ul className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-800">
          {data.items.map((c) => (
            <li
              key={c.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
            >
              <div>
                <Link
                  href={`/partner/claims/${c.id}`}
                  className="font-medium text-stone-900 dark:text-stone-50 hover:text-orange-700"
                >
                  {c.tour?.name ?? "Tour"}
                </Link>
                <p className="text-xs text-stone-500 mt-1">
                  {org.name} ·{" "}
                  <span className={statusTone(c.status)}>{c.status.replace(/_/g, " ")}</span>
                  {" · "}
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
                {c.status === "NEEDS_INFO" && c.reviewNotes && (
                  <p className="mt-2 text-xs text-sky-800 dark:text-sky-300 line-clamp-2">
                    Admin: {c.reviewNotes}
                  </p>
                )}
              </div>
              <Link
                href={`/partner/claims/${c.id}`}
                className="text-[10px] font-mono uppercase tracking-widest text-orange-700 dark:text-orange-400"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}

      <button type="button" onClick={() => refetch()} className="text-xs text-stone-500 underline">
        Refresh
      </button>
    </div>
  );
}
