import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, ArrowRight, Plane, Car, Map } from "lucide-react";

type TripType = "tours" | "shuttles" | "flights";

export const SearchForm = () => {
  const [tripType, setTripType] = useState<TripType>("tours");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(2);

  const tripTypes = [
    { id: "tours" as TripType, label: "Tours", icon: Map },
    { id: "shuttles" as TripType, label: "Shuttles", icon: Car },
    { id: "flights" as TripType, label: "Flights", icon: Plane },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Trip Type Tabs */}
      <div className="flex gap-1 mb-4">
        {tripTypes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTripType(id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-medium transition-all duration-300 ${
              tripType === id
                ? "bg-card text-foreground shadow-soft"
                : "bg-card/60 text-muted-foreground hover:bg-card/80"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <div className="bg-card rounded-2xl rounded-tl-none shadow-medium p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* From */}
          <div className="lg:col-span-3 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="City or airport"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-card font-body text-foreground placeholder:text-muted-foreground transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* To */}
          <div className="lg:col-span-3 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Destination"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-card font-body text-foreground placeholder:text-muted-foreground transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* Date */}
          <div className="lg:col-span-3 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              {tripType === "tours" ? "Departure" : "Date"}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-card font-body text-foreground placeholder:text-muted-foreground transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* Passengers */}
          <div className="lg:col-span-2 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Travelers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-card font-body text-foreground appearance-none cursor-pointer transition-all duration-300 outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Person" : "People"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1 flex items-end">
            <Button variant="hero" size="xl" className="w-full h-12 rounded-xl">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
