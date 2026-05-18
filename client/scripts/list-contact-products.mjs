import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = readFileSync(join(__dirname, "../src/mocks/productsData.ts"), "utf8");
const m = file.match(/tabs:\s*(\[[\s\S]*\])\s*\}\s*;/);
if (!m) {
  console.error("Could not parse productsData.ts");
  process.exit(1);
}
const tabs = Function(`"use strict"; return (${m[1]});`)();

const options = [{ value: "General Enquiry", label: "General Enquiry", category: "Other" }];
for (const tab of tabs) {
  for (const group of tab.groups) {
    for (const product of group.products) {
      const name = String(product.name || "").trim();
      if (!name) continue;
      const casSuffix = product.casNo ? ` (CAS ${product.casNo})` : "";
      const display = `${name}${casSuffix}`;
      options.push({
        value: display,
        label: display,
        category: `${tab.label} — ${group.name}`,
      });
    }
  }
}

console.log(`Total Product values sent to Kissflow (field "Product"): ${options.length}\n`);
options.forEach((o, i) => console.log(`${i + 1}. ${o.value}`));
