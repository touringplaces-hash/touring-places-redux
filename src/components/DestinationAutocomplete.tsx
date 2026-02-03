import { useState, useRef, useEffect } from "react";
import { MapPin, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface Destination {
  name: string;
  code?: string;
  country?: string;
  type: "city" | "airport" | "region";
}

interface DestinationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "destination" | "airport" | "location";
  className?: string;
}

const destinations: Destination[] = [
  // South Africa
  { name: "Cape Town", code: "CPT", country: "South Africa", type: "city" },
  { name: "Johannesburg", code: "JNB", country: "South Africa", type: "city" },
  { name: "Durban", code: "DUR", country: "South Africa", type: "city" },
  { name: "Kruger National Park", country: "South Africa", type: "region" },
  { name: "Garden Route", country: "South Africa", type: "region" },
  { name: "Stellenbosch", country: "South Africa", type: "city" },
  { name: "Pretoria", country: "South Africa", type: "city" },
  // Kenya
  { name: "Nairobi", code: "NBO", country: "Kenya", type: "city" },
  { name: "Mombasa", code: "MBA", country: "Kenya", type: "city" },
  { name: "Masai Mara", country: "Kenya", type: "region" },
  { name: "Amboseli", country: "Kenya", type: "region" },
  // Ghana
  { name: "Accra", code: "ACC", country: "Ghana", type: "city" },
  { name: "Kumasi", country: "Ghana", type: "city" },
  { name: "Cape Coast", country: "Ghana", type: "city" },
  // Tanzania
  { name: "Dar es Salaam", code: "DAR", country: "Tanzania", type: "city" },
  { name: "Zanzibar", code: "ZNZ", country: "Tanzania", type: "city" },
  { name: "Serengeti", country: "Tanzania", type: "region" },
  { name: "Kilimanjaro", code: "JRO", country: "Tanzania", type: "region" },
  // Botswana
  { name: "Gaborone", code: "GBE", country: "Botswana", type: "city" },
  { name: "Okavango Delta", country: "Botswana", type: "region" },
  { name: "Chobe", country: "Botswana", type: "region" },
  { name: "Maun", code: "MUB", country: "Botswana", type: "city" },
  // United Kingdom
  { name: "London", code: "LHR", country: "United Kingdom", type: "city" },
  { name: "London Gatwick", code: "LGW", country: "United Kingdom", type: "airport" },
  { name: "Manchester", code: "MAN", country: "United Kingdom", type: "city" },
  { name: "Edinburgh", code: "EDI", country: "United Kingdom", type: "city" },
  { name: "Birmingham", code: "BHX", country: "United Kingdom", type: "city" },
  // UAE
  { name: "Dubai", code: "DXB", country: "UAE", type: "city" },
  { name: "Abu Dhabi", code: "AUH", country: "UAE", type: "city" },
  { name: "Sharjah", code: "SHJ", country: "UAE", type: "city" },
  // Japan
  { name: "Tokyo", code: "NRT", country: "Japan", type: "city" },
  { name: "Tokyo Haneda", code: "HND", country: "Japan", type: "airport" },
  { name: "Osaka", code: "KIX", country: "Japan", type: "city" },
  { name: "Kyoto", country: "Japan", type: "city" },
  { name: "Hokkaido", code: "CTS", country: "Japan", type: "region" },
  // China
  { name: "Beijing", code: "PEK", country: "China", type: "city" },
  { name: "Shanghai", code: "PVG", country: "China", type: "city" },
  { name: "Hong Kong", code: "HKG", country: "China", type: "city" },
  { name: "Guangzhou", code: "CAN", country: "China", type: "city" },
  // Brazil
  { name: "São Paulo", code: "GRU", country: "Brazil", type: "city" },
  { name: "Rio de Janeiro", code: "GIG", country: "Brazil", type: "city" },
  { name: "Salvador", code: "SSA", country: "Brazil", type: "city" },
  { name: "Brasília", code: "BSB", country: "Brazil", type: "city" },
  // Popular International
  { name: "Paris", code: "CDG", country: "France", type: "city" },
  { name: "New York", code: "JFK", country: "USA", type: "city" },
  { name: "Sydney", code: "SYD", country: "Australia", type: "city" },
  { name: "Singapore", code: "SIN", country: "Singapore", type: "city" },
  { name: "Bangkok", code: "BKK", country: "Thailand", type: "city" },
];

export const DestinationAutocomplete = ({
  value,
  onChange,
  placeholder = "Search destinations...",
  type = "destination",
  className,
}: DestinationAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length >= 1) {
      const searchTerm = value.toLowerCase();
      const filtered = destinations.filter((dest) => {
        const matchesName = dest.name.toLowerCase().includes(searchTerm);
        const matchesCode = dest.code?.toLowerCase().includes(searchTerm);
        const matchesCountry = dest.country?.toLowerCase().includes(searchTerm);
        
        // For airport type, prioritize airports and cities with codes
        if (type === "airport") {
          return (matchesName || matchesCode) && dest.code;
        }
        
        return matchesName || matchesCode || matchesCountry;
      }).slice(0, 8);
      
      setFilteredDestinations(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setIsOpen(false);
      setFilteredDestinations([]);
    }
  }, [value, type]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (dest: Destination) => {
    if (type === "airport" && dest.code) {
      onChange(dest.code);
    } else {
      onChange(dest.name);
    }
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const Icon = type === "airport" ? Plane : MapPin;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(type === "airport" ? e.target.value.toUpperCase() : e.target.value)}
          onFocus={() => {
            if (value.length >= 1 && filteredDestinations.length > 0) {
              setIsOpen(true);
            }
          }}
          maxLength={type === "airport" ? 3 : undefined}
          className={cn(
            "w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-card font-body text-foreground placeholder:text-muted-foreground transition-all duration-300 outline-none",
            type === "airport" && "uppercase",
            className
          )}
        />
      </div>

      {isOpen && filteredDestinations.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-xl shadow-medium border border-border z-50 overflow-hidden">
          {filteredDestinations.map((dest, index) => (
            <button
              key={`${dest.name}-${dest.code || index}`}
              type="button"
              onClick={() => handleSelect(dest)}
              className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 border-b border-border/50 last:border-b-0"
            >
              {dest.type === "airport" || (type === "airport" && dest.code) ? (
                <Plane className="w-4 h-4 text-primary flex-shrink-0" />
              ) : (
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground truncate">{dest.name}</span>
                  {dest.code && (
                    <span className="text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      {dest.code}
                    </span>
                  )}
                </div>
                {dest.country && (
                  <span className="text-xs text-muted-foreground">{dest.country}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
