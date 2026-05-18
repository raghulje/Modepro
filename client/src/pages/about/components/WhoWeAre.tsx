import { useEffect, useRef, useState } from "react";
import { useAboutData } from "@/hooks/cms/useAboutData";

export default function WhoWeAre() {
  const { data: aboutData } = useAboutData();
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="whoweare"
      className="py-[3%] bg-white"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div
            className={`lg:col-span-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="relative flex items-center justify-center">
              <img
                src={aboutData.whoWeAre.image}
                alt={aboutData.whoWeAre.alt}
                className="w-full max-w-[320px] h-auto object-contain"
              />
            </div>
          </div>

          {/* Text */}
          <div
            className={`lg:col-span-8 transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="about-who-we-title-text">
              <a href="#whoweare">{aboutData.whoWeAre.title}</a>
            </div>
            <div className="about-who-we-info-text space-y-4">
              {aboutData.whoWeAre.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}