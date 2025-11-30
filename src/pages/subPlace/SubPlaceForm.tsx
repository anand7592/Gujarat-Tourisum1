import { useState } from "react";
import type { Place } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface SubPlaceFormProps {
  parentPlaces: Place[]; // List of parent places for dropdown
  onCreated: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

const SubPlaceForm = ({ parentPlaces, onCreated, isSubmitting }: SubPlaceFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    place: "", // Stores the Place ID
    location: "",
    entryFee: "",
    openTime: "09:00",
    closeTime: "18:00",
    bestTimeToVisit: "",
    features: "", // "Parking, WiFi"
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.place || !formData.location) {
      alert("Please fill in Name, Parent Place, and Location.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("place", formData.place);
    payload.append("location", formData.location);
    payload.append("entryFee", formData.entryFee);
    payload.append("openTime", formData.openTime);
    payload.append("closeTime", formData.closeTime);
    payload.append("bestTimeToVisit", formData.bestTimeToVisit);
    
    // Convert "WiFi, Parking" -> ["WiFi", "Parking"] -> JSON String
    const featureArray = formData.features.split(",").map(f => f.trim()).filter(f => f !== "");
    payload.append("features", JSON.stringify(featureArray));

    if (imageFile) {
      payload.append("image", imageFile);
    }

    await onCreated(payload);

    // Reset Form
    setFormData({
      name: "", description: "", place: "", location: "",
      entryFee: "", openTime: "09:00", closeTime: "18:00",
      bestTimeToVisit: "", features: ""
    });
    setImageFile(null);
  };

  return (
    <Card className="mb-8 border-t-4 border-t-purple-600 shadow-md">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg font-semibold text-gray-700">
          Insert Sub-Place (Attraction):
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Parent Place</Label>
              <Select 
                value={formData.place} 
                onValueChange={(val) => setFormData({...formData, place: val})}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a City/Location" />
                </SelectTrigger>
                <SelectContent>
                  {parentPlaces.map((p) => (
                    <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sub-Place Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Science City"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <Label>Location (Specific)</Label>
              <Input 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Entry Fee (₹)</Label>
              <Input 
                type="number"
                value={formData.entryFee}
                onChange={(e) => setFormData({...formData, entryFee: e.target.value})}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Open Time</Label>
              <Input type="time" value={formData.openTime} onChange={(e) => setFormData({...formData, openTime: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Close Time</Label>
              <Input type="time" value={formData.closeTime} onChange={(e) => setFormData({...formData, closeTime: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Best Time to Visit</Label>
              <Input placeholder="e.g. Evening, Winter" value={formData.bestTimeToVisit} onChange={(e) => setFormData({...formData, bestTimeToVisit: e.target.value})} />
            </div>
          </div>

           {/* Row 4 */}
           <div className="space-y-2">
              <Label>Features (Comma separated)</Label>
              <Input 
                placeholder="e.g. Parking, Guide, Food Court" 
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
              />
            </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <Input 
              type="file" 
              accept="image/*"
              onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto">
            {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : "Submit Sub-Place"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubPlaceForm;