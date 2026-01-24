import { useState } from "react";
import safariImage from "@/assets/destination-safari.jpg";
import winelandsImage from "@/assets/destination-winelands.jpg";
import { TourCard } from "./TourCard";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

// Cape Town Tours (prices + R250 markup)
const capeTownTours = [
  // Full Day Tours
  {
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800",
    title: "Table Mountain & City Full Day",
    location: "Cape Town, South Africa",
    price: 1450, // Base ~1200 + 250
    rating: 4.9,
    badge: "Full Day",
    badgeType: "popular" as const,
    duration: "8 hours",
    description: "Experience the iconic Table Mountain with cable car ride, followed by a comprehensive city tour including Bo-Kaap, V&A Waterfront, and Company's Garden. Includes hotel pickup and drop-off.",
  },
  {
    image: winelandsImage,
    title: "Cape Winelands Full Day Tour",
    location: "Stellenbosch & Franschhoek",
    price: 1650, // Base ~1400 + 250
    rating: 4.8,
    badge: "Best Seller",
    badgeType: "popular" as const,
    duration: "9 hours",
    description: "Visit world-renowned wine estates in Stellenbosch and Franschhoek. Includes wine tastings at 3 estates, cheese pairing, and gourmet lunch. Travel through picturesque mountain passes.",
  },
  {
    image: "https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?w=800",
    title: "Cape Peninsula Full Day Tour",
    location: "Cape Point & Boulders Beach",
    price: 1550, // Base ~1300 + 250
    rating: 4.9,
    badge: "Must See",
    badgeType: "special" as const,
    duration: "10 hours",
    description: "Journey along Chapman's Peak Drive to Cape Point Nature Reserve. Visit the penguin colony at Boulders Beach and charming Simon's Town. Lunch at a seaside restaurant included.",
  },
  // Half Day Tours
  {
    image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800",
    title: "Table Mountain Half Day",
    location: "Cape Town, South Africa",
    price: 850, // Base ~600 + 250
    rating: 4.8,
    badge: "Half Day",
    badgeType: "discount" as const,
    duration: "4 hours",
    description: "Cable car ride to the top of Table Mountain with guided walk. Enjoy panoramic views of the city, ocean, and surrounding mountains. Morning or afternoon departures available.",
  },
  {
    image: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=800",
    title: "Bo-Kaap & City Half Day",
    location: "Cape Town City Bowl",
    price: 750, // Base ~500 + 250
    rating: 4.7,
    badge: "Half Day",
    badgeType: "discount" as const,
    duration: "4 hours",
    description: "Explore the colorful Bo-Kaap neighborhood, visit District Six Museum, and walk through historic Company's Garden. Includes traditional Cape Malay cooking demonstration.",
  },
  {
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
    title: "Constantia Wine Route Half Day",
    location: "Constantia Valley",
    price: 950, // Base ~700 + 250
    rating: 4.8,
    badge: "Half Day",
    badgeType: "discount" as const,
    duration: "5 hours",
    description: "Visit South Africa's oldest wine-producing region. Tour 2-3 historic wine estates with tastings. Perfect introduction to Cape wines without a full day commitment.",
  },
];

// Johannesburg Tours (prices + R250 markup)
const johannesburgTours = [
  // Full Day Tours
  {
    image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800",
    title: "Soweto & Apartheid Museum Full Day",
    location: "Johannesburg, South Africa",
    price: 1350, // Base ~1100 + 250
    rating: 4.9,
    badge: "Full Day",
    badgeType: "popular" as const,
    duration: "8 hours",
    description: "Comprehensive tour of Soweto including Vilakazi Street (homes of Mandela & Tutu), Hector Pieterson Museum, and the powerful Apartheid Museum. Lunch at local shebeen included.",
  },
  {
    image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800",
    title: "Cradle of Humankind Full Day",
    location: "Maropeng, Gauteng",
    price: 1450, // Base ~1200 + 250
    rating: 4.8,
    badge: "UNESCO Site",
    badgeType: "special" as const,
    duration: "7 hours",
    description: "Explore the UNESCO World Heritage Site where our ancestors walked. Visit Sterkfontein Caves, Maropeng Visitor Centre, and learn about human evolution. Lunch included.",
  },
  {
    image: safariImage,
    title: "Lion & Safari Park Full Day",
    location: "Hartbeespoort, Gauteng",
    price: 1550, // Base ~1300 + 250
    rating: 4.7,
    badge: "Wildlife",
    badgeType: "popular" as const,
    duration: "8 hours",
    description: "Get up close with lions, cheetahs, and other African wildlife. Self-drive safari experience with guided walking tours. Opportunity to interact with lion cubs (seasonal).",
  },
  // Half Day Tours
  {
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800",
    title: "Johannesburg City Half Day",
    location: "Johannesburg CBD",
    price: 750, // Base ~500 + 250
    rating: 4.6,
    badge: "Half Day",
    badgeType: "discount" as const,
    duration: "4 hours",
    description: "Discover the vibrant heart of Jozi. Visit Constitution Hill, Maboneng Precinct, and Arts on Main. See the city's transformation from mining town to modern metropolis.",
  },
  {
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    title: "Soweto Half Day Tour",
    location: "Soweto, Johannesburg",
    price: 850, // Base ~600 + 250
    rating: 4.8,
    badge: "Half Day",
    badgeType: "discount" as const,
    duration: "5 hours",
    description: "Essential Soweto highlights including Vilakazi Street, Regina Mundi Church, and Orlando Towers. Experience the township's vibrant culture and rich history.",
  },
  {
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    title: "Gold Reef City Half Day",
    location: "Johannesburg South",
    price: 950, // Base ~700 + 250
    rating: 4.5,
    badge: "Half Day",
    badgeType: "discount" as const,
    duration: "5 hours",
    description: "Journey into a real gold mine 75m underground. Learn about Johannesburg's gold rush history at this unique theme park. Mining demonstration and gold pouring included.",
  },
];

export const SouthAfricaSection = () => {
  const [showAllCapeTown, setShowAllCapeTown] = useState(false);
  const [showAllJohannesburg, setShowAllJohannesburg] = useState(false);

  const visibleCapeTownTours = showAllCapeTown ? capeTownTours : capeTownTours.slice(0, 3);
  const visibleJohannesburgTours = showAllJohannesburg ? johannesburgTours : johannesburgTours.slice(0, 3);

  return (
    <section id="tours" className="py-20 bg-secondary">
      <div className="container">
        <div className="text-center mb-12 animate-fade-up">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Explore South Africa
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            South African Adventures
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Discover the breathtaking beauty of South Africa. From scenic wine routes to thrilling safaris, 
            experience authentic African adventures with our expertly curated tours.
          </p>
        </div>

        {/* Cape Town Tours */}
        <div className="mb-16">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            Cape Town Tours
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCapeTownTours.map((tour, index) => (
              <div
                key={tour.title}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TourCard {...tour} />
              </div>
            ))}
          </div>

          {capeTownTours.length > 3 && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAllCapeTown(!showAllCapeTown)}
                className="gap-2"
              >
                {showAllCapeTown ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    View More ({capeTownTours.length - 3} more tours) <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Johannesburg Tours */}
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            Johannesburg Tours
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleJohannesburgTours.map((tour, index) => (
              <div
                key={tour.title}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TourCard {...tour} />
              </div>
            ))}
          </div>

          {johannesburgTours.length > 3 && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAllJohannesburg(!showAllJohannesburg)}
                className="gap-2"
              >
                {showAllJohannesburg ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    View More ({johannesburgTours.length - 3} more tours) <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
