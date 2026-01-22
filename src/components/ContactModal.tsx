import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Send, CheckCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EnquiryType = "Enquiries" | "Flights" | "Shuttles" | "Tours" | "Stays";

interface FormData {
  surname: string;
  firstNames: string;
  countryOfResidence: string;
  emailAddress: string;
  enquiryType: EnquiryType;
  travelDate: Date | undefined;
  duration: string;
  numberOfPersons: number;
  otherInformation: string;
  honeypot: string;
}

const initialFormData: FormData = {
  surname: "",
  firstNames: "",
  countryOfResidence: "",
  emailAddress: "",
  enquiryType: "Enquiries",
  travelDate: undefined,
  duration: "",
  numberOfPersons: 1,
  otherInformation: "",
  honeypot: "",
};

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot detection
    if (formData.honeypot) {
      console.log("Bot detected");
      return;
    }

    // Validation
    if (!formData.surname || !formData.firstNames || !formData.countryOfResidence || !formData.emailAddress) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Send email notification via edge function (which also saves to DB)
      const { error: emailError } = await supabase.functions.invoke("send-contact-enquiry", {
        body: {
          surname: formData.surname.trim(),
          firstNames: formData.firstNames.trim(),
          countryOfResidence: formData.countryOfResidence.trim(),
          emailAddress: formData.emailAddress.trim(),
          enquiryType: formData.enquiryType,
          travelDate: formData.travelDate ? format(formData.travelDate, "PPP") : "Not specified",
          duration: formData.duration.trim() || "Not specified",
          numberOfPersons: formData.numberOfPersons,
          otherInformation: formData.otherInformation.trim() || "None",
        },
      });

      if (emailError) {
        throw emailError;
      }

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your enquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Contact Us</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-muted-foreground">
              Your enquiry has been submitted successfully. We'll be in touch soon.
            </p>
            <Button onClick={handleClose} className="mt-6">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field */}
            <input
              type="text"
              name="website"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              className="absolute -left-[9999px] opacity-0"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="surname">Surname *</Label>
                <Input
                  id="surname"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstNames">First Names *</Label>
                <Input
                  id="firstNames"
                  value={formData.firstNames}
                  onChange={(e) => setFormData({ ...formData, firstNames: e.target.value })}
                  maxLength={150}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="countryOfResidence">Country of Residence *</Label>
              <Input
                id="countryOfResidence"
                value={formData.countryOfResidence}
                onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value })}
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailAddress">Email Address *</Label>
              <Input
                id="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                maxLength={255}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enquiryType">Enquiry Type *</Label>
              <Select
                value={formData.enquiryType}
                onValueChange={(value: EnquiryType) => setFormData({ ...formData, enquiryType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select enquiry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enquiries">General Enquiries</SelectItem>
                  <SelectItem value="Flights">Flights</SelectItem>
                  <SelectItem value="Shuttles">Shuttles</SelectItem>
                  <SelectItem value="Tours">Tours</SelectItem>
                  <SelectItem value="Stays">Stays</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date of Travel</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.travelDate && "text-muted-foreground"
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
                      onSelect={(date) => setFormData({ ...formData, travelDate: date })}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 5 days"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  maxLength={100}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPersons">Number of Persons</Label>
              <Select
                value={String(formData.numberOfPersons)}
                onValueChange={(value) => setFormData({ ...formData, numberOfPersons: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? "Person" : "People"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherInformation">Other Information</Label>
              <Textarea
                id="otherInformation"
                placeholder="Any additional details about your enquiry..."
                value={formData.otherInformation}
                onChange={(e) => setFormData({ ...formData, otherInformation: e.target.value })}
                maxLength={2000}
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Enquiry
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
