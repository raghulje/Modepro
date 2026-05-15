import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import CareersHero from "./components/CareersHero";
import CareersContent from "./components/CareersContent";

export default function Careers() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CareersHero />
        <CareersContent />
      </main>
      <Footer />
    </div>
  );
}