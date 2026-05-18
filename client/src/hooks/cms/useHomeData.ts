import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { homeData as mockHomeData } from "@/mocks/homeData";

export function useHomeData() {
  const [data, setData] = useState(mockHomeData);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [homeRes, navRes, footerRes] = await Promise.all([
          api.get<{
            company: typeof mockHomeData.company;
            heroSlides: typeof mockHomeData.heroSlides;
            welcome: typeof mockHomeData.welcome;
            features: typeof mockHomeData.features;
          }>("/home"),
          api.get<typeof mockHomeData.navLinks>("/nav-links"),
          api.get<typeof mockHomeData.footer>("/footer"),
        ]);

        if (cancelled) return;

        if (homeRes.success && homeRes.data) {
          setData({
            company: homeRes.data.company,
            navLinks: navRes.success && navRes.data ? navRes.data : mockHomeData.navLinks,
            heroSlides: homeRes.data.heroSlides,
            welcome: homeRes.data.welcome || mockHomeData.welcome,
            features: homeRes.data.features,
            footer: footerRes.success && footerRes.data ? footerRes.data : mockHomeData.footer,
          });
          setFromApi(true);
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

  return { data, loading, fromApi };
}
