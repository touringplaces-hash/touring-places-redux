import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";

const destinations = [
  { slug: "south-africa", name: "South Africa", flag: "🇿🇦", tours: 10, image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600" },
  { slug: "kenya", name: "Kenya", flag: "🇰🇪", tours: 10, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600" },
  { slug: "ghana", name: "Ghana", flag: "🇬🇭", tours: 10, image: "https://images.unsplash.com/photo-1590845947698-8924d7409b56?w=600" },
  { slug: "tanzania", name: "Tanzania", flag: "🇹🇿", tours: 10, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600" },
  { slug: "botswana", name: "Botswana", flag: "🇧🇼", tours: 10, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600" },
  { slug: "united-kingdom", name: "United Kingdom", flag: "🇬🇧", tours: 10, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600" },
  { slug: "uae", name: "UAE", flag: "🇦🇪", tours: 10, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600" },
  { slug: "japan", name: "Japan", flag: "🇯🇵", tours: 10, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600" },
  { slug: "china", name: "China", flag: "🇨🇳", tours: 10, image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600" },
  { slug: "brazil", name: "Brazil", flag: "🇧🇷", tours: 10, image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600" },
];

export const AllDestinationsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedDestinations = showAll ? destinations : destinations.slice(0, 8);

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12 animate-fade-up">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Worldwide Adventures
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            All <span className="text-primary">Destinations</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Discover curated tours across 10 incredible countries. Each destination offers unique experiences,
            handpicked by our travel experts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedDestinations.map((dest, index) => (
            <Link
              key={dest.slug}
              to={`/destinations/${dest.slug}`}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{dest.flag}</span>
                  <h3 className="font-display text-2xl font-bold text-card group-hover:text-primary transition-colors">
                    {dest.name}
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-card/80 text-sm">{dest.tours} curated tours</span>
                  <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!showAll && destinations.length > 8 && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(true)}
              className="gap-2"
            >
              View More Destinations
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}

        {showAll && (
          <div className="text-center mt-8">
            <Link to="/destinations">
              <Button variant="hero" size="lg" className="gap-2">
                View All Destinations
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
