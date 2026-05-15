import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import CapabilitiesHero from "./components/CapabilitiesHero";
import CapabilitiesContent from "./components/CapabilitiesContent";

export default function Capabilities() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CapabilitiesHero />
        <CapabilitiesContent />
      </main>
      <Footer />
    </div>
  );
}