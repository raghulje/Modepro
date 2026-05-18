import { useEffect, useRef, useState } from "react";
import { useEhsData } from "@/hooks/cms/pages";
import OriginalBulletList from "@/components/feature/OriginalBulletList";

export default function EhsContent() {
  const { data: ehsData } = useEhsData();
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

  const { infrastructure, policy } = ehsData.sections;

  return (
    <section ref={sectionRef} className="py-6 md:py-10 bg-white all-page-main-mrg-line">
      <div className="container-site">
        <div
          className={`space-y-8 md:space-y-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div id={infrastructure.anchor} className="contentarea">
            <div className="subsection-title">
              <a href={`#${infrastructure.anchor}`}>{infrastructure.title}</a>
            </div>
            <OriginalBulletList items={infrastructure.items} />
          </div>
          <div id={policy.anchor} className="contentarea">
            <div className="ehs-policy-title-text">
              <a href={`#${policy.anchor}`}>{policy.title}</a>
            </div>
            <OriginalBulletList items={policy.items} />
          </div>
        </div>
      </div>
    </section>
  );
}
