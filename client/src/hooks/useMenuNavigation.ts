import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useMenuNavigation(onNavigate?: () => void) {
  const navigate = useNavigate();

  return useCallback(
    (href: string) => {
      onNavigate?.();

      if (!href || href === "#") return;

      const [pathPart, hashPart] = href.split("#");
      const path = pathPart || "/";
      const hash = hashPart ? `#${hashPart}` : "";

      navigate(`${path}${hash}`);

      if (!hash) {
        window.scrollTo(0, 0);
      }
    },
    [navigate, onNavigate]
  );
}
