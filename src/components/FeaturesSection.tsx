import { Shield, Clock, CreditCard, Headphones, MapPin, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Guaranteed Protection",
    description: "Your bookings are protected with our comprehensive travel guarantee.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance for all your travel needs and emergencies.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Easy payment options with secure transactions and instant confirmations.",
  },
  {
    icon: MapPin,
    title: "Curated Experiences",
    description: "Handpicked tours and destinations crafted by travel experts.",
  },
  {
    icon: Award,
    title: "Best Price Promise",
    description: "We guarantee the best prices on all our tours and services.",
  },
  {
    icon: Headphones,
    title: "Personal Concierge",
    description: "Dedicated travel concierge to customize your perfect journey.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            The Touring Places Guarantee
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Rise above all travel anxieties with our comprehensive guarantees and premium services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="font-body text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
