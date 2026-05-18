import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { mergeWithMock } from "@/utils/breadcrumbs";
import { aboutData as mockAboutData } from "@/mocks/aboutData";

export function useAboutData() {
  const [data, setData] = useState(mockAboutData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<typeof mockAboutData>("/about");
        if (!cancelled && res.success && res.data) {
          setData(mergeWithMock(mockAboutData, res.data));
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
