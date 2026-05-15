import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const content = `import { useEffect, useRef, useState } from "react";
import { productsData } from "@/mocks/productsData";
import PageHeader from "@/components/feature/PageHeader";
import BreadcrumbBar from "@/components/feature/BreadcrumbBar";

export default function ProductsHero() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef}>
      <TAG className="relative w-full overflow-hidden">
        <PageHeader className="absolute top-0 left-0 right-0 z-20" />
        <img
          src={productsData.banner.image}
          alt={productsData.banner.alt}
          className="w-full h-auto object-cover"
        />
      </TAG>

      <BreadcrumbBar items={productsData.breadcrumb} />

      <TAG className="bg-white py-[2%]">
        <TAG className="container-site text-center">
          <h1
            className={\`page-hero-title transition-all duration-700 \${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }\`}
          >
            PRODUCTS{" "}
            <span className="section-title-accent">PORTFOLIO</span>
          </h1>
          <span
            className={\`section-title-underline underline-w-product transition-all duration-700 delay-150 \${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }\`}
            aria-hidden="true"
          />
        </TAG>
      </TAG>
    </div>
  );
}
`.replaceAll("TAG", "div");

writeFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "../src/pages/products/components/ProductsHero.tsx"
  ),
  content,
  "utf8"
);
