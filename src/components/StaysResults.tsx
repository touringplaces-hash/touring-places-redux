import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Wifi, Car, Coffee, Waves, X, ExternalLink } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Stay {
  id: string;
  name: string;
  location: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
  type: string;
  deepLink?: string;
}

interface StaysResultsProps {
  stays: Stay[];
  isLoading: boolean;
  onClear: () => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  "Pool": <Waves className="w-4 h-4" />,
  "Wifi": <Wifi className="w-4 h-4" />,
  "Parking": <Car className="w-4 h-4" />,
  "Restaurant": <Coffee className="w-4 h-4" />,
};

export const StaysResults = ({ stays, isLoading, onClear }: StaysResultsProps) => {
  const { formatPrice } = useCurrency();

  if (stays.length === 0 && !isLoading) return null;

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Available <span className="text-primary">Stays</span>
            </h2>
            <p className="text-muted-foreground mt-1">
              {stays.length} accommodations found
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="w-4 h-4 mr-2" />
            Clear Results
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl overflow-hidden">
                <div className="h-48 bg-muted" />
                <div className="p-5">
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-8 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stays.map((stay) => (
              <div 
                key={stay.id} 
                className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={stay.image} 
                    alt={stay.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {stay.type}
                  </div>
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">
                    {formatPrice(stay.price)}/night
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {stay.name}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    {stay.location}
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{stay.rating}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">({stay.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    {stay.amenities.slice(0, 4).map((amenity, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-1 text-sm text-muted-foreground"
                        title={amenity}
                      >
                        {amenityIcons[amenity] || <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        <span className="hidden sm:inline">{amenity}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full" 
                    variant="hero"
                    onClick={() => {
                      if (stay.deepLink) {
                        window.open(stay.deepLink, "_blank");
                      }
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
