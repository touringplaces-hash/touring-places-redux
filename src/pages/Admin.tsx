import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Search, Filter, RefreshCw, CheckCircle, Clock, XCircle, ArrowLeft, Calendar,
  Mail, Phone, Users, MapPin, LogOut, Loader2, Shield, BarChart3, Package,
  DollarSign, TrendingUp, Eye, Pencil, Trash2, Plus, Building2, Hotel, UserCog, Contact
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { Session, User } from "@supabase/supabase-js";
import * as OTPAuth from "otpauth";

interface Booking {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  destination: string;
  booking_type: string;
  travel_date: string;
  number_of_travelers: number;
  special_requests: string | null;
  status: string;
  created_at: string;
  user_id: string | null;
}

interface Supplier {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  status: string;
  created_at: string;
}

interface Tour {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: string | null;
  is_active: boolean;
  supplier_id: string | null;
  country: string | null;
  city: string | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  rating: number | null;
  badge: string | null;
  badge_type: string | null;
  status: string;
  itinerary: any;
}

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  booking_id: string | null;
}

interface CrmCustomer {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  total_bookings: number;
  total_spent: number;
  last_booking_date: string | null;
  notes: string | null;
  tags: string[];
  created_at: string;
}

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);
  const [has2FASetup, setHas2FASetup] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSecret, setOtpSecret] = useState("");
  const [otpUri, setOtpUri] = useState("");
  const [verifying2FA, setVerifying2FA] = useState(false);
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [crmCustomers, setCrmCustomers] = useState<CrmCustomer[]>([]);
  const [workers, setWorkers] = useState<{ id: string; user_id: string; role: string; created_at: string }[]>([]);
  const [newWorkerEmail, setNewWorkerEmail] = useState("");
  const [addingWorker, setAddingWorker] = useState(false);
  const [analytics, setAnalytics] = useState({ visitors: 0, pageViews: 0, avgDuration: 0 });
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [tourCountryFilter, setTourCountryFilter] = useState<string>("all");
  const [tourStatusFilter, setTourStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("bookings");
  
  // Tour form state
  const [tourDialogOpen, setTourDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [tourForm, setTourForm] = useState({
    title: "", location: "", description: "", price: "", duration: "",
    image_url: "", country: "South Africa", city: "", category: "tour",
    badge: "", badge_type: "popular", status: "draft",
    itinerary: "" // JSON string
  });
  const [savingTour, setSavingTour] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
        return;
      }
      if (session?.user) {
        setTimeout(() => checkAdminRole(session.user.id), 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setAuthLoading(false);
        navigate("/auth");
        return;
      }
      checkAdminRole(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error || !data) {
        toast({ title: "Access Denied", description: "You don't have admin privileges.", variant: "destructive" });
        navigate("/");
        return;
      }

      const { data: twoFAData } = await supabase
        .from("admin_2fa")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (twoFAData?.is_enabled) {
        setHas2FASetup(true);
        setRequires2FA(true);
        setOtpSecret(twoFAData.totp_secret);
      } else {
        setHas2FASetup(false);
        setRequires2FA(true);
        const totp = new OTPAuth.TOTP({
          issuer: "Touring Places",
          label: user?.email || "Admin",
          algorithm: "SHA1",
          digits: 6,
          period: 30,
          secret: OTPAuth.Secret.fromHex(crypto.getRandomValues(new Uint8Array(20)).reduce((s, b) => s + b.toString(16).padStart(2, '0'), ''))
        });
        setOtpSecret(totp.secret.hex);
        setOtpUri(totp.toString());
      }
      
      setIsAdmin(true);
      setAuthLoading(false);
    } catch (error) {
      console.error("Error:", error);
      navigate("/");
    }
  };

  const verify2FA = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast({ title: "Invalid Code", description: "Please enter a 6-digit code", variant: "destructive" });
      return;
    }

    setVerifying2FA(true);
    try {
      const totp = new OTPAuth.TOTP({
        issuer: "Touring Places",
        label: user?.email || "Admin",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromHex(otpSecret)
      });

      const delta = totp.validate({ token: otpCode, window: 1 });
      
      if (delta === null) {
        toast({ title: "Invalid Code", description: "The code is incorrect. Please try again.", variant: "destructive" });
        return;
      }

      if (!has2FASetup) {
        const { error } = await supabase
          .from("admin_2fa")
          .upsert({ user_id: user?.id, totp_secret: otpSecret, is_enabled: true });
        if (error) throw error;
        toast({ title: "2FA Enabled", description: "Two-factor authentication is now enabled." });
      }

      setRequires2FA(false);
      fetchAllData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to verify code", variant: "destructive" });
    } finally {
      setVerifying2FA(false);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, suppliersRes, toursRes, transactionsRes, analyticsRes, workersRes, crmRes] = await Promise.all([
        supabase.from("bookings").select("*").order("created_at", { ascending: false }),
        supabase.from("suppliers").select("*").order("created_at", { ascending: false }),
        supabase.from("tours").select("*").order("created_at", { ascending: false }),
        supabase.from("transactions").select("*").order("created_at", { ascending: false }),
        supabase.from("site_analytics").select("*").order("created_at", { ascending: false }).limit(1000),
        supabase.from("user_roles").select("*").eq("role", "worker").order("created_at", { ascending: false }),
        supabase.from("crm_customers").select("*").order("created_at", { ascending: false }),
      ]);

      setBookings(bookingsRes.data || []);
      setFilteredBookings(bookingsRes.data || []);
      setSuppliers(suppliersRes.data || []);
      setTours(toursRes.data || []);
      setTransactions(transactionsRes.data || []);
      setWorkers(workersRes.data || []);
      setCrmCustomers(crmRes.data || []);
      
      const analyticsData = analyticsRes.data || [];
      const uniqueSessions = new Set(analyticsData.map(a => a.session_id));
      const totalDuration = analyticsData.reduce((sum, a) => sum + (a.duration_seconds || 0), 0);
      setAnalytics({
        visitors: uniqueSessions.size,
        pageViews: analyticsData.length,
        avgDuration: analyticsData.length > 0 ? Math.round(totalDuration / analyticsData.length) : 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-sync CRM from bookings
  const syncCRM = async () => {
    try {
      const { data: allBookings } = await supabase.from("bookings").select("*").not("user_id", "is", null);
      if (!allBookings) return;

      // Group by user_id
      const userMap = new Map<string, { email: string; name: string; count: number; lastDate: string }>();
      allBookings.forEach(b => {
        if (!b.user_id) return;
        const existing = userMap.get(b.user_id);
        if (existing) {
          existing.count++;
          if (b.created_at > existing.lastDate) existing.lastDate = b.created_at;
        } else {
          userMap.set(b.user_id, {
            email: b.customer_email,
            name: b.customer_name,
            count: 1,
            lastDate: b.created_at,
          });
        }
      });

      for (const [userId, data] of userMap) {
        await supabase.from("crm_customers").upsert({
          user_id: userId,
          email: data.email,
          full_name: data.name,
          total_bookings: data.count,
          last_booking_date: data.lastDate,
        }, { onConflict: "user_id" });
      }

      toast({ title: "CRM Synced", description: `Synced ${userMap.size} customers from bookings.` });
      fetchAllData();
    } catch (error: any) {
      toast({ title: "Sync Error", description: error.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    let filtered = [...bookings];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.booking_reference.toLowerCase().includes(term) ||
        b.customer_name.toLowerCase().includes(term) ||
        b.customer_email.toLowerCase().includes(term) ||
        b.destination.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== "all") filtered = filtered.filter(b => b.status === statusFilter);
    if (typeFilter !== "all") filtered = filtered.filter(b => b.booking_type === typeFilter);
    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, typeFilter, bookings]);

  const filteredTours = tours.filter(t => {
    if (tourCountryFilter !== "all" && t.country !== tourCountryFilter) return false;
    if (tourStatusFilter !== "all" && t.status !== tourStatusFilter) return false;
    return true;
  });

  const tourCountries = [...new Set(tours.map(t => t.country).filter(Boolean))];

  const updateBookingStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    toast({ title: "Updated", description: `Status changed to ${newStatus}` });
  };

  const updateSupplierStatus = async (id: string, status: "approved" | "pending" | "rejected" | "suspended") => {
    const updateData: any = { status };
    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = user?.id || null;
    } else {
      updateData.approved_at = null;
      updateData.approved_by = null;
    }
    const { error } = await supabase.from("suppliers").update(updateData).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    toast({ title: "Updated", description: `Supplier ${status}` });
  };

  const openTourForm = (tour?: Tour) => {
    if (tour) {
      setEditingTour(tour);
      setTourForm({
        title: tour.title,
        location: tour.location,
        description: tour.description || "",
        price: String(tour.price),
        duration: tour.duration || "",
        image_url: tour.image_url || "",
        country: tour.country || "South Africa",
        city: tour.city || "",
        category: tour.category || "tour",
        badge: tour.badge || "",
        badge_type: tour.badge_type || "popular",
        status: tour.status || "draft",
        itinerary: tour.itinerary ? JSON.stringify(tour.itinerary, null, 2) : "[]",
      });
    } else {
      setEditingTour(null);
      setTourForm({
        title: "", location: "", description: "", price: "", duration: "",
        image_url: "", country: "South Africa", city: "", category: "tour",
        badge: "", badge_type: "popular", status: "draft", itinerary: "[]",
      });
    }
    setTourDialogOpen(true);
  };

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTour(true);
    try {
      let parsedItinerary = [];
      try { parsedItinerary = JSON.parse(tourForm.itinerary); } catch { parsedItinerary = []; }

      const tourData = {
        title: tourForm.title.trim(),
        location: tourForm.location.trim(),
        description: tourForm.description.trim() || null,
        price: parseFloat(tourForm.price),
        duration: tourForm.duration.trim() || null,
        image_url: tourForm.image_url.trim() || null,
        country: tourForm.country || null,
        city: tourForm.city.trim() || null,
        category: tourForm.category || "tour",
        badge: tourForm.badge.trim() || null,
        badge_type: tourForm.badge_type || "popular",
        status: tourForm.status,
        is_active: tourForm.status === "live",
        itinerary: parsedItinerary,
      };

      if (editingTour) {
        const { error } = await supabase.from("tours").update(tourData).eq("id", editingTour.id);
        if (error) throw error;
        toast({ title: "Tour Updated" });
      } else {
        const { error } = await supabase.from("tours").insert({ ...tourData, supplier_id: null });
        if (error) throw error;
        toast({ title: "Tour Added" });
      }
      setTourDialogOpen(false);
      fetchAllData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSavingTour(false);
    }
  };

  const deleteTour = async (id: string) => {
    if (!confirm("Delete this tour?")) return;
    const { error } = await supabase.from("tours").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Deleted" });
    fetchAllData();
  };

  const toggleTourStatus = async (tour: Tour) => {
    const newStatus = tour.status === "live" ? "draft" : "live";
    const { error } = await supabase.from("tours").update({ status: newStatus, is_active: newStatus === "live" }).eq("id", tour.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setTours(prev => prev.map(t => t.id === tour.id ? { ...t, status: newStatus, is_active: newStatus === "live" } : t));
    toast({ title: `Tour ${newStatus === "live" ? "Published" : "Drafted"}` });
  };

  const addWorkerRole = async () => {
    if (!newWorkerEmail.trim()) return;
    setAddingWorker(true);
    try {
      let userId = newWorkerEmail.trim();
      if (newWorkerEmail.includes("@")) {
        toast({ title: "Note", description: "Please enter the user's ID (UUID).", variant: "destructive" });
        setAddingWorker(false);
        return;
      }
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "worker" as any });
      if (error) throw error;
      toast({ title: "Worker Added" });
      setNewWorkerEmail("");
      fetchAllData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setAddingWorker(false);
    }
  };

  const removeWorkerRole = async (id: string) => {
    if (!confirm("Remove this worker role?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Removed" });
    fetchAllData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed": case "approved": case "live":
        return <Badge className="bg-green-500/10 text-green-600"><CheckCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      case "cancelled": case "rejected":
        return <Badge className="bg-red-500/10 text-red-600"><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      case "draft":
        return <Badge className="bg-gray-500/10 text-gray-600"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-600"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
    }
  };

  const totalSales = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const pendingSales = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (requires2FA) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-2" />
            <CardTitle>{has2FASetup ? "Two-Factor Authentication" : "Setup 2FA"}</CardTitle>
            <CardDescription>
              {has2FASetup ? "Enter the 6-digit code from your authenticator app" : "Scan the QR code with Google Authenticator"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!has2FASetup && (
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpUri)}`} alt="2FA QR Code" className="w-48 h-48" />
                </div>
                <p className="text-xs text-muted-foreground break-all">Manual entry: {otpSecret}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input id="otp" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="text-center text-2xl tracking-widest" maxLength={6} />
            </div>
            <Button onClick={verify2FA} className="w-full" disabled={verifying2FA}>
              {verifying2FA ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {has2FASetup ? "Verify" : "Enable 2FA & Continue"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) return null;

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-charcoal text-card py-4 px-6">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/"><Button variant="ghost" size="icon" className="text-card hover:text-primary"><ArrowLeft className="w-5 h-5" /></Button></a>
            <div>
              <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400"><Shield className="w-3 h-3 mr-1" />2FA Active</Badge>
            <Button onClick={() => fetchAllData()} variant="outline" className="gap-2 border-card/20 text-card hover:bg-card/10">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2 border-card/20 text-card hover:bg-card/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Bookings</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Visitors</p><p className="text-2xl font-bold">{analytics.visitors}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Tours</p><p className="text-2xl font-bold">{tours.length}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">CRM</p><p className="text-2xl font-bold">{crmCustomers.length}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Sales</p><p className="text-2xl font-bold text-green-600">R{totalSales.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-yellow-600">R{pendingSales.toLocaleString()}</p></CardContent></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="bookings" className="gap-1"><Calendar className="w-4 h-4" /><span className="hidden sm:inline">Bookings</span></TabsTrigger>
            <TabsTrigger value="tours" className="gap-1"><Package className="w-4 h-4" /><span className="hidden sm:inline">Tours</span></TabsTrigger>
            <TabsTrigger value="crm" className="gap-1"><Contact className="w-4 h-4" /><span className="hidden sm:inline">CRM</span></TabsTrigger>
            <TabsTrigger value="suppliers" className="gap-1"><Building2 className="w-4 h-4" /><span className="hidden sm:inline">Suppliers</span></TabsTrigger>
            <TabsTrigger value="workers" className="gap-1"><UserCog className="w-4 h-4" /><span className="hidden sm:inline">Workers</span></TabsTrigger>
            <TabsTrigger value="sales" className="gap-1"><DollarSign className="w-4 h-4" /><span className="hidden sm:inline">Sales</span></TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1"><BarChart3 className="w-4 h-4" /><span className="hidden sm:inline">Analytics</span></TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map(b => (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-primary">{b.booking_reference}</TableCell>
                        <TableCell>
                          <div>{b.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{b.customer_email}</div>
                        </TableCell>
                        <TableCell>{b.destination}</TableCell>
                        <TableCell>{format(new Date(b.travel_date), "MMM dd, yyyy")}</TableCell>
                        <TableCell>{getStatusBadge(b.status)}</TableCell>
                        <TableCell>
                          <Select value={b.status} onValueChange={v => updateBookingStatus(b.id, v)}>
                            <SelectTrigger className="w-[120px] h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tours Tab - Enhanced */}
          <TabsContent value="tours">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Manage Tours</CardTitle>
                  <CardDescription>Create, edit, and manage all tours. Toggle live/draft status.</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={tourCountryFilter} onValueChange={setTourCountryFilter}>
                    <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Countries" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {tourCountries.map(c => <SelectItem key={c} value={c!}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={tourStatusFilter} onValueChange={setTourStatusFilter}>
                    <SelectTrigger className="w-[120px]"><SelectValue placeholder="All Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => openTourForm()} className="gap-2"><Plus className="w-4 h-4" />Add Tour</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Live</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTours.map(t => (
                      <TableRow key={t.id}>
                        <TableCell>
                          {t.image_url ? (
                            <img src={t.image_url} alt={t.title} className="w-12 h-12 rounded object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center"><Package className="w-5 h-5 text-muted-foreground" /></div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{t.title}</div>
                          <div className="text-xs text-muted-foreground">{t.location}</div>
                        </TableCell>
                        <TableCell>{t.country || "N/A"}</TableCell>
                        <TableCell>R{t.price?.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(t.status)}</TableCell>
                        <TableCell>
                          <Switch checked={t.status === "live"} onCheckedChange={() => toggleTourStatus(t)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openTourForm(t)}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteTour(t.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTours.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No tours found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Tour Add/Edit Dialog */}
            <Dialog open={tourDialogOpen} onOpenChange={setTourDialogOpen}>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingTour ? "Edit Tour" : "Add New Tour"}</DialogTitle>
                  <DialogDescription>Fill in the tour details below. Set status to "live" to publish.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveTour} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Title *</Label><Input value={tourForm.title} onChange={e => setTourForm({...tourForm, title: e.target.value})} required /></div>
                    <div className="space-y-2"><Label>Location *</Label><Input value={tourForm.location} onChange={e => setTourForm({...tourForm, location: e.target.value})} required /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Country</Label>
                      <Select value={tourForm.country} onValueChange={v => setTourForm({...tourForm, country: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["South Africa", "Kenya", "Ghana", "Tanzania", "Botswana", "Zimbabwe", "Mozambique", "Namibia", "United Kingdom", "UAE", "Japan", "China", "Brazil"].map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>City</Label><Input value={tourForm.city} onChange={e => setTourForm({...tourForm, city: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Category</Label>
                      <Select value={tourForm.category} onValueChange={v => setTourForm({...tourForm, category: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tour">Tour</SelectItem>
                          <SelectItem value="safari">Safari</SelectItem>
                          <SelectItem value="adventure">Adventure</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="beach">Beach</SelectItem>
                          <SelectItem value="city">City</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Price (ZAR) *</Label><Input type="number" value={tourForm.price} onChange={e => setTourForm({...tourForm, price: e.target.value})} required /></div>
                    <div className="space-y-2"><Label>Duration</Label><Input value={tourForm.duration} onChange={e => setTourForm({...tourForm, duration: e.target.value})} placeholder="8 hours" /></div>
                    <div className="space-y-2"><Label>Status</Label>
                      <Select value={tourForm.status} onValueChange={v => setTourForm({...tourForm, status: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Badge</Label><Input value={tourForm.badge} onChange={e => setTourForm({...tourForm, badge: e.target.value})} placeholder="e.g. Best Seller" /></div>
                    <div className="space-y-2"><Label>Badge Type</Label>
                      <Select value={tourForm.badge_type} onValueChange={v => setTourForm({...tourForm, badge_type: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popular">Popular</SelectItem>
                          <SelectItem value="special">Special</SelectItem>
                          <SelectItem value="discount">Discount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2"><Label>Image URL</Label><Input value={tourForm.image_url} onChange={e => setTourForm({...tourForm, image_url: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Description</Label><Textarea value={tourForm.description} onChange={e => setTourForm({...tourForm, description: e.target.value})} rows={3} /></div>
                  <div className="space-y-2">
                    <Label>Itinerary (JSON)</Label>
                    <Textarea value={tourForm.itinerary} onChange={e => setTourForm({...tourForm, itinerary: e.target.value})} rows={5} placeholder='[{"day": 1, "title": "Arrival", "description": "Check in and welcome dinner"}]' className="font-mono text-sm" />
                    <p className="text-xs text-muted-foreground">Format: JSON array of objects with day, title, description fields.</p>
                  </div>
                  <Button type="submit" className="w-full" disabled={savingTour}>
                    {savingTour ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingTour ? "Save Changes" : "Add Tour"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* CRM Tab */}
          <TabsContent value="crm">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Customer Relationship Management</CardTitle>
                  <CardDescription>All users who have booked or used services.</CardDescription>
                </div>
                <Button onClick={syncCRM} className="gap-2"><RefreshCw className="w-4 h-4" />Sync from Bookings</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Booking</TableHead>
                      <TableHead>Tags</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {crmCustomers.map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.full_name || "N/A"}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.phone || "—"}</TableCell>
                        <TableCell>{c.total_bookings}</TableCell>
                        <TableCell>R{(c.total_spent || 0).toLocaleString()}</TableCell>
                        <TableCell>{c.last_booking_date ? format(new Date(c.last_booking_date), "MMM dd, yyyy") : "—"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {(c.tags || []).map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {crmCustomers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No CRM data yet. Click "Sync from Bookings" to populate from existing bookings.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers">
            <Card>
              <CardHeader><CardTitle>Supplier Applications</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.company_name}</TableCell>
                        <TableCell>{s.contact_person}</TableCell>
                        <TableCell>{s.email}</TableCell>
                        <TableCell>{getStatusBadge(s.status)}</TableCell>
                        <TableCell>
                          <Select value={s.status} onValueChange={(v: "approved" | "pending" | "rejected" | "suspended") => updateSupplierStatus(s.id, v)}>
                            <SelectTrigger className="w-[120px] h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers">
            <Card>
              <CardHeader>
                <CardTitle>Worker Role Management</CardTitle>
                <CardDescription>Assign and manage worker roles.</CardDescription>
                <div className="flex gap-4 mt-4">
                  <Input placeholder="Enter user ID (UUID)..." value={newWorkerEmail} onChange={e => setNewWorkerEmail(e.target.value)} className="flex-1" />
                  <Button onClick={addWorkerRole} disabled={addingWorker} className="gap-2">
                    {addingWorker ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Worker
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workers.map(w => (
                      <TableRow key={w.id}>
                        <TableCell className="font-mono text-xs">{w.user_id}</TableCell>
                        <TableCell><Badge className="bg-blue-500/10 text-blue-600"><UserCog className="w-3 h-3 mr-1" />worker</Badge></TableCell>
                        <TableCell>{w.created_at ? format(new Date(w.created_at), "MMM dd, yyyy") : "N/A"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeWorkerRole(w.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {workers.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No workers assigned yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View all sales and payment records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card><CardContent className="pt-4 text-center"><p className="text-xs text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold text-green-600">R{totalSales.toLocaleString()}</p></CardContent></Card>
                  <Card><CardContent className="pt-4 text-center"><p className="text-xs text-muted-foreground">Pending</p><p className="text-2xl font-bold text-yellow-600">R{pendingSales.toLocaleString()}</p></CardContent></Card>
                  <Card><CardContent className="pt-4 text-center"><p className="text-xs text-muted-foreground">Transactions</p><p className="text-2xl font-bold">{transactions.length}</p></CardContent></Card>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map(t => (
                      <TableRow key={t.id}>
                        <TableCell>{format(new Date(t.created_at), "MMM dd, yyyy")}</TableCell>
                        <TableCell className="font-medium">{t.currency} {t.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(t.status)}</TableCell>
                        <TableCell className="font-mono text-xs">{t.id.slice(0, 8)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader><CardTitle>Site Analytics</CardTitle><CardDescription>Visitor statistics and engagement</CardDescription></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardContent className="pt-6 text-center">
                      <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-3xl font-bold">{analytics.visitors}</p>
                      <p className="text-sm text-muted-foreground">Unique Visitors</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                    <CardContent className="pt-6 text-center">
                      <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-3xl font-bold">{analytics.pageViews}</p>
                      <p className="text-sm text-muted-foreground">Page Views</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
                    <CardContent className="pt-6 text-center">
                      <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-3xl font-bold">{analytics.avgDuration}s</p>
                      <p className="text-sm text-muted-foreground">Avg. Duration</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
