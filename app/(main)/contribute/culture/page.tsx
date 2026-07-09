"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudinaryImageUpload, type ImageValue } from "@/components/upload/CloudinaryImageUpload";
import { createCulture, useCountries, useTimelines } from "@/lib/api";
import type { CreateCultureInput } from "@/lib/api/client";
import type { Timeline } from "@/lib/api/types";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/constants";
import { uploadImage } from "@/lib/upload";
import { motion } from "framer-motion";
import { Flag, PenLine } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContributeCulturePage() {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [timelineId, setTimelineId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [useCountryFlag, setUseCountryFlag] = useState(true);
  const [image, setImage] = useState<ImageValue>("");
  const [capital, setCapital] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ role?: string; status?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: countriesData } = useCountries();
  const { data: timelinesData } = useTimelines();
  const countriesRaw = (countriesData?.items ?? []) as { id: string; name: string }[];
  const timelines = (timelinesData?.items ?? []) as Timeline[];
  const internalCountries = countriesRaw.filter((c) => !c.id.startsWith("ext-"));

  const canSubmit = user?.role === "ADMIN" || (user?.role === "CONTRIBUTOR" && user?.status === "APPROVED");

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !region.trim() || !timelineId.trim()) return;

    setSubmitting(true);
    try {
      const imageUrl =
        typeof image === "string" ? image?.trim() : image instanceof File ? (await uploadImage(image)).url : undefined;
      const payload: CreateCultureInput = {
        name: name.trim(),
        region: region.trim(),
        timelineId: timelineId.trim(),
        capital: capital.trim() || undefined,
        language: language.trim() || undefined,
        description: description.trim() || undefined,
        countryId: countryId.trim() || undefined,
        image: useCountryFlag && countryId.trim() ? undefined : imageUrl,
      };
      await createCulture(payload);
      setSuccess(true);
      setName("");
      setRegion("");
      setTimelineId("");
      setCountryId("");
      setCapital("");
      setLanguage("");
      setDescription("");
      setImage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create culture.");
    } finally {
      setSubmitting(false);
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
        <p className="text-stone-500 mb-8 max-w-md text-center">Only approved contributors can add cultures. Create an account and request contributor access.</p>
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
        <p className="text-stone-500 mb-8 max-w-md text-center">Your account is pending approval. Once approved, you can add cultures here.</p>
        <Link href="/cultures">
          <Button variant="outline" className="rounded-none font-black uppercase tracking-widest">Browse cultures</Button>
        </Link>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] flex flex-col items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center space-y-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
            <Flag size={32} className="text-green-700 dark:text-green-400" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">Culture added</h1>
            <p className="text-stone-500 font-serif text-lg">It will appear on the Cultures page. You can add another or go back to Gesi.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cultures">
              <Button className="w-full sm:w-auto rounded-none font-black uppercase tracking-widest h-12 px-6">View cultures</Button>
            </Link>
            <Button type="button" variant="outline" className="w-full sm:w-auto rounded-none font-black uppercase tracking-widest h-12 px-6" onClick={() => setSuccess(false)}>
              Add another culture
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] py-24">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Flag size={14} className="text-orange-700" />
            <span className="text-orange-700 font-mono text-[10px] uppercase tracking-[0.3em]">Contributor</span>
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white leading-tight">
            Add a <span className="text-orange-800">Culture</span>
          </h1>
          <p className="text-stone-500 mt-4 font-serif italic">
            Add a culture with a name, region, and timeline. You can link it to a country and use the country flag as the image, or upload your own image.
          </p>
        </motion.div>

        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6" onSubmit={handleSubmit} noValidate>
          {error && (
            <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3 py-2">{error}</p>
          )}

          <div className="border border-stone-200 dark:border-stone-800 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <PenLine size={14} className="text-orange-700" />
              <span className="text-orange-700 font-mono text-[10px] uppercase tracking-[0.3em]">Identity</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Culture name *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ashanti" className="rounded-none border-stone-200 dark:border-stone-800" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Region *</label>
              <Input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. West Africa" className="rounded-none border-stone-200 dark:border-stone-800" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Timeline *</label>
              <select
                value={timelineId}
                onChange={(e) => setTimelineId(e.target.value)}
                className="w-full bg-transparent border border-stone-200 dark:border-stone-800 py-3 px-4 font-mono text-sm focus:border-orange-800 outline-none rounded-none"
                required
              >
                <option value="">Choose a timeline</option>
                {timelines.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.startYear != null && t.startYear < 0 ? `${Math.abs(t.startYear)} BCE` : `${t.startYear ?? "?"} CE`}
                    {t.endYear != null ? ` – ${t.endYear < 0 ? `${Math.abs(t.endYear)} BCE` : `${t.endYear} CE`}` : ""})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-stone-200 dark:border-stone-800 p-6 space-y-4">
            <span className="text-orange-700 font-mono text-[10px] uppercase tracking-[0.3em]">Country & image</span>
            <p className="text-stone-500 text-xs">Link this culture to a country (optional). If you don’t upload an image, we’ll use the country flag when a country is selected.</p>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Country (optional)</label>
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className="w-full bg-transparent border border-stone-200 dark:border-stone-800 py-3 px-4 font-mono text-sm focus:border-orange-800 outline-none rounded-none"
              >
                <option value="">None</option>
                {internalCountries.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            {countryId && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={useCountryFlag} onChange={(e) => setUseCountryFlag(e.target.checked)} className="rounded border-stone-300" />
                <span className="text-sm text-stone-600 dark:text-stone-400">Use country flag as culture image (when no image uploaded)</span>
              </label>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Image (optional)</label>
              <CloudinaryImageUpload value={image} onChange={setImage} />
              <p className="text-[10px] text-stone-500">Leave empty to use the country flag when a country is selected.</p>
            </div>
          </div>

          <div className="border border-stone-200 dark:border-stone-800 p-6 space-y-4">
            <span className="text-orange-700 font-mono text-[10px] uppercase tracking-[0.3em]">Details (optional)</span>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Capital</label>
              <Input value={capital} onChange={(e) => setCapital(e.target.value)} placeholder="e.g. Kumasi" className="rounded-none border-stone-200 dark:border-stone-800" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Language(s)</label>
              <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="e.g. Twi" className="rounded-none border-stone-200 dark:border-stone-800" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of the culture"
                rows={3}
                className="w-full bg-transparent border border-stone-200 dark:border-stone-800 py-3 px-4 font-mono text-sm focus:border-orange-800 outline-none rounded-none resize-y"
              />
            </div>
          </div>

          <Button type="submit" disabled={submitting || !name.trim() || !region.trim() || !timelineId.trim()} className="w-full rounded-none font-black uppercase tracking-widest h-12">
            {submitting ? "Adding…" : "Add culture"}
          </Button>
        </motion.form>

        <p className="mt-8 text-center">
          <Link href="/contribute" className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 text-sm font-mono">
            ← Back to submit a story
          </Link>
        </p>
      </div>
    </main>
  );
}
