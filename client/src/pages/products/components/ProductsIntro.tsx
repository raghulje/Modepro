import { useEffect, useRef, useState } from "react";
import { productsData } from "@/mocks/productsData";

export default function ProductsIntro() {
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
    <section ref={sectionRef} className="bg-white">
      <div className="container-site">
        <div
          className={`transition-all duration-700 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="subsection-title">
            <a id="ourpro" href="#ourpro">
              {productsData.intro.title}
            </a>
          </div>
          <p className="quality-pg-info-text">{productsData.intro.description}</p>
        </div>
      </div>
    </section>
  );
}
