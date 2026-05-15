import { useEffect, useRef, useState } from "react";
import { aboutData } from "@/mocks/aboutData";
import PageHeader from "@/components/feature/PageHeader";
import BreadcrumbBar from "@/components/feature/BreadcrumbBar";
import { usePageTitle } from "@/hooks/usePageTitle";
import { pageTitles } from "@/mocks/pageTitles";

export default function AboutHero() {
  usePageTitle(pageTitles.about);
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
      <div className="relative w-full overflow-hidden">
        <PageHeader className="absolute top-0 left-0 right-0 z-20" />
        <img
          src={aboutData.banner.image}
          alt={aboutData.banner.alt}
          className="w-full h-auto object-cover"
        />
      </div>

      <BreadcrumbBar items={aboutData.breadcrumb} />

      <div className="container-site">
        <div
          className={`about-welcome-title-text transition-all duration-700 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          ABOUT <span>MODEPRO INDIA</span>
        </div>
      </div>
    </div>
  );
}
