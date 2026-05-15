import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const pagesDir = join(
  fileURLToPath(new URL("..", import.meta.url)),
  "src/pages"
);

const underlineByFile = {
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

function findHeroFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) findHeroFiles(p, out);
    else if (name.endsWith("Hero.tsx")) out.push(p);
  }
  return out;
}

for (const file of findHeroFiles(pagesDir)) {
  if (file.includes("AboutHero")) continue;
  let content = readFileSync(file, "utf8");
  const base = file.split(/[/\\]/).pop().replace(".tsx", "");
  const underline = underlineByFile[base] || "underline-w-welcome";

  if (!content.includes("BreadcrumbBar")) {
    content = content.replace(
      'import PageHeader from "@/components/feature/PageHeader";',
      'import PageHeader from "@/components/feature/PageHeader";\nimport BreadcrumbBar from "@/components/feature/BreadcrumbBar";'
    );
  }

  content = content.replace(
    /\{\/\* Breadcrumb[\s\S]*?<\/div>\s*\n\s*<\/motionless-top-bar>\s*\n\s*<\/div>/m,
    ""
  );

  content = content.replace(
    /(\s*)\{\/\* Breadcrumb[\s\S]*?\n\s*<\/motionless-top-bar>\n/m,
    ""
  );

  // Replace breadcrumb block
  const breadcrumbRegex =
    /\{\/\* Breadcrumb[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n/m;
  const dataMatch = content.match(/(\w+Data)\.breadcrumb/);
  if (dataMatch && breadcrumbRegex.test(content)) {
    content = content.replace(
      breadcrumbRegex,
      `\n      <BreadcrumbBar items={${dataMatch[1]}.breadcrumb} />\n\n`
    );
  }

  content = content.replace(
    /className="text-3xl md:text-4xl lg:text-\[42px\] font-normal text-gray-800/g,
    'className="page-hero-title'
  );
  content = content.replace(
    /<div className="mt-2 mx-auto w-40 h-\[2px\] bg-brand" \/>/g,
    `<span className="section-title-underline ${underline}" aria-hidden="true" />`
  );
  content = content.replace(
    /<motionless-top-bar\n            className=\{`w-20 h-1 bg-brand rounded-full[\s\S]*?\}\n          \/>/g,
    ""
  );

  content = content.replaceAll("motionless-top-bar", "motionless-top-bar");
  content = content.replaceAll("motionless-top-bar", "div");
  content = content.replace(/max-w-site mx-auto px-4 md:px-6/g, "container-site");
  content = content.replace(/text-gray-600/g, "text-brand-link");
  content = content.replace(
    /index === \w+\.breadcrumb\.length - 1\s*\?\s*"text-brand font-medium"/g,
    'index === $&.breadcrumb.length - 1 ? "breadcrumb-active"'
  );

  writeFileSync(file, content, "utf8");
  console.log("patched", base);
}
