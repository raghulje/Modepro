import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { aboutData } from "@/mocks/aboutData";

export default function ManufacturingLocation() {
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
      id="mfglocation"
      className="py-12 md:py-16 bg-white"
    >
      <div className="max-w-site mx-auto px-4 md:px-8">
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
                src={aboutData.manufacturingLocation.image}
                alt={aboutData.manufacturingLocation.alt}
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
            <h2 className="text-xl md:text-2xl font-bold text-brand mb-5 tracking-wide">
              {aboutData.manufacturingLocation.title}
            </h2>

            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 flex items-center justify-center text-brand mt-0.5 flex-shrink-0">
                <MapPin className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
              </div>
              <h3 className="font-raleway text-modepro-md text-modepro-text font-bold">
                {aboutData.manufacturingLocation.location}
              </h3>
            </div>

            <p className="text-body-muted pl-11">
              {aboutData.manufacturingLocation.address}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}