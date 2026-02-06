import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, LogOut, Loader2, Calendar, Package, Search, CheckCircle, Clock, XCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Session } from "@supabase/supabase-js";

interface Booking {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_email: string;
  destination: string;
  booking_type: string;
  travel_date: string;
  status: string;
  created_at: string;
}

const WorkerDashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isWorker, setIsWorker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setAuthLoading(false);
        navigate("/auth");
        return;
      }
      checkWorkerRole(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkWorkerRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "worker")
      .maybeSingle();

    if (!data) {
      toast({ title: "Access Denied", description: "You don't have worker privileges.", variant: "destructive" });
      navigate("/");
      return;
    }
    setIsWorker(true);
    setAuthLoading(false);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    setBookings(data || []);
    setLoading(false);
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    toast({ title: "Updated", description: `Status changed to ${newStatus}` });
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = !searchTerm ||
      b.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500/10 text-green-600"><CheckCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-600"><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-600"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isWorker) return null;

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
              <h1 className="font-display text-2xl font-bold">Worker Dashboard</h1>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-400"><Users className="w-3 h-3 mr-1" />Worker</Badge>
            <Button onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }} variant="outline" className="gap-2 border-card/20 text-card hover:bg-card/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Bookings</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Confirmed</p><p className="text-2xl font-bold text-green-600">{stats.confirmed}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Bookings</CardTitle>
            <CardDescription>View and update booking statuses</CardDescription>
            <div className="flex gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search bookings..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
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
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
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
                      <TableCell><Badge variant="outline">{b.booking_type}</Badge></TableCell>
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
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WorkerDashboard;
