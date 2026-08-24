"use client";

import {
  usePartnerAuthGate,
  usePartnerWorkspace,
} from "@/components/partner/use-partner-workspace";
import { usePartnerTours, type PartnerTourModerationStatus } from "@/lib/api";
import Link from "next/link";
import { useState } from "react";

const MOD_FILTERS: { value: "" | PartnerTourModerationStatus; label: string }[] = [
  { value: "", label: "All" },
  { value: "NONE", label: "Drafts (not submitted)" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "NEEDS_CHANGES", label: "Needs changes" },
  { value: "IN_REVIEW", label: "In review" },
  { value: "REJECTED", label: "Rejected" },
];

export default function PartnerToursPage() {
  const { mounted, hasToken } = usePartnerAuthGate();
  const { org, isPending: orgPending } = usePartnerWorkspace(mounted && hasToken);
  const verified = org?.status === "VERIFIED";
  const [modFilter, setModFilter] = useState<"" | PartnerTourModerationStatus>("");
  const toursQuery = usePartnerTours(
    {
      limit: 50,
      ...(modFilter ? { moderationStatus: modFilter } : {}),
    },
    { enabled: mounted && hasToken && verified }
  );

  if (!mounted || !hasToken) return null;
  if (orgPending) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Loading…</p>
    );
  }
  if (!org) {
    return (
      <p className="text-sm text-stone-600">
        <Link href="/partner" className="underline text-orange-800">
          Apply as a partner
        </Link>{" "}
        to manage tours.
      </p>
    );
  }
  if (!verified) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-black tracking-tight">Tours</h1>
        <p className="text-sm text-stone-600">
          Tour management is available after your organization is verified by Gesi. Current status:{" "}
          {org.status.replace(/_/g, " ")}.
        </p>
      </div>
    );
  }

  const items = toursQuery.data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-stone-50">
            Tours
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Create drafts, then submit them for Gesi review. Publishing is not available to partners.
          </p>
        </div>
        <Link
          href="/partner/tours/new"
          className="inline-flex min-h-[44px] items-center bg-stone-900 px-4 text-xs font-mono uppercase tracking-widest text-white dark:bg-amber-600"
        >
          Create tour
        </Link>
      </div>

      <select
        value={modFilter}
        onChange={(e) => setModFilter(e.target.value as "" | PartnerTourModerationStatus)}
        className="border border-stone-300 dark:border-stone-700 bg-transparent px-3 py-2.5 text-sm min-h-[44px]"
      >
        {MOD_FILTERS.map((o) => (
          <option key={o.value || "all"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {toursQuery.isPending ? (
        <p className="text-sm text-stone-500">Loading tours…</p>
      ) : toursQuery.isError ? (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {toursQuery.error.message}
        </div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-stone-300 dark:border-stone-700 p-8 text-center text-sm text-stone-500">
          No tours for this filter.
        </div>
      ) : (
        <ul className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-800">
          {items.map((t) => (
            <li
              key={t.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4"
            >
              <div>
                <Link
                  href={`/partner/tours/${t.id}`}
                  className="font-medium text-stone-900 dark:text-stone-50 hover:text-orange-800"
                >
                  {t.name}
                </Link>
                <p className="text-xs text-stone-500 mt-1">
                  {t.locationLabel} · {t.duration}
                </p>
                <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-stone-500">
                  {t.status}
                  {" · "}
                  {(t.moderationStatus ?? "NONE").replace(/_/g, " ")}
                </p>
              </div>
              <Link
                href={`/partner/tours/${t.id}`}
                className="inline-flex min-h-[44px] items-center border border-stone-300 dark:border-stone-700 px-4 text-xs font-mono uppercase tracking-widest"
              >
                {t.moderationStatus === "SUBMITTED" || t.moderationStatus === "IN_REVIEW"
                  ? "View"
                  : "Edit"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
