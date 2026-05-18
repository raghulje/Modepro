import { useEffect, useRef, useState } from "react";
import { useQualityData } from "@/hooks/cms/pages";
import OriginalBulletList from "@/components/feature/OriginalBulletList";

export default function QualityContent() {
  const { data: qualityData } = useQualityData();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-8 md:py-12 bg-white all-page-main-mrg-line">
      <div className="container-site">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="lg:col-span-8">
            <div className="quality-pg-info-text space-y-6">
              <div id="assurance">
                <div className="subsection-title">
                  <a href="#assurance">{qualityData.qualityAssurance.title}</a>
                </div>
                {qualityData.qualityAssurance.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div id="control">
                <div className="subsection-title">
                  <a href="#control">{qualityData.qualityControl.title}</a>
                </div>
                <p>{qualityData.qualityControl.description}</p>
              </div>
            </div>
            <div className="contentarea mt-6">
              <div className="subsection-title">{qualityData.equipment.title}</div>
              <OriginalBulletList items={qualityData.equipment.items} />
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="kur-img-mar space-y-4">
              {qualityData.images.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
