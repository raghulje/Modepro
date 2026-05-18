import { useEffect, useState } from "react";
import { useSiteData } from "@/contexts/SiteDataContext";
import { images } from "@/lib/assets";
import { useMenuNavigation } from "@/hooks/useMenuNavigation";

const MENU_STORAGE_KEY = "navgoco-open-sections";

function loadOpenSections(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function saveOpenSections(state: Record<string, boolean>) {
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

interface PageHeaderProps {
  className?: string;
}

export default function PageHeader({ className = "" }: PageHeaderProps) {
  const { data: homeData } = useSiteData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    () => loadOpenSections()
  );

  const closeMenu = () => setMenuOpen(false);
  const handleNav = useMenuNavigation(closeMenu);

  const toggleItem = (label: string) => {
    setExpandedItems((prev) => {
      const next = { ...prev, [label]: !prev[label] };
      saveOpenSections(next);
      return next;
    });
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("nav-expanded");
    } else {
      document.body.classList.remove("nav-expanded");
    }
    return () => document.body.classList.remove("nav-expanded");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <div className={className}>
        <div className="container-site py-2.5 flex items-center justify-between">
          <a href="/" className="flex-shrink-0 block p-2.5">
            <img
              src={images.logo}
              alt="Modepro India Pvt. Ltd"
              className="w-full max-w-logo-header h-auto object-contain"
            />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="menu-trigger nav-expander"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className="menu-trigger-label">Menu</span>
            <span className="menu-toggle" aria-hidden="true">
              <span className="menu-toggle-bar" />
              <span className="menu-toggle-bar" />
              <span className="menu-toggle-bar" />
            </span>
          </button>
        </div>
      </div>

      <nav
        className={`main-menu-panel ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="menu-close-bg flex items-center justify-end px-4 py-3">
          <button
            type="button"
            onClick={closeMenu}
            className="menu-close-btn"
            id="nav-close"
          >
            <span className="menu-close-label">Close Menu</span>
            <span className="menu-close-x" aria-hidden="true">
              ×
            </span>
          </button>
        </div>

        <ul className="main-menu list-none p-0 m-0">
          {homeData.navLinks.map((link) => {
            const hasChildren = Boolean(link.children?.length);
            const isOpen = !!expandedItems[link.label];

            return (
              <li
                key={link.label}
                className={`menu-item list-none ${isOpen ? "open" : ""}`}
              >
                <a
                  href={link.href}
                  className="menu-link block"
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasChildren) {
                      toggleItem(link.label);
                    } else {
                      handleNav(link.href);
                    }
                  }}
                >
                  {link.label}
                  {hasChildren ? <span className="caret" aria-hidden="true" /> : null}
                </a>

                {hasChildren ? (
                  <ul
                    className={`main-menu-sub list-none p-0 m-0 ${
                      isOpen ? "is-open" : ""
                    }`}
                  >
                    {link.children!.map((child) => (
                      <li key={child.label} className="sub-nav">
                        <a
                          href={child.href}
                          className="menu-sublink block py-1"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNav(child.href);
                          }}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
