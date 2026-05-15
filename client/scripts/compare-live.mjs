import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "live-snapshots");

const pages = [
  { id: "home", url: "https://modepro.co.in/index.html" },
  { id: "about", url: "https://modepro.co.in/aboutus.html" },
  { id: "products", url: "https://modepro.co.in/_product.html" },
  { id: "rnd", url: "https://modepro.co.in/r&d.html" },
  { id: "manufacturing", url: "https://modepro.co.in/manufacturing.html" },
  { id: "quality", url: "https://modepro.co.in/quality.html" },
  { id: "ehs", url: "https://modepro.co.in/ehs.html" },
  { id: "capabilities", url: "https://modepro.co.in/capabilities.html" },
  { id: "careers", url: "https://modepro.co.in/career.html" },
  { id: "gallery", url: "https://modepro.co.in/gallery.html" },
  { id: "contact", url: "https://modepro.co.in/contact.html" },
];

function extractSignals(html) {
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
  const h1 =
    html.match(/class="[^"]*title-text[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ??
    html.match(/class="welcome-title-text"[^>]*>([\s\S]*?)<\/div>/i)?.[1] ??
    "";
  const clean = (s) =>
    s
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&rsquo;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const breadcrumbs = [...html.matchAll(/breadcrumb[\s\S]*?<\/ol>/gi)]
    .map((m) => clean(m[0]))
    .join(" | ");
  const firstPara = clean(
    html.match(/quality-pg-info-text|welcome-info-text|about-who-we-info-text[\s\S]{0,2000}/i)?.[0] ?? ""
  ).slice(0, 280);
  return { title, pageHeading: clean(h1).slice(0, 120), breadcrumbs: breadcrumbs.slice(0, 120), firstPara };
}

fs.mkdirSync(outDir, { recursive: true });

for (const p of pages) {
  const res = await fetch(p.url);
  const html = await res.text();
  fs.writeFileSync(path.join(outDir, `${p.id}.html`), html);
  const signals = extractSignals(html);
  fs.writeFileSync(path.join(outDir, `${p.id}.json`), JSON.stringify(signals, null, 2));
  console.log(`${p.id}:`, JSON.stringify(signals));
}
