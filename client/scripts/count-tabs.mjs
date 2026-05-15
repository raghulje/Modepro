import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const html = fs
  .readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "live-snapshots/products.html"),
    "utf8"
  )
  .replace(/<!--[\s\S]*?-->/g, "");

const parts = html.split('<div class="tab_content');
const labels = ["Intermediates", "Pyridine", "Thiophene", "Extra"];
parts.slice(1).forEach((chunk, i) => {
  const end = chunk.indexOf("</table>");
  const table = chunk.slice(0, end + 8);
  const groups = (table.match(/title-bg-color/g) || []).length;
  const products = (table.match(/name-str-cas/g) || []).length;
  console.log(labels[i] || `tab${i + 1}`, "groups", groups, "products", products);
});
