import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import QualityHero from "./components/QualityHero";
import QualityContent from "./components/QualityContent";

export default function Quality() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <QualityHero />
        <QualityContent />
      </main>
      <Footer />
    </div>
  );
}