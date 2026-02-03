import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ArrowRight, Plane, Car, Map, Hotel, CalendarRange } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DestinationAutocomplete } from "@/components/DestinationAutocomplete";

export type TripType = "tours" | "stays" | "flights" | "shuttles";

interface FlightResult {
  id: string;
  cityFrom: string;
  cityTo: string;
  price: number;
  currency: string;
  departureTime: number;
  arrivalTime: number;
  airlines: string[];
  stops: number;
  deepLink: string;
  duration: {
    total: number;
    departure: number;
  };
}

interface SearchFormProps {
  onFlightResults?: (flights: FlightResult[]) => void;
  onSearching?: (searching: boolean) => void;
  tripType?: TripType;
  onTripTypeChange?: (tripType: TripType) => void;
}

export const SearchForm = ({ 
  onFlightResults, 
  onSearching, 
  tripType: externalTripType,
  onTripTypeChange 
}: SearchFormProps) => {
  const [internalTripType, setInternalTripType] = useState<TripType>("tours");
  const tripType = externalTripType ?? internalTripType;
  
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [passengers, setPassengers] = useState(2);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const tripTypes = [
    { id: "tours" as TripType, label: "Tours", icon: Map },
    { id: "stays" as TripType, label: "Stays", icon: Hotel },
    { id: "flights" as TripType, label: "Flights", icon: Plane },
    { id: "shuttles" as TripType, label: "Shuttles", icon: Car },
  ];

  const handleTripTypeChange = (newType: TripType) => {
    if (onTripTypeChange) {
      onTripTypeChange(newType);
    } else {
      setInternalTripType(newType);
    }
  };

  const handleSearch = async () => {
    if (tripType === "flights") {
      if (!from || !to || !date) {
        toast({
          title: "Missing Information",
          description: "Please fill in origin, destination, and departure date.",
          variant: "destructive",
        });
        return;
      }

      setIsSearching(true);
      onSearching?.(true);

      try {
        const { data, error } = await supabase.functions.invoke("search-flights", {
          body: {
            flyFrom: from.toUpperCase(),
            flyTo: to.toUpperCase(),
            dateFrom: format(date, "dd/MM/yyyy"),
            dateTo: format(date, "dd/MM/yyyy"),
            adults: passengers,
            returnFrom: returnDate ? format(returnDate, "dd/MM/yyyy") : undefined,
            returnTo: returnDate ? format(returnDate, "dd/MM/yyyy") : undefined,
          },
        });

        if (error) throw error;

        if (data?.flights && data.flights.length > 0) {
          onFlightResults?.(data.flights);
          toast({
            title: "Flights Found!",
            description: `Found ${data.flights.length} flights. Showing cheapest options with max 1 stop.`,
          });
        } else {
          toast({
            title: "No Flights Found",
            description: "Try different dates or destinations.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Flight search error:", error);
        toast({
          title: "Search Failed",
          description: error.message || "Unable to search flights. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
        onSearching?.(false);
      }
    } else if (tripType === "tours") {
      // Scroll to tours section
      document.getElementById("tours")?.scrollIntoView({ behavior: "smooth" });
    } else if (tripType === "shuttles") {
      // Scroll to shuttles section
      document.getElementById("shuttles")?.scrollIntoView({ behavior: "smooth" });
    } else if (tripType === "stays") {
      toast({
        title: "Coming Soon",
        description: "Stay booking is coming soon. Please contact us directly for accommodation enquiries.",
      });
    }
  };

  const renderSearchFields = () => {
    if (tripType === "stays") {
      return (
        <>
          {/* Where */}
          <div className="lg:col-span-3 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Where</label>
            <DestinationAutocomplete
              value={from}
              onChange={setFrom}
              placeholder="City or Airport"
              type="destination"
            />
          </div>

          {/* Check-In */}
          <div className="lg:col-span-3 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Check-In</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal rounded-xl bg-secondary border-2 border-transparent hover:bg-secondary/80",
                    !checkIn && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  {checkIn ? format(checkIn, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-Out */}
          <div className="lg:col-span-3 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Check-Out</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal rounded-xl bg-secondary border-2 border-transparent hover:bg-secondary/80",
                    !checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarRange className="mr-2 h-5 w-5 text-primary" />
                  {checkOut ? format(checkOut, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => date < (checkIn || new Date())}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div className="lg:col-span-2 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-card font-body text-foreground appearance-none cursor-pointer transition-all duration-300 outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      );
    }

    if (tripType === "flights") {
      return (
        <>
          {/* From */}
          <div className="lg:col-span-2 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">From (Airport Code)</label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="CPT, JNB..."
                value={from}
                onChange={(e) => setFrom(e.target.value.toUpperCase())}
                maxLength={3}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-card font-body text-foreground placeholder:text-muted-foreground transition-all duration-300 outline-none uppercase"
              />
            </div>
          </div>

          {/* To */}
          <div className="lg:col-span-2 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">To (Airport Code)</label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="LHR, DXB..."
                value={to}
                onChange={(e) => setTo(e.target.value.toUpperCase())}
                maxLength={3}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-card font-body text-foreground placeholder:text-muted-foreground transition-all duration-300 outline-none uppercase"
              />
            </div>
          </div>

          {/* Departure Date */}
          <div className="lg:col-span-2 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Departure</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal rounded-xl bg-secondary border-2 border-transparent hover:bg-secondary/80",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  {date ? format(date, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date */}
          <div className="lg:col-span-2 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Return (optional)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal rounded-xl bg-secondary border-2 border-transparent hover:bg-secondary/80",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarRange className="mr-2 h-5 w-5 text-primary" />
                  {returnDate ? format(returnDate, "MMM dd, yyyy") : "One-way"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(d) => d < (date || new Date())}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
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
        </>
      );
    }

    // Tours interface - "Where" with date range
    if (tripType === "tours") {
      return (
        <>
          {/* Where */}
          <div className="lg:col-span-3 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Where</label>
            <DestinationAutocomplete
              value={from}
              onChange={setFrom}
              placeholder="Destination"
              type="destination"
            />
          </div>

          {/* When - Date Range Start */}
          <div className="lg:col-span-3 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">When</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal rounded-xl bg-secondary border-2 border-transparent hover:bg-secondary/80",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  {date ? format(date, "MMM dd") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date */}
          <div className="lg:col-span-3 relative">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal rounded-xl bg-secondary border-2 border-transparent hover:bg-secondary/80",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarRange className="mr-2 h-5 w-5 text-primary" />
                  {returnDate ? format(returnDate, "MMM dd") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(d) => d < (date || new Date())}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Travelers */}
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
        </>
      );
    }

    // Shuttles interface
    return (
      <>
        {/* From */}
        <div className="lg:col-span-3 relative">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">From</label>
          <DestinationAutocomplete
            value={from}
            onChange={setFrom}
            placeholder="Pick-up location"
            type="location"
          />
        </div>

        {/* To */}
        <div className="lg:col-span-3 relative">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
          <DestinationAutocomplete
            value={to}
            onChange={setTo}
            placeholder="Drop-off location"
            type="location"
          />
        </div>

        {/* Date */}
        <div className="lg:col-span-3 relative">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal rounded-xl bg-secondary border-2 border-transparent hover:bg-secondary/80",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                {date ? format(date, "MMM dd, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Passengers */}
        <div className="lg:col-span-2 relative">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Passengers</label>
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
      </>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Trip Type Tabs */}
      <div className="flex gap-1 mb-4">
        {tripTypes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleTripTypeChange(id)}
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
          {renderSearchFields()}

          {/* Search Button */}
          <div className="lg:col-span-1 flex items-end">
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full h-12 rounded-xl"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
