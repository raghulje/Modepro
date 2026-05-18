import { useEffect, useRef, useState } from "react";
import { useSiteData } from "@/contexts/SiteDataContext";

export default function FeatureCards() {
  const { data: homeData } = useSiteData();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const features = homeData.features ?? [];

  return (
    <section ref={sectionRef} className="bg-modepro-section py-[3%]">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 re-cap-gal-main-line">
          {features.map((feature, index) => {
            const gallery =
              Array.isArray(feature.images) && feature.images.length > 0
                ? feature.images.filter((img): img is string => Boolean(img))
                : [];
            return (
              <div
                key={`${feature.title}-${index}`}
                className={`gal-box text-center transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {gallery.length > 0 ? (
                  <div className="hm-gal-main grid grid-cols-4 gap-px justify-center my-5">
                    {gallery.slice(0, 8).map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img}
                        alt={`Gallery ${imgIndex + 1}`}
                        className="gallery-thumb"
                        loading="lazy"
                      />
                    ))}
                  </div>
                ) : feature.image ? (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-auto mx-auto mb-3"
                    loading="lazy"
                  />
                ) : null}

                <h3 className="feature-card-title">{feature.title}</h3>
                <a href={feature.ctaHref} className="btn-read-more mx-auto">
                  {feature.ctaText}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
