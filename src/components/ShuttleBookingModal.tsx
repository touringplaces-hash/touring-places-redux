import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, CheckCircle, Car, Users, Check, LogIn, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const bookingSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  customerEmail: z.string().trim().email("Please enter a valid email").max(255),
  customerPhone: z.string().trim().max(20).optional(),
  travelDate: z.date({ required_error: "Please select a travel date" }),
  numberOfTravelers: z.number().min(1).max(50),
  specialRequests: z.string().max(500).optional(),
});

interface ShuttleOption {
  name: string;
  type: string;
  price: number;
  capacity: string;
  features: string[];
  popular?: boolean;
  discount?: string;
}

interface ShuttleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shuttle: ShuttleOption;
}

// Vehicle images based on shuttle type
const vehicleImages: Record<string, string> = {
  "Economy": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=60",
  "Comfort": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&auto=format&fit=crop&q=60",
  "Executive": "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600&auto=format&fit=crop&q=60",
  "Group": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=60",
};

export function ShuttleBookingModal({ isOpen, onClose, shuttle }: ShuttleBookingModalProps) {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    pickupLocation: "",
    dropoffLocation: "",
    travelDate: undefined as Date | undefined,
    numberOfTravelers: 1,
    flightNumber: "",
    specialRequests: "",
    honeypot: "",
  });

  // Pre-fill form with user data
  useEffect(() => {
    if (user && profile) {
      setFormData(prev => ({
        ...prev,
        customerName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || prev.customerName,
        customerEmail: user.email || prev.customerEmail,
        customerPhone: profile.phone || prev.customerPhone,
      }));
    }
  }, [user, profile]);

  const validateField = (field: string, value: any) => {
    try {
      const partialSchema = bookingSchema.pick({ [field]: true } as any);
      partialSchema.parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0]?.message || "Invalid input" }));
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.honeypot) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        setBookingReference("TP-XXXXXXXX");
      }, 1000);
      return;
    }
    
    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      const destination = `Airport Shuttle - ${shuttle.name} (${formData.pickupLocation} → ${formData.dropoffLocation})`;
      
      const { data: booking, error: insertError } = await supabase
        .from("bookings")
        .insert({
          customer_name: formData.customerName.trim(),
          customer_email: formData.customerEmail.trim().toLowerCase(),
          customer_phone: formData.customerPhone?.trim() || null,
          booking_type: "shuttle",
          destination: destination,
          travel_date: format(formData.travelDate!, "yyyy-MM-dd"),
          number_of_travelers: formData.numberOfTravelers,
          special_requests: formData.flightNumber 
            ? `Flight: ${formData.flightNumber}. ${formData.specialRequests?.trim() || ''}` 
            : formData.specialRequests?.trim() || null,
          user_id: user?.id || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const { error: emailError } = await supabase.functions.invoke("send-booking-confirmation", {
        body: {
          customerName: formData.customerName.trim(),
          customerEmail: formData.customerEmail.trim().toLowerCase(),
          bookingReference: booking.booking_reference,
          destination: destination,
          travelDate: format(formData.travelDate!, "MMMM d, yyyy"),
          numberOfTravelers: formData.numberOfTravelers,
          bookingType: "shuttle",
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
      }

      setBookingReference(booking.booking_reference);
      setIsSuccess(true);
      toast.success("Booking confirmed! Check your email for details.");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setBookingReference("");
    setFormData({
      customerName: user && profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : "",
      customerEmail: user?.email || "",
      customerPhone: profile?.phone || "",
      pickupLocation: "",
      dropoffLocation: "",
      travelDate: undefined,
      numberOfTravelers: 1,
      flightNumber: "",
      specialRequests: "",
      honeypot: "",
    });
    setErrors({});
    onClose();
  };

  // Get max passengers based on shuttle capacity
  const maxPassengers = parseInt(shuttle.capacity.split("-")[1] || shuttle.capacity.split("-")[0]) || 8;

  // Auth required screen
  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              Sign In Required
            </DialogTitle>
          </DialogHeader>
          
          <p className="text-muted-foreground">
            Please sign in or create an account to book the <strong>{shuttle.name}</strong> shuttle.
          </p>
          
          <div className="flex flex-col gap-3 mt-4">
            <Link to={`/auth?redirect=${encodeURIComponent(window.location.pathname)}`} onClick={handleClose}>
              <Button variant="hero" className="w-full gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
            <Link to={`/auth?mode=signup&redirect=${encodeURIComponent(window.location.pathname)}`} onClick={handleClose}>
              <Button variant="outline" className="w-full gap-2">
                <User className="w-4 h-4" />
                Create Account
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-4">
            Creating an account lets you track your bookings and manage your profile.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center py-6">
            <CheckCircle className="h-16 w-16 text-primary mb-4" />
            <DialogTitle className="text-2xl font-heading mb-2">Booking Confirmed!</DialogTitle>
            <p className="text-muted-foreground mb-4">
              Your {shuttle.name} shuttle has been booked.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-4 w-full">
              <p className="text-sm text-muted-foreground">Booking Reference</p>
              <p className="text-2xl font-bold text-primary">{bookingReference}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              A confirmation email has been sent to {formData.customerEmail}
            </p>
            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-2">
          {/* Left side - Vehicle Info & Terms */}
          <div className="bg-secondary p-6 md:rounded-l-lg">
            <div className="rounded-xl overflow-hidden mb-4">
              <img 
                src={vehicleImages[shuttle.name] || vehicleImages["Economy"]} 
                alt={shuttle.type} 
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">{shuttle.name}</h3>
                <p className="text-sm text-muted-foreground">{shuttle.type}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Users className="w-4 h-4" />
              <span>{shuttle.capacity} passengers</span>
            </div>
            
            <div className="bg-card rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Starting from</span>
                {shuttle.discount && (
                  <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                    {shuttle.discount}
                  </span>
                )}
              </div>
              <p className="font-display text-3xl font-bold text-foreground">
                R{shuttle.price.toLocaleString()}
              </p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-foreground mb-2">Features Included:</h4>
              <ul className="space-y-2">
                {shuttle.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-primary/10 rounded-xl">
              <h4 className="font-semibold text-sm text-foreground mb-2">Terms & Conditions:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Free cancellation up to 24 hours before pickup</li>
                <li>• Driver will wait up to 60 minutes for flight arrivals</li>
                <li>• Child seats available on request</li>
                <li>• Luggage: 2 bags per person included</li>
                <li>• Extra stops may incur additional charges</li>
              </ul>
            </div>
          </div>

          {/* Right side - Booking Form */}
          <div className="p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-heading">
                Book {shuttle.name} Shuttle
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => {
                      setFormData({ ...formData, customerName: e.target.value });
                      validateField("customerName", e.target.value);
                    }}
                    placeholder="John Doe"
                    className={errors.customerName ? "border-destructive" : ""}
                  />
                  {errors.customerName && <p className="text-xs text-destructive">{errors.customerName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => {
                      setFormData({ ...formData, customerEmail: e.target.value });
                      validateField("customerEmail", e.target.value);
                    }}
                    placeholder="john@example.com"
                    className={errors.customerEmail ? "border-destructive" : ""}
                  />
                  {errors.customerEmail && <p className="text-xs text-destructive">{errors.customerEmail}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone (Optional)</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="+27 12 345 6789"
                />
              </div>

              {/* Honeypot */}
              <input
                type="text"
                name="website"
                aria-hidden="true"
                style={{ 
                  position: 'absolute',
                  left: '-9999px',
                  top: '-9999px',
                  opacity: 0,
                  height: 0,
                  width: 0,
                  pointerEvents: 'none'
                }}
                tabIndex={-1}
                autoComplete="off"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupLocation">Pickup Location *</Label>
                  <Input
                    id="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    placeholder="e.g., Cape Town Airport"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dropoffLocation">Drop-off Location *</Label>
                  <Input
                    id="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                    placeholder="e.g., V&A Waterfront Hotel"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pickup Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.travelDate && "text-muted-foreground",
                          errors.travelDate && "border-destructive"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.travelDate ? format(formData.travelDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.travelDate}
                        onSelect={(date) => {
                          setFormData({ ...formData, travelDate: date });
                          validateField("travelDate", date);
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.travelDate && <p className="text-xs text-destructive">{errors.travelDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfTravelers">Passengers *</Label>
                  <Select
                    value={formData.numberOfTravelers.toString()}
                    onValueChange={(value) => setFormData({ ...formData, numberOfTravelers: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: maxPassengers }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flightNumber">Flight Number (Optional)</Label>
                <Input
                  id="flightNumber"
                  value={formData.flightNumber}
                  onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                  placeholder="e.g., SA123"
                />
                <p className="text-xs text-muted-foreground">For flight tracking and pickup coordination</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Child seat, extra luggage, etc..."
                  rows={2}
                />
              </div>

              {/* Total calculation */}
              <div className="bg-muted p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {shuttle.name} Transfer
                  </span>
                  <span className="font-display text-xl font-bold text-foreground">
                    From R{shuttle.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Final price confirmed after route verification
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
