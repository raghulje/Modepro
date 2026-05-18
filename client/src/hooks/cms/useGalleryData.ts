import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { mergeWithMock } from "@/utils/breadcrumbs";
import { galleryData as mockGalleryData } from "@/mocks/galleryData";

export function useGalleryData() {
  const [data, setData] = useState(mockGalleryData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<typeof mockGalleryData>("/gallery");
        if (!cancelled && res.success && res.data) {
          setData(mergeWithMock(mockGalleryData, res.data));
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
