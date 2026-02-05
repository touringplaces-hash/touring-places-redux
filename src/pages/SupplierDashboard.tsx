import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  ArrowLeft, Plus, MapPin, DollarSign, Clock, Pencil, Trash2, 
  Package, Building2, Loader2, CheckCircle, XCircle, AlertCircle 
} from "lucide-react";
import logo from "@/assets/tpsa-logo.png";

interface Supplier {
  id: string;
  company_name: string;
  status: string;
}

interface Tour {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  is_active: boolean;
}

const SupplierDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const [tourForm, setTourForm] = useState({
    title: "",
    location: "",
    description: "",
    price: "",
    duration: "",
    image_url: "",
    city: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?redirect=/supplier");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSupplierData();
    }
  }, [user]);

  const fetchSupplierData = async () => {
    setLoadingData(true);
    try {
      // Check if user is a supplier
      const { data: supplierData, error: supplierError } = await supabase
        .from("suppliers")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (supplierError || !supplierData) {
        // Not a supplier, redirect to register
        navigate("/supplier/register");
        return;
      }

      setSupplier(supplierData);

      if (supplierData.status === 'approved') {
        // Fetch tours
        const { data: toursData } = await supabase
          .from("tours")
          .select("*")
          .eq("supplier_id", supplierData.id)
          .order("created_at", { ascending: false });

        if (toursData) {
          setTours(toursData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) return;

    setIsAddingTour(true);
    try {
      const { error } = await supabase
        .from("tours")
        .insert({
          supplier_id: supplier.id,
          title: tourForm.title.trim(),
          location: tourForm.location.trim(),
          description: tourForm.description.trim() || null,
          price: parseFloat(tourForm.price),
          duration: tourForm.duration.trim() || null,
          image_url: tourForm.image_url.trim() || null,
          city: tourForm.city.trim() || null,
        });

      if (error) throw error;

      toast.success("Tour added successfully!");
      setAddDialogOpen(false);
      setTourForm({ title: "", location: "", description: "", price: "", duration: "", image_url: "", city: "" });
      fetchSupplierData();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add tour");
    } finally {
      setIsAddingTour(false);
    }
  };

  const toggleTourStatus = async (tourId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("tours")
        .update({ is_active: !currentStatus })
        .eq("id", tourId);

      if (error) throw error;
      
      toast.success(`Tour ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchSupplierData();
    } catch (error) {
      toast.error("Failed to update tour status");
    }
  };

  const deleteTour = async (tourId: string) => {
    if (!confirm("Are you sure you want to delete this tour?")) return;
    
    try {
      const { error } = await supabase
        .from("tours")
        .delete()
        .eq("id", tourId);

      if (error) throw error;
      
      toast.success("Tour deleted");
      fetchSupplierData();
    } catch (error) {
      toast.error("Failed to delete tour");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-primary/10 text-primary"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "pending":
        return <Badge className="bg-muted text-muted-foreground"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      case "rejected":
        return <Badge className="bg-destructive/10 text-destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <div className="bg-charcoal p-2 rounded-lg">
              <img src={logo} alt="Touring Places" className="h-8" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="font-medium">{supplier?.company_name}</span>
            {supplier && getStatusBadge(supplier.status)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Supplier Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tours and listings
          </p>
        </div>

        {supplier?.status === 'pending' && (
          <Card className="mb-8 border-muted">
            <CardContent className="py-8 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">Application Under Review</h3>
              <p className="text-muted-foreground">
                Your supplier application is being reviewed. You'll be able to add tours once approved.
              </p>
            </CardContent>
          </Card>
        )}

        {supplier?.status === 'rejected' && (
          <Card className="mb-8 border-destructive">
            <CardContent className="py-8 text-center">
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">Application Rejected</h3>
              <p className="text-muted-foreground">
                Your application was not approved. Please contact support for more information.
              </p>
            </CardContent>
          </Card>
        )}

        {supplier?.status === 'approved' && (
          <Tabs defaultValue="tours" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="tours" className="gap-2">
                  <Package className="w-4 h-4" />
                  My Tours
                </TabsTrigger>
              </TabsList>

              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Tour
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New Tour</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddTour} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tour Title *</Label>
                      <Input
                        id="title"
                        value={tourForm.title}
                        onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
                        placeholder="Cape Peninsula Full Day Tour"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={tourForm.location}
                          onChange={(e) => setTourForm({ ...tourForm, location: e.target.value })}
                          placeholder="Cape Town, South Africa"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={tourForm.city}
                          onChange={(e) => setTourForm({ ...tourForm, city: e.target.value })}
                          placeholder="Cape Town"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (ZAR) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={tourForm.price}
                          onChange={(e) => setTourForm({ ...tourForm, price: e.target.value })}
                          placeholder="1500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={tourForm.duration}
                          onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                          placeholder="8 hours"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        value={tourForm.image_url}
                        onChange={(e) => setTourForm({ ...tourForm, image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={tourForm.description}
                        onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                        placeholder="Describe your tour..."
                        rows={3}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isAddingTour}>
                      {isAddingTour ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Add Tour
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="tours">
              <Card>
                <CardHeader>
                  <CardTitle>My Tours</CardTitle>
                  <CardDescription>Manage your tour listings</CardDescription>
                </CardHeader>
                <CardContent>
                  {tours.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-display text-lg font-semibold mb-2">No tours yet</h3>
                      <p className="text-muted-foreground">
                        Add your first tour to start receiving bookings
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tours.map((tour) => (
                        <div
                          key={tour.id}
                          className="flex items-center justify-between p-4 border border-border rounded-xl"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{tour.title}</span>
                              <Badge variant={tour.is_active ? "default" : "secondary"}>
                                {tour.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {tour.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                R{tour.price}
                              </span>
                              {tour.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {tour.duration}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleTourStatus(tour.id, tour.is_active)}
                            >
                              {tour.is_active ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTour(tour.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default SupplierDashboard;
