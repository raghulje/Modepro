interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbBar({ items }: BreadcrumbBarProps) {
  return (
    <div className="breadcrumb-bar">
      <div className="container-site">
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          {items.map((item, index) => (
            <span key={item.label} className="flex items-center">
              {index > 0 && <span className="breadcrumb-separator">/</span>}
              {index === items.length - 1 ? (
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
