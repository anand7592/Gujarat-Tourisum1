import { useState } from "react";
import type { Package } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Eye, 
  Pencil, 
  Trash2, 
  MapPin, 
  Users, 
  Calendar, 
  IndianRupee,
  Clock,
  Star,
  Building2,
  Activity,
  Plus
} from "lucide-react";

interface PackageListProps {
  packages: Package[];
  onEdit: (packageData: Package) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

const PackageList = ({ packages, onEdit, onDelete, isAdmin }: PackageListProps) => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  
  // Debug: Log packages to help troubleshoot display issues
  console.log('📦 PackageList received packages:', {
    count: packages?.length || 0,
    packages: packages,
    isArray: Array.isArray(packages),
    firstPackage: packages?.[0],
    firstPackageGroupSize: packages?.[0]?.groupSize
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Adventure': 'bg-orange-100 text-orange-800',
      'Cultural': 'bg-purple-100 text-purple-800',
      'Religious': 'bg-yellow-100 text-yellow-800',
      'Wildlife': 'bg-green-100 text-green-800',
      'Beach': 'bg-blue-100 text-blue-800',
      'Hill Station': 'bg-indigo-100 text-indigo-800',
      'Heritage': 'bg-red-100 text-red-800',
      'Family': 'bg-pink-100 text-pink-800',
      'Romantic': 'bg-rose-100 text-rose-800',
      'Budget': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'Easy': 'bg-green-100 text-green-800',
      'Moderate': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  if (packages.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Packages Found</h3>
          <p className="text-gray-500 text-center mb-6">
            {isAdmin ? "Create your first tour package to get started." : "No packages available at the moment."}
          </p>
          {isAdmin && (
            <Button onClick={() => window.dispatchEvent(new CustomEvent('create-package'))} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-2" />
              Create First Package
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {packages.map((pkg) => {
          // Safety check for package structure
          if (!pkg || !pkg._id) {
            console.warn('⚠️ Invalid package data:', pkg);
            return null;
          }
          
          return (
          <Card key={pkg._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 px-4 py-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base md:text-lg truncate">{pkg.name}</CardTitle>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge className={`${getCategoryColor(pkg.category)} text-xs`}>
                      {pkg.category}
                    </Badge>
                    <Badge className={`${getDifficultyColor(pkg.difficulty)} text-xs`}>
                      {pkg.difficulty}
                    </Badge>
                  </div>
                </div>
                <Badge variant={pkg.isActive ? "default" : "secondary"} className="text-xs shrink-0">
                  {pkg.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 px-4 pb-4">
              <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 shrink-0" />
                  <span>{pkg.duration} days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 shrink-0" />
                  <span className="truncate">
                    {pkg.groupSize?.min || 1}-{pkg.groupSize?.max || 10} people
                  </span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <IndianRupee className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 shrink-0" />
                  <span className="font-semibold truncate">
                    {formatCurrency(pkg.discountedPrice || pkg.price)}
                    {pkg.discountedPrice && (
                      <span className="text-gray-400 line-through ml-1.5 text-xs">
                        {formatCurrency(pkg.price)}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 shrink-0" />
                  <span className="truncate">{formatDate(pkg.startDate)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 text-xs md:text-sm">
                <Activity className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 shrink-0" />
                <span>{pkg.availableSlots - pkg.bookedSlots} slots available</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 min-w-20"
                      onClick={() => setSelectedPackage(pkg)}
                    >
                      <Eye className="h-3 w-3 md:mr-1" /> 
                      <span className="hidden md:inline">View</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] md:max-h-[80vh] overflow-y-auto">
                    <PackageDetailsModal package={selectedPackage} />
                  </DialogContent>
                </Dialog>

                {isAdmin && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 min-w-20"
                      onClick={() => {
                        console.log('🖱️ Edit button clicked for package:', pkg.name);
                        onEdit(pkg);
                      }}
                    >
                      <Pencil className="h-3 w-3 md:mr-1" /> 
                      <span className="hidden md:inline">Edit</span>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 min-w-20">
                          <Trash2 className="h-3 w-3 md:mr-1" /> 
                          <span className="hidden md:inline">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Package</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{pkg.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(pkg._id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          );
        }).filter(Boolean)}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Group Size</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => {
                // Safety check for package structure
                if (!pkg || !pkg._id) {
                  console.warn('⚠️ Invalid package data:', pkg);
                  return null;
                }
                
                return (
                <TableRow key={pkg._id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{pkg.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {formatDate(pkg.startDate)} - {formatDate(pkg.endDate)}
                      </div>
                      {pkg.places.length > 0 && (
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {pkg.places.slice(0, 2).map(p => p.name).join(", ")}
                          {pkg.places.length > 2 && ` +${pkg.places.length - 2} more`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getCategoryColor(pkg.category)}>
                        {pkg.category}
                      </Badge>
                      <br />
                      <Badge className={getDifficultyColor(pkg.difficulty)}>
                        {pkg.difficulty}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {pkg.duration} days
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold">
                        {formatCurrency(pkg.discountedPrice || pkg.price)}
                      </div>
                      {pkg.discountedPrice && (
                        <div className="text-sm text-gray-400 line-through">
                          {formatCurrency(pkg.price)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      {pkg.groupSize?.min || 1}-{pkg.groupSize?.max || 10}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium text-green-600">
                        {pkg.availableSlots - pkg.bookedSlots} available
                      </div>
                      <div className="text-gray-500">
                        {pkg.bookedSlots} booked
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={pkg.isActive ? "default" : "secondary"}>
                      {pkg.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedPackage(pkg)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <PackageDetailsModal package={selectedPackage} />
                        </DialogContent>
                      </Dialog>

                      {isAdmin && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              console.log('🖱️ Desktop edit button clicked for package:', pkg.name);
                              onEdit(pkg);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Package</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{pkg.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(pkg._id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                );
              }).filter(Boolean)}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

// Package Details Modal Component
const PackageDetailsModal = ({ package: pkg }: { package: Package | null }) => {
  if (!pkg) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {pkg.name}
        </DialogTitle>
        <DialogDescription>
          {pkg.description}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 md:space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <div className="text-center">
            <Clock className="h-6 w-6 mx-auto text-blue-600 mb-1" />
            <div className="font-semibold">{pkg.duration} Days</div>
          </div>
          <div className="text-center">
            <Users className="h-6 w-6 mx-auto text-green-600 mb-1" />
            <div className="font-semibold">{pkg.groupSize.min}-{pkg.groupSize.max} People</div>
          </div>
          <div className="text-center">
            <IndianRupee className="h-6 w-6 mx-auto text-orange-600 mb-1" />
            <div className="font-semibold">{formatCurrency(pkg.discountedPrice || pkg.price)}</div>
          </div>
          <div className="text-center">
            <Calendar className="h-6 w-6 mx-auto text-purple-600 mb-1" />
            <div className="font-semibold">{formatDate(pkg.startDate)}</div>
          </div>
        </div>

        {/* Highlights */}
        {pkg.highlights && pkg.highlights.length > 0 && (
          <div>
            <h4 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Highlights
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
              {pkg.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Itinerary */}
        {pkg.itinerary && pkg.itinerary.length > 0 && (
          <div>
            <h4 className="text-sm md:text-base font-semibold mb-2">📋 Itinerary</h4>
            <div className="space-y-2 md:space-y-3">
              {pkg.itinerary.map((day, index) => (
                <div key={index} className="border rounded-lg p-2.5 md:p-3">
                  <div className="text-sm md:text-base font-medium text-blue-600">Day {day.day}: {day.title}</div>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">{day.description}</p>
                  {day.activities && day.activities.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Activities: {day.activities.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Places */}
        {pkg.places && pkg.places.length > 0 && (
          <div>
            <h4 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Places Covered
            </h4>
            <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 md:gap-2">
              {pkg.places.map((place, index) => (
                <Badge key={index} variant="outline" className="justify-center">
                  {place.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Hotels */}
        {pkg.hotels && pkg.hotels.length > 0 && (
          <div>
            <h4 className="text-sm md:text-base font-semibold mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Recommended Hotels
            </h4>
            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2 md:gap-2">
              {pkg.hotels.map((hotel, index) => (
                <div key={index} className="text-sm border rounded p-2">
                  <div className="font-medium">{hotel.name}</div>
                  <div className="text-gray-500">{hotel.location}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Included/Excluded */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {pkg.included && pkg.included.length > 0 && (
            <div>
              <h4 className="text-sm md:text-base font-semibold mb-2 text-green-600">✅ What's Included</h4>
              <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
                {pkg.included.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {pkg.excluded && pkg.excluded.length > 0 && (
            <div>
              <h4 className="text-sm md:text-base font-semibold mb-2 text-red-600">❌ What's Excluded</h4>
              <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
                {pkg.excluded.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Policies */}
        {(pkg.cancellationPolicy || pkg.termsAndConditions) && (
          <div className="space-y-2 md:space-y-3">
            {pkg.cancellationPolicy && (
              <div>
                <h4 className="text-sm md:text-base font-semibold mb-1">📜 Cancellation Policy</h4>
                <p className="text-xs md:text-sm text-gray-600">{pkg.cancellationPolicy}</p>
              </div>
            )}
            {pkg.termsAndConditions && (
              <div>
                <h4 className="text-sm md:text-base font-semibold mb-1">📋 Terms & Conditions</h4>
                <p className="text-xs md:text-sm text-gray-600">{pkg.termsAndConditions}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PackageList;