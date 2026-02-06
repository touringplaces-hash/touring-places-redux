import heroCapeTown from "@/assets/hero-cape-town.jpg";
import heroSafari from "@/assets/hero-safari.jpg";
import heroHotel from "@/assets/hero-hotel.jpg";
import heroAirport from "@/assets/hero-airport.jpg";
import { SearchForm } from "./SearchForm";

export type TripType = "tours" | "stays" | "flights" | "shuttles";

interface FlightResult {
  id: string;
  cityFrom: string;
  cityTo: string;
  price: number;
  currency: string;
  departureTime: number | null;
  arrivalTime: number | null;
  localDeparture: string | null;
  localArrival: string | null;
  airlines: string[];
  stops: number;
  deepLink: string;
  duration: {
    total: number;
    departure: number;
  };
}

interface HeroSectionProps {
  onFlightResults?: (flights: FlightResult[]) => void;
  onSearching?: (searching: boolean) => void;
  tripType?: TripType;
  onTripTypeChange?: (tripType: TripType) => void;
}

const heroImages: Record<TripType, string> = {
  tours: heroSafari,
  stays: heroHotel,
  flights: heroAirport,
  shuttles: heroCapeTown,
};

const heroTitles: Record<TripType, { main: string; highlight: string }> = {
  tours: { main: "Explore Africa with", highlight: "Tours" },
  stays: { main: "Find Your Perfect", highlight: "Stay" },
  flights: { main: "Book Your Next", highlight: "Flight" },
  shuttles: { main: "Travel with", highlight: "Us" },
};

const heroDescriptions: Record<TripType, string> = {
  tours: "Experience the thrill and excitement of touring Africa with our specially curated tours. See nature from a whole new perspective!",
  stays: "Discover exceptional accommodations across Africa. From luxury hotels to boutique lodges, find your perfect stay.",
  flights: "Search and compare flights to destinations across Africa and beyond. Find the best deals for your next adventure.",
  shuttles: "Reliable airport transfers and shuttle services in Cape Town, Durban, and Johannesburg.",
};

export const HeroSection = ({ 
  onFlightResults, 
  onSearching, 
  tripType = "tours",
  onTripTypeChange 
}: HeroSectionProps) => {
  const currentImage = heroImages[tripType];
  const currentTitle = heroTitles[tripType];
  const currentDescription = heroDescriptions[tripType];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20">
      {/* Background Image with transition */}
      <div className="absolute inset-0 z-0">
        {Object.entries(heroImages).map(([type, image]) => (
          <img
            key={type}
            src={image}
            alt={`Hero background for ${type}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              tripType === type ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-card mb-4 leading-tight">
            {currentTitle.main} <span className="text-primary">{currentTitle.highlight}</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-card/90 max-w-2xl mx-auto">
            {currentDescription}
          </p>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <SearchForm 
            onFlightResults={onFlightResults}
            onSearching={onSearching}
            tripType={tripType}
            onTripTypeChange={onTripTypeChange}
          />
        </div>
      </div>
    </section>
  );
};
