import { useState, useEffect } from "react";
import type { Place, Hotel } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HotelFormProps {
  places: Place[];
  // NEW: Accept initial data for editing
  initialData?: Hotel | null;
  onSubmit: (formData: FormData, isUpdate: boolean) => Promise<void>;
  onCancelEdit: () => void;
  isSubmitting: boolean;
}

const CATEGORIES = ["Budget", "Mid-Range", "Luxury", "Resort", "Boutique"];

const HotelForm = ({
  places,
  initialData,
  onSubmit,
  onCancelEdit,
  isSubmitting,
}: HotelFormProps) => {
  // State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    place: "",
    location: "",
    address: "",
    contactNo: "",
    email: "",
    website: "",
    pricePerNight: "",
    category: "",
    amenities: "",
  });
  const [roomTypes, setRoomTypes] = useState([
    { name: "", pricePerNight: 0, maxGuests: 2 },
  ]);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  // POPULATE FORM WHEN EDITING
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        place:
          typeof initialData.place === "object"
            ? initialData.place._id
            : initialData.place,
        location: initialData.location,
        address: initialData.address,
        contactNo: initialData.contactNo,
        email: initialData.email || "",
        website: initialData.website || "",
        pricePerNight: initialData.pricePerNight.toString(),
        category: initialData.category,
        amenities: initialData.amenities.join(", "), // Convert array to string
      });
      setRoomTypes(
        initialData.roomTypes.length > 0
          ? initialData.roomTypes
          : [{ name: "", pricePerNight: 0, maxGuests: 2 }]
      );
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      place: "",
      location: "",
      address: "",
      contactNo: "",
      email: "",
      website: "",
      pricePerNight: "",
      category: "",
      amenities: "",
    });
    setRoomTypes([{ name: "", pricePerNight: 0, maxGuests: 2 }]);
    setImageFiles(null);
  };

  const handleRoomChange = (index: number, field: string, value: any) => {
    const updated = [...roomTypes];
    
    // Validate price cannot be zero or negative
    if (field === 'pricePerNight') {
      const price = Number(value);
      if (price < 1) {
        alert('Room price must be at least ₹1 per night');
        return;
      }
    }
    
    // Validate max guests
    if (field === 'maxGuests') {
      const guests = Number(value);
      if (guests < 1) {
        alert('Room must accommodate at least 1 guest');
        return;
      }
      if (guests > 10) {
        alert('Maximum 10 guests allowed per room');
        return;
      }
    }
    
    (updated[index] as any)[field] = value;
    setRoomTypes(updated);
  };

  const addRoom = () =>
    setRoomTypes([...roomTypes, { name: "", pricePerNight: 1000, maxGuests: 2 }]);
  const removeRoom = (index: number) => {
    if (roomTypes.length > 1)
      setRoomTypes(roomTypes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate basic fields
    if (
      !formData.name ||
      !formData.place ||
      !formData.category ||
      !formData.description
    ) {
      return alert("Please fill in required fields");
    }
    
    // Validate starting price
    if (!formData.pricePerNight || Number(formData.pricePerNight) < 1) {
      return alert("Please enter a valid starting price (minimum ₹1)");
    }
    
    // Validate room types
    if (roomTypes.length === 0) {
      return alert("Please add at least one room type");
    }
    
    for (let i = 0; i < roomTypes.length; i++) {
      const room = roomTypes[i];
      if (!room.name.trim()) {
        return alert(`Please enter a name for room type ${i + 1}`);
      }
      if (room.pricePerNight < 1) {
        return alert(`Room type "${room.name}" must have a price of at least ₹1`);
      }
      if (room.maxGuests < 1) {
        return alert(`Room type "${room.name}" must accommodate at least 1 guest`);
      }
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "amenities") payload.append(key, value);
    });

    const amenityArray = formData.amenities
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    payload.append("amenities", JSON.stringify(amenityArray));
    payload.append("roomTypes", JSON.stringify(roomTypes));

    if (imageFiles) {
      for (let i = 0; i < imageFiles.length; i++) {
        payload.append("images", imageFiles[i]);
      }
    }

    // Pass true if initialData exists (Update Mode)
    await onSubmit(payload, !!initialData);

    if (!initialData) resetForm(); // Only reset on Create
  };

  return (
    <Card
      className={`mb-8 border-t-4 shadow-md ${
        initialData ? "border-t-orange-500" : "border-t-indigo-600"
      }`}
    >
      <CardHeader className="bg-gray-50 border-b flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold text-gray-700">
          {initialData ? `Edit Hotel: ${initialData.name}` : "Add New Hotel"}
        </CardTitle>
        {initialData && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCancelEdit}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <X size={16} className="mr-1" /> Cancel Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... (Fields are exactly the same as previous code, no changes needed inside inputs) ... */}
          {/* COPY THE INPUTS GRID FROM PREVIOUS HotelForm HERE */}
          {/* I am omitting the middle input code to save space, copy-paste it from your existing file */}

          {/* --- RE-PASTE THE INPUT SECTION FROM PREVIOUS ANSWER HERE --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Hotel Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Location *</Label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Parent Place *</Label>
              <Select
                value={formData.place}
                onValueChange={(val) =>
                  setFormData({ ...formData, place: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Tourist Place" />
                </SelectTrigger>
                <SelectContent>
                  {places.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Full Address *</Label>
            <Textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Contact No *</Label>
              <Input
                value={formData.contactNo}
                onChange={(e) =>
                  setFormData({ ...formData, contactNo: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                💰 Starting Price (₹) *
              </Label>
              <Input
                type="number"
                min="1"
                value={formData.pricePerNight}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerNight: e.target.value })
                }
                placeholder="1500"
                className="border-gray-300 focus:border-green-500"
              />
              <p className="text-xs text-gray-600">
                Lowest room price for search results & hotel listing
              </p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Amenities (Comma separated)</Label>
            <Input
              value={formData.amenities}
              onChange={(e) =>
                setFormData({ ...formData, amenities: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>
              {initialData
                ? "Add NEW Images (Will be appended)"
                : "Images (Select Multiple)"}
            </Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(e.target.files)}
            />
            {/* Show existing images count hint */}
            {initialData && initialData.images.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Currently has {initialData.images.length} images. Use 'View' in
                list to see them.
              </p>
            )}
          </div>

          {/* PRICING EXPLANATION */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
            <h4 className="font-semibold text-blue-800 flex items-center gap-2">
              💡 How Hotel Pricing Works
            </h4>
            <div className="text-sm text-blue-700">
              <p><strong>Starting Price:</strong> The lowest room rate shown in search results (₹{formData.pricePerNight || 'XXX'} per night)</p>
              <p><strong>Room Type Prices:</strong> Specific rates for each room category you offer</p>
              <p className="text-xs mt-1">💡 <em>Tip: Set your starting price equal to your cheapest room type</em></p>
            </div>
          </div>

          {/* ROOM TYPES */}
          <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-lg text-gray-800">
                  🏨 Room Types & Detailed Pricing
                </h4>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addRoom}
                >
                  <Plus size={14} className="mr-1" /> Add Room Type
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Define different types of rooms available in your hotel with their specific pricing and capacity.
                <br />
                <span className="text-blue-600 font-medium">Examples:</span> Standard Room, Deluxe Room, Suite, Family Room, etc.
              </p>
            </div>
            {roomTypes.map((room, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row gap-4 sm:items-end bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    🏷️ Room Type Name *
                  </Label>
                  <Input
                    value={room.name}
                    onChange={(e) =>
                      handleRoomChange(idx, "name", e.target.value)
                    }
                    placeholder="e.g. Standard Room, Deluxe Suite, Family Room"
                    className="border-gray-300 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500">Give a clear name that guests will understand</p>
                </div>
                <div className="w-full sm:w-32 space-y-2">
                  <Label className="text-sm font-semibold text-green-700 flex items-center gap-1">
                    💰 Price per Night (₹) *
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={room.pricePerNight}
                    onChange={(e) =>
                      handleRoomChange(
                        idx,
                        "pricePerNight",
                        Number(e.target.value)
                      )
                    }
                    placeholder="2000"
                    className="border-gray-300 focus:border-green-500"
                    required
                  />
                  <p className="text-xs text-gray-500">Minimum ₹1 required</p>
                </div>
                <div className="w-full sm:w-28 space-y-2">
                  <Label className="text-sm font-semibold text-purple-700 flex items-center gap-1">
                    👥 Max Guests *
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={room.maxGuests}
                    onChange={(e) =>
                      handleRoomChange(idx, "maxGuests", Number(e.target.value))
                    }
                    placeholder="2"
                    className="border-gray-300 focus:border-purple-500"
                    required
                  />
                  <p className="text-xs text-gray-500">1-10 people</p>
                </div>
                {roomTypes.length > 1 && (
                  <div className="flex justify-end sm:justify-center">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeRoom(idx)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              initialData
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2" />
            ) : initialData ? (
              "Update Hotel"
            ) : (
              "Save Hotel"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HotelForm;
