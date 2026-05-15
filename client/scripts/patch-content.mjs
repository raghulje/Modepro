import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const srcDir = join(fileURLToPath(new URL("..", import.meta.url)), "src");

const replacements = [
  [
    'className="text-xl md:text-[22px] font-normal text-brand tracking-wide pb-2 border-b border-dashed border-gray-300 mb-4"',
    'className="subsection-title mb-4"',
  ],
  [
    'className="text-xl md:text-2xl font-bold text-brand mb-5 tracking-wide"',
    'className="subsection-title-sm mb-5"',
  ],
  [
    'className="text-lg md:text-xl font-bold text-brand mb-5 tracking-wide"',
    'className="subsection-title-sm mb-5"',
  ],
  ["text-gray-600", "text-modepro-text"],
  ["text-gray-700", "text-modepro-text"],
  ["text-gray-800", "text-black"],
  ["text-sm md:text-[15px]", "text-modepro-md max-md:text-modepro-sm"],
  ["border-dashed border-gray-300", "border-dashed border-modepro-dashed"],
  ["border-4 border-brand", "image-border-brand"],
  ["max-w-site mx-auto px-4 md:px-8", "container-site"],
  ["max-w-site mx-auto px-4 md:px-6", "container-site"],
  ["py-12 md:py-16", "py-[3%]"],
  ["py-16 md:py-24", "py-[3%]"],
];

function walk(dir, files = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) {
      if (!["theme", "node_modules"].includes(n)) walk(p, files);
    } else if (p.endsWith("Content.tsx") || p.endsWith("WhoWeAre.tsx") || p.endsWith("InfoCards.tsx")) {
      files.push(p);
    }
  }
  return files;
}

for (const file of walk(srcDir)) {
  let c = readFileSync(file, "utf8");
  const o = c;
  for (const [a, b] of replacements) c = c.split(a).join(b);
  if (c !== o) {
    writeFileSync(file, c, "utf8");
    console.log(file.split(/[/\\]/).pop());
  }
}
