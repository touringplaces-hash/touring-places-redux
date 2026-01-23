import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SouthAfricaSection } from "@/components/SouthAfricaSection";
import { DestinationsSection } from "@/components/DestinationsSection";
import { ShuttleSection } from "@/components/ShuttleSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { GoogleMapSection } from "@/components/GoogleMapSection";
import { FlightResults } from "@/components/FlightResults";
import { Footer } from "@/components/Footer";

interface FlightResult {
  id: string;
  cityFrom: string;
  cityTo: string;
  price: number;
  currency: string;
  departureTime: number;
  arrivalTime: number;
  airlines: string[];
  stops: number;
  deepLink: string;
  duration: {
    total: number;
    departure: number;
  };
}

const Index = () => {
  const [flightResults, setFlightResults] = useState<FlightResult[]>([]);
  const [isSearchingFlights, setIsSearchingFlights] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection 
          onFlightResults={setFlightResults} 
          onSearching={setIsSearchingFlights}
        />
        {flightResults.length > 0 && (
          <FlightResults 
            flights={flightResults} 
            isLoading={isSearchingFlights}
            onClear={() => setFlightResults([])}
          />
        )}
        <SouthAfricaSection />
        <DestinationsSection />
        <ShuttleSection />
        <TestimonialsSection />
        <FeaturesSection />
        <GoogleMapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
