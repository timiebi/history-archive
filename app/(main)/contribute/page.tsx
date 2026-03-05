"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudinaryImageUpload, type ImageValue } from "@/components/upload/CloudinaryImageUpload";
import { uploadImage } from "@/lib/upload";
import { STORY_CATEGORIES } from "@/lib/constants";
import { useCountries, useCreateStory, useTimelines } from "@/lib/api";
import type { StorySectionInput } from "@/lib/api/client";
import type { Timeline } from "@/lib/api/types";
import { motion } from "framer-motion";
import { Clock, PenLine, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const AUTH_USER_KEY = "archive_user";
const AUTH_TOKEN_KEY = "archive_token";

type FormSection = { text: string; image: ImageValue };
const defaultSection = (): FormSection => ({ text: "", image: "" });

type TimelineMode = "none" | "existing" | "new";

export default function ContributePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [image, setImage] = useState<ImageValue>("");
  const [sections, setSections] = useState<FormSection[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ role?: string; status?: string } | null>(null);

  const [timelineMode, setTimelineMode] = useState<TimelineMode>("none");
  const [timelineId, setTimelineId] = useState("");
  const [timelineName, setTimelineName] = useState("");
  const [timelineDescription, setTimelineDescription] = useState("");
  const [timelineStartYear, setTimelineStartYear] = useState<string>("");
  const [timelineEndYear, setTimelineEndYear] = useState<string>("");

  const { data: countriesData } = useCountries();
  const { data: timelinesData } = useTimelines();
  const countries = (countriesData?.items ?? []) as { id: string; name: string }[];
  const timelines = (timelinesData?.items ?? []) as Timeline[];

  const createStory = useCreateStory({
    onSuccess: () => {
      setSubmitAttempted(false);
      setUploadError(null);
      setTitle("");
      setContent("");
      setCategoryName("");
      setCountryId("");
      setImage("");
      setSections([]);
      setSourceUrl("");
      setTimelineMode("none");
      setTimelineId("");
      setTimelineName("");
      setTimelineDescription("");
      setTimelineStartYear("");
      setTimelineEndYear("");
      setShowSuccessScreen(true);
    },
  });

  const addSection = () => setSections((prev) => [...prev, defaultSection()]);
  const removeSection = (i: number) => setSections((prev) => prev.filter((_, idx) => idx !== i));
  const updateSection = (i: number, field: "text" | "image", value: string | ImageValue) => {
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  };
  const useSectionsForSubmit = sections.some((s) => s.text.trim().length > 0);
  const hasCoverImage = typeof image === "string" ? Boolean(image?.trim()) : image instanceof File;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const t = localStorage.getItem(AUTH_TOKEN_KEY);
      const u = localStorage.getItem(AUTH_USER_KEY);
      if (t && u) {
        try {
          setUser(JSON.parse(u));
        } catch {
          setUser(null);
        }
      } else setUser(null);
    }
  }, []);

  const canSubmit = user?.role === "ADMIN" || (user?.role === "CONTRIBUTOR" && user?.status === "APPROVED");

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSubmitAttempted(true);
    setUploadError(null);
    const bodyContent = useSectionsForSubmit ? sections.map((s) => s.text).join("\n\n") : content;
    if (!categoryName.trim() || !title.trim() || !bodyContent.trim() || !hasCoverImage) return;
    if (title.trim().length > 300) return;
    const startYearNum = timelineStartYear.trim() ? parseInt(timelineStartYear.trim(), 10) : undefined;
    const endYearNum = timelineEndYear.trim() ? parseInt(timelineEndYear.trim(), 10) : undefined;

    setUploadingImages(true);
    try {
      const coverUrl =
        image instanceof File
          ? (await uploadImage(image)).url
          : (image as string).trim();

      const sectionsToInclude = sections.filter((s) => s.text.trim());
      const sectionImageUrls = await Promise.all(
        sectionsToInclude.map((s) =>
          s.image instanceof File
            ? uploadImage(s.image).then((r) => r.url)
            : Promise.resolve(typeof s.image === "string" && s.image.trim() ? s.image.trim() : undefined)
        )
      );
      const sectionsPayload: StorySectionInput[] = sectionsToInclude.map((s, i) => ({
        text: s.text.trim(),
        image: sectionImageUrls[i],
      }));

      const selectedCountry = countries.find((c) => c.id === countryId?.trim());
      createStory.mutate({
        title: title.trim(),
        content: bodyContent.trim(),
        categoryName: categoryName.trim(),
        ...(countryId?.trim()
          ? {
              countryId: countryId.trim(),
              ...(countryId.startsWith("ext-") && selectedCountry?.name ? { countryName: selectedCountry.name } : {}),
            }
          : {}),
        image: coverUrl,
        sections: sectionsPayload.length > 0 ? sectionsPayload : undefined,
        sourceUrl: sourceUrl || undefined,
        ...(timelineMode === "existing" && timelineId ? { timelineId } : undefined),
        ...(timelineMode === "new" && timelineName.trim() && startYearNum != null && !Number.isNaN(startYearNum)
          ? {
              timelineName: timelineName.trim(),
              timelineDescription: timelineDescription.trim() || undefined,
              timelineStartYear: startYearNum,
              timelineEndYear: endYearNum != null && !Number.isNaN(endYearNum) ? endYearNum : undefined,
            }
          : undefined),
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploadingImages(false);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex items-center justify-center">
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest">Loading…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white mb-4">Sign in to contribute</h1>
        <p className="text-stone-500 mb-8 max-w-md text-center">Only approved contributors can submit stories. Create an account and request contributor access.</p>
        <Link href="/auth/signup">
          <Button className="rounded-none font-black uppercase tracking-widest">Create account</Button>
        </Link>
      </main>
    );
  }

  if (!canSubmit) {
    return (
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white mb-4">Contributor access required</h1>
        <p className="text-stone-500 mb-8 max-w-md text-center">Your account is pending approval. Once approved, you can submit stories here.</p>
        <Link href="/stories">
          <Button variant="outline" className="rounded-none font-black uppercase tracking-widest">Browse stories</Button>
        </Link>
      </main>
    );
  }

  if (showSuccessScreen) {
    return (
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
            <PenLine size={32} className="text-green-700 dark:text-green-400" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">
              Thank you — your story is in
            </h1>
            <p className="text-stone-500 font-serif text-lg">
              It will be reviewed and can appear in the archive once approved. You can check its status from your dashboard.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto rounded-none font-black uppercase tracking-widest h-12 px-6">
                Go to my dashboard
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto rounded-none font-black uppercase tracking-widest h-12 px-6"
              onClick={() => setShowSuccessScreen(false)}
            >
              Add another story
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] py-24">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <PenLine size={14} className="text-orange-700" />
            <span className="text-orange-700 font-mono text-[10px] uppercase tracking-[0.3em]">Contributor</span>
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white leading-tight">
            Submit a <span className="text-orange-800">Story</span>
          </h1>
          <p className="text-stone-500 mt-4 font-serif italic">Add a verified record to the archive. A cover image is required; you can add optional sections (text + image per section) so your story displays like featured articles—text then image in flow.</p>
        </motion.div>

        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-6" method="post" onSubmit={(e) => { e.preventDefault(); void onSubmit(e); }} noValidate>
          {createStory.isError && (
            <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3 py-2">
              {createStory.error?.message}
            </p>
          )}

          {/* ——— Timeline & place (optional) ——— */}
          <div className="border border-stone-200 dark:border-stone-800 p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-orange-700" />
              <span className="text-orange-700 font-mono text-[10px] uppercase tracking-[0.3em]">Time & place</span>
            </div>
            <p className="text-stone-500 text-xs">Link this story to a period and place. Optional—you can leave this blank or attach to an existing timeline.</p>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Where does this story take place? (optional)</label>
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className="w-full bg-transparent border border-stone-200 dark:border-stone-800 py-3 px-4 font-mono text-sm focus:border-orange-800 outline-none"
              >
                <option value="">Select country / region</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Timeline</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="timelineMode" checked={timelineMode === "none"} onChange={() => setTimelineMode("none")} className="rounded border-stone-300" />
                  <span className="font-mono text-xs">No timeline</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="timelineMode" checked={timelineMode === "existing"} onChange={() => setTimelineMode("existing")} className="rounded border-stone-300" />
                  <span className="font-mono text-xs">Attach to existing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="timelineMode" checked={timelineMode === "new"} onChange={() => setTimelineMode("new")} className="rounded border-stone-300" />
                  <span className="font-mono text-xs">Create new timeline</span>
                </label>
              </div>

              {timelineMode === "existing" && (
                <select
                  value={timelineId}
                  onChange={(e) => setTimelineId(e.target.value)}
                  className="w-full bg-transparent border border-stone-200 dark:border-stone-800 py-3 px-4 font-mono text-sm focus:border-orange-800 outline-none mt-2"
                >
                  <option value="">Choose a timeline</option>
                  {timelines.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.startYear < 0 ? `${Math.abs(t.startYear)} BCE` : `${t.startYear} CE`}
                      {t.endYear != null ? ` – ${t.endYear < 0 ? `${Math.abs(t.endYear)} BCE` : `${t.endYear} CE`}` : ""})
                    </option>
                  ))}
                </select>
              )}

              {timelineMode === "new" && (
                <div className="space-y-4 mt-4 p-4 border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/20">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Timeline name *</label>
                    <Input
                      value={timelineName}
                      onChange={(e) => setTimelineName(e.target.value)}
                      placeholder="e.g. Great Zimbabwe Peak Era"
                      className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-10 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Short description (optional)</label>
                    <Input
                      value={timelineDescription}
                      onChange={(e) => setTimelineDescription(e.target.value)}
                      placeholder="Brief context for this period"
                      className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-10 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Start year * (negative = BCE)</label>
                      <Input
                        type="number"
                        value={timelineStartYear}
                        onChange={(e) => setTimelineStartYear(e.target.value)}
                        placeholder="-500 or 1324"
                        className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-10 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">End year (optional)</label>
                      <Input
                        type="number"
                        value={timelineEndYear}
                        onChange={(e) => setTimelineEndYear(e.target.value)}
                        placeholder="-200 or 1400"
                        className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-10 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Category *</label>
            <select
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              className="w-full bg-transparent border border-stone-200 dark:border-stone-800 py-3 px-4 font-mono text-sm focus:border-orange-800 outline-none"
              aria-invalid={submitAttempted && !categoryName.trim() ? "true" : undefined}
            >
              <option value="">Select category</option>
              {STORY_CATEGORIES.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {submitAttempted && !categoryName.trim() && (
              <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400" role="alert">Category is required.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Golden Age of the Mali Empire"
              className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 font-mono"
              required
              maxLength={300}
              aria-invalid={submitAttempted && !title.trim() ? "true" : undefined}
            />
            {submitAttempted && !title.trim() && (
              <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400" role="alert">Title is required.</p>
            )}
            {title.length > 280 && (
              <p className="text-[10px] font-mono text-stone-500">{title.length}/300</p>
            )}
          </div>

          <div className="space-y-1.5">
            <CloudinaryImageUpload
              value={image}
              onChange={setImage}
              label="Cover image *"
              placeholder="Drop cover photo or click to upload"
              hint="Required. Add a main image by uploading a photo or pasting an image link."
              required
            />
            {submitAttempted && !hasCoverImage && (
              <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400" role="alert">
                Cover image is required.
              </p>
            )}
            {uploadError && (
              <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400" role="alert">
                {uploadError}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Content * (or use sections below)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Single block of text, or leave empty and add sections below for multiple parts with images"
              rows={6}
              className="w-full bg-transparent border border-stone-200 dark:border-stone-800 py-3 px-4 font-mono text-sm focus:border-orange-800 outline-none resize-y"
              required={!useSectionsForSubmit}
              aria-invalid={submitAttempted && !content.trim() && !useSectionsForSubmit ? "true" : undefined}
            />
            {submitAttempted && !content.trim() && !useSectionsForSubmit && (
              <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400" role="alert">Content or at least one section with text is required.</p>
            )}
            {submitAttempted && sections.length > 0 && sections.filter((s) => s.text.trim()).length === 0 && (
              <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400" role="alert">Add at least one section with text.</p>
            )}
          </div>

          <div className="border-t border-stone-200 dark:border-stone-800 pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Sections (optional)</label>
              <Button type="button" variant="outline" size="sm" onClick={addSection} className="rounded-none text-[10px] gap-1">
                <Plus size={12} /> Add section
              </Button>
            </div>
            <p className="text-stone-500 text-xs">Add as many sections as you need. Each can have text and an optional image. They’ll appear as text first, then image—like a short article.</p>
            {sections.map((sec, i) => (
              <div key={i} className="p-4 border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-stone-500">Section {i + 1}</span>
                  <button type="button" onClick={() => removeSection(i)} className="text-stone-400 hover:text-red-600 p-1 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center" aria-label={`Remove section ${i + 1}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <textarea
                  value={sec.text}
                  onChange={(e) => updateSection(i, "text", e.target.value)}
                  placeholder="Section text…"
                  rows={4}
                  className="w-full bg-transparent border border-stone-200 dark:border-stone-800 py-2 px-3 font-mono text-sm focus:border-orange-800 outline-none resize-y"
                />
                <CloudinaryImageUpload
                  value={sec.image ?? ""}
                  onChange={(v) => updateSection(i, "image", v)}
                  label="Section image (optional)"
                  placeholder="Drop image or click"
                  compact
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Source URL (optional)</label>
            <Input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://…"
              className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 font-mono"
            />
          </div>

          <Button
            type="submit"
            disabled={
              uploadingImages ||
              createStory.isPending ||
              !categoryName.trim() ||
              !title.trim() ||
              title.trim().length > 300 ||
              !hasCoverImage ||
              (!content.trim() && !useSectionsForSubmit) ||
              (useSectionsForSubmit && sections.filter((s) => s.text.trim()).length === 0) ||
              (timelineMode === "new" && (!timelineName.trim() || !timelineStartYear.trim() || Number.isNaN(parseInt(timelineStartYear.trim(), 10))))
            }
            className="w-full h-14 cursor-pointer rounded-none font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-800 dark:hover:bg-orange-600 disabled:cursor-not-allowed"
          >
            {uploadingImages ? "Uploading images…" : createStory.isPending ? "Submitting…" : "Submit to archive"}
          </Button>
        </motion.form>
      </div>
    </main>
  );
}
