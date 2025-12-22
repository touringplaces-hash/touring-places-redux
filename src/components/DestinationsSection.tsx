import safariImage from "@/assets/destination-safari.jpg";
import winelandsImage from "@/assets/destination-winelands.jpg";
import ghanaImage from "@/assets/destination-ghana.jpg";
import kenyaImage from "@/assets/destination-kenya.jpg";
import { DestinationCard } from "./DestinationCard";

const destinations = [
  {
    image: safariImage,
    title: "Kruger National Park Safari",
    location: "South Africa",
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
    image: ghanaImage,
    title: "Ghana: The Cape Adventure",
    location: "Accra, Ghana",
    price: 7400,
    rating: 4.7,
    badge: "World Famous",
    badgeType: "special" as const,
  },
  {
    image: kenyaImage,
    title: "Kenya: Masai Mara Safari",
    location: "Masai Mara, Kenya",
    price: 5950,
    rating: 4.9,
    badge: "Special Tour",
    badgeType: "special" as const,
  },
];

export const DestinationsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12 animate-fade-up">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Explore Africa
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Popular Destinations
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            These alluring destinations are picked just for you. Experience the beauty of Africa
            with our carefully curated tour packages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
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
