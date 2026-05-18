import { createContext, useContext, type ReactNode } from "react";
import { useHomeData } from "@/hooks/cms/useHomeData";
import type { homeData } from "@/mocks/homeData";

type HomeDataType = typeof homeData;

const SiteDataContext = createContext<{
  data: HomeDataType;
  loading: boolean;
} | null>(null);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const { data, loading } = useHomeData();
  return (
    <SiteDataContext.Provider value={{ data, loading }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return ctx;
}
