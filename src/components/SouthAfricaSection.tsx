import safariImage from "@/assets/destination-safari.jpg";
import winelandsImage from "@/assets/destination-winelands.jpg";
import { DestinationCard } from "./DestinationCard";

const southAfricaDestinations = [
  {
    image: safariImage,
    title: "Kruger National Park Safari",
    location: "Mpumalanga, South Africa",
    price: 4500,
    rating: 4.9,
    badge: "Popular",
    badgeType: "popular" as const,
  },
  {
    image: winelandsImage,
    title: "Franschhoek Wine Tour",
    location: "Cape Town, South Africa",
    price: 1240,
    rating: 4.8,
    badge: "5% Off",
    badgeType: "discount" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800",
    title: "Table Mountain Adventure",
    location: "Cape Town, South Africa",
    price: 890,
    rating: 4.9,
    badge: "Must See",
    badgeType: "special" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
    title: "Johannesburg City Tour",
    location: "Johannesburg, South Africa",
    price: 750,
    rating: 4.7,
    badge: "New",
    badgeType: "popular" as const,
  },
];

export const SouthAfricaSection = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {southAfricaDestinations.map((destination, index) => (
            <div
              key={destination.title}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <DestinationCard {...destination} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
