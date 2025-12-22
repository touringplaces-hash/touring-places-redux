import heroImage from "@/assets/hero-cape-town.jpg";
import { SearchForm } from "./SearchForm";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Cape Town with Table Mountain at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-card mb-4 leading-tight">
            Travel with <span className="text-primary">Us</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-card/90 max-w-2xl mx-auto">
            Experience the thrill and excitement of touring Africa with our specially curated tours.
            See nature from a whole new perspective!
          </p>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <SearchForm />
        </div>
      </div>
    </section>
  );
};
