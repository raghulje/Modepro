import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import ProductsHero from "./components/ProductsHero";
import ProductsIntro from "./components/ProductsIntro";
import ProductsTabs from "./components/ProductsTabs";

export default function Products() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ProductsHero />
        <ProductsIntro />
        <ProductsTabs />
      </main>
      <Footer />
    </div>
  );
}