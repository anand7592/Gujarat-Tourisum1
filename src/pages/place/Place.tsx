import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Place } from "@/types";
import { useAuth } from "@/context/AuthContext";
import PlaceForm from "./PlaceForm";
import PlaceList from "./PlaceList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Places = () => {
  const { user } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Place> | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const { data } = await api.get("/places");
      setPlaces(data);
    } catch (error) {
      console.error("Failed to fetch places", error);
    }
  };

  // --- CREATE LOGIC (Passed to PlaceForm) ---
  const handleCreate = async (formData: FormData) => {
    try {
      setLoading(true);
      const { data } = await api.post("/places", formData);
      setPlaces([data, ...places]); // Add new place to top of list
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create place");
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE LOGIC (Passed to PlaceList) ---
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/places/${id}`);
      setPlaces(places.filter((p) => p._id !== id));
    } catch (error: any) {
      alert("Failed to delete place");
    }
  };

  // --- EDIT LOGIC (Handled here via Modal) ---
  const openEditModal = (place: Place) => {
    setEditData(place);
    setEditImage(null);
    setIsEditOpen(true);
  };

  const submitEdit = async () => {
    if (!editData || !editData._id) return;

    try {
      const formData = new FormData();
      if (editData.name) formData.append("name", editData.name);
      if (editData.location) formData.append("location", editData.location);
      if (editData.description) formData.append("description", editData.description);
      if (editData.price) formData.append("price", editData.price.toString());
      if (editImage) formData.append("image", editImage);

      const { data } = await api.put(`/places/${editData._id}`, formData);
      
      // Update list
      setPlaces(places.map((p) => (p._id === editData._id ? data : p)));
      setIsEditOpen(false);
    } catch (error: any) {
      alert("Failed to update place");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. TOP SECTION: INSERT FORM */}
      {user?.isAdmin && (
        <PlaceForm onPlaceCreated={handleCreate} isSubmitting={loading} />
      )}

      {/* 2. BOTTOM SECTION: TABLE */}
      <PlaceList 
        places={places} 
        isAdmin={!!user?.isAdmin} 
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {/* 3. HIDDEN: EDIT MODAL (Pop up only when clicking pencil) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Place</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input 
                value={editData?.name || ""} 
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Location</Label>
              <Input 
                value={editData?.location || ""} 
                onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea 
                value={editData?.description || ""} 
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))} 
              />
            </div>
             <div className="grid gap-2">
              <Label>Price</Label>
              <Input 
                type="number"
                value={editData?.price || 0} 
                onChange={(e) => setEditData(prev => ({ ...prev, price: Number(e.target.value) }))} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Change Image (Optional)</Label>
              <Input 
                type="file" 
                onChange={(e) => e.target.files && setEditImage(e.target.files[0])} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={submitEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Places;