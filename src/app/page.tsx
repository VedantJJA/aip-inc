import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ServicesPreview from "@/components/landing/ServicesPreview";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import CTASection from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesPreview />
        <WhyChooseUs />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
