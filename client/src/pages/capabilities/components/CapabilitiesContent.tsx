import { useEffect, useRef, useState } from "react";
import { useCapabilitiesData } from "@/hooks/cms/pages";

export default function CapabilitiesContent() {
  const { data: capabilitiesData } = useCapabilitiesData();
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

  const { headers, rows } = capabilitiesData.table;

  return (
    <section ref={sectionRef} className="py-6 md:py-10 bg-white">
      <div className="container-site">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table table-bordered">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="cap-table-title-text px-2 py-[7px] text-left border border-[#4e95f4]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const cellClass =
                    index % 2 === 0 ? "cap-table-info-text1" : "cap-table-info-text2";
                  return (
                    <tr key={index}>
                      <td className={`${cellClass} border border-[#4e95f4]`}>{row.named}</td>
                      <td className={`${cellClass} border border-[#4e95f4]`}>{row.types}</td>
                      <td className={`${cellClass} border border-[#4e95f4]`}>{row.reagents}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}