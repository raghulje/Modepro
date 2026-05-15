import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const snapDir = path.join(__dirname, "live-snapshots");

const react = {
  home: {
    title: "Manufacturer of advanced intermediates of API's | Indian pharmaceutical company | Modepro India Pvt. Ltd",
    heading: "WELCOME TO MODEPRO",
    breadcrumb: "HOME only",
  },
  about: { title: "Modepro India | About Us", heading: "ABOUT MODEPRO INDIA", breadcrumb: "HOME > ABOUT MODEPRO" },
  products: { title: "Modepro India | Products", heading: "PRODUCTS PORTFOLIO", breadcrumb: "HOME > PRODUCTS" },
  rnd: { title: "Modepro India |  R & D", heading: "Research and Development", breadcrumb: "HOME > R & D" },
  manufacturing: { title: "Modepro India | Manufacturing", heading: "Manufacturing", breadcrumb: "HOME > MANUFACTURING" },
  quality: { title: "Modepro India | Quality", heading: "Quality", breadcrumb: "HOME > QUALITY" },
  ehs: { title: "Modepro India | EHS", heading: "EHS", breadcrumb: "HOME > EHS" },
  capabilities: { title: "Modepro | Capabilities", heading: "Capabilities", breadcrumb: "HOME > Capabilities" },
  careers: { title: "Modepro India | Careers", heading: "Careers", breadcrumb: "HOME > CAREERS" },
  gallery: { title: "Modepro | Gallery", heading: "PHOTO GALLERY", breadcrumb: "HOME > PHOTO GALLERY" },
  contact: { title: "Modepro | Contact Us", heading: "CONTACT US", breadcrumb: "HOME > CONTACT US" },
};

const productsTs = fs.readFileSync(
  path.join(__dirname, "../src/mocks/productsData.ts"),
  "utf8"
);
const reactGroups = (productsTs.match(/name:/g) || []).length; // rough
const reactGroupHeaders = (productsTs.match(/name: "/g) || []).filter ? (productsTs.match(/^\s+name: "/gm) || []).length : 0;

const galleryTs = fs.readFileSync(path.join(__dirname, "../src/mocks/galleryData.ts"), "utf8");
const reactGalleryImages = (galleryTs.match(/thumb:/g) || []).length;

const capsTs = fs.readFileSync(path.join(__dirname, "../src/mocks/capabilitiesData.ts"), "utf8");
const reactCapRows = (capsTs.match(/named:/g) || []).length;

console.log("=== SIDE-BY-SIDE: Live vs React ===\n");

for (const id of Object.keys(react)) {
  const live = JSON.parse(fs.readFileSync(path.join(snapDir, `${id}.json`), "utf8"));
  const r = react[id];
  const titleMatch = live.title.replace(/&amp;/g, "&").includes(r.title.split("|")[0].trim().slice(0, 20)) || r.title.includes(live.title.split("|")[0].trim().slice(0, 15));
  const headingMatch =
    live.pageHeading.toUpperCase().replace(/\s+/g, " ") ===
    r.heading.toUpperCase().replace(/\s+/g, " ");
  console.log(`## ${id.toUpperCase()}`);
  console.log(`  Title     Live: ${live.title}`);
  console.log(`            React: ${r.title}`);
  console.log(`            Match: ${normalize(live.title) === normalize(r.title) ? "YES" : "CHECK"}`);
  console.log(`  Heading   Live: ${live.pageHeading}`);
  console.log(`            React: ${r.heading}`);
  console.log(`            Match: ${headingMatch ? "YES" : "NO"}`);
  console.log(`  Breadcrumb Live: ${live.breadcrumbs}`);
  console.log("");
}

const liveProductsHtml = fs.readFileSync(path.join(snapDir, "products.html"), "utf8");
const liveGroups = (liveProductsHtml.match(/title-bg-color/g) || []).length;
const liveProducts = (liveProductsHtml.match(/name-str-cas/g) || []).length;
const reactProductGroups = (productsTs.match(/^\s+name: "/gm) || []).length;
const reactProductRows = (productsTs.match(/casNo:/g) || []).length;

console.log("## PRODUCTS DATA");
console.log(`  Live:  ${liveGroups} groups, ${liveProducts} product rows`);
console.log(`  React: ${reactProductGroups} groups, ${reactProductRows} product rows`);
console.log(`  Match: ${liveGroups === reactProductGroups && liveProducts === reactProductRows ? "YES" : "NO - content gap"}`);

console.log("\n## GALLERY IMAGES");
console.log(`  React mock: ${reactGalleryImages} images`);

console.log("\n## CAPABILITIES TABLE ROWS");
const liveCaps = (fs.readFileSync(path.join(snapDir, "capabilities.html"), "utf8").match(/cap-table-info-text/g) || []).length;
console.log(`  Live rows: ${liveCaps / 2} (pairs of tr classes)`);
console.log(`  React rows: ${reactCapRows}`);

function normalize(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/API's/g, "API's")
    .replace(/API's/g, "API's")
    .replace(/\s+/g, " ")
    .trim();
}
