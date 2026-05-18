import { useEffect, useRef, useState } from "react";
import { useCareersData } from "@/hooks/cms/pages";

function SectionTitle({
  children,
  anchor,
}: {
  children: React.ReactNode;
  anchor?: string;
}) {
  return (
    <div className="subsection-title mb-4">
      {anchor ? <a href={`#${anchor}`}>{children}</a> : children}
    </div>
  );
}

export default function CareersContent() {
  const { data: careersData } = useCareersData();
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

  const { welcome, openings } = careersData.sections;

  return (
    <section ref={sectionRef} className="py-6 md:py-10 bg-white">
      <div className="container-site">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Left content - 8 columns */}
          <div className="lg:col-span-8 space-y-8">
            {/* Welcome to Careers at Modepro */}
            <div id={welcome.anchor}>
              <SectionTitle anchor={welcome.anchor}>{welcome.title}</SectionTitle>
              <p className="quality-pg-info-text">{welcome.text}</p>
            </div>

            {/* Current Openings */}
            <div id={openings.anchor}>
              <SectionTitle anchor={openings.anchor}>{openings.title}</SectionTitle>
              <div className="quality-pg-info-text">
                <p>{openings.text}</p>
                <p className="mt-2">
                {openings.subText}
                <a
                  href={openings.emailHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand hover:underline"
                >
                  {openings.email}
                </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - 4 columns empty */}
          <div className="lg:col-span-4" />
        </div>
      </div>
    </section>
  );
}