
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MapPin, 
  Building2, 
  Calendar,
  IndianRupee,
  TrendingUp,
  Star,
  Package,
  Map,
  Eye,
  Plus,
  Activity,
  Loader2
} from "lucide-react";
import type { User, Place, SubPlace, Hotel, Booking, Rating } from "@/types";
import api from "@/lib/api";

interface DashboardStats {
  totalUsers: number;
  totalPlaces: number;
  totalSubPlaces: number;
  totalHotels: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  totalRatings: number;
  averageRating: number;
  monthlyRevenue: number;
  monthlyBookings: number;
}

interface RecentActivity {
  bookings: Booking[];
  users: User[];
  ratings: Rating[];
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPlaces: 0,
    totalSubPlaces: 0,
    totalHotels: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    totalRatings: 0,
    averageRating: 0,
    monthlyRevenue: 0,
    monthlyBookings: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity>({
    bookings: [],
    users: [],
    ratings: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data with individual error handling and debugging
      // console.log("Fetching dashboard data...");
      
      let users: User[] = [];
      let places: Place[] = [];
      let subPlaces: SubPlace[] = [];
      let hotels: Hotel[] = [];
      let bookings: Booking[] = [];
      let ratings: Rating[] = [];

      // Fetch users
      try {
        const usersRes = await api.get("/users");
        users = Array.isArray(usersRes.data) ? usersRes.data : [];
        // console.log("Users fetched:", users.length, users);
      } catch {
        // console.error("Error fetching users:", err);
      }

      // Fetch places
      try {
        const placesRes = await api.get("/places");
        places = Array.isArray(placesRes.data) ? placesRes.data : [];
        // console.log("Places fetched:", places.length, places);
      } catch {
        // console.error("Error fetching places:", err);
      }

      // Fetch subplaces
      try {
        const subPlacesRes = await api.get("/subplaces");
        subPlaces = Array.isArray(subPlacesRes.data) ? subPlacesRes.data : [];
        // console.log("SubPlaces fetched:", subPlaces.length, subPlaces);
      } catch {
        // console.error("Error fetching subplaces:", err);
      }

      // Fetch hotels
      try {
        const hotelsRes = await api.get("/hotels");
        hotels = Array.isArray(hotelsRes.data) ? hotelsRes.data : [];
        // console.log("Hotels fetched:", hotels.length, hotels);
      } catch {
        // console.error("Error fetching hotels:", err);
      }

      // Fetch bookings
      try {
        const bookingsRes = await api.get("/bookings");
        // console.log("Raw bookings response:", bookingsRes);
        
        // Check if data is nested or in a different structure
        let bookingsData = bookingsRes.data;
        if (bookingsData && typeof bookingsData === 'object') {
          // Check common API response patterns
          if (bookingsData.bookings) bookingsData = bookingsData.bookings;
          else if (bookingsData.data) bookingsData = bookingsData.data;
          else if (bookingsData.results) bookingsData = bookingsData.results;
        }
        
        bookings = Array.isArray(bookingsData) ? bookingsData : [];
        // console.log("Bookings processed:", bookings.length);
        
        // Log first booking structure for debugging
        if (bookings.length > 0) {
          // console.log("First booking structure:", JSON.stringify(bookings[0], null, 2));
        }
      } catch {
        // console.error("Error fetching bookings:", err);
      }

      // Fetch ratings
      try {
        const ratingsRes = await api.get("/ratings");
        ratings = Array.isArray(ratingsRes.data) ? ratingsRes.data : [];
        // console.log("Ratings fetched:", ratings.length, ratings);
      } catch {
        // console.error("Error fetching ratings:", err);
      }

      // If no data from backend, use demo data for showcase
      if (users.length === 0 && places.length === 0 && hotels.length === 0) {
        // console.log("No backend data found, using demo data");
        
        const demoUsers = [
          { _id: "1", firstName: "John", lastName: "Doe", email: "john@example.com", contactNo: "1234567890", address: "Ahmedabad", isAdmin: false, createdAt: "2024-11-15T00:00:00Z" },
          { _id: "2", firstName: "Jane", lastName: "Smith", email: "jane@example.com", contactNo: "0987654321", address: "Surat", isAdmin: true, createdAt: "2024-11-20T00:00:00Z" },
          { _id: "3", firstName: "Raj", lastName: "Patel", email: "raj@example.com", contactNo: "5555555555", address: "Vadodara", isAdmin: false, createdAt: "2024-12-01T00:00:00Z" },
        ];
        
        const demoPlaces = [
          { _id: "1", name: "Sabarmati Ashram", description: "Gandhi's Ashram", location: "Ahmedabad", price: 0, createdBy: null },
          { _id: "2", name: "Rann of Kutch", description: "White Desert", location: "Kutch", price: 500, createdBy: null },
          { _id: "3", name: "Somnath Temple", description: "Famous Shiva Temple", location: "Somnath", price: 100, createdBy: null },
        ];
        
        const demoHotels = [
          { _id: "1", name: "Hotel Grand Gujarat", description: "Luxury hotel in heart of city", place: demoPlaces[0], location: "Ahmedabad", address: "SG Highway", contactNo: "123456789", email: "grand@hotel.com", images: [], pricePerNight: 3000, category: "Luxury" as const, amenities: ["AC", "WiFi", "Pool"], roomTypes: [], averageRating: 4.5, isActive: true, createdBy: demoUsers[0], createdAt: "2024-10-01T00:00:00Z" },
          { _id: "2", name: "Kutch Resort", description: "Desert resort experience", place: demoPlaces[1], location: "Kutch", address: "Rann Area", contactNo: "987654321", email: "kutch@resort.com", images: [], pricePerNight: 5000, category: "Resort" as const, amenities: ["AC", "Desert Safari"], roomTypes: [], averageRating: 4.8, isActive: true, createdBy: demoUsers[1], createdAt: "2024-10-15T00:00:00Z" },
        ];
        
        const demoBookings = [
          { _id: "1", user: demoUsers[0], hotel: demoHotels[0], checkInDate: "2024-12-01", checkOutDate: "2024-12-03", numberOfNights: 2, roomType: "Deluxe", numberOfRooms: 1, guestName: "John Doe", guestEmail: "john@example.com", guestPhone: "1234567890", numberOfGuests: 2, pricePerNight: 3000, totalAmount: 6000, taxAmount: 600, finalAmount: 6600, paymentStatus: "Paid" as const, paymentMethod: "Razorpay", bookingStatus: "Confirmed" as const, createdAt: "2024-12-01T00:00:00Z", updatedAt: "2024-12-01T00:00:00Z" },
          { _id: "2", user: demoUsers[1], hotel: demoHotels[1], checkInDate: "2024-12-10", checkOutDate: "2024-12-12", numberOfNights: 2, roomType: "Premium", numberOfRooms: 1, guestName: "Jane Smith", guestEmail: "jane@example.com", guestPhone: "0987654321", numberOfGuests: 4, pricePerNight: 5000, totalAmount: 10000, taxAmount: 1000, finalAmount: 11000, paymentStatus: "Pending" as const, paymentMethod: "Razorpay", bookingStatus: "Pending" as const, createdAt: "2024-12-01T10:00:00Z", updatedAt: "2024-12-01T10:00:00Z" },
          { _id: "3", user: demoUsers[2], hotel: demoHotels[0], checkInDate: "2024-11-25", checkOutDate: "2024-11-27", numberOfNights: 2, roomType: "Standard", numberOfRooms: 2, guestName: "Raj Patel", guestEmail: "raj@example.com", guestPhone: "5555555555", numberOfGuests: 3, pricePerNight: 2500, totalAmount: 10000, taxAmount: 1000, finalAmount: 11000, paymentStatus: "Paid" as const, paymentMethod: "Razorpay", bookingStatus: "Completed" as const, createdAt: "2024-11-25T00:00:00Z", updatedAt: "2024-11-27T00:00:00Z" },
        ];
        
        const demoRatings = [
          { _id: "1", user: demoUsers[0], ratingType: "Hotel" as const, hotel: demoHotels[0], rating: 5, title: "Excellent Stay", comment: "Great service and clean rooms. Highly recommended!", helpfulCount: 10, images: [], createdAt: "2024-12-01T00:00:00Z" },
          { _id: "2", user: demoUsers[1], ratingType: "Hotel" as const, hotel: demoHotels[1], rating: 4, title: "Good Desert Experience", comment: "Amazing desert views but service could be better", helpfulCount: 5, images: [], createdAt: "2024-11-30T00:00:00Z" },
          { _id: "3", user: demoUsers[2], ratingType: "Place" as const, place: demoPlaces[0], rating: 5, title: "Historical Place", comment: "Must visit for history lovers", helpfulCount: 8, images: [], createdAt: "2024-11-28T00:00:00Z" },
        ];

        users = demoUsers;
        places = demoPlaces;
        hotels = demoHotels;
        bookings = demoBookings;
        ratings = demoRatings;
      }

      // console.log("Final data counts:", {
      //   users: users.length,
      //   places: places.length,
      //   subPlaces: subPlaces.length,
      //   hotels: hotels.length,
      //   bookings: bookings.length,
      //   ratings: ratings.length
      // });

      // Calculate stats with detailed debugging for revenue
      // console.log("All bookings for revenue calculation:", bookings);
      
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / ratings.length 
        : 0;

      // Calculate monthly metrics (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Calculate stats based on user role
      const userFilteredBookings = user?.isAdmin 
        ? bookings 
        : bookings.filter(booking => 
            booking.user?._id === user?._id || 
            booking.guestEmail === user?.email
          );

      const userTotalRevenue = userFilteredBookings
        .filter(b => {
          const status = (b.paymentStatus || '').toString().toLowerCase();
          return status === "paid" || b.paymentStatus === "Paid";
        })
        .reduce((sum, b) => {
          const amount = Number(b.finalAmount) || Number(b.totalAmount) || 0;
          return sum + amount;
        }, 0);

      const userPendingBookings = userFilteredBookings.filter(b => b.bookingStatus === "Pending").length;

      const userMonthlyBookings = userFilteredBookings.filter(b => {
        if (!b.createdAt) return false;
        const bookingDate = new Date(b.createdAt);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      }).length;

      const userMonthlyRevenue = userFilteredBookings
        .filter(b => {
          if (!b.createdAt) return false;
          const bookingDate = new Date(b.createdAt);
          return bookingDate.getMonth() === currentMonth && 
                 bookingDate.getFullYear() === currentYear &&
                 (b.paymentStatus === "Paid" || (b.paymentStatus || '').toString().toLowerCase() === "paid");
        })
        .reduce((sum, b) => sum + (Number(b.finalAmount) || Number(b.totalAmount) || 0), 0);

      const calculatedStats = {
        totalUsers: user?.isAdmin ? users.length : 1, // Normal users only see themselves
        totalPlaces: places.length,
        totalSubPlaces: subPlaces.length,
        totalHotels: hotels.length,
        totalBookings: userFilteredBookings.length,
        totalRevenue: userTotalRevenue,
        pendingBookings: userPendingBookings,
        totalRatings: ratings.length,
        averageRating,
        monthlyRevenue: userMonthlyRevenue,
        monthlyBookings: userMonthlyBookings,
      };

      // console.log("Calculated stats:", calculatedStats);
      setStats(calculatedStats);

      // Set recent activity (last 5 items, sorted by creation date)
      // Filter bookings based on user role
      const filteredBookings = user?.isAdmin 
        ? bookings // Admin sees all bookings
        : bookings.filter(booking => 
            booking.user?._id === user?._id || 
            booking.guestEmail === user?.email
          ); // Normal users see only their own bookings

      const sortedBookings = filteredBookings
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 5);
      
      const sortedUsers = users
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 5);
      
