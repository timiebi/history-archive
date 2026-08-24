"use client";

import { PartnerStatusBadge } from "@/components/partner/partner-ui";
import {
  statusLabel,
  usePartnerAuthGate,
  usePartnerWorkspace,
} from "@/components/partner/use-partner-workspace";
import {
  useCreatePartnerOrganization,
} from "@/lib/api";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type FormState = {
  name: string;
  legalName: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  businessRegistrationId: string;
  description: string;
  address: string;
  logoUrl: string;
  authorizedToRepresent: boolean;
};

const emptyForm: FormState = {
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
  authorizedToRepresent: false,
};

export default function PartnerDashboardPage() {
  const { mounted, hasToken } = usePartnerAuthGate();
  const workspace = usePartnerWorkspace(mounted && hasToken);
  const { org, membershipRole, isOwner, memberCount, isPending, isError, error, refetch } =
    workspace;
  const createMut = useCreatePartnerOrganization();

  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
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
      authorizedToRepresent: true,
    });
  }, [org]);

  async function onApply(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setMessage("");
    if (!form.authorizedToRepresent) {
      setFormError("Confirm that you are authorized to represent this organization.");
      return;
    }
    if (!form.websiteUrl.trim() && !form.businessRegistrationId.trim()) {
      setFormError("Provide a website URL or a business registration identifier.");
      return;
    }
    try {
      await createMut.mutateAsync({
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
        authorizedToRepresent: true,
      });
      setMessage("Application submitted. Gesi will review it shortly.");
      setShowApply(false);
      await refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Request failed");
    }
  }

  if (!mounted || !hasToken) {
    return null;
  }

  if (isPending) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Loading workspace…</p>
    );
  }

  if (isError) {
    return (
      <div className="border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40 px-4 py-3 text-sm text-red-800 dark:text-red-200">
        {error?.message ?? "Failed to load partner workspace"}
      </div>
    );
  }

  // ——— No organization: apply ———
  if (!org) {
    return (
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-stone-500 mb-3">
          Tourism partners
        </p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-stone-50">
          Become a Gesi Tourism Partner
        </h1>
        <p className="mt-4 text-stone-600 dark:text-stone-400 leading-relaxed">
          Gesi connects travelers with African heritage and tourism experiences. Businesses can apply
          to become verified tourism partners. The Gesi team reviews each application before any
          partner listing can go live.
        </p>
        <p className="mt-3 text-sm text-stone-500 leading-relaxed">
          Verification helps travelers understand which tourism businesses are officially represented
          on Gesi. Applying does not create a public tour listing yet.
        </p>

        {formError && (
          <div className="mt-6 border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40 px-4 py-3 text-sm text-red-800">
            {formError}
          </div>
        )}
        {message && (
          <div className="mt-6 border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40 px-4 py-3 text-sm text-emerald-800">
            {message}
          </div>
        )}

        {!showApply ? (
          <button
            type="button"
            onClick={() => setShowApply(true)}
            className="mt-10 inline-flex min-h-[48px] items-center justify-center bg-stone-900 px-6 text-sm font-semibold uppercase tracking-wider text-white hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            Apply as a Tourism Partner
          </button>
        ) : (
          <ApplyForm
            form={form}
            setForm={setForm}
            busy={createMut.isPending}
            onSubmit={onApply}
          />
        )}
      </div>
    );
  }

  // ——— Dashboard ———
  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-stone-500 mb-2">
          Partner workspace
        </p>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-stone-50">
            {org.name}
          </h1>
          <PartnerStatusBadge status={org.status} />
        </div>
        <p className="mt-2 text-sm text-stone-500">
          Your role: <span className="font-medium text-stone-800 dark:text-stone-200">{membershipRole}</span>
        </p>
      </header>

      {org.status === "NEEDS_INFO" && (
        <div className="border border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40 p-4 text-sm">
          <p className="font-medium text-sky-900 dark:text-sky-200">More information is required</p>
          {org.verificationNotes && (
            <p className="mt-2 whitespace-pre-wrap text-stone-700 dark:text-stone-300">
              {org.verificationNotes}
            </p>
          )}
          <Link
            href="/partner/organization"
            className="mt-3 inline-block text-sky-800 dark:text-sky-300 underline font-medium"
          >
            Update organization details
          </Link>
        </div>
      )}

      {org.status === "VERIFIED" && (
        <div className="border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30 p-4 text-sm text-emerald-900 dark:text-emerald-200">
          Your organization has been verified by Gesi.
        </div>
      )}

      {org.status === "PENDING_REVIEW" && (
        <div className="border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4 text-sm text-amber-950 dark:text-amber-200">
          Application submitted. Status: {statusLabel(org.status)}. The Gesi team will review your
          organization.
        </div>
      )}

      {org.status === "SUSPENDED" && (
        <div className="border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 p-4 text-sm text-orange-900 dark:text-orange-200">
          This partner organization is suspended. Contact Gesi if you need help.
        </div>
      )}

      {org.status === "REJECTED" && (
        <div className="border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 p-4 text-sm text-red-900 dark:text-red-200">
          This application was not approved.
          {org.verificationNotes ? ` ${org.verificationNotes}` : ""}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="border border-stone-200 dark:border-stone-800 p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Summary</p>
          <p className="mt-2 text-sm text-stone-700 dark:text-stone-300 line-clamp-4">
            {org.description?.trim() || "No description yet."}
          </p>
          <p className="mt-3 text-xs text-stone-500">
            {org.country}
            {org.websiteUrl ? ` · ${org.websiteUrl}` : ""}
          </p>
        </div>
        <div className="border border-stone-200 dark:border-stone-800 p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Team</p>
          <p className="mt-2 text-2xl font-bold text-stone-900 dark:text-stone-50">
            {memberCount || "—"}
          </p>
          <p className="text-xs text-stone-500 mt-1">
            {memberCount === 1 ? "member" : "members"}
          </p>
          <Link
            href="/partner/team"
            className="mt-3 inline-block text-sm text-orange-800 dark:text-orange-400 underline"
          >
            Manage team
          </Link>
        </div>
      </section>

      <section className="border border-stone-200 dark:border-stone-800 p-5 space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
          Quick actions
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/partner/organization"
            className="inline-flex min-h-[44px] items-center border border-stone-300 dark:border-stone-700 px-4 text-xs font-mono uppercase tracking-widest text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900"
          >
            {isOwner ? "Edit organization" : "View organization"}
          </Link>
          <Link
            href="/partner/team"
            className="inline-flex min-h-[44px] items-center border border-stone-300 dark:border-stone-700 px-4 text-xs font-mono uppercase tracking-widest text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900"
          >
            Team
          </Link>
        </div>
      </section>

      <section className="border border-stone-200 dark:border-stone-800 p-5 space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
          Tour listings
        </p>
        {org.status === "VERIFIED" ? (
          <>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Create draft tours and submit them for Gesi review. Partners cannot publish listings.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/partner/tours"
                className="inline-flex min-h-[44px] items-center border border-stone-300 dark:border-stone-700 px-4 text-xs font-mono uppercase tracking-widest"
              >
                View tours
              </Link>
              <Link
                href="/partner/tours/new"
                className="inline-flex min-h-[44px] items-center bg-stone-900 px-4 text-xs font-mono uppercase tracking-widest text-white dark:bg-amber-600"
              >
                Create tour
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Tour management will become available once your organization is verified.
            </p>
            <button
              type="button"
              disabled
              className="mt-1 inline-flex min-h-[44px] items-center bg-stone-200 dark:bg-stone-800 px-4 text-xs font-mono uppercase tracking-widest text-stone-500 cursor-not-allowed"
            >
              Create tour (verification required)
            </button>
          </>
        )}
      </section>

      <section className="border border-stone-200 dark:border-stone-800 p-5 space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
          Claim curated listings
        </p>
        {org.status === "VERIFIED" ? (
          <>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              If a Gesi-curated tour represents your organization, you can submit a claim with
              evidence. Only Gesi Admin can approve claims — approval is never automatic.
            </p>
            <Link
              href="/partner/claims"
              className="inline-flex min-h-[44px] items-center border border-stone-300 dark:border-stone-700 px-4 text-xs font-mono uppercase tracking-widest"
            >
              View claims
            </Link>
          </>
        ) : (
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Listing claims become available after your organization is verified.
          </p>
        )}
      </section>

      <p className="text-xs text-stone-500 leading-relaxed">
        Partners cannot publish tours or approve their own claims. Booking and payments are not
        available yet.
      </p>
    </div>
  );
}

