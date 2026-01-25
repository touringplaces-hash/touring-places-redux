import { Button } from "@/components/ui/button";
import { Menu, Phone, User, Globe, Map, Hotel, Plane, Car, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import tpsaLogo from "@/assets/tpsa-logo.png";
import { ContactModal } from "./ContactModal";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TripType = "tours" | "stays" | "flights" | "shuttles";

interface HeaderProps {
  onTripTypeChange?: (tripType: TripType) => void;
  activeTripType?: TripType;
}

export const Header = ({ onTripTypeChange, activeTripType = "tours" }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const menuItems = [
    { id: "tours" as TripType, label: "Tours", icon: Map },
    { id: "stays" as TripType, label: "Stays", icon: Hotel },
    { id: "flights" as TripType, label: "Flights", icon: Plane },
    { id: "shuttles" as TripType, label: "Shuttles", icon: Car },
  ];

  const handleMenuClick = (tripType: TripType) => {
    setMobileMenuOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        onTripTypeChange?.(tripType);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      onTripTypeChange?.(tripType);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
              <Link to="/" className="text-card/80 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-card/80 hover:text-primary transition-colors">
                About Us
              </Link>
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
              <a 
                href="https://wa.link/190qw7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              >
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

            {/* Desktop Navigation - Tours, Stays, Flights, Shuttles with icons */}
            <div className="hidden lg:flex items-center gap-6">
              {menuItems.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => handleMenuClick(id)}>
                  <Button 
                    variant="nav" 
                    className={`text-base gap-2 ${activeTripType === id ? "text-primary" : ""}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Globe className="w-5 h-5" />
              </Button>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <User className="w-4 h-4" />
                      {profile?.first_name || "Account"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-card">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" className="gap-2">
                    <User className="w-4 h-4" />
                    Sign in
                  </Button>
                </Link>
              )}
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
                {menuItems.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => handleMenuClick(id)}>
                    <Button 
                      variant="ghost" 
                      className={`justify-start w-full gap-2 ${activeTripType === id ? "text-primary" : ""}`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Button>
                  </button>
                ))}
                <Link to="/"><Button variant="ghost" className="justify-start w-full" onClick={() => setMobileMenuOpen(false)}>Home</Button></Link>
                <Link to="/about"><Button variant="ghost" className="justify-start w-full" onClick={() => setMobileMenuOpen(false)}>About Us</Button></Link>
                <button onClick={() => scrollToSection("find-us")}><Button variant="ghost" className="justify-start w-full">How to Find Us</Button></button>
                <div className="flex gap-2 pt-2">
                  {user ? (
                    <>
                      <Link to="/dashboard" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full gap-2">
                          <User className="w-4 h-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="flex-1 text-destructive" 
                        onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Link to="/auth" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <User className="w-4 h-4" />
                        Sign in
                      </Button>
                    </Link>
                  )}
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
