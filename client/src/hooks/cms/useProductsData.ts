import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { mergeWithMock } from "@/utils/breadcrumbs";
import { productsData as mockProductsData } from "@/mocks/productsData";

export function useProductsData() {
  const [data, setData] = useState(mockProductsData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{
          banner: typeof mockProductsData.banner;
          pageTitle: string;
          intro: typeof mockProductsData.intro;
          tabs: typeof mockProductsData.tabs;
        }>("/products");
        if (!cancelled && res.success && res.data) {
          setData(mergeWithMock(mockProductsData, res.data));
        }
      } catch {
        // keep mocks
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}
