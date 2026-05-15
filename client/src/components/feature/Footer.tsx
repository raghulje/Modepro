import { homeData } from "@/mocks/homeData";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const { footer } = homeData;

  return (
    <footer className="footer-main relative">
      <div className="container-site">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          <div className="footer-col">
            <div className="footer-heading">NAVIGATION</div>
            <ul className="footer-nav-list">
              {footer.navigation.map((item) => (
                <li key={item.label} className="footer-nav-item">
                  <a href={item.href} className="footer-nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <div className="footer-heading">{footer.officeAddress.title}</div>
            <p className="footer-address">{footer.officeAddress.text}</p>
          </div>

          <div className="footer-col">
            <div className="footer-heading">{footer.factoryAddress.title}</div>
            <p className="footer-address">{footer.factoryAddress.text}</p>
          </div>

          <div className="footer-col">
            <div className="footer-heading">{footer.careers.title}</div>
            <p className="footer-address footer-careers-text">
              {footer.careers.description}
            </p>
            <a href={footer.careers.ctaHref} className="btn-current">
              {footer.careers.ctaText}
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p className="copy-text">{footer.copyright}</p>
            <div className="footer-managed">
              <p className="footer-managed-label">{footer.managedBy.text}</p>
              <a
                href={footer.managedBy.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-managed-logo"
              >
                <img
                  src={footer.managedBy.logo}
                  alt="Effervescent Communications"
                />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="footer-scroll-top"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <svg
              className="footer-scroll-top-icon"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7 2.5L7 11.5M7 2.5L3.5 6M7 2.5L10.5 6"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