function ApplyForm({
  form,
  setForm,
  busy,
  onSubmit,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  busy: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 space-y-4 border border-stone-200 dark:border-stone-800 p-5 sm:p-6 bg-white dark:bg-stone-950"
    >
      <h2 className="text-lg font-bold text-stone-900 dark:text-stone-50">Partner application</h2>
      {(
        [
          ["name", "Organization display name", true],
          ["legalName", "Legal / trading name", true],
          ["country", "Country / operating region", true],
          ["contactEmail", "Primary contact email", true],
          ["contactPhone", "Primary contact phone", true],
          ["websiteUrl", "Website URL", false],
          ["businessRegistrationId", "Business registration ID", false],
          ["address", "Address", false],
          ["logoUrl", "Logo URL", false],
        ] as const
      ).map(([key, label, required]) => (
        <label key={key} className="block text-sm">
          <span className="text-stone-600 dark:text-stone-400">
            {label}
            {required ? " *" : ""}
          </span>
          <input
            required={required}
            type={
              key === "contactEmail" ? "email" : key === "websiteUrl" || key === "logoUrl" ? "url" : "text"
            }
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="mt-1 w-full border border-stone-300 dark:border-stone-700 bg-transparent px-3 py-2.5 text-stone-900 dark:text-stone-100"
          />
        </label>
      ))}
      <label className="block text-sm">
        <span className="text-stone-600 dark:text-stone-400">Short description *</span>
        <textarea
          required
          minLength={20}
          rows={5}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="mt-1 w-full border border-stone-300 dark:border-stone-700 bg-transparent px-3 py-2.5"
        />
      </label>
      <label className="flex items-start gap-3 text-sm text-stone-700 dark:text-stone-300">
        <input
          type="checkbox"
          checked={form.authorizedToRepresent}
          onChange={(e) => setForm((f) => ({ ...f, authorizedToRepresent: e.target.checked }))}
          className="mt-1"
        />
        <span>
          I confirm that I am authorized to represent this organization in applying to become a Gesi
          tourism partner.
        </span>
      </label>
      <p className="text-xs text-stone-500">
        Provide a website URL or a business registration identifier (at least one is required).
      </p>
      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-[48px] items-center justify-center bg-stone-900 px-6 text-sm font-semibold uppercase tracking-wider text-white disabled:opacity-50 dark:bg-amber-600"
      >
        {busy ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
