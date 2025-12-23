import { Button } from "@/components/ui/button";
import { Menu, Phone, User, Globe } from "lucide-react";
import { useState } from "react";
import tpsaLogo from "@/assets/tpsa-logo.png";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 shadow-soft">
      {/* Top bar */}
      <div className="bg-charcoal text-card py-2">
        <div className="container flex items-center justify-between text-sm">
          <span className="font-body text-card/80">exploring together</span>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-card/80">24/7 Customer Support</span>
            <span className="text-card/80">How to Find Us</span>
            <a href="tel:+27732373200" className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
              <Phone className="w-3 h-3" />
              +27-73-237-3200
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img 
              src={tpsaLogo} 
              alt="Touring Places South Africa" 
              className="h-10 md:h-12 w-auto invert"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Button variant="nav" className="text-base">Home</Button>
            <Button variant="nav" className="text-base">Tours</Button>
            <Button variant="nav" className="text-base">Shuttles</Button>
            <Button variant="nav" className="text-base">About Us</Button>
            <Button variant="nav" className="text-base">Services</Button>
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Globe className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="gap-2">
              <User className="w-4 h-4" />
              Sign in
            </Button>
            <Button variant="hero">Contact</Button>
          </div>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-4 pb-2 border-t border-border mt-4 animate-fade-up">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start">Home</Button>
              <Button variant="ghost" className="justify-start">Tours</Button>
              <Button variant="ghost" className="justify-start">Shuttles</Button>
              <Button variant="ghost" className="justify-start">About Us</Button>
              <Button variant="ghost" className="justify-start">Services</Button>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <User className="w-4 h-4" />
                  Sign in
                </Button>
                <Button variant="hero" className="flex-1">Contact</Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
