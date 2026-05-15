import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const pagesDir = join(fileURLToPath(new URL("..", import.meta.url)), "src/pages");

const underline = {
  RndHero: "underline-w-rnd",
  QualityHero: "underline-w-quality",
  ProductsHero: "underline-w-product",
  ManufacturingHero: "underline-w-manufacturing",
  GalleryHero: "underline-w-gallery",
  EhsHero: "underline-w-ehs",
  ContactHero: "underline-w-contact",
  CareersHero: "underline-w-career",
  CapabilitiesHero: "underline-w-capabilities",
};

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (n.endsWith("Hero.tsx")) out.push(p);
  }
  return out;
}

for (const file of walk(pagesDir)) {
  const name = file.split(/[/\\]/).pop().replace(".tsx", "");
  let c = readFileSync(file, "utf8");
  const data = c.match(/(\w+Data)\.breadcrumb/)?.[1];
  if (!data) continue;

  if (!c.includes("BreadcrumbBar")) {
    c = c.replace(
      'import PageHeader from "@/components/feature/PageHeader";',
      'import PageHeader from "@/components/feature/PageHeader";\nimport BreadcrumbBar from "@/components/feature/BreadcrumbBar";'
    );
  }

  c = c.replace(
    /\s*\{\/\* Breadcrumb[\s\S]*?\n\s*<\/div>\s*\n\s*<\/motionless-top-bar>\s*\n\s*<\/div>\s*\n/m,
    "\n"
  );
  c = c.replace(
    /\s*\{\/\* Breadcrumb[\s\S]*?\n\s*<\/div>\s*\n\s*<\/div>\s*\n/m,
    "\n"
  );

  if (!c.includes("<BreadcrumbBar")) {
    c = c.replace(
      /(\s*)(\{\/\* Centered page title \*\/\}|\{\/\* Page title \*\/\})/,
      `$1<BreadcrumbBar items={${data}.breadcrumb} />\n\n$1$2`
    );
    c = c.replace(
      /(\s*)<\/div>\s*\n\s*(\{\/\* Centered page title)/,
      `$1</div>\n\n$1<BreadcrumbBar items={${data}.breadcrumb} />\n\n$1$2`
    );
  }

  const ul = underline[name] || "underline-w-welcome";
  c = c.replace(
    /className={`text-3xl md:text-4xl lg:text-\[42px\] font-normal text-gray-800/g,
    'className={`page-hero-title'
  );
  c = c.replace(
    /className={`text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center/g,
    'className={`page-hero-title'
  );
  c = c.replace(
    /<div className="mt-2 mx-auto w-40 h-\[2px\] bg-brand" \/>/g,
    `<span className="section-title-underline ${ul}" aria-hidden="true" />`
  );
  c = c.replace(
    /className={`w-20 h-1 bg-brand rounded-full mx-auto mt-4[\s\S]*?\/>\s*\n/g,
    `<span className="section-title-underline ${ul} mx-auto" aria-hidden="true" />\n`
  );
  c = c.replace(/<span className="text-brand">/g, '<span className="section-title-accent">');
  c = c.replace(/max-w-site mx-auto px-4 md:px-6/g, "container-site");
  c = c.replace(/bg-modepro-breadcrumb border-b border-gray-200/g, "");
  c = c.replace(/text-gray-600/g, "text-brand-link");
  c = c.replace(/text-gray-800/g, "text-black");
  c = c.replace(/text-gray-900/g, "text-black");

  writeFileSync(file, c, "utf8");
  console.log("ok", name);
}
