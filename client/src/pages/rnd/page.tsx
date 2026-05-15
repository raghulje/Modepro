import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import RndHero from "./components/RndHero";
import RndContent from "./components/RndContent";

export default function Rnd() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <RndHero />
        <RndContent />
      </main>
      <Footer />
    </div>
  );
}