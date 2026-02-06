import { Button } from "@/components/ui/button";
import { Plane, Clock, X, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useCurrency } from "@/contexts/CurrencyContext";

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

interface FlightResultsProps {
  flights: FlightResult[];
  isLoading: boolean;
  onClear: () => void;
}

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const formatTime = (timestamp: number | null, isoString: string | null) => {
  // Prefer ISO string from local_departure/local_arrival
  if (isoString) {
    const date = new Date(isoString);
    if (!isNaN(date.getTime())) return format(date, "HH:mm");
  }
  // Fallback to unix timestamp
  if (timestamp && !isNaN(timestamp)) {
    const date = new Date(timestamp * 1000);
    if (!isNaN(date.getTime())) return format(date, "HH:mm");
  }
  return "--:--";
};

const formatDate = (timestamp: number | null, isoString: string | null) => {
  if (isoString) {
    const date = new Date(isoString);
    if (!isNaN(date.getTime())) return format(date, "EEE, MMM d");
  }
  if (timestamp && !isNaN(timestamp)) {
    const date = new Date(timestamp * 1000);
    if (!isNaN(date.getTime())) return format(date, "EEE, MMM d");
  }
  return "Unknown date";
};

export const FlightResults = ({ flights, isLoading, onClear }: FlightResultsProps) => {
  const { formatPrice } = useCurrency();

  if (isLoading) {
    return (
      <section className="py-12 bg-secondary">
        <div className="container">
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mb-2" />
            <div className="h-4 w-72 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-6 shadow-soft">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center space-y-2">
                        <div className="h-7 w-16 bg-muted animate-pulse rounded mx-auto" />
                        <div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" />
                        <div className="h-3 w-20 bg-muted animate-pulse rounded mx-auto" />
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="h-3 w-16 bg-muted animate-pulse rounded mb-2" />
                        <div className="w-full h-px bg-border" />
                      </div>
                      <div className="text-center space-y-2">
                        <div className="h-7 w-16 bg-muted animate-pulse rounded mx-auto" />
                        <div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" />
                        <div className="h-3 w-20 bg-muted animate-pulse rounded mx-auto" />
                      </div>
                    </div>
                  </div>
                  <div className="lg:border-l lg:pl-6 lg:min-w-[180px] flex flex-col items-center lg:items-end space-y-2">
                    <div className="h-9 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    <div className="h-10 w-full lg:w-28 bg-muted animate-pulse rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-6 animate-pulse">Searching for the best flights...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-secondary">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Flight Results
            </h2>
            <p className="text-muted-foreground">
              Found {flights.length} flights • Sorted by price • Max 1 stop
            </p>
          </div>
          <Button variant="outline" onClick={onClear} className="gap-2">
            <X className="w-4 h-4" />
            Clear
          </Button>
        </div>

        <div className="space-y-4">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Flight Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Plane className="w-4 h-4 text-primary" />
                      {flight.airlines?.join(", ") || "Multiple Airlines"}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      flight.stops === 0 
                        ? "bg-primary/10 text-primary" 
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {flight.stops === 0 ? "Direct" : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Departure */}
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{formatTime(flight.departureTime, flight.localDeparture)}</p>
                      <p className="text-sm text-muted-foreground">{flight.cityFrom}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(flight.departureTime, flight.localDeparture)}</p>
                    </div>

                    {/* Duration */}
                    <div className="flex-1 flex flex-col items-center">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(flight.duration?.departure || flight.duration?.total || 0)}
                      </p>
                      <div className="w-full h-px bg-border my-2 relative">
                        <Plane className="w-4 h-4 text-primary absolute left-1/2 -translate-x-1/2 -top-2 rotate-90" />
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{formatTime(flight.arrivalTime, flight.localArrival)}</p>
                      <p className="text-sm text-muted-foreground">{flight.cityTo}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(flight.arrivalTime, flight.localArrival)}</p>
                    </div>
                  </div>
                </div>

                {/* Price & Book */}
                <div className="lg:border-l lg:pl-6 lg:min-w-[180px] flex flex-col items-center lg:items-end">
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(flight.price)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">per person</p>
                  <a 
                    href={flight.deepLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full lg:w-auto"
                  >
                    <Button variant="hero" className="w-full gap-2">
                      Book Now
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {flights.length === 0 && (
          <div className="text-center py-12">
            <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No flights found. Try different search criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};
