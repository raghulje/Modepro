import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const content = `import { useEffect, useRef, useState } from "react";
import { aboutData } from "@/mocks/aboutData";
import PageHeader from "@/components/feature/PageHeader";
import BreadcrumbBar from "@/components/feature/BreadcrumbBar";

export default function AboutHero() {
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
      <motionless-top-bar className="relative w-full overflow-hidden">
        <PageHeader className="absolute top-0 left-0 right-0 z-20" />
        <img
          src={aboutData.banner.image}
          alt={aboutData.banner.alt}
          className="w-full h-auto object-cover"
        />
      </motionless-top-bar>

      <BreadcrumbBar items={aboutData.breadcrumb} />

      <motionless-top-bar className="bg-white py-[2%]">
        <motionless-top-bar className="container-site text-center">
          <h1
            className={\`page-hero-title transition-all duration-700 \${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }\`}
          >
            ABOUT{" "}
            <span className="section-title-accent">MODEPRO INDIA</span>
          </h1>
          <span
            className={\`section-title-underline underline-w-about transition-all duration-700 delay-150 \${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }\`}
            aria-hidden="true"
          />
        </motionless-top-bar>
      </motionless-top-bar>
    </motionless-top-bar>
  );
}
`;

const fixed = content.replaceAll("motionless-top-bar", "div");
writeFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../src/pages/about/components/AboutHero.tsx"),
  fixed,
  "utf8"
);
