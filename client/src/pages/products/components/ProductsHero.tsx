import { useEffect, useRef, useState } from "react";
import { productsData } from "@/mocks/productsData";
import PageHeader from "@/components/feature/PageHeader";
import BreadcrumbBar from "@/components/feature/BreadcrumbBar";
import { usePageTitle } from "@/hooks/usePageTitle";
import { pageTitles } from "@/mocks/pageTitles";

export default function ProductsHero() {
  usePageTitle(pageTitles.products);
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
          src={productsData.banner.image}
          alt={productsData.banner.alt}
          className="w-full max-h-[470px] object-cover object-center"
        />
      </div>

      <BreadcrumbBar items={productsData.breadcrumb} />

      <div className="container-site">
        <div
          className={`product-title-text transition-all duration-700 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          PRODUCTS <span> PORTFOLIO</span>
        </div>
      </div>
    </div>
  );
}
