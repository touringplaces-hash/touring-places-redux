import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TourCard } from "@/components/TourCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Star, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Tour {
  id: string;
  name: string;
  destination: string;
  duration: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
}

const destinationInfo: Record<string, { name: string; description: string; image: string; flag: string }> = {
  "south-africa": {
    name: "South Africa",
    description: "Experience the Rainbow Nation - from Cape Town's iconic Table Mountain to the wild safaris of Kruger National Park, South Africa offers unparalleled diversity.",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200",
    flag: "🇿🇦",
  },
  "kenya": {
    name: "Kenya",
    description: "Witness the Great Migration, explore the Masai Mara, and experience authentic African culture in the birthplace of safari.",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200",
    flag: "🇰🇪",
  },
  "ghana": {
    name: "Ghana",
    description: "Discover West Africa's hidden gem with its rich history, vibrant culture, and stunning coastal castles that tell powerful stories.",
    image: "https://images.unsplash.com/photo-1590845947698-8924d7409b56?w=1200",
    flag: "🇬🇭",
  },
  "tanzania": {
    name: "Tanzania",
    description: "Home to Kilimanjaro, the Serengeti, and Zanzibar's spice islands - Tanzania is East Africa's crown jewel.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200",
    flag: "🇹🇿",
  },
  "botswana": {
    name: "Botswana",
    description: "Experience luxury safari at its finest in the Okavango Delta, Chobe, and the vast Kalahari wilderness.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200",
    flag: "🇧🇼",
  },
  "united-kingdom": {
    name: "United Kingdom",
    description: "From London's iconic landmarks to Scottish castles and English countryside, discover centuries of history and culture.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
    flag: "🇬🇧",
  },
  "uae": {
    name: "United Arab Emirates",
    description: "Where ancient desert traditions meet futuristic cities - experience Dubai's glamour and Abu Dhabi's cultural treasures.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
    flag: "🇦🇪",
  },
  "japan": {
    name: "Japan",
    description: "Ancient temples, modern cities, and natural beauty converge in the Land of the Rising Sun. Experience tradition and innovation.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200",
    flag: "🇯🇵",
  },
  "china": {
    name: "China",
    description: "Walk the Great Wall, meet the Terracotta Warriors, and explore 5,000 years of civilization in the Middle Kingdom.",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1200",
    flag: "🇨🇳",
  },
  "brazil": {
    name: "Brazil",
    description: "From Rio's carnival spirit to the Amazon rainforest and Iguazu Falls, Brazil pulses with color, rhythm, and natural wonders.",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200",
    flag: "🇧🇷",
  },
};

const Destinations = () => {
  const { country } = useParams<{ country: string }>();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const info = country ? destinationInfo[country] : null;

  useEffect(() => {
    const fetchTours = async () => {
      if (!country || !info) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("search-tours", {
          body: { destination: info.name },
        });

        if (error) throw error;
        setTours(data?.tours || []);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [country, info]);

  if (!info) {
    return (
      <div className="min-h-screen bg-background">
        <Header onTripTypeChange={() => {}} activeTripType="tours" />
        <main className="container py-32 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Destination Not Found</h1>
          <p className="text-muted-foreground mb-8">The destination you're looking for doesn't exist.</p>
          <Link to="/destinations">
            <Button>View All Destinations</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onTripTypeChange={() => {}} activeTripType="tours" />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        <img 
          src={info.image} 
          alt={info.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent" />
        <div className="relative z-10 container h-full flex flex-col justify-end pb-12">
          <Link to="/destinations" className="inline-flex items-center gap-2 text-card/80 hover:text-card mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            All Destinations
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl">{info.flag}</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-card">
              {info.name}
            </h1>
          </div>
          <p className="text-lg text-card/90 max-w-2xl">{info.description}</p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Tours in {info.name}
            </h2>
            <p className="text-muted-foreground mt-1">
              {tours.length} curated experiences available
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-2xl h-64 mb-4" />
                <div className="bg-muted rounded h-6 w-3/4 mb-2" />
                <div className="bg-muted rounded h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <div key={tour.id} className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="font-semibold text-primary">{tour.currency} {tour.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {tour.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {tour.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {tour.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{tour.rating}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">({tour.reviews.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tour.highlights?.slice(0, 3).map((highlight, i) => (
                      <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Destinations;
