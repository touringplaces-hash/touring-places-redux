import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ArrowRight, Clock } from "lucide-react";
import { TourBookingModal } from "./TourBookingModal";

interface TourCardProps {
  image: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  badge?: string;
  badgeType?: "popular" | "special" | "discount";
  duration?: string;
  description?: string;
}

export const TourCard = ({
  image,
  title,
  location,
  price,
  rating,
  badge,
  badgeType = "popular",
  duration,
  description,
}: TourCardProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

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
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-start gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span className="text-sm font-body">{location}</span>
            </div>
            {duration && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-body whitespace-nowrap">{duration}</span>
              </div>
            )}
          </div>
          
          <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">From</span>
              <p className="font-display text-xl font-bold text-foreground">
                R{price.toLocaleString()}
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

      <TourBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tour={{
          title,
          location,
          price,
          duration,
          description,
          image,
        }}
      />
    </>
  );
};
