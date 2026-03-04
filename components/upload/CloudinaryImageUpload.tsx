"use client";

import {
  validateImageFile,
  IMAGE_ACCEPT,
  IMAGE_MAX_SIZE_MB,
} from "@/lib/upload";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X, Link2 } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

/** Value is either a URL string (pasted) or a File (selected, not yet uploaded). */
export type ImageValue = string | File;

export interface CloudinaryImageUploadProps {
  value: ImageValue;
  onChange: (value: ImageValue) => void;
  label?: string;
  placeholder?: string;
  compact?: boolean;
  hint?: string;
  required?: boolean;
}

function isFile(v: ImageValue): v is File {
  return v instanceof File;
}

export function CloudinaryImageUpload({
  value,
  onChange,
  label = "Image",
  placeholder = "Drag a photo here or click to upload",
  compact = false,
  hint,
  required,
}: CloudinaryImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Preview URL: object URL for File, or the string value for pasted URL
  const previewUrl = isFile(value) ? objectUrl : (typeof value === "string" && value?.trim() ? value : null);

  // Create/revoke object URL when value is a File
  useEffect(() => {
    if (!isFile(value)) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    objectUrlRef.current = url;
    setObjectUrl(url);
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setObjectUrl(null);
    };
  }, [value]);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validated = validateImageFile(file);
      if (!validated.ok) {
        setError(validated.message);
        return;
      }
      onChange(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const file = e.clipboardData?.files?.[0];
      if (file?.type.startsWith("image/")) {
        e.preventDefault();
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const applyUrl = useCallback(() => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onChange(trimmed);
      setUrlInput("");
      setShowUrlInput(false);
    }
  }, [urlInput, onChange]);

  const removeImage = useCallback(() => {
    onChange("");
    setError(null);
  }, [onChange]);

  const hasImage = isFile(value) || Boolean(typeof value === "string" && value?.trim());

  return (
    <div className="space-y-2">
      <input
        id={fileInputId}
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        onChange={handleChange}
        className="sr-only"
        aria-label="Choose image file"
      />
      {label && (
        <label className="block text-[10px] font-black uppercase tracking-widest text-stone-400">
          {label}
          {required && <span className="text-red-600 dark:text-red-400" aria-hidden> *</span>}
        </label>
      )}

      <AnimatePresence mode="wait">
        {hasImage && previewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative group rounded-none overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50"
          >
            <div className={compact ? "aspect-video" : "aspect-2/1 sm:aspect-3/1"}>
              <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            </div>
            {isFile(value) && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white font-mono text-[10px] uppercase">
                Will upload on submit
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 rounded-none bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-white font-mono text-[10px] uppercase tracking-widest hover:bg-orange-100 dark:hover:bg-orange-950 cursor-pointer"
                aria-label="Choose a different image"
              >
                <ImagePlus size={14} /> Choose image
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 rounded-none bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-white font-mono text-[10px] uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-950 cursor-pointer"
                aria-label="Remove image"
              >
                <X size={14} /> Remove
              </button>
            </div>
          </motion.div>
        ) : (
          <label htmlFor={fileInputId} className="block cursor-pointer">
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onPaste={handlePaste}
              className={`
                relative border-2 border-dashed rounded-none transition-colors cursor-pointer
                ${isDragging ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20" : "border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600"}
                ${compact ? "py-6" : "py-10 sm:py-12"}
              `}
            >
              <div className="flex flex-col items-center justify-center gap-2 text-center px-4">
                <ImagePlus size={compact ? 24 : 32} className="text-stone-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
                  {placeholder}
                </span>
                <span className="text-[10px] text-stone-400">
                  JPEG, PNG, WebP or GIF · max {IMAGE_MAX_SIZE_MB} MB · or paste from clipboard. Uploads when you submit.
                </span>
              </div>
            </motion.div>
          </label>
        )}
      </AnimatePresence>

      {error && (
        <p className="font-mono text-[10px] uppercase text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowUrlInput((s) => !s)}
          className="font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-orange-700 dark:hover:text-orange-400 flex items-center gap-1 cursor-pointer"
        >
          <Link2 size={12} /> {showUrlInput ? "Hide URL" : "Or paste image URL"}
        </button>
        {showUrlInput && (
          <div className="flex flex-1 min-w-0 gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyUrl())}
              placeholder="https://…"
              className="flex-1 min-w-0 bg-transparent border border-stone-200 dark:border-stone-800 py-2 px-3 font-mono text-xs focus:border-orange-800 outline-none"
            />
            <button
              type="button"
              onClick={applyUrl}
              className="shrink-0 px-3 py-2 border border-stone-200 dark:border-stone-800 font-mono text-[10px] uppercase tracking-widest hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              Use URL
            </button>
          </div>
        )}
      </div>

      {hint && <p className="text-stone-500 text-xs">{hint}</p>}
    </div>
  );
}
