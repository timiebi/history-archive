/**
 * Image upload via backend. Backend receives the file and uploads to Cloudinary, returns URL.
 * No Cloudinary keys on the frontend — all keys stay on the backend.
 */

import { getApiUrl } from "@/lib/api/client";
import { AUTH_TOKEN_KEY } from "@/lib/constants";

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function validateImageFile(
  file: File
): { ok: true } | { ok: false; message: string } {
  if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/)) {
    return { ok: false, message: "Please use a JPEG, PNG, WebP, or GIF image." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, message: `Image must be under ${MAX_SIZE_MB} MB.` };
  }
  return { ok: true };
}

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
export const IMAGE_MAX_SIZE_MB = MAX_SIZE_MB;

export interface UploadResult {
  url: string;
}

export async function uploadImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
  if (!token) {
    throw new Error("You must be signed in to upload images.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const url = getApiUrl("/upload/image");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as { url?: string };
          resolve({ url: data.url ?? "" });
        } catch {
          reject(new Error("Something went wrong. Please try again."));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText) as { message?: string };
          reject(new Error(err.message ?? "Upload didn’t work. Please try again."));
        } catch {
          reject(new Error("Upload didn’t work. Please try again."));
        }
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Connection problem. Check your internet and try again.")));
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(formData);
  });
}
