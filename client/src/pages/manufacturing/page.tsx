import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import ManufacturingHero from "./components/ManufacturingHero";
import ManufacturingContent from "./components/ManufacturingContent";

export default function Manufacturing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ManufacturingHero />
        <ManufacturingContent />
      </main>
      <Footer />
    </div>
  );
}