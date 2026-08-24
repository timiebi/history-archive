"use client";

import { PartnerStatusBadge } from "@/components/partner/partner-ui";
import {
  usePartnerAuthGate,
  usePartnerWorkspace,
} from "@/components/partner/use-partner-workspace";
import { useUpdatePartnerOrganization } from "@/lib/api";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function PartnerOrganizationPage() {
  const { mounted, hasToken } = usePartnerAuthGate();
  const { org, isOwner, canEditOrg, isPending, isError, error, refetch } =
    usePartnerWorkspace(mounted && hasToken);
  const updateMut = useUpdatePartnerOrganization();

  const [form, setForm] = useState({
    name: "",
    legalName: "",
    country: "",
    contactEmail: "",
    contactPhone: "",
    websiteUrl: "",
    businessRegistrationId: "",
    description: "",
    address: "",
    logoUrl: "",
  });
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!org) return;
    setForm({
      name: org.name ?? "",
      legalName: org.legalName ?? "",
      country: org.country ?? "",
      contactEmail: org.contactEmail ?? "",
      contactPhone: org.contactPhone ?? "",
      websiteUrl: org.websiteUrl ?? "",
      businessRegistrationId: org.businessRegistrationId ?? "",
      description: org.description ?? "",
      address: org.address ?? "",
      logoUrl: org.logoUrl ?? "",
    });
  }, [org]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!org || !canEditOrg) return;
    setFormError("");
    setMessage("");
    if (!form.websiteUrl.trim() && !form.businessRegistrationId.trim()) {
      setFormError("Provide a website URL or a business registration identifier.");
      return;
    }
    try {
      await updateMut.mutateAsync({
        orgId: org.id,
        body: {
          name: form.name.trim(),
          legalName: form.legalName.trim(),
          country: form.country.trim(),
          contactEmail: form.contactEmail.trim(),
          contactPhone: form.contactPhone.trim(),
          websiteUrl: form.websiteUrl.trim() || undefined,
          businessRegistrationId: form.businessRegistrationId.trim() || undefined,
          description: form.description.trim(),
          address: form.address.trim() || undefined,
          logoUrl: form.logoUrl.trim() || undefined,
          resubmitForReview: org.status === "NEEDS_INFO",
        },
      });
      setMessage(
        org.status === "NEEDS_INFO"
          ? "Updates submitted for review."
          : "Organization details saved."
      );
      await refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    }
  }

  if (!mounted || !hasToken) return null;

  if (isPending) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Loading…</p>
    );
  }

  if (isError) {
    return (
      <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error?.message}
      </div>
    );
  }

  if (!org) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-stone-600">You do not have a partner organization yet.</p>
        <Link href="/partner" className="text-orange-800 underline text-sm">
          Apply as a tourism partner
        </Link>
      </div>
    );
  }

  const readOnly = !canEditOrg;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-stone-50">
            Organization
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {isOwner
              ? "Update your public-facing organization profile."
              : "View organization details (OWNER manages profile edits)."}
          </p>
        </div>
        <PartnerStatusBadge status={org.status} />
      </div>

      {org.status === "NEEDS_INFO" && org.verificationNotes && (
        <div className="border border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40 p-4 text-sm">
          <p className="font-medium text-sky-900 dark:text-sky-200">Gesi requested updates</p>
          <p className="mt-2 whitespace-pre-wrap text-stone-700 dark:text-stone-300">
            {org.verificationNotes}
          </p>
        </div>
      )}

      {(org.status === "SUSPENDED" || org.status === "REJECTED") && (
        <div className="border border-stone-300 dark:border-stone-700 p-4 text-sm text-stone-600">
          This organization is {org.status.replace(/_/g, " ").toLowerCase()} and is read-only.
        </div>
      )}

      {!isOwner && (
        <div className="border border-stone-200 dark:border-stone-800 p-4 text-sm text-stone-600">
          You are a MANAGER. Only the OWNER can edit organization profile fields.
        </div>
      )}

      {formError && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</div>
      )}
      {message && (
        <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4 border border-stone-200 dark:border-stone-800 p-5 sm:p-6">
        {(
          [
            ["name", "Organization display name"],
            ["legalName", "Legal / trading name"],
            ["country", "Country / operating region"],
            ["contactEmail", "Contact email"],
            ["contactPhone", "Contact phone"],
            ["websiteUrl", "Website"],
            ["businessRegistrationId", "Business registration ID"],
            ["address", "Address"],
            ["logoUrl", "Logo URL"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="text-stone-600 dark:text-stone-400">{label}</span>
            <input
              disabled={readOnly}
              type={key === "contactEmail" ? "email" : key === "websiteUrl" || key === "logoUrl" ? "url" : "text"}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="mt-1 w-full border border-stone-300 dark:border-stone-700 bg-transparent px-3 py-2.5 disabled:opacity-60"
            />
          </label>
        ))}
        <label className="block text-sm">
          <span className="text-stone-600 dark:text-stone-400">Description</span>
          <textarea
            disabled={readOnly}
            rows={5}
            minLength={20}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="mt-1 w-full border border-stone-300 dark:border-stone-700 bg-transparent px-3 py-2.5 disabled:opacity-60"
          />
        </label>

        {canEditOrg && (
          <button
            type="submit"
            disabled={updateMut.isPending}
            className="inline-flex min-h-[48px] items-center justify-center bg-stone-900 px-6 text-sm font-semibold uppercase tracking-wider text-white disabled:opacity-50 dark:bg-amber-600"
          >
            {updateMut.isPending
              ? "Saving…"
              : org.status === "NEEDS_INFO"
                ? "Save and resubmit"
                : "Save changes"}
          </button>
        )}
      </form>
    </div>
  );
}
