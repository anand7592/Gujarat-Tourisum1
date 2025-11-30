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
    (updated[index] as any)[field] = value;
    setRoomTypes(updated);
  };

  const addRoom = () =>
    setRoomTypes([...roomTypes, { name: "", pricePerNight: 0, maxGuests: 2 }]);
  const removeRoom = (index: number) => {
    if (roomTypes.length > 1)
      setRoomTypes(roomTypes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.place ||
      !formData.category ||
      !formData.description
    ) {
      return alert("Please fill in required fields");
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
              <Label>Base Price (₹) *</Label>
              <Input
                type="number"
                value={formData.pricePerNight}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerNight: e.target.value })
                }
              />
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

          {/* ROOM TYPES */}
          <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm text-gray-700">
                Room Configuration
              </h4>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addRoom}
              >
                <Plus size={14} className="mr-1" /> Add Room
              </Button>
            </div>
            {roomTypes.map((room, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row gap-4 sm:items-end bg-white p-3 rounded border"
              >
                <div className="flex-1 space-y-1">
                  <Label className="text-xs font-medium">Room Name</Label>
                  <Input
                    value={room.name}
                    onChange={(e) =>
                      handleRoomChange(idx, "name", e.target.value)
                    }
                    placeholder="e.g. Deluxe Room"
                  />
                </div>
                <div className="w-full sm:w-24 space-y-1">
                  <Label className="text-xs font-medium">Price (₹)</Label>
                  <Input
                    type="number"
                    value={room.pricePerNight}
                    onChange={(e) =>
                      handleRoomChange(
                        idx,
                        "pricePerNight",
                        Number(e.target.value)
                      )
                    }
                    placeholder="2000"
                  />
                </div>
                <div className="w-full sm:w-20 space-y-1">
                  <Label className="text-xs font-medium">Max Guests</Label>
                  <Input
                    type="number"
                    value={room.maxGuests}
                    onChange={(e) =>
                      handleRoomChange(idx, "maxGuests", Number(e.target.value))
                    }
                    placeholder="2"
                  />
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
