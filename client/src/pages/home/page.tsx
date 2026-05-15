import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import HeroCarousel from "./components/HeroCarousel";
import WelcomeSection from "./components/WelcomeSection";
import FeatureCards from "./components/FeatureCards";
import { usePageTitle } from "@/hooks/usePageTitle";
import { pageTitles } from "@/mocks/pageTitles";

export default function Home() {
  usePageTitle(pageTitles.home);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />
        <WelcomeSection />
        <FeatureCards />
      </main>
      <Footer />
    </div>
  );
}