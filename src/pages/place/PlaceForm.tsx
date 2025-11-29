import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PlaceFormProps {
  onPlaceCreated: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

const PlaceForm = ({ onPlaceCreated, isSubmitting }: PlaceFormProps) => {
  // Local state for form inputs
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !location || !description || !price) {
      alert("Please fill in all text fields.");
      return;
    }

    // 1. Pack data securely into FormData
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("price", price);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // DEBUG: Log what you are sending
    // Note: You cannot console.log(formData) directly. You must iterate:
    for (const pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }

    // 2. Send to parent component
    await onPlaceCreated(formData);

    // 3. Reset Form
    setName("");
    setLocation("");
    setDescription("");
    setPrice("");
    setImageFile(null);
    // Reset file input visually
    (document.getElementById("place-image") as HTMLInputElement).value = "";
  };

  return (
    <Card className="mb-8 border-t-4 border-t-blue-600 shadow-md">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg font-semibold text-gray-700">
          Insert Place:
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="place-name">Place Name</Label>
              <Input
                id="place-name"
                placeholder="Enter place name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place-location">Location</Label>
              <Input
                id="place-location"
                placeholder="e.g. Ahmedabad, Gujarat"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="place-desc">Description</Label>
            <Textarea
              id="place-desc"
              placeholder="Enter details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="place-price">Price (₹)</Label>
              <Input
                id="place-price"
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place-image">Place Image</Label>
              <Input
                id="place-image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files ? setImageFile(e.target.files[0]) : null
                }
                disabled={isSubmitting}
                className="cursor-pointer bg-white"
              />
              <p className="text-xs text-gray-500">Upload Place Image here</p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "SUBMIT"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlaceForm;