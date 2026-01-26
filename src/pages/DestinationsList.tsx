import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

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

const DestinationsList = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header onTripTypeChange={() => {}} activeTripType="tours" />
      
      <main className="pt-32 pb-20">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Explore Our <span className="text-primary">Destinations</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover curated tours across 10 incredible countries. Each destination offers unique experiences, 
              handpicked by our travel experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <Link 
                key={dest.slug}
                to={`/destinations/${dest.slug}`}
                className="group relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DestinationsList;
