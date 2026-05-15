import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import AboutHero from "./components/AboutHero";
import WhoWeAre from "./components/WhoWeAre";
import OurPeople from "./components/OurPeople";
import ManufacturingLocation from "./components/ManufacturingLocation";
import InfoCards from "./components/InfoCards";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <WhoWeAre />
        <OurPeople />
        <ManufacturingLocation />
        <InfoCards />
      </main>
      <Footer />
    </div>
  );
}