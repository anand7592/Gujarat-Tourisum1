import { useState, useEffect, useCallback } from "react";
import type { Package, PackageFormData, Place, Hotel } from "@/types";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateInputDD_MM_YYYY } from "@/components/ui/date-input";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, X, MapPin, Users, IndianRupee, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PackageFormProps {
  onSuccess?: () => void;
  onSubmit: (data: FormData, isUpdate: boolean) => Promise<void>;
  initialData?: Package;
  isSubmitting: boolean;
}

const PackageForm = ({ onSuccess, onSubmit, initialData, isSubmitting }: PackageFormProps) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<PackageFormData>({
    name: "",
    description: "",
    duration: 3,
    price: 5000,
    discountedPrice: "",
    category: "",
    difficulty: "",
    groupSizeMin: 2,
    groupSizeMax: 20,
    included: "",
    excluded: "",
    highlights: "",
    meetingPoint: "",
    cancellationPolicy: "Free cancellation up to 48 hours before the tour starts. 50% refund for cancellations between 24-48 hours. No refund for cancellations within 24 hours.",
    termsAndConditions: "",
    startDate: "",
    endDate: "",
    availableSlots: 50,
    places: [],
    hotels: [],
  });

  const [itinerary, setItinerary] = useState([
    { day: 1, title: "", description: "", activities: "", meals: "", accommodation: "", places: "" }
  ]);

  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [placesRes, hotelsRes] = await Promise.all([
        api.get("/places"),
        api.get("/hotels"),
      ]);
      
      const placesData = Array.isArray(placesRes.data) ? placesRes.data : [];
      const hotelsData = Array.isArray(hotelsRes.data) ? hotelsRes.data : [];
      
      setPlaces(placesData);
      setHotels(hotelsData);
      
      console.log("📍 Loaded places:", placesData.length);
      console.log("🏨 Loaded hotels:", hotelsData.length);
      
      if (placesData.length === 0) {
        setError("No places available. Please add places first before creating packages.");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load places and hotels. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (initialData) {
      console.log('🔄 PackageForm received initialData:', initialData);
      console.log('🔍 GroupSize check:', initialData.groupSize);
      
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        duration: initialData.duration || 3,
        price: initialData.price || 0,
        discountedPrice: initialData.discountedPrice?.toString() || "",
        category: initialData.category || "",
        difficulty: initialData.difficulty || "",
        groupSizeMin: initialData.groupSize?.min || 2,
        groupSizeMax: initialData.groupSize?.max || 20,
        included: Array.isArray(initialData.included) ? initialData.included.join(", ") : "",
        excluded: Array.isArray(initialData.excluded) ? initialData.excluded.join(", ") : "",
        highlights: Array.isArray(initialData.highlights) ? initialData.highlights.join(", ") : "",
        meetingPoint: initialData.meetingPoint || "",
        cancellationPolicy: initialData.cancellationPolicy || "Free cancellation up to 48 hours before the tour starts. 50% refund for cancellations between 24-48 hours. No refund for cancellations within 24 hours.",
        termsAndConditions: initialData.termsAndConditions || "",
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : "",
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : "",
        availableSlots: initialData.availableSlots || 50,
        places: Array.isArray(initialData.places) ? initialData.places.map(p => p._id) : [],
        hotels: Array.isArray(initialData.hotels) ? initialData.hotels.map(h => h._id) : [],
      });

      if (initialData.itinerary && Array.isArray(initialData.itinerary) && initialData.itinerary.length > 0) {
        setItinerary(initialData.itinerary.map(item => ({
          day: item.day || 1,
          title: item.title || "",
          description: item.description || "",
          activities: Array.isArray(item.activities) ? item.activities.join(", ") : "",
          meals: Array.isArray(item.meals) ? item.meals.join(", ") : "",
          accommodation: item.accommodation || "",
          places: Array.isArray(item.places) ? item.places.join(", ") : ""
        })));
      }
    }
  }, [initialData]);

  const addItineraryDay = () => {
    setItinerary([...itinerary, {
      day: itinerary.length + 1,
      title: "",
      description: "",
      activities: "",
      meals: "",
      accommodation: "",
      places: ""
    }]);
  };

  const removeItineraryDay = (index: number) => {
    if (itinerary.length > 1) {
      const updated = itinerary.filter((_, i) => i !== index);
      // Re-number days
      const renumbered = updated.map((item, i) => ({ ...item, day: i + 1 }));
      setItinerary(renumbered);
    }
  };

  const handleItineraryChange = (index: number, field: string, value: string | number) => {
    const updated = [...itinerary];
    const item = { ...updated[index] };
    
    switch (field) {
      case 'day':
        item.day = typeof value === 'string' ? parseInt(value) || 1 : value as number;
        break;
      case 'title':
        item.title = value as string;
        break;
      case 'description':
        item.description = value as string;
        break;
      case 'activities':
        item.activities = value as string;
        break;
      case 'meals':
        item.meals = value as string;
        break;
      case 'accommodation':
        item.accommodation = value as string;
        break;
      case 'places':
        item.places = value as string;
        break;
    }
    
    updated[index] = item;
    setItinerary(updated);
  };

  const handlePlaceToggle = (placeId: string) => {
    const updatedPlaces = formData.places.includes(placeId)
      ? formData.places.filter(id => id !== placeId)
      : [...formData.places, placeId];
    setFormData({ ...formData, places: updatedPlaces });
  };

  const handleHotelToggle = (hotelId: string) => {
    const updatedHotels = formData.hotels.includes(hotelId)
      ? formData.hotels.filter(id => id !== hotelId)
      : [...formData.hotels, hotelId];
    setFormData({ ...formData, hotels: updatedHotels });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Package name is required");
      return;
    }
    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    if (!formData.difficulty) {
      setError("Please select difficulty level");
      return;
    }
    if (formData.price < 1) {
      setError("Price must be at least ₹1");
      return;
    }
    if (formData.groupSizeMin < 1) {
      setError("Minimum group size must be at least 1");
      return;
    }
    if (formData.groupSizeMax < formData.groupSizeMin) {
      setError("Maximum group size must be greater than minimum");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setError("Please select start and end dates");
      return;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError("End date must be after start date");
      return;
    }
    if (formData.places.length === 0) {
      setError("Please select at least one place for the package");
      return;
    }
    if (!formData.cancellationPolicy.trim()) {
      setError("Cancellation policy is required");
      return;
    }
    if (new Date(formData.startDate) <= new Date()) {
      setError("Start date must be in the future");
      return;
    }

    try {
      // Debug: Log the form data before sending
      console.log("📦 Form data before sending:", {
        places: formData.places,
        hotels: formData.hotels,
        placesCount: formData.places.length,
        hotelsCount: formData.hotels.length
      });

      const payload = new FormData();
      
      // Add basic fields
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      payload.append("difficulty", formData.difficulty);
      payload.append("duration", formData.duration.toString());
      payload.append("price", formData.price.toString());
      payload.append("startDate", formData.startDate);
      payload.append("endDate", formData.endDate);
      payload.append("availableSlots", formData.availableSlots.toString());
      payload.append("meetingPoint", formData.meetingPoint);
      payload.append("cancellationPolicy", formData.cancellationPolicy);
      payload.append("termsConditions", formData.termsAndConditions);
      
      // Add discounted price only if provided
      if (formData.discountedPrice) {
        payload.append("discountedPrice", formData.discountedPrice);
      }
      
      // Add group size as nested object
      payload.append("groupSize[min]", formData.groupSizeMin.toString());
      payload.append("groupSize[max]", formData.groupSizeMax.toString());
      
      // Add places and hotels
      payload.append("places", JSON.stringify(formData.places));
      payload.append("hotels", JSON.stringify(formData.hotels));

      // Add itinerary with validation
      const processedItinerary = itinerary.map(item => ({
        day: item.day,
        title: item.title || `Day ${item.day}`,
        description: item.description || `Activities for Day ${item.day}`,
        activities: item.activities.split(',').map(s => s.trim()).filter(Boolean),
        meals: {
          breakfast: item.meals.toLowerCase().includes('breakfast'),
          lunch: item.meals.toLowerCase().includes('lunch'),
          dinner: item.meals.toLowerCase().includes('dinner')
        },
        accommodation: item.accommodation || ""
      }));
      
      payload.append("itinerary", JSON.stringify(processedItinerary));

      // Add arrays
      payload.append("included", JSON.stringify(formData.included.split(',').map(s => s.trim()).filter(Boolean)));
      payload.append("excluded", JSON.stringify(formData.excluded.split(',').map(s => s.trim()).filter(Boolean)));
      payload.append("highlights", JSON.stringify(formData.highlights.split(',').map(s => s.trim()).filter(Boolean)));

      // Add images
      if (imageFiles) {
        for (let i = 0; i < imageFiles.length; i++) {
          payload.append("images", imageFiles[i]);
        }
      }

      await onSubmit(payload, !!initialData);
      
      if (onSuccess) {
        onSuccess();
      }

      if (!initialData) {
        // Reset form for new package
        setFormData({
          name: "",
          description: "",
          duration: 3,
          price: 5000,
          discountedPrice: "",
          category: "",
          difficulty: "",
          groupSizeMin: 2,
          groupSizeMax: 20,
          included: "",
          excluded: "",
          highlights: "",
          meetingPoint: "",
          cancellationPolicy: "Free cancellation up to 48 hours before the tour starts. 50% refund for cancellations between 24-48 hours. No refund for cancellations within 24 hours.",
          termsAndConditions: "",
          startDate: "",
          endDate: "",
          availableSlots: 50,
          places: [],
          hotels: [],
        });
        setItinerary([{ day: 1, title: "", description: "", activities: "", meals: "", accommodation: "", places: "" }]);
        setImageFiles(null);
      }
    } catch (err) {
      console.error("Package submission error:", err);
      setError("Failed to save package. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {initialData ? "Edit Package" : "Create New Tour Package"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">📝 Basic Information</h3>
            
            <div className="space-y-2">
              <Label>Package Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. 3 Days Gujarat Heritage Tour"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Detailed description of the tour package..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Duration (Days) *
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
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
              </div>

              <div className="space-y-2">
                <Label>Difficulty Level *</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing & Group Size */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">💰 Pricing & Group Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  Price per Person (₹) *
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Discounted Price (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.discountedPrice}
                  onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                  placeholder="Optional discounted price"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Min Group Size *
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.groupSizeMin}
                  onChange={(e) => setFormData({...formData, groupSizeMin: Number(e.target.value)})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Max Group Size *</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.groupSizeMax}
                  onChange={(e) => setFormData({...formData, groupSizeMax: Number(e.target.value)})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Available Slots *</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.availableSlots}
                  onChange={(e) => setFormData({...formData, availableSlots: Number(e.target.value)})}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">📅 Tour Dates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <DateInputDD_MM_YYYY
                  value={formData.startDate}
                  onChange={(value) => setFormData({...formData, startDate: value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <DateInputDD_MM_YYYY
                  value={formData.endDate}
                  onChange={(value) => setFormData({...formData, endDate: value})}
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Places & Hotels */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🏞️ Places & Hotels</h3>
            
            {/* Selected Items Summary */}
            {(formData.places.length > 0 || formData.hotels.length > 0) && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected:</strong> {formData.places.length} places, {formData.hotels.length} hotels
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-red-600">Places Covered * ({formData.places.length} selected)</Label>
                {formData.places.length === 0 && (
                  <p className="text-sm text-red-500">At least one place must be selected</p>
                )}
                <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2 bg-gray-50">
                  {places.map((place) => (
                    <div 
                      key={place._id} 
                      className={`flex items-center space-x-2 p-2 rounded ${
                        formData.places.includes(place._id) 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`place-${place._id}`}
                        checked={formData.places.includes(place._id)}
                        onChange={() => handlePlaceToggle(place._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label 
                        htmlFor={`place-${place._id}`} 
                        className={`text-sm cursor-pointer flex-1 ${
                          formData.places.includes(place._id) ? 'font-medium text-blue-800' : ''
                        }`}
                      >
                        {place.name} - {place.location}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Recommended Hotels ({formData.hotels.length} selected)</Label>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2 bg-gray-50">
                  {hotels.map((hotel) => (
                    <div 
                      key={hotel._id} 
                      className={`flex items-center space-x-2 p-2 rounded ${
                        formData.hotels.includes(hotel._id) 
                          ? 'bg-green-50 border border-green-200' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`hotel-${hotel._id}`}
                        checked={formData.hotels.includes(hotel._id)}
                        onChange={() => handleHotelToggle(hotel._id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label 
                        htmlFor={`hotel-${hotel._id}`} 
                        className={`text-sm cursor-pointer flex-1 ${
                          formData.hotels.includes(hotel._id) ? 'font-medium text-green-800' : ''
                        }`}
                      >
                        {hotel.name} - {hotel.location}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Itinerary */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">📋 Day-wise Itinerary</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
                <Plus className="h-4 w-4 mr-1" /> Add Day
              </Button>
            </div>

            {itinerary.map((day, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Day {day.day}</h4>
                  {itinerary.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItineraryDay(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder={`Day ${day.day} title (e.g., Arrival in Ahmedabad)`}
                    value={day.title}
                    onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Places to visit (comma separated)"
                    value={day.places}
                    onChange={(e) => handleItineraryChange(index, 'places', e.target.value)}
                  />
                </div>

                <Textarea
                  placeholder="Day description and activities"
                  value={day.description}
                  onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                  rows={2}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Activities (comma separated)"
                    value={day.activities}
                    onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                  />
                  <Input
                    placeholder="Meals included (comma separated)"
                    value={day.meals}
                    onChange={(e) => handleItineraryChange(index, 'meals', e.target.value)}
                  />
                  <Input
                    placeholder="Accommodation"
                    value={day.accommodation}
                    onChange={(e) => handleItineraryChange(index, 'accommodation', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Package Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">📋 Package Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>What's Included</Label>
                <Textarea
                  value={formData.included}
                  onChange={(e) => setFormData({...formData, included: e.target.value})}
                  placeholder="Transportation, Accommodation, Meals, etc. (comma separated)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>What's Excluded</Label>
                <Textarea
                  value={formData.excluded}
                  onChange={(e) => setFormData({...formData, excluded: e.target.value})}
                  placeholder="Personal expenses, Tips, etc. (comma separated)"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Package Highlights</Label>
              <Textarea
                value={formData.highlights}
                onChange={(e) => setFormData({...formData, highlights: e.target.value})}
                placeholder="Key attractions and features (comma separated)"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Meeting Point</Label>
              <Input
                value={formData.meetingPoint}
                onChange={(e) => setFormData({...formData, meetingPoint: e.target.value})}
                placeholder="Where the tour starts from"
              />
            </div>
          </div>

          <Separator />

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">📜 Policies</h3>
            
            <div className="space-y-2">
              <Label className="text-red-600">Cancellation Policy *</Label>
              <Textarea
                value={formData.cancellationPolicy}
                onChange={(e) => setFormData({...formData, cancellationPolicy: e.target.value})}
                placeholder="Cancellation terms and conditions"
                rows={3}
                required
                className={!formData.cancellationPolicy.trim() ? "border-red-300" : ""}
              />
              {!formData.cancellationPolicy.trim() && (
                <p className="text-sm text-red-500">Cancellation policy is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Terms & Conditions</Label>
              <Textarea
                value={formData.termsAndConditions}
                onChange={(e) => setFormData({...formData, termsAndConditions: e.target.value})}
                placeholder="General terms and conditions"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">📷 Package Images</h3>
            
            <div className="space-y-2">
              <Label>Upload Images</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(e.target.files)}
                className="file:mr-2 file:px-4 file:py-2 file:border-0 file:bg-gray-100 file:text-gray-700"
              />
              <p className="text-xs text-gray-600">
                Select multiple images to showcase your package
              </p>
            </div>
          </div>

          {/* Validation Summary */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium mb-2">📋 Package Summary</h4>
            <div className="text-xs space-y-1">
              <div className={formData.places.length > 0 ? "text-green-600" : "text-red-600"}>
                ✓ Places: {formData.places.length > 0 ? `${formData.places.length} selected` : "⚠️ At least 1 required"}
              </div>
              <div className={formData.cancellationPolicy.trim() ? "text-green-600" : "text-red-600"}>
                ✓ Cancellation Policy: {formData.cancellationPolicy.trim() ? "Provided" : "⚠️ Required"}
              </div>
              <div className={new Date(formData.startDate) > new Date() ? "text-green-600" : "text-red-600"}>
                ✓ Start Date: {new Date(formData.startDate) > new Date() ? "Future date" : "⚠️ Must be future date"}
              </div>
              <div className="text-gray-600">
                • Hotels: {formData.hotels.length} selected (optional)
              </div>
              <div className="text-gray-600">
                • Itinerary: {itinerary.length} day(s)
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || formData.places.length === 0 || !formData.cancellationPolicy.trim() || new Date(formData.startDate) <= new Date()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {initialData ? "Update Package" : "Create Package"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PackageForm;