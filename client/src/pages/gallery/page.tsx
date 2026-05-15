import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import GalleryHero from "./components/GalleryHero";
import GalleryGrid from "./components/GalleryGrid";

export default function Gallery() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <GalleryHero />
        <GalleryGrid />
      </main>
      <Footer />
    </div>
  );
}