import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Search, Filter, Loader2 } from "lucide-react";
import BookingForm from "./BookingForm";
import BookingList from "./BookingList";
import type { Booking } from "@/types";
import api from "@/lib/api";

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("list");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/bookings");
      const bookingData = response.data.bookings || [];
      setBookings(bookingData);
    } catch (error: unknown) {
      console.error("Failed to fetch bookings:", error);
      
      // Check if it's an axios error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        
        if (axiosError.response?.status === 404) {
          console.warn("Booking endpoints not implemented yet. Using empty state.");
          // Set empty bookings instead of showing error for missing endpoints
          setBookings([]);
          return;
        }
        
        if (axiosError.response?.status !== 401) {
          alert(`Booking API Error: ${axiosError.response?.data?.message || 'Endpoint not available'}. Please implement the backend booking system.`);
        }
      } else {
        alert("Failed to fetch bookings: Network error or API not available");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Memoized filtered bookings for better performance
  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((booking) => {
        const hotel = typeof booking.hotel === 'object' ? booking.hotel : null;
        return (
          booking.guestName.toLowerCase().includes(searchLower) ||
          booking.guestEmail.toLowerCase().includes(searchLower) ||
          booking.guestPhone.includes(searchTerm) ||
          booking._id.toLowerCase().includes(searchLower) ||
          (hotel && hotel.name.toLowerCase().includes(searchLower))
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.bookingStatus === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter((booking) => booking.paymentStatus === paymentFilter);
    }

    return filtered;
  }, [searchTerm, statusFilter, paymentFilter, bookings]);

  // Memoized stats calculation
  const stats = useMemo(() => ({
    total: bookings.length,
    confirmed: bookings.filter((b) => b.bookingStatus === "Confirmed").length,
    pending: bookings.filter((b) => b.bookingStatus === "Pending").length,
    cancelled: bookings.filter((b) => b.bookingStatus === "Cancelled").length,
    completed: bookings.filter((b) => b.bookingStatus === "Completed").length
  }), [bookings]);

  const handleBookingSuccess = () => {
    setActiveTab("list");
    fetchBookings();
  };

  const getStatColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Manage your hotel reservations</p>
        </div>
        <Button 
          onClick={() => setActiveTab("new")} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          New Booking
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <Badge className={getStatColor("confirmed")} variant="outline">
                {stats.confirmed}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Badge className={getStatColor("pending")} variant="outline">
                {stats.pending}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <Badge className={getStatColor("completed")} variant="outline">
                {stats.completed}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <Badge className={getStatColor("cancelled")} variant="outline">
                {stats.cancelled}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Calendar size={16} />
            My Bookings ({filteredBookings.length})
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Plus size={16} />
            New Booking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter size={18} />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Booking Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="Pending">Payment Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPaymentFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          <BookingList 
            bookings={filteredBookings} 
            onBookingUpdate={fetchBookings}
            isAdmin={user?.role === 'admin'}
          />
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Plus size={20} />
                Create New Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BookingForm onSuccess={handleBookingSuccess} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookings;