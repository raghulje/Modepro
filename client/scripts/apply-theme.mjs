import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const srcDir = join(fileURLToPath(new URL("..", import.meta.url)), "src");

const replacements = [
  ["text-[#00a0b0]", "text-brand"],
  ["bg-[#00a0b0]", "bg-brand"],
  ["border-[#00a0b0]", "border-brand"],
  ["hover:text-[#00a0b0]", "hover:text-brand"],
  ["hover:bg-[#008a99]", "hover:bg-brand-dark"],
  ["bg-[#008a99]", "bg-brand-dark"],
  ["bg-[#0c3b4d]", "bg-modepro-footer-start"],
  ["bg-[#f5f5f5]", "bg-modepro-breadcrumb"],
  ["bg-[#e8f7f9]", "bg-modepro-table-odd"],
  ["#00a0b0", "#0798bc"],
  ["bg-brand-teal", "bg-brand"],
  ["text-brand-teal", "text-brand"],
  ["hover:bg-brand-teal-dark", "hover:bg-brand-dark"],
  ["bg-brand-teal/", "bg-brand/"],
  ["text-brand-teal-darker", "text-brand-table"],
  ["from-brand-teal-darker", "from-modepro-footer-start"],
  ["to-brand-teal", "to-brand"],
  ["from-brand-teal-darker/80", "from-modepro-footer-start/80"],
  ["to-brand-teal/60", "to-brand/60"],
  ["max-w-7xl", "max-w-site"],
  ["max-w-[1170px]", "max-w-site"],
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!["theme", "node_modules"].includes(name)) walk(p, files);
    } else if ([".tsx", ".ts"].includes(extname(p))) {
      files.push(p);
    }
  }
  return files;
}

let count = 0;
for (const file of walk(srcDir)) {
  let content = readFileSync(file, "utf8");
  const original = content;
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  if (content !== original) {
    writeFileSync(file, content, "utf8");
    count++;
  }
}

console.log(`Updated ${count} files.`);
