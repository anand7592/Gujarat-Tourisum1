import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Package2, 
  Plus, 
  Search, 
  SortAsc, 
  SortDesc,
  Users,
  IndianRupee,
  Activity
} from "lucide-react";
import PackageForm from "./PackageForm";
import PackageList from "./PackageList";
import type { Package } from "@/types";

const PackagePage = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [stats, setStats] = useState({
    totalPackages: 0,
    activePackages: 0,
    totalRevenue: 0,
    totalBookings: 0
  });

  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  // Listen for create package events
  useEffect(() => {
    const handleCreatePackageEvent = () => {
      handleCreatePackage();
    };
    
    window.addEventListener('create-package', handleCreatePackageEvent);
    return () => window.removeEventListener('create-package', handleCreatePackageEvent);
  }, []);

  // Fetch packages from API
  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/packages");
        
      // Debug: Log the API response structure
      console.log('🌐 API Response:', data);
      console.log('🌐 Response structure:', {
        isArray: Array.isArray(data),
        hasPackages: 'packages' in data,
        keys: Object.keys(data || {}),
        dataType: typeof data,
        firstItem: Array.isArray(data) ? data[0] : data.packages?.[0]
      });
      
      // Handle different response structures from backend
      let packagesArray = [];
      if (Array.isArray(data)) {
        packagesArray = data;
      } else if (data && data.packages && Array.isArray(data.packages)) {
        packagesArray = data.packages;
      } else if (data && typeof data === 'object') {
        // If it's a single package object, wrap it in an array
        packagesArray = [data];
      }
      
      console.log('📦 Processed packages:', packagesArray);
      setPackages(packagesArray);
      calculateStats(packagesArray);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setPackages([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate statistics
  const calculateStats = (packagesData: Package[]) => {
    const stats = {
      totalPackages: packagesData.length,
      activePackages: packagesData.filter(p => p.isActive).length,
      totalRevenue: packagesData.reduce((sum, p) => sum + (p.bookedSlots * (p.discountedPrice || p.price)), 0),
      totalBookings: packagesData.reduce((sum, p) => sum + p.bookedSlots, 0)
    };
    setStats(stats);
  };

  // Filter and sort packages
  useEffect(() => {
    let filtered = [...packages];

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(pkg => 
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.places.some(place => place.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter(pkg => pkg.category === categoryFilter);
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(pkg => 
        statusFilter === "active" ? pkg.isActive : !pkg.isActive
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof Package] as string | number;
      let bValue: string | number = b[sortBy as keyof Package] as string | number;

      // Handle special sorting cases
      if (sortBy === "price") {
        aValue = a.discountedPrice || a.price;
        bValue = b.discountedPrice || b.price;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPackages(filtered);
  }, [packages, searchTerm, categoryFilter, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Handle package operations
  const handleCreatePackage = () => {
    setEditingPackage(null);
    setShowForm(true);
  };

  const handleEditPackage = (packageData: Package) => {
    console.log('✏️ Edit package clicked:', packageData);
    console.log('✏️ Package structure check:', {
      hasId: !!packageData._id,
      hasName: !!packageData.name,
      hasGroupSize: !!packageData.groupSize,
      groupSizeStructure: packageData.groupSize
    });
    setEditingPackage(packageData);
    setShowForm(true);
  };

  const handleDeletePackage = async (id: string) => {
    try {
      await api.delete(`/packages/${id}`);
      setPackages(packages.filter(p => p._id !== id));
    } catch (error) {
      console.error("Error deleting package:", error);
      // For now, just remove from state
      setPackages(packages.filter(p => p._id !== id));
    }
  };

  const handleFormSubmit = async (formData: FormData, isUpdate: boolean) => {
    try {
      const url = isUpdate && editingPackage 
        ? `/packages/${editingPackage._id}`
        : "/packages";
      
      const { data: savedPackage } = isUpdate 
        ? await api.put(url, formData)
        : await api.post(url, formData);
      
      if (isUpdate && editingPackage) {
        setPackages(packages.map(p => 
          p._id === editingPackage._id ? savedPackage : p
        ));
      } else {
        setPackages([...packages, savedPackage]);
      }
      
      setShowForm(false);
      setEditingPackage(null);
    } catch (error) {
      console.error("Error saving package:", error);
      alert('Error saving package. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (showForm) {
    console.log('📝 Showing form with editing package:', editingPackage);
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false);
              setEditingPackage(null);
            }}
            className="mb-4"
          >
            ← Back to Packages
          </Button>
          <h1 className="text-3xl font-bold">
            {editingPackage ? "Edit Package" : "Create New Package"}
          </h1>
        </div>
        
        <PackageForm
          initialData={editingPackage || undefined}
          onSubmit={handleFormSubmit}
          isSubmitting={loading}
          onSuccess={() => {
            setShowForm(false);
            setEditingPackage(null);
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Package2 className="h-6 w-6 md:h-8 md:w-8" />
            Tour Packages
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            {isAdmin 
              ? "Manage your tour packages and track bookings"
              : "Explore available tour packages"
            }
          </p>

        </div>
        
        {isAdmin && (
          <Button onClick={handleCreatePackage} size="lg" className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3">
            <Plus className="h-5 w-5 mr-2" />
            Add New Package
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      {isAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3 md:px-6 md:py-4">
              <CardTitle className="text-xs md:text-sm font-medium">Total Packages</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-3 md:px-6 md:pb-4">
              <div className="text-xl md:text-2xl font-bold">{stats.totalPackages}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activePackages} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3 md:px-6 md:py-4">
              <CardTitle className="text-xs md:text-sm font-medium">Bookings</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-3 md:px-6 md:pb-4">
              <div className="text-xl md:text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                All packages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3 md:px-6 md:py-4">
              <CardTitle className="text-xs md:text-sm font-medium">Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-3 md:px-6 md:pb-4">
              <div className="text-lg md:text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                From bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3 md:px-6 md:py-4">
              <CardTitle className="text-xs md:text-sm font-medium">Avg. Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 pb-3 md:px-6 md:pb-4">
              <div className="text-xl md:text-2xl font-bold">
                {stats.totalPackages > 0 
                  ? Math.round((stats.totalBookings / stats.totalPackages) * 100) / 100
                  : 0
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Per package
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Find Packages</CardTitle>
          <CardDescription>
            Search and filter packages by your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search packages, places, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Religious">Religious</SelectItem>
                  <SelectItem value="Wildlife">Wildlife</SelectItem>
                  <SelectItem value="Beach">Beach</SelectItem>
                  <SelectItem value="Hill Station">Hill Station</SelectItem>
                  <SelectItem value="Heritage">Heritage</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                  <SelectItem value="Romantic">Romantic</SelectItem>
                  <SelectItem value="Budget">Budget</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="startDate">Start Date</SelectItem>
                  <SelectItem value="createdAt">Created</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>

              {/* Quick Add Button in Filter Section */}
              {isAdmin && (
                <Button
                  onClick={handleCreatePackage}
                  className="hidden sm:flex bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Add
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 text-xs">×</button>
              </Badge>
            )}
            {categoryFilter && categoryFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {categoryFilter}
                <button onClick={() => setCategoryFilter("")} className="ml-1 text-xs">×</button>
              </Badge>
            )}
            {statusFilter && statusFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("")} className="ml-1 text-xs">×</button>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Package List */}
      <PackageList
        packages={filteredPackages}
        onEdit={handleEditPackage}
        onDelete={handleDeletePackage}
        isAdmin={isAdmin}
      />

      {/* Floating Action Button for Mobile */}
      {isAdmin && (
        <Button
          onClick={handleCreatePackage}
          size="lg"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-50 md:hidden"
        >
          <Plus className="h-8 w-8" />
        </Button>
      )}
    </div>
  );
};


export default PackagePage;