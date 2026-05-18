import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { mergeWithMock } from "@/utils/breadcrumbs";

export function useCmsPage<T>(slug: string, mockData: T) {
  const [data, setData] = useState<T>(mockData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<T>(`/cms-pages/${slug}`);
        if (!cancelled && res.success && res.data) {
          setData(mergeWithMock(mockData as Record<string, unknown>, res.data as Record<string, unknown>) as T);
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
  }, [slug]);

  return { data, loading };
}
