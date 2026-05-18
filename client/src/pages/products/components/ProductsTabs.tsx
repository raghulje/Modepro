import { Fragment, useEffect, useRef, useState } from "react";
import { useProductsData } from "@/hooks/cms/useProductsData";
import { productsData as mockProductsData } from "@/mocks/productsData";

type ProductGroups = (typeof mockProductsData.tabs)[number]["groups"];

function formatCasNo(casNo: string) {
  return `[CAS NO. ${casNo} ]`;
}

function ProductTable({
  groups,
}: {
  groups: ProductGroups;
}) {
  let productRowIndex = 0;

  return (
    <table className="products-table table table-bordered table-striped">
      <thead>
        <tr>
          <th className="w-[20%]">Structure</th>
          <th className="w-[45%]">Name</th>
          <th className="w-[20%]">Cas No.</th>
        </tr>
      </thead>
      <tbody>
        {groups.map((group) => (
          <Fragment key={group.name}>
            <tr className="title-bg-color">
              <td colSpan={3}>{group.name}</td>
            </tr>
            {group.products.map((product, idx) => {
              productRowIndex += 1;
              const rowClass =
                productRowIndex % 2 === 1 ? "name-str-cas1" : "name-str-cas2";
              return (
                <tr key={`${group.name}-${idx}`} className={rowClass}>
                  <td data-label="Structure">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-gray-500 italic text-sm">
                        Structure not available
                      </span>
                    )}
                  </td>
                  <td data-label="Name">{product.name}</td>
                  <td data-label="Cas No.">
                    {product.casNo ? formatCasNo(product.casNo) : "—"}
                  </td>
                </tr>
              );
            })}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default function ProductsTabs() {
  const { data: productsData } = useProductsData();
  const [activeTab, setActiveTab] = useState("intermediates");
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
    <section ref={sectionRef} className="bg-white pb-10">
      <div className="container-site">
        <div
          className={`transition-all duration-700 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="tab_wrapper first_tab clearfix">
            <ul className="tab_list" role="tablist">
              {productsData.tabs.map((tab) => (
                <li
                  key={tab.id}
                  className={activeTab === tab.id ? "active" : undefined}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveTab(tab.id);
                    }
                  }}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  tabIndex={0}
                >
                  <b>{tab.label}</b>
                </li>
              ))}
            </ul>

            <div className="content_wrapper">
              {productsData.tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`tab_content${
                    activeTab === tab.id ? " active" : ""
                  }`}
                  role="tabpanel"
                  hidden={activeTab !== tab.id}
                >
                  <div className="hidden md:block overflow-x-auto">
                    <ProductTable groups={tab.groups} />
                  </div>

                  <div className="md:hidden p-3 space-y-4">
                    {tab.groups.map((group) => (
                      <div key={group.name}>
                        <h3 className="title-bg-color px-3 py-2 text-base">
                          {group.name}
                        </h3>
                        <div className="space-y-2 mt-2">
                          {group.products.map((product, idx) => (
                            <div
                              key={idx}
                              className={`border border-gray-300 p-3 ${
                                idx % 2 === 0
                                  ? "name-str-cas1"
                                  : "name-str-cas2"
                              }`}
                            >
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-20 w-auto object-contain mx-auto mb-2"
                                  loading="lazy"
                                />
                              )}
                              <p className="text-sm text-black mb-1">
                                {product.name}
                              </p>
                              {product.casNo && (
                                <p className="text-sm text-black">
                                  {formatCasNo(product.casNo)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
