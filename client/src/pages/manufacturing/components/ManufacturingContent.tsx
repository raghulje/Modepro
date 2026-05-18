import { useEffect, useRef, useState } from "react";
import { useManufacturingData } from "@/hooks/cms/pages";
import OriginalBulletList from "@/components/feature/OriginalBulletList";

function FacilityItem({ text, index }: { text: string; index: number }) {
  if (index === 2) {
    return (
      <>
        Reaction Temperature ranging from -75<sup>0</sup>C to +150<sup>0</sup>C.
      </>
    );
  }
  return <>{text}</>;
}

export default function ManufacturingContent() {
  const { data: manufacturingData } = useManufacturingData();
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
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-10 md:mb-14">
            <div className="lg:col-span-8 space-y-8">
              <div id="where">
                <div className="subsection-title">
                  <a href="#where">Where we are</a> located?
                </div>
                <p className="quality-pg-info-text">
                  {manufacturingData.whereWeAre.description}
                </p>
              </div>
              <div id="fact" className="contentarea">
                <div className="subsection-title">
                  <a href="#fact">Facilities</a>
                </div>
                <ul>
                  {manufacturingData.facilities.items.map((item, index) => (
                    <li key={index}>
                      <span>
                        <FacilityItem text={item} index={index} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="kur-img-mar">
                <img
                  src={manufacturingData.images.manuImg}
                  alt="Manufacturing"
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-8 contentarea">
              <div id="ware">
                <div className="subsection-title">
                  <a href="#ware">Warehousing</a>
                </div>
                <OriginalBulletList items={manufacturingData.warehousing.items} />
              </div>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="kur-img-mar">
                <img
                  src={manufacturingData.images.warehouseImg}
                  alt="Warehouse"
                  className="w-full h-auto block mb-4"
                  loading="lazy"
                />
                <img
                  src={manufacturingData.images.mipl4Img}
                  alt="Warehouse Inner"
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
