import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Globe, Users, Award, Headphones, Plane, Car, MapPin, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-secondary to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center animate-fade-up">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                About Us
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-2 mb-6">
                Bridging Technology & Travel
              </h1>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                At Touring Places, we're revolutionizing how you experience Africa. By combining cutting-edge 
                technology with our deep knowledge of the continent, we deliver seamless travel and logistics 
                services that exceed expectations.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-up">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                  Our Mission
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  Making African Travel Accessible & Unforgettable
                </h2>
                <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                  We believe that every journey should be a seamless blend of adventure, comfort, and discovery. 
                  Our mission is to bridge the gap between traditional travel services and modern technology, 
                  providing our clients with an integrated platform for all their travel needs.
                </p>
                <p className="font-body text-muted-foreground mb-8 leading-relaxed">
                  From curated safari experiences to reliable airport shuttles, from international flights to 
                  comfortable accommodations – we've built a comprehensive ecosystem that puts you in control 
                  of your African adventure.
                </p>
                <Link to="/">
                  <Button variant="hero" size="lg">
                    Start Your Journey
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl p-6 shadow-soft animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  <Globe className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">Global Reach</h3>
                  <p className="text-muted-foreground font-body text-sm">
                    Connecting travelers worldwide to Africa's wonders
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft animate-fade-up" style={{ animationDelay: "0.2s" }}>
                  <Users className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">Expert Team</h3>
                  <p className="text-muted-foreground font-body text-sm">
                    Local experts passionate about African travel
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft animate-fade-up" style={{ animationDelay: "0.3s" }}>
                  <Award className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">Quality First</h3>
                  <p className="text-muted-foreground font-body text-sm">
                    Curated experiences with uncompromising standards
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft animate-fade-up" style={{ animationDelay: "0.4s" }}>
                  <Headphones className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">24/7 Support</h3>
                  <p className="text-muted-foreground font-body text-sm">
                    Always available when you need assistance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-secondary">
          <div className="container">
            <div className="text-center mb-12 animate-fade-up">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Our Services
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
                Complete Travel Solutions
              </h2>
              <p className="font-body text-muted-foreground max-w-2xl mx-auto">
                We provide an integrated platform for all your travel needs across Africa and beyond.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card rounded-2xl p-8 shadow-soft text-center animate-fade-up">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Curated Tours</h3>
                <p className="text-muted-foreground font-body text-sm">
                  Expertly crafted safari experiences, wine tours, city adventures, and cultural immersions 
                  across South Africa and beyond.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft text-center animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Plane className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Flight Booking</h3>
                <p className="text-muted-foreground font-body text-sm">
                  Access to global airlines with competitive pricing. Find the best routes and deals 
                  for your African adventure.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft text-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Car className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Airport Shuttles</h3>
                <p className="text-muted-foreground font-body text-sm">
                  Reliable, comfortable airport transfers. Professional drivers ensuring you arrive 
                  at your destination safely and on time.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-soft text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">Accommodation</h3>
                <p className="text-muted-foreground font-body text-sm">
                  From boutique lodges to luxury hotels, we connect you with verified accommodations 
                  that match your travel style.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center animate-fade-up">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Our Technology
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Innovation Meets Hospitality
              </h2>
              <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
                We leverage the latest technology to streamline your travel experience. Our platform integrates 
                real-time flight search, instant booking confirmations, secure payments, and intelligent 
                recommendations – all designed to make your journey planning effortless.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h3 className="font-display text-lg font-semibold mb-2">Real-Time Search</h3>
                  <p className="text-muted-foreground font-body text-sm">
                    Access live availability and pricing for flights, tours, and accommodations.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h3 className="font-display text-lg font-semibold mb-2">Instant Confirmation</h3>
                  <p className="text-muted-foreground font-body text-sm">
                    Receive immediate booking confirmations and e-tickets via email.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h3 className="font-display text-lg font-semibold mb-2">Secure Payments</h3>
                  <p className="text-muted-foreground font-body text-sm">
                    Industry-standard encryption protects all your transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-charcoal">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-card mb-6">
                Ready to Explore Africa?
              </h2>
              <p className="font-body text-card/80 mb-8 text-lg">
                Let us help you create memories that last a lifetime. Start planning your African adventure today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button variant="hero" size="lg">
                    Browse Tours
                  </Button>
                </Link>
                <Link to="/#find-us">
                  <Button variant="outline" size="lg" className="border-card/30 text-card hover:bg-card/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
