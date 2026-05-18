import { useEffect, useRef, useState } from "react";
import { useAboutData } from "@/hooks/cms/useAboutData";

export default function OurPeople() {
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
      id="ourpeople"
      className="py-[3%] bg-modepro-section"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text */}
          <div
            className={`lg:col-span-8 order-2 lg:order-1 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <h2 className="subsection-title-sm mb-5">
              {aboutData.ourPeople.title}
            </h2>
            <p className="text-body-muted">
              {aboutData.ourPeople.description}
            </p>
          </div>

          {/* Image */}
          <div
            className={`lg:col-span-4 order-1 lg:order-2 transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="relative flex items-center justify-center">
              <img
                src={aboutData.ourPeople.image}
                alt={aboutData.ourPeople.alt}
                className="w-full max-w-[320px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}