import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, Users, Check } from "lucide-react";
import { BookingModal } from "./BookingModal";

const shuttleOptions = [
  {
    name: "Economy",
    type: "Sedan or similar",
    price: 700,
    capacity: "1-3",
    features: ["Free Souvenirs", "Meet & Greet"],
    popular: false,
  },
  {
    name: "Comfort",
    type: "Compact SUV or similar",
    price: 900,
    capacity: "1-4",
    features: ["Free Souvenirs", "Meet & Greet", "Flight Tracking"],
    popular: true,
  },
  {
    name: "Executive",
    type: "Luxury Sedan or Similar",
    price: 1500,
    capacity: "1-3",
    features: ["Free Souvenirs", "Meet & Greet", "Flight Tracking", "Priority Service"],
    popular: true,
  },
  {
    name: "Group",
    type: "Group Airport Shuttle",
    price: 2500,
    capacity: "5-8",
    features: ["Free Souvenirs", "Meet & Greet", "Flight Tracking", "Extra Luggage"],
    popular: false,
    discount: "5% Off",
  },
];

export const ShuttleSection = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedShuttle, setSelectedShuttle] = useState("");

  const handleBookNow = (shuttleName: string) => {
    setSelectedShuttle(`Airport Shuttle - ${shuttleName}`);
    setIsBookingOpen(true);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Airport Transfers
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Airport Shuttles
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of fleet for your Airport transfers within Cape Town, Durban and Johannesburg.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shuttleOptions.map((option, index) => (
            <div
              key={option.name}
              className={`relative bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-1 animate-fade-up ${
                option.popular ? "ring-2 ring-primary" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {option.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
              {option.discount && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  {option.discount}
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{option.name}</h3>
                  <p className="text-sm text-muted-foreground">{option.type}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="font-display text-3xl font-bold text-foreground">R{option.price.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Users className="w-4 h-4" />
                <span>{option.capacity} passengers</span>
              </div>

              <ul className="space-y-2 mb-6">
                {option.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant={option.popular ? "hero" : "outline"} 
                className="w-full"
                onClick={() => handleBookNow(option.name)}
              >
                Book Now
              </Button>
            </div>
          ))}
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        bookingType="shuttle"
        preSelectedDestination={selectedShuttle}
      />
    </section>
  );
};
