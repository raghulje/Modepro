import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const content = `import { homeData } from "@/mocks/homeData";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const { footer } = homeData;

  return (
    <footer className="footer-main relative">
      <TAG className="container-site">
        <TAG className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          <TAG className="footer-col">
            <TAG className="footer-heading">NAVIGATION</TAG>
            <ul className="footer-nav-list">
              {footer.navigation.map((item) => (
                <li key={item.label} className="footer-nav-item">
                  <a href={item.href} className="footer-nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </TAG>

          <TAG className="footer-col">
            <TAG className="footer-heading">{footer.officeAddress.title}</TAG>
            <p className="footer-address">{footer.officeAddress.text}</p>
          </TAG>

          <TAG className="footer-col">
            <TAG className="footer-heading">{footer.factoryAddress.title}</TAG>
            <p className="footer-address">{footer.factoryAddress.text}</p>
          </TAG>

          <TAG className="footer-col">
            <TAG className="footer-heading">{footer.careers.title}</TAG>
            <p className="footer-address footer-careers-text">
              {footer.careers.description}
            </p>
            <a href={footer.careers.ctaHref} className="btn-current">
              {footer.careers.ctaText}
            </a>
          </TAG>
        </TAG>

        <TAG className="footer-bottom">
          <TAG className="footer-bottom-inner">
            <p className="copy-text">{footer.copyright}</p>
            <TAG className="footer-managed">
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
            </TAG>
          </TAG>

          <button
            type="button"
            onClick={scrollToTop}
            className="footer-scroll-top"
            aria-label="Scroll to top"
            title="Scroll to top"
          />
        </TAG>
      </TAG>
    </footer>
  );
}
`.replaceAll("TAG", "motionless-top-bar").replaceAll("motionless-top-bar", "div");

writeFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../src/components/feature/Footer.tsx"),
  content,
  "utf8"
);
