import { useEffect, useRef, useState } from "react";
import { useGalleryData } from "@/hooks/cms/useGalleryData";
import BreadcrumbBar from "@/components/feature/BreadcrumbBar";
import PageBannerCarousel from "@/components/feature/PageBannerCarousel";
import { usePageTitle } from "@/hooks/usePageTitle";
import { pageTitles } from "@/mocks/pageTitles";

export default function GalleryHero() {
  const { data: galleryData } = useGalleryData();
  usePageTitle(pageTitles.gallery);
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
      <PageBannerCarousel slides={galleryData.bannerSlides} />
      <BreadcrumbBar items={galleryData.breadcrumb} />
      <div className="container-site">
        <div
          className={`pho-gal-title-text transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {galleryData.title} <span> {galleryData.titleHighlight}</span>
        </div>
      </div>
    </div>
  );
}
