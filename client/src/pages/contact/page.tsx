import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import ContactHero from "./components/ContactHero";
import ContactForm from "./components/ContactForm";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ContactHero />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
