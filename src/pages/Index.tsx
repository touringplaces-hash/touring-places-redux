import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DestinationsSection } from "@/components/DestinationsSection";
import { ShuttleSection } from "@/components/ShuttleSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DestinationsSection />
        <ShuttleSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
