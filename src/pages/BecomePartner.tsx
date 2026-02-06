import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Handshake, Loader2, CheckCircle, MapPin, DollarSign, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const regions = [
  "South Africa", "Kenya", "Ghana", "Tanzania", "Botswana", "Zimbabwe",
  "Mozambique", "Namibia", "United Kingdom", "UAE", "Japan", "China", "Brazil", "Other"
];

const BecomePartner = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    serviceType: "",
    description: "",
  });

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceType) {
      toast.error("Please select a service type");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("partner_applications").insert({
        company_name: formData.companyName.trim(),
        contact_person: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        website: formData.website.trim() || null,
        service_type: formData.serviceType,
        description: formData.description.trim() || null,
        operating_regions: selectedRegions.length > 0 ? selectedRegions : null,
      });
      if (error) throw error;
      setIsSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header onTripTypeChange={() => {}} activeTripType="tours" />
        <main className="container py-20 flex items-center justify-center">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-6">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Application Received!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your interest in partnering with Touring Places. Our team will review your application and contact you within 3–5 business days.
              </p>
              <Link to="/">
                <Button variant="hero">Return Home</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onTripTypeChange={() => {}} activeTripType="tours" />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-charcoal to-charcoal/90 text-card py-20">
          <div className="container text-center">
            <Handshake className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Become a Partner</h1>
            <p className="text-card/70 font-body text-lg max-w-2xl mx-auto">
              Join Africa's growing travel network. Partner with Touring Places to showcase your tours, shuttle services, and accommodations to travellers worldwide.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <h2 className="font-display text-2xl font-bold text-center mb-10">Why Partner With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: Globe, title: "Global Reach", desc: "Access travellers from around the world through our platform." },
                { icon: DollarSign, title: "Grow Revenue", desc: "Increase bookings with our marketing and distribution channels." },
                { icon: Users, title: "Dedicated Support", desc: "A partnership manager to help you succeed every step of the way." },
                { icon: MapPin, title: "Africa Focus", desc: "We specialise in African tourism — your market, your audience." },
              ].map((benefit, i) => (
                <Card key={i} className="text-center border-none shadow-soft">
                  <CardContent className="pt-6">
                    <benefit.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-display font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground font-body">{benefit.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-16">
          <div className="container max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Partner Application</CardTitle>
                <CardDescription>
                  Fill in your business details below. We accept tour operators, shuttle companies, and accommodation providers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://www.yourcompany.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Service Type *</Label>
                    <Select value={formData.serviceType} onValueChange={(v) => setFormData({ ...formData, serviceType: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tours">Tours & Excursions</SelectItem>
                        <SelectItem value="shuttle">Shuttle & Transfers</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="both">Multiple Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Operating Regions</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {regions.map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={`region-${region}`}
                            checked={selectedRegions.includes(region)}
                            onCheckedChange={() => toggleRegion(region)}
                          />
                          <label htmlFor={`region-${region}`} className="text-sm font-body cursor-pointer">
                            {region}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Tell us about your business</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your services, experience, fleet size, number of tours, etc."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomePartner;
