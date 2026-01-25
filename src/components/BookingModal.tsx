import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, CheckCircle, LogIn, User } from "lucide-react";
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
  destination: z.string().min(1, "Please select a destination"),
  travelDate: z.date({ required_error: "Please select a travel date" }),
  numberOfTravelers: z.number().min(1).max(50),
  specialRequests: z.string().max(500).optional(),
});

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingType: "tour" | "shuttle";
  preSelectedDestination?: string;
}

const destinations = [
  "Cape Town, South Africa",
  "Kruger Safari, South Africa",
  "Cape Winelands, South Africa",
  "Accra, Ghana",
  "Nairobi, Kenya",
  "Victoria Falls, Zimbabwe",
  "Zanzibar, Tanzania",
  "Marrakech, Morocco",
];

export function BookingModal({ isOpen, onClose, bookingType, preSelectedDestination }: BookingModalProps) {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    destination: preSelectedDestination || "",
    travelDate: undefined as Date | undefined,
    numberOfTravelers: 1,
    specialRequests: "",
    honeypot: "",
  });

  // Pre-fill form with user data when available
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
    
    // Honeypot check
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
      const { data: booking, error: insertError } = await supabase
        .from("bookings")
        .insert({
          customer_name: formData.customerName.trim(),
          customer_email: formData.customerEmail.trim().toLowerCase(),
          customer_phone: formData.customerPhone?.trim() || null,
          booking_type: bookingType,
          destination: formData.destination,
          travel_date: format(formData.travelDate!, "yyyy-MM-dd"),
          number_of_travelers: formData.numberOfTravelers,
          special_requests: formData.specialRequests?.trim() || null,
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
          destination: formData.destination,
          travelDate: format(formData.travelDate!, "MMMM d, yyyy"),
          numberOfTravelers: formData.numberOfTravelers,
          bookingType: bookingType,
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
      destination: "",
      travelDate: undefined,
      numberOfTravelers: 1,
      specialRequests: "",
      honeypot: "",
    });
    setErrors({});
    onClose();
  };

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
            Please sign in or create an account to complete your booking.
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

  // Success screen
  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center py-6">
            <CheckCircle className="h-16 w-16 text-primary mb-4" />
            <DialogTitle className="text-2xl font-heading mb-2">Booking Confirmed!</DialogTitle>
            <p className="text-muted-foreground mb-4">
              Your {bookingType} to {formData.destination} has been booked.
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

  // Booking form
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">
            Book Your {bookingType === "tour" ? "Tour" : "Shuttle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Honeypot field */}
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

          <div className="space-y-2">
            <Label>Destination *</Label>
            <Select
              value={formData.destination}
              onValueChange={(value) => {
                setFormData({ ...formData, destination: value });
                validateField("destination", value);
              }}
            >
              <SelectTrigger className={errors.destination ? "border-destructive" : ""}>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((dest) => (
                  <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.destination && <p className="text-xs text-destructive">{errors.destination}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Travel Date *</Label>
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
              <Label htmlFor="numberOfTravelers">Travelers *</Label>
              <Select
                value={formData.numberOfTravelers.toString()}
                onValueChange={(value) => setFormData({ ...formData, numberOfTravelers: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? "person" : "people"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder="Any special requirements or requests..."
              rows={3}
            />
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
      </DialogContent>
    </Dialog>
  );
}
