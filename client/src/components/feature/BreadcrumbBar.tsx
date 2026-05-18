import { normalizeBreadcrumbs, type BreadcrumbItem } from "@/utils/breadcrumbs";

interface BreadcrumbBarProps {
  items?: BreadcrumbItem[] | null | unknown;
}

export default function BreadcrumbBar({ items = [] }: BreadcrumbBarProps) {
  const crumbs = normalizeBreadcrumbs(items);
  if (!crumbs.length) return null;

  return (
    <div className="breadcrumb-bar">
      <div className="container-site">
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          {crumbs.map((item, index) => (
            <span key={`${item.label}-${index}`} className="flex items-center">
              {index > 0 && <span className="breadcrumb-separator">/</span>}
              {index === crumbs.length - 1 ? (
                <span className="breadcrumb-active">{item.label}</span>
              ) : (
                <a href={item.href} className="breadcrumb-link">
                  {item.label}
                </a>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
