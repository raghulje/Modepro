export function getAssetBaseUrl(): string {
  const api = import.meta.env.VITE_API_URL;
  if (api) return api.replace(/\/api\/v1\/?$/, "");
  return "";
}

/** Resolve site image paths for CMS previews (/images, /uploads, external URLs). */
export function resolveImagePath(imagePath: string | null | undefined): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (imagePath.startsWith("/images/")) {
    return imagePath;
  }
  const base = getAssetBaseUrl();
  if (imagePath.startsWith("/uploads/")) {
    return base ? `${base}${imagePath}` : imagePath;
  }
  if (imagePath.startsWith("/")) {
    return base ? `${base}${imagePath}` : imagePath;
  }
  return base ? `${base}/uploads/${imagePath}` : `/uploads/${imagePath}`;
}
