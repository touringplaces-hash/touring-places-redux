import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { BookingModal } from "./BookingModal";
import { useCurrency } from "@/contexts/CurrencyContext";

interface DestinationCardProps {
  image: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  badge?: string;
  badgeType?: "popular" | "special" | "discount";
}

export const DestinationCard = ({
  image,
  title,
  location,
  price,
  rating,
  badge,
  badgeType = "popular",
}: DestinationCardProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { formatPrice } = useCurrency();

  const badgeStyles = {
    popular: "bg-primary text-primary-foreground",
    special: "bg-charcoal text-card",
    discount: "bg-destructive text-destructive-foreground",
  };

  return (
    <>
      <div className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
          
          {/* Badge */}
          {badge && (
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${badgeStyles[badgeType]}`}>
              {badge}
            </span>
          )}

          {/* Rating */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-xs font-semibold text-foreground">{rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start gap-1 text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 mt-0.5 text-primary" />
            <span className="text-sm font-body">{location}</span>
          </div>
          
          <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">From</span>
              <p className="font-display text-xl font-bold text-foreground">
                {formatPrice(price)}
                <span className="text-sm font-normal text-muted-foreground">/person</span>
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
              onClick={() => setIsBookingOpen(true)}
            >
              Book Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        bookingType="tour"
        preSelectedDestination={location}
      />
    </>
  );
};
