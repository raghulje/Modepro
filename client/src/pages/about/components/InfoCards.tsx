import { useEffect, useRef, useState } from "react";
import { useAboutData } from "@/hooks/cms/useAboutData";

export default function InfoCards() {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pro-quality-respect-envi-main py-[3%]">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {aboutData.infoCards.map((card, index) => (
            <div
              key={card.id}
              id={card.id}
              className={`abt-box transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="process-title-text">
                <a href={`#${card.id}`}>{card.title}</a>
              </div>
              <img
                src={card.image}
                alt={card.alt}
                className="mx-auto mb-4 h-28 md:h-36 w-auto object-contain block"
              />
              {"paragraphs" in card ? (
                <div className="quality-info-text space-y-3">
                  {card.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : (
                <p
                  className={
                    card.id === "rip"
                      ? "respect-info-text"
                      : card.id === "ehs"
                        ? "environment-info-text"
                        : "process-info-text"
                  }
                >
                  {card.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
