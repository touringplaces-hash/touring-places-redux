import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import tpsaLogo from "@/assets/tpsa-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-charcoal text-card pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img 
              src={tpsaLogo} 
              alt="Touring Places South Africa" 
              className="h-12 w-auto mb-4"
            />
            <p className="text-card/70 font-body mb-6">
              Experience the thrill and excitement of touring Africa with our specially curated tours.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="text-card/60 hover:text-primary hover:bg-card/10">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-card/60 hover:text-primary hover:bg-card/10">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-card/60 hover:text-primary hover:bg-card/10">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-card/60 hover:text-primary hover:bg-card/10">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-card mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "Tours", "Shuttles", "About Us", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-card/70 hover:text-primary transition-colors font-body">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-display text-lg font-semibold text-card mb-4">Destinations</h4>
            <ul className="space-y-3">
              {["South Africa", "Ghana", "Kenya", "Tanzania", "Botswana"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-card/70 hover:text-primary transition-colors font-body">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-card mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-card/70 font-body">
                  123 Main Street, Cape Town, South Africa
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+27732373200" className="text-card/70 hover:text-primary transition-colors font-body">
                  +27-73-237-3200
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:info@touringplaces.co.za" className="text-card/70 hover:text-primary transition-colors font-body">
                  info@touringplaces.co.za
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-card/10 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-display text-lg font-semibold text-card mb-1">Subscribe to our newsletter</h4>
              <p className="text-card/70 font-body text-sm">Get the latest deals and travel inspiration straight to your inbox.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 h-12 px-4 rounded-xl bg-card/10 border border-card/20 text-card placeholder:text-card/50 focus:border-primary outline-none transition-colors font-body"
              />
              <Button variant="hero" size="lg">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-card/10 pt-8 text-center">
          <p className="text-card/50 font-body text-sm">
            © {new Date().getFullYear()} Touring Places. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
