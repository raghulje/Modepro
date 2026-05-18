import { useEffect, useRef, useState } from "react";
import { useSiteData } from "@/contexts/SiteDataContext";

export default function WelcomeSection() {
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="bg-white text-img-line">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <img
              src={homeData.welcome.image}
              alt="About Us"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="welcome-title-text">
              {homeData.welcome.title}{" "}
              <span>{homeData.welcome.titleHighlight}</span>
            </div>
            <div className="welcome-info-text space-y-4">
              {homeData.welcome.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <a href={homeData.welcome.ctaHref} className="btn-read-more">
              {homeData.welcome.ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
