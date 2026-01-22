import { Button } from "@/components/ui/button";
import { Menu, Phone, User, Globe } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tpsaLogo from "@/assets/tpsa-logo.png";
import { ContactModal } from "./ContactModal";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 shadow-soft">
        {/* Top bar - 80% black */}
        <div className="bg-[rgba(0,0,0,0.8)] text-card py-2">
          <div className="container flex items-center justify-between text-sm">
            <span className="font-body text-card/80">exploring together</span>
            <div className="hidden md:flex items-center gap-6">
              <span className="text-card/80">24/7 Customer Support</span>
              <button 
                onClick={() => scrollToSection("find-us")}
                className="text-card/80 hover:text-primary transition-colors cursor-pointer"
              >
                How to Find Us
              </button>
              <button 
                onClick={() => setContactModalOpen(true)}
                className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                Contact Us
              </button>
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
            <Link to="/" className="flex items-center">
              <img 
                src={tpsaLogo} 
                alt="Touring Places South Africa" 
                className="h-10 md:h-12 w-auto invert"
              />
            </Link>

            {/* Desktop Navigation - Reordered: Home, Tours, Stays, Flights, Shuttles */}
            <div className="hidden lg:flex items-center gap-8">
              <Link to="/">
                <Button variant="nav" className="text-base">Home</Button>
              </Link>
              <button onClick={() => scrollToSection("tours")}>
                <Button variant="nav" className="text-base">Tours</Button>
              </button>
              <button onClick={() => scrollToSection("tours")}>
                <Button variant="nav" className="text-base">Stays</Button>
              </button>
              <button onClick={() => scrollToSection("tours")}>
                <Button variant="nav" className="text-base">Flights</Button>
              </button>
              <button onClick={() => scrollToSection("shuttles")}>
                <Button variant="nav" className="text-base">Shuttles</Button>
              </button>
              <Link to="/about">
                <Button variant="nav" className="text-base">About Us</Button>
              </Link>
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Globe className="w-5 h-5" />
              </Button>
              <Link to="/auth">
                <Button variant="outline" className="gap-2">
                  <User className="w-4 h-4" />
                  Sign in
                </Button>
              </Link>
              <Button variant="hero" onClick={() => setContactModalOpen(true)}>Contact</Button>
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
                <Link to="/"><Button variant="ghost" className="justify-start w-full" onClick={() => setMobileMenuOpen(false)}>Home</Button></Link>
                <button onClick={() => scrollToSection("tours")}><Button variant="ghost" className="justify-start w-full">Tours</Button></button>
                <button onClick={() => scrollToSection("tours")}><Button variant="ghost" className="justify-start w-full">Stays</Button></button>
                <button onClick={() => scrollToSection("tours")}><Button variant="ghost" className="justify-start w-full">Flights</Button></button>
                <button onClick={() => scrollToSection("shuttles")}><Button variant="ghost" className="justify-start w-full">Shuttles</Button></button>
                <Link to="/about"><Button variant="ghost" className="justify-start w-full" onClick={() => setMobileMenuOpen(false)}>About Us</Button></Link>
                <button onClick={() => scrollToSection("find-us")}><Button variant="ghost" className="justify-start w-full">How to Find Us</Button></button>
                <div className="flex gap-2 pt-2">
                  <Link to="/auth" className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
                      <User className="w-4 h-4" />
                      Sign in
                    </Button>
                  </Link>
                  <Button variant="hero" className="flex-1" onClick={() => { setMobileMenuOpen(false); setContactModalOpen(true); }}>
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </>
  );
};
