"use client";

import {
  createPartnerTour,
  updatePartnerTour,
  uploadPartnerImage,
  submitPartnerTour,
  withdrawPartnerTour,
  type PartnerTour,
  type PartnerTourBody,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type FormState = {
  slug: string;
  name: string;
  shortDescription: string;
  locationLabel: string;
  location: string;
  countryLabel: string;
  region: string;
  price: string;
  duration: string;
  heroImageUrl: string;
  operatorsLabel: string;
  overview: string;
  difficulty: string;
  groupSize: string;
  bestSeason: string;
  meetingPoint: string;
  highlights: string;
  mapLabel: string;
  included: string;
  excluded: string;
  itineraryText: string;
  faqText: string;
  experienceText: string;
  galleryUrls: string;
};

function tourToForm(t: PartnerTour): FormState {
  return {
    slug: t.slug ?? "",
    name: t.name ?? "",
    shortDescription: t.shortDescription ?? "",
    locationLabel: t.locationLabel ?? "",
    location: t.location ?? "",
    countryLabel: t.countryLabel ?? "",
    region: t.region ?? "",
    price: String(t.price ?? 0),
    duration: t.duration ?? "",
    heroImageUrl: t.heroImageUrl ?? "",
    operatorsLabel: t.operatorsLabel ?? "",
    overview: t.overview ?? "",
    difficulty: t.difficulty ?? "",
    groupSize: t.groupSize ?? "",
    bestSeason: t.bestSeason ?? "",
    meetingPoint: t.meetingPoint ?? "",
    highlights: (t.highlights ?? []).join("\n"),
    mapLabel: t.mapLabel ?? "",
    included: (t.included ?? []).join("\n"),
    excluded: (t.excluded ?? []).join("\n"),
    itineraryText: (t.itineraryDays ?? [])
      .map((d) => `${d.dayNumber}|${d.title}|${d.description}`)
      .join("\n"),
    faqText: (t.faqs ?? []).map((f) => `${f.question}|${f.answer}`).join("\n"),
    experienceText: (t.experienceItems ?? [])
      .map((e) => `${e.title}|${e.description}`)
      .join("\n"),
    galleryUrls: (t.images ?? [])
      .filter((i) => !i.isHero)
      .map((i) => i.url)
      .join("\n"),
  };
}

const emptyForm: FormState = {
  slug: "",
  name: "",
  shortDescription: "",
  locationLabel: "",
  location: "",
  countryLabel: "",
  region: "",
  price: "0",
  duration: "",
  heroImageUrl: "",
  operatorsLabel: "",
  overview: "",
  difficulty: "",
  groupSize: "",
  bestSeason: "",
  meetingPoint: "",
  highlights: "",
  mapLabel: "",
  included: "",
  excluded: "",
  itineraryText: "",
  faqText: "",
  experienceText: "",
  galleryUrls: "",
};

function lines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function formToBody(form: FormState): PartnerTourBody {
  const included = lines(form.included).map((text, i) => ({
    kind: "INCLUDED" as const,
    text,
    sortOrder: i,
  }));
  const excluded = lines(form.excluded).map((text, i) => ({
    kind: "EXCLUDED" as const,
    text,
    sortOrder: i,
  }));
  const itineraryDays = lines(form.itineraryText).map((line, i) => {
    const [dayNumber, title, ...rest] = line.split("|");
    return {
      dayNumber: parseInt(dayNumber, 10) || i + 1,
      title: (title ?? `Day ${i + 1}`).trim(),
      description: rest.join("|").trim() || title || "",
      sortOrder: i,
    };
  });
  const faqs = lines(form.faqText).map((line, i) => {
    const [question, ...rest] = line.split("|");
    return {
      question: (question ?? "").trim(),
      answer: rest.join("|").trim(),
      sortOrder: i,
    };
  });
  const experienceItems = lines(form.experienceText).map((line, i) => {
    const [title, ...rest] = line.split("|");
    return {
      title: (title ?? "").trim(),
      description: rest.join("|").trim(),
      sortOrder: i,
    };
  });
  const gallery = lines(form.galleryUrls).map((url, i) => ({
    url,
    sortOrder: i + 1,
    isHero: false,
  }));
  const images = [
    ...(form.heroImageUrl.trim()
      ? [{ url: form.heroImageUrl.trim(), sortOrder: 0, isHero: true }]
      : []),
    ...gallery,
  ];

  return {
    slug: form.slug.trim().toLowerCase(),
    name: form.name.trim(),
    shortDescription: form.shortDescription.trim(),
    locationLabel: form.locationLabel.trim(),
    location: form.location.trim(),
    countryLabel: form.countryLabel.trim(),
    region: form.region.trim(),
    price: parseInt(form.price, 10) || 0,
    duration: form.duration.trim(),
    heroImageUrl: form.heroImageUrl.trim(),
    operatorsLabel: form.operatorsLabel.trim() || undefined,
    overview: form.overview.trim(),
    difficulty: form.difficulty.trim() || undefined,
    groupSize: form.groupSize.trim() || undefined,
    bestSeason: form.bestSeason.trim() || undefined,
    meetingPoint: form.meetingPoint.trim() || undefined,
    highlights: lines(form.highlights),
    mapLabel: form.mapLabel.trim() || undefined,
    status: "DRAFT",
    images,
    itineraryDays,
    faqs,
    lineItems: [...included, ...excluded],
    experienceItems,
  };
}

export function PartnerTourEditor({
  tourId,
  initial,
}: {
  tourId?: string;
  initial?: PartnerTour | null;
}) {
  const router = useRouter();
  const isNew = !tourId;
  const [form, setForm] = useState<FormState>(() =>
    initial ? tourToForm(initial) : emptyForm
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const moderation = initial?.moderationStatus ?? "NONE";
  const locked =
    moderation === "SUBMITTED" ||
    moderation === "IN_REVIEW" ||
    moderation === "REJECTED";
  const canSubmit =
    !isNew &&
    !!tourId &&
    (moderation === "NONE" || moderation === "NEEDS_CHANGES") &&
    (initial?.status ?? "DRAFT") === "DRAFT";
  const canWithdraw = !isNew && !!tourId && moderation === "SUBMITTED";

  const preview = useMemo(() => formToBody(form), [form]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onUpload(file: File, target: "hero" | "gallery") {
    if (locked) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await uploadPartnerImage(file);
      if (target === "hero") set("heroImageUrl", url);
      else set("galleryUrls", form.galleryUrls ? `${form.galleryUrls}\n${url}` : url);
      setMessage("Image uploaded");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e?: FormEvent) {
    e?.preventDefault();
    if (locked) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const body = formToBody(form);
      if (isNew) {
        const created = await createPartnerTour(body);
        setMessage("Draft saved");
        router.replace(`/partner/tours/${created.id}`);
      } else if (tourId) {
        await updatePartnerTour(tourId, body);
        setMessage("Draft updated");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitForReview() {
    if (!tourId || !canSubmit) return;
    if (
      !confirm(
        "Submit this tour for Gesi review? You will not be able to edit it until review completes or you withdraw."
      )
    ) {
      return;
    }
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const body = formToBody(form);
      await updatePartnerTour(tourId, body);
      const updated = await submitPartnerTour(tourId);
      setMessage("Submitted for Gesi review. This does not publish the tour.");
      router.replace(`/partner/tours/${updated.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function onWithdraw() {
    if (!tourId || !canWithdraw) return;
    if (!confirm("Withdraw this submission so you can edit the draft again?")) return;
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await withdrawPartnerTour(tourId);
      setMessage("Submission withdrawn. You can edit the draft again.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdraw failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-stone-50">
            {isNew ? "Create tour" : "Edit tour"}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Drafts stay private until Gesi reviews and publishes them. Partners cannot publish.
          </p>
          {!isNew && (
            <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-stone-500">
              Lifecycle: {initial?.status ?? "DRAFT"} · Review: {moderation.replace(/_/g, " ")}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="min-h-[44px] border border-stone-300 dark:border-stone-700 px-4 text-xs font-mono uppercase tracking-widest"
          >
            {showPreview ? "Hide preview" : "Preview"}
          </button>
          {!locked && (
            <button
              type="button"
              disabled={saving}
              onClick={() => onSave()}
              className="min-h-[44px] bg-stone-900 px-4 text-xs font-mono uppercase tracking-widest text-white disabled:opacity-50 dark:bg-amber-600"
            >
              {saving ? "Saving…" : "Save draft"}
            </button>
          )}
          {canSubmit && (
            <button
              type="button"
              disabled={submitting || saving}
              onClick={() => void onSubmitForReview()}
              className="min-h-[44px] bg-orange-800 px-4 text-xs font-mono uppercase tracking-widest text-white disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit for review"}
            </button>
          )}
          {canWithdraw && (
            <button
              type="button"
              disabled={submitting}
              onClick={() => void onWithdraw()}
              className="min-h-[44px] border border-stone-400 px-4 text-xs font-mono uppercase tracking-widest disabled:opacity-50"
            >
              Withdraw submission
            </button>
          )}
        </div>
      </div>

      {moderation === "SUBMITTED" && (
        <div className="border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4 text-sm text-amber-950 dark:text-amber-200">
          This tour is submitted for Gesi review
          {initial?.submittedAt
            ? ` (submitted ${new Date(initial.submittedAt).toLocaleString()})`
            : ""}
          . Editing is locked. You can withdraw to continue editing.
        </div>
      )}
      {moderation === "NEEDS_CHANGES" && (
        <div className="border border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/30 p-4 text-sm">
          <p className="font-medium text-sky-900 dark:text-sky-200">Gesi requested changes</p>
          {initial?.reviewNotes && (
            <p className="mt-2 whitespace-pre-wrap text-stone-700 dark:text-stone-300">
              {initial.reviewNotes}
            </p>
          )}
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            Update the tour, then submit for review again.
          </p>
        </div>
      )}
      {moderation === "REJECTED" && (
        <div className="border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 p-4 text-sm text-red-900 dark:text-red-200">
          This tour was rejected.
          {initial?.reviewNotes ? ` ${initial.reviewNotes}` : ""}
        </div>
      )}

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}
      {message && (
        <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {showPreview && (
        <section className="border border-stone-200 dark:border-stone-800 p-5 space-y-2 bg-stone-50 dark:bg-stone-950">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Preview</p>
          <h2 className="text-xl font-bold">{preview.name || "Untitled tour"}</h2>
          <p className="text-sm text-stone-600">{preview.shortDescription}</p>
          <p className="text-xs text-stone-500">
            {preview.locationLabel} · {preview.duration} ·{" "}
            {preview.price ? `From $${preview.price}` : "Price TBD"}
          </p>
          {preview.heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.heroImageUrl} alt="" className="mt-3 max-h-48 w-full object-cover" />
          )}
          <p className="text-sm whitespace-pre-wrap text-stone-700 dark:text-stone-300">
            {preview.overview}
          </p>
        </section>
      )}

      <form onSubmit={onSave} className="space-y-8" aria-disabled={locked}>
        <fieldset disabled={locked} className="space-y-8 disabled:opacity-70">
        <Section title="Basic information">
          <Field label="Name *" value={form.name} onChange={(v) => set("name", v)} required />
          <Field
            label="Slug *"
            value={form.slug}
            onChange={(v) => set("slug", v.toLowerCase().replace(/\s+/g, "-"))}
            required
            hint="URL identifier, e.g. sahara-heritage-trek"
          />
          <TextArea
            label="Short description *"
            value={form.shortDescription}
            onChange={(v) => set("shortDescription", v)}
            required
          />
          <TextArea label="Overview *" value={form.overview} onChange={(v) => set("overview", v)} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price (USD) *" value={form.price} onChange={(v) => set("price", v)} required />
            <Field label="Duration *" value={form.duration} onChange={(v) => set("duration", v)} required />
            <Field label="Difficulty" value={form.difficulty} onChange={(v) => set("difficulty", v)} />
            <Field label="Group size" value={form.groupSize} onChange={(v) => set("groupSize", v)} />
            <Field label="Best season" value={form.bestSeason} onChange={(v) => set("bestSeason", v)} />
            <Field label="Meeting point" value={form.meetingPoint} onChange={(v) => set("meetingPoint", v)} />
            <Field
              label="Operators label"
              value={form.operatorsLabel}
              onChange={(v) => set("operatorsLabel", v)}
            />
          </div>
        </Section>

        <Section title="Location">
          <Field
            label="Location label *"
            value={form.locationLabel}
            onChange={(v) => set("locationLabel", v)}
            required
          />
          <Field label="Location *" value={form.location} onChange={(v) => set("location", v)} required />
          <Field
            label="Country label *"
            value={form.countryLabel}
            onChange={(v) => set("countryLabel", v)}
            required
          />
          <Field label="Region *" value={form.region} onChange={(v) => set("region", v)} required />
          <Field label="Map label" value={form.mapLabel} onChange={(v) => set("mapLabel", v)} />
        </Section>

        <Section title="Images">
          <Field
            label="Hero image URL *"
            value={form.heroImageUrl}
            onChange={(v) => set("heroImageUrl", v)}
            required
          />
          <label className="block text-sm">
            <span className="text-stone-600 dark:text-stone-400">Upload hero</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="mt-1 block w-full text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onUpload(f, "hero");
              }}
            />
          </label>
          <TextArea
            label="Gallery image URLs (one per line)"
            value={form.galleryUrls}
            onChange={(v) => set("galleryUrls", v)}
          />
          <label className="block text-sm">
            <span className="text-stone-600 dark:text-stone-400">Upload gallery image</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="mt-1 block w-full text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onUpload(f, "gallery");
              }}
            />
          </label>
        </Section>

        <Section title="Highlights / experience">
          <TextArea
            label="Highlights (one per line)"
            value={form.highlights}
            onChange={(v) => set("highlights", v)}
          />
          <TextArea
            label="Experience items (title|description per line)"
            value={form.experienceText}
            onChange={(v) => set("experienceText", v)}
          />
        </Section>

        <Section title="Itinerary">
          <TextArea
            label="Days (dayNumber|title|description per line)"
            value={form.itineraryText}
            onChange={(v) => set("itineraryText", v)}
          />
        </Section>

        <Section title="FAQs">
          <TextArea
            label="FAQs (question|answer per line)"
            value={form.faqText}
            onChange={(v) => set("faqText", v)}
          />
        </Section>

        <Section title="What's included / excluded">
          <TextArea label="Included (one per line)" value={form.included} onChange={(v) => set("included", v)} />
          <TextArea label="Excluded (one per line)" value={form.excluded} onChange={(v) => set("excluded", v)} />
        </Section>

        <p className="text-xs text-stone-500">
          Heritage relationships and historical narrative are managed by Gesi and cannot be edited
          here.
        </p>

        {!locked && (
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-[48px] items-center justify-center bg-stone-900 px-6 text-sm font-semibold uppercase tracking-wider text-white disabled:opacity-50 dark:bg-amber-600"
          >
            {saving ? "Saving…" : "Save draft"}
          </button>
        )}
        </fieldset>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-4">
      <h2 className="font-mono text-[10px] uppercase tracking-widest text-stone-500">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-stone-600 dark:text-stone-400">{label}</span>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-stone-300 dark:border-stone-700 bg-transparent px-3 py-2.5"
      />
      {hint && <span className="mt-1 block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="text-stone-600 dark:text-stone-400">{label}</span>
      <textarea
        required={required}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-stone-300 dark:border-stone-700 bg-transparent px-3 py-2.5"
      />
    </label>
  );
}
