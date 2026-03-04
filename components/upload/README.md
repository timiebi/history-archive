# Image upload (backend + Cloudinary)

Submit a Story lets contributors **upload** cover and section images. The **frontend** sends the file to **your backend**; the **backend** uploads it to Cloudinary and returns the URL. No Cloudinary keys or SDK on the frontend.

- **Frontend:** Drag-and-drop or paste image → POST `file` to backend `POST /upload/image` (with auth) → receive `{ url }` → use URL in the story payload.
- **Backend:** Receives file, uploads to Cloudinary using env keys, returns `{ url }`.

## Backend setup (you do this)

1. In the **backend** `.env`, add your Cloudinary credentials (from [Cloudinary Console](https://cloudinary.com/console)):
   ```bash
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   Optional: `CLOUDINARY_UPLOAD_FOLDER=afri-archive/stories` to store in a folder.

2. Run `yarn install` in the backend (adds the `cloudinary` package) and restart the backend.

3. The upload endpoint is `POST /upload/image` (Bearer token required; CONTRIBUTOR or ADMIN). Max file size 10 MB; JPEG, PNG, WebP, GIF.

**Frontend:** No Cloudinary env vars. It only needs `NEXT_PUBLIC_API_URL` pointing at your backend.

If the backend doesn’t have Cloudinary configured, uploads will fail with a clear error; contributors can still use **“Or paste image URL”** to paste a link.
