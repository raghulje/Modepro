import { useEffect, useRef, useState } from "react";
import { contactData } from "@/mocks/contactData";
import PageHeader from "@/components/feature/PageHeader";
import BreadcrumbBar from "@/components/feature/BreadcrumbBar";
import { usePageTitle } from "@/hooks/usePageTitle";
import { pageTitles } from "@/mocks/pageTitles";

export default function ContactHero() {
  usePageTitle(pageTitles.contact);
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
      {/* Banner with floating header */}
      <div className="relative w-full h-[260px] md:h-[340px] overflow-hidden">
        <PageHeader className="absolute top-0 left-0 right-0 z-20" />
        <img
          src={contactData.banner.image}
          alt={contactData.banner.alt}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <BreadcrumbBar items={contactData.breadcrumb} />


      <div className="container-site">
        <div
          className={`cont-title-text transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {contactData.title} <span>{contactData.titleHighlight}</span>
        </div>
      </div>
    </div>
  );
}