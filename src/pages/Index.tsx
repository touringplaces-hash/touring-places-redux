import { useState } from "react";
import { Header, TripType } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ShuttleSection } from "@/components/ShuttleSection";
import { SouthAfricaSection } from "@/components/SouthAfricaSection";
import { DestinationsSection } from "@/components/DestinationsSection";
import { AllDestinationsSection } from "@/components/AllDestinationsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
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
  const [tripType, setTripType] = useState<TripType>("tours");

  return (
    <div className="min-h-screen bg-background">
      <Header onTripTypeChange={setTripType} activeTripType={tripType} />
      <main>
        <HeroSection 
          onFlightResults={setFlightResults} 
          onSearching={setIsSearchingFlights}
          tripType={tripType}
          onTripTypeChange={setTripType}
        />
        {flightResults.length > 0 && (
          <FlightResults 
            flights={flightResults} 
            isLoading={isSearchingFlights}
            onClear={() => setFlightResults([])}
          />
        )}
        <ShuttleSection />
        <SouthAfricaSection />
        <DestinationsSection />
        <AllDestinationsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <GoogleMapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
