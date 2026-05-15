import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import EhsHero from "./components/EhsHero";
import EhsContent from "./components/EhsContent";

export default function Ehs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <EhsHero />
        <EhsContent />
      </main>
      <Footer />
    </div>
  );
}