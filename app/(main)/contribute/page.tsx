"use client";

import { useCreateStory, useCategories } from "@/lib/api";
import type { StorySectionInput } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { PenLine, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const AUTH_USER_KEY = "archive_user";
const AUTH_TOKEN_KEY = "archive_token";

const defaultSection = (): StorySectionInput => ({ text: "", image: "" });

export default function ContributePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [sections, setSections] = useState<StorySectionInput[]>([]);
  const [sourceUrl, setSourceUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ role?: string; status?: string } | null>(null);

  const { data: catData } = useCategories();
  const categories = (catData?.items ?? []) as { id: string; name: string }[];
  const createStory = useCreateStory({
    onSuccess: () => {
      setTitle("");
      setContent("");
      setCategoryId("");
      setImage("");
      setSections([]);
      setSourceUrl("");
    },
  });

  const addSection = () => setSections((prev) => [...prev, defaultSection()]);
  const removeSection = (i: number) => setSections((prev) => prev.filter((_, idx) => idx !== i));
  const updateSection = (i: number, field: "text" | "image", value: string) => {
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  };
  const useSectionsForSubmit = sections.some((s) => s.text.trim().length > 0);
  const sectionsPayload = useSectionsForSubmit ? sections.filter((s) => s.text.trim()).map((s) => ({ text: s.text.trim(), image: s.image?.trim() || undefined })) : undefined;

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bodyContent = useSectionsForSubmit ? sections.map((s) => s.text).join("\n\n") : content;
    if (!categoryId || !title.trim() || !bodyContent.trim()) return;
    createStory.mutate({
      title: title.trim(),
      content: bodyContent.trim(),
      categoryId,
      image: image || undefined,
      sections: sectionsPayload,
      sourceUrl: sourceUrl || undefined,
    });
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
          <p className="text-stone-500 mt-4 font-serif italic">Add a verified record to the archive. Use a cover image and optional sections (text + image per section) so your story displays like featured articles—text then image in flow.</p>
        </motion.div>

        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-6" onSubmit={onSubmit}>
          {createStory.isError && (
            <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3 py-2">
              {createStory.error?.message}
            </p>
          )}
          {createStory.isSuccess && (
            <p className="text-[10px] font-mono uppercase text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-2">
              Story submitted. It will appear in the feed once published.
            </p>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full bg-transparent border border-stone-200 dark:border-stone-800 py-3 px-4 font-mono text-sm focus:border-orange-800 outline-none"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Golden Age of the Mali Empire"
              className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Cover image URL (optional)</label>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://… — main image for the story"
              className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-12 font-mono"
            />
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
            />
          </div>

          <div className="border-t border-stone-200 dark:border-stone-800 pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Sections (optional)</label>
              <Button type="button" variant="outline" size="sm" onClick={addSection} className="rounded-none text-[10px] gap-1">
                <Plus size={12} /> Add section
              </Button>
            </div>
            <p className="text-stone-500 text-xs">Each section = one block of text + optional image. Stories are shown with <strong>text first, then image</strong> per section (like Wikipedia). Add as many sections as you need.</p>
            {sections.map((sec, i) => (
              <div key={i} className="p-4 border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-stone-500">Section {i + 1}</span>
                  <button type="button" onClick={() => removeSection(i)} className="text-stone-400 hover:text-red-600 p-1">
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
                <Input
                  value={sec.image ?? ""}
                  onChange={(e) => updateSection(i, "image", e.target.value)}
                  placeholder="Image URL for this section (optional)"
                  className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent h-10 font-mono text-xs"
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
            disabled={createStory.isPending || !categoryId || !title.trim() || (!content.trim() && !useSectionsForSubmit) || (useSectionsForSubmit && (!sectionsPayload || sectionsPayload.length === 0))}
            className="w-full h-14 rounded-none font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-800 dark:hover:bg-orange-600"
          >
            {createStory.isPending ? "Submitting…" : "Submit to archive"}
          </Button>
        </motion.form>
      </div>
    </main>
  );
}
