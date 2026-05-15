import { writeFileSync } from "fs";

const content = `export default function Navbar() {
  return (
    <div className="top-bar">
      <div className="top-bar-inner flex items-center justify-end gap-5">
        <a href="/about" className="top-bar-link">
          Modepro
        </a>
        <a href="/products" className="top-bar-link">
          Products
        </a>
        <a href="/contact" className="top-bar-link">
          Contact Us
        </a>
      </div>
    </div>
  );
}
`;

writeFileSync(
  new URL("../src/components/feature/Navbar.tsx", import.meta.url),
  content,
  "utf8"
);
