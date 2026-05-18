/**
 * Local static assets under /public/images (downloaded from modepro.co.in).
 * Run `npm run download-assets` to refresh files from the live site.
 */

export const images = {
  logo: "/images/logo_new1a.png",
  footerLogo: "/images/ftlogo.png",
  scrollTop: "/images/up.png",
} as const;

/** Build a local image path from a site-relative images path, e.g. "banner2.jpg" */
export function imagePath(relativePath: string): string {
  return `/images/${relativePath.replace(/^\//, "")}`;
}
