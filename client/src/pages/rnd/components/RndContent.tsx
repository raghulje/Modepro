import { useEffect, useRef, useState } from "react";
import { rndData } from "@/mocks/rndData";
import OriginalBulletList from "@/components/feature/OriginalBulletList";

export default function RndContent() {
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
          <div className="lg:col-span-8 space-y-8">
            <div id="reser">
              <div className="subsection-title">
                <a href="#reser">{rndData.intro.title}</a>
              </div>
              <div
                className="quality-pg-info-text"
                dangerouslySetInnerHTML={{ __html: rndData.intro.htmlIntro }}
              />
            </div>
            <div id="activities" className="contentarea">
              <div className="subsection-title">
                <a href="#activities">{rndData.majorActivities.title}</a>
              </div>
              <OriginalBulletList items={rndData.majorActivities.items} />
            </div>
            <div id="develop" className="contentarea">
              <div className="subsection-title">
                <a href="#develop">{rndData.analyticalDevelopment.title}</a>
              </div>
              <p className="quality-pg-info-text">
                {rndData.analyticalDevelopment.description}
              </p>
              <div className="subsection-title">
                {rndData.analyticalDevelopment.subTitle}
              </div>
              <OriginalBulletList items={rndData.analyticalDevelopment.items} />
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="kur-img-mar">
              <img
                src={rndData.intro.image}
                alt={rndData.intro.imageAlt}
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
