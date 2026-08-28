"use client";

import {
  usePartnerClaim,
  useResubmitTourListingClaim,
  useWithdrawTourListingClaim,
} from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

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

export default function PartnerClaimDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { data: claim, isPending, isError, error, refetch } = usePartnerClaim(id || null);
  const resubmitMut = useResubmitTourListingClaim();
  const withdrawMut = useWithdrawTourListingClaim();
  const [notes, setNotes] = useState("");
  const [urlsText, setUrlsText] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [seeded, setSeeded] = useState(false);

  const needsInfo = claim?.status === "NEEDS_INFO";

  useEffect(() => {
    if (claim && needsInfo && !seeded) {
      setNotes(claim.evidenceNotes ?? "");
      setUrlsText((claim.evidenceUrls ?? []).join("\n"));
      setSeeded(true);
    }
  }, [claim, needsInfo, seeded]);

  async function onResubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setMessage("");
    try {
      const urls = urlsText
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean);
      await resubmitMut.mutateAsync({
        id,
        evidenceNotes: notes.trim(),
        evidenceUrls: urls.length ? urls : undefined,
      });
      setMessage("Updated information submitted — pending Gesi verification.");
      setSeeded(false);
      await refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Resubmit failed");
    }
  }

  async function onWithdraw() {
    if (!confirm("Withdraw this claim?")) return;
    setFormError("");
    try {
      await withdrawMut.mutateAsync(id);
      setMessage("Claim withdrawn.");
      await refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Withdraw failed");
    }
  }

  if (isPending) {
    return <p className="text-sm text-stone-500">Loading claim…</p>;
  }

  if (isError || !claim) {
    return (
      <div>
        <p className="text-sm text-red-700">{error?.message ?? "Claim not found"}</p>
        <Link href="/partner/claims" className="text-sm underline mt-2 inline-block">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-stone-500 mb-1">
          <Link href="/partner/claims" className="hover:text-orange-600">
            Claims
          </Link>
          <span className="mx-1">/</span>
          {claim.tour?.name}
        </p>
        <h1 className="text-2xl font-black tracking-tight">{claim.tour?.name}</h1>
        <p className={`mt-1 text-sm font-medium ${statusTone(claim.status)}`}>
          {claim.status.replace(/_/g, " ")}
        </p>
      </div>

      {message && (
        <div className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          {message}
        </div>
      )}
      {formError && (
        <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-800">{formError}</div>
      )}

      <section className="border border-stone-200 dark:border-stone-800 p-5 space-y-3 text-sm">
        <p>
          <span className="text-stone-500">Organization:</span> {claim.organization?.name}
        </p>
        <p>
          <span className="text-stone-500">Submitted:</span>{" "}
          {new Date(claim.createdAt).toLocaleString()}
        </p>
        <div>
          <p className="text-stone-500 mb-1">Evidence</p>
          <p className="whitespace-pre-wrap text-stone-800 dark:text-stone-200">
            {claim.evidenceNotes}
          </p>
          {!!claim.evidenceUrls?.length && (
            <ul className="mt-2 space-y-1">
              {claim.evidenceUrls.map((u) => (
                <li key={u}>
                  <a
                    href={u}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-700 underline break-all"
                  >
                    {u}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {claim.reviewNotes && (
          <div>
            <p className="text-stone-500 mb-1">Admin review notes</p>
            <p className="whitespace-pre-wrap">{claim.reviewNotes}</p>
          </div>
        )}
      </section>

      {needsInfo && (
        <form
          onSubmit={onResubmit}
          className="border border-sky-200 dark:border-sky-900 p-5 space-y-4"
        >
          <h2 className="font-bold text-sky-900 dark:text-sky-200">
            Provide requested information
          </h2>
          <label className="block text-sm">
            <span className="text-stone-600">Updated evidence *</span>
            <textarea
              required
              minLength={20}
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full border border-stone-300 dark:border-stone-700 bg-transparent px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">Evidence URLs (one per line)</span>
            <textarea
              rows={3}
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              className="mt-1 w-full border border-stone-300 dark:border-stone-700 bg-transparent px-3 py-2 font-mono text-xs"
            />
          </label>
          <button
            type="submit"
            disabled={resubmitMut.isPending}
            className="inline-flex min-h-[44px] items-center bg-sky-800 px-4 text-xs font-mono uppercase tracking-widest text-white disabled:opacity-50"
          >
            {resubmitMut.isPending ? "Submitting…" : "Resubmit claim"}
          </button>
        </form>
      )}

      {(claim.status === "PENDING" || claim.status === "NEEDS_INFO") && (
        <button
          type="button"
          onClick={onWithdraw}
          disabled={withdrawMut.isPending}
          className="text-xs text-stone-500 underline"
        >
          Withdraw claim
        </button>
      )}

      <p className="text-xs text-stone-500">
        Partners cannot approve claims. Only Gesi Admin can approve, reject, or request more
        information.
      </p>
    </div>
  );
}