      const sortedRatings = ratings
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 5);

      setRecentActivity({
        bookings: sortedBookings,
        users: sortedUsers,
        ratings: sortedRatings,
      });

    } catch {
      // console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName}! Here's what's happening with Gujarat Tourism.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchDashboardData} variant="outline" className="gap-2" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Activity className="h-4 w-4" />
            )}
            Refresh Data
          </Button>
          <Button onClick={() => navigate("/dashboard/bookings")} className="gap-2">
            <Calendar className="h-4 w-4" />
            View Bookings
          </Button>
        </div>
      </div>

      {/* Debug Info */}
      {/* {import.meta.env.DEV && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="text-sm text-blue-800">
              <p><strong>Debug Info:</strong></p>
              <p>API URL: {import.meta.env.VITE_API_URL || '/api'}</p>
              <p>Data Status: {stats.totalUsers > 0 ? 'Backend Connected' : 'Using Demo Data'}</p>
              <p>Total Bookings: {stats.totalBookings} | Revenue: ₹{stats.totalRevenue}</p>
              <p>Paid Bookings: {recentActivity.bookings.filter(b => (b.paymentStatus || '').toString().toLowerCase() === 'paid' || b.paymentStatus === 'Paid').length}</p>
              <p className="text-xs mt-1">Check browser console for detailed API logs</p>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Overview Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.isAdmin ? "Total Revenue (All Users)" : "Your Total Spending"}
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-gray-600">
              This month: {formatCurrency(stats.monthlyRevenue)}
            </p>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.isAdmin ? "Total Bookings (All Users)" : "Your Bookings"}
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.monthlyBookings} this month
            </p>
          </CardContent>
        </Card>

        {/* Total Hotels */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hotels</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHotels}</div>
            <p className="text-xs text-gray-600">
              {stats.pendingBookings} pending bookings
            </p>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {stats.averageRating.toFixed(1)}
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-gray-600">
              {stats.totalRatings} total reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => navigate("/dashboard/user")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users Management</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-gray-600 mb-3">Total registered users</p>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Eye className="h-3 w-3" />
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => navigate("/dashboard/place")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Places Management</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlaces}</div>
            <p className="text-xs text-gray-600 mb-3">Tourist places</p>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Plus className="h-3 w-3" />
              Add New Place
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => navigate("/dashboard/subplace")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sub Places</CardTitle>
            <Map className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubPlaces}</div>
            <p className="text-xs text-gray-600 mb-3">Sub locations</p>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Eye className="h-3 w-3" />
              View Sub Places
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="recent-bookings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent-bookings">Recent Bookings</TabsTrigger>
          <TabsTrigger value="recent-users">New Users</TabsTrigger>
          <TabsTrigger value="recent-reviews">Latest Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="recent-bookings" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {user?.isAdmin ? "Recent Bookings (All Users)" : "Your Recent Bookings"}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/bookings")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {recentActivity.bookings.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.bookings.map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{booking.guestName}</p>
                            {user?.isAdmin && (
                              <Badge variant="outline" className="text-xs">
                                ID: {booking.user?._id?.slice(-4) || 'N/A'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{booking.hotel?.name}</p>
                          {user?.isAdmin && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <span>📧 {booking.guestEmail}</span>
                              <span>📱 {booking.guestPhone}</span>
                            </div>
                          )}
                          <p className="text-xs text-gray-500">
                            {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(booking.finalAmount)}</p>
                        <Badge variant={
                          booking.paymentStatus === "Paid" ? "default" :
                          booking.paymentStatus === "Pending" ? "secondary" : "destructive"
                        } className="mb-1">
                          {booking.paymentStatus}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {booking.bookingStatus}
                        </div>
                        {user?.isAdmin && (
                          <div className="text-xs text-gray-400 mt-1">
                            {formatDate(booking.createdAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  {user?.isAdmin ? "No recent bookings from any users" : "You have no recent bookings"}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent-users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                New Users
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/user")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {recentActivity.users.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant={user.isAdmin ? "default" : "secondary"}>
                        {user.isAdmin ? "Admin" : "User"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No recent users</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent-reviews" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-5 w-5" />
                Latest Reviews
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/rating")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {recentActivity.ratings.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.ratings.map((rating) => (
                    <div key={rating._id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{rating.user?.firstName} {rating.user?.lastName}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${
                                  i < rating.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        <Badge variant="outline">{rating.ratingType}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{rating.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(rating.createdAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No recent reviews</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="gap-2 h-auto p-4" onClick={() => navigate("/dashboard/hotel")}>
              <Building2 className="h-5 w-5" />
              <div>
                <p className="font-medium">Manage Hotels</p>
                <p className="text-xs text-gray-600">Add or edit hotels</p>
              </div>
            </Button>

            <Button variant="outline" className="gap-2 h-auto p-4" onClick={() => navigate("/dashboard/bookings")}>
              <Calendar className="h-5 w-5" />
              <div>
                <p className="font-medium">View Bookings</p>
                <p className="text-xs text-gray-600">Manage reservations</p>
              </div>
            </Button>

            <Button variant="outline" className="gap-2 h-auto p-4" onClick={() => navigate("/dashboard/rating")}>
              <Star className="h-5 w-5" />
              <div>
                <p className="font-medium">Manage Reviews</p>
                <p className="text-xs text-gray-600">Respond to feedback</p>
              </div>
            </Button>

            <Button variant="outline" className="gap-2 h-auto p-4" onClick={() => navigate("/dashboard/package")}>
              <Package className="h-5 w-5" />
              <div>
                <p className="font-medium">Tour Packages</p>
                <p className="text-xs text-gray-600">Create packages</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard