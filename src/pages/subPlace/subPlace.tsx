import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { SubPlace, Place } from "@/types";
import { useAuth } from "@/context/AuthContext";
import SubPlaceForm from "./SubPlaceForm";
import SubPlaceList from "./SubPlaceList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SubPlaces = () => {
  const { user } = useAuth();
  const [subPlaces, setSubPlaces] = useState<SubPlace[]>([]);
  const [parentPlaces, setParentPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editData, setEditData] = useState<any>(null); 
  const [editImage, setEditImage] = useState<File | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [spRes, pRes] = await Promise.all([
        api.get("/subplaces"),
        api.get("/places")
      ]);
      setSubPlaces(spRes.data);
      setParentPlaces(pRes.data);
    } catch (error) {
      console.error("Failed to load data");
    }
  };

  const handleCreate = async (formData: FormData) => {
    try {
      setLoading(true);
      const { data } = await api.post("/subplaces", formData);
      setSubPlaces([data, ...subPlaces]);
    } catch (error: any) {
      alert(error.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/subplaces/${id}`);
      setSubPlaces(subPlaces.filter(s => s._id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  };

  // --- EDIT LOGIC ---
  const openEditModal = (sp: SubPlace) => {
    setEditData({
      ...sp,
      place: typeof sp.place === 'object' ? sp.place._id : sp.place, // Ensure ID
      featuresString: sp.features ? sp.features.join(", ") : "" 
    });
    setEditImage(null);
    setIsEditOpen(true);
  };

  const submitEdit = async () => {
    if (!editData) return;
    try {
      const payload = new FormData();
      payload.append("name", editData.name);
      payload.append("description", editData.description);
      payload.append("location", editData.location);
      payload.append("place", editData.place);
      payload.append("entryFee", editData.entryFee); // <--- ENTRY FEE SENT HERE
      payload.append("openTime", editData.openTime);
      payload.append("closeTime", editData.closeTime);
      
      const featureArray = editData.featuresString.split(",").map((s: string) => s.trim()).filter(Boolean);
      payload.append("features", JSON.stringify(featureArray));

      if (editImage) payload.append("image", editImage);

      const { data } = await api.put(`/subplaces/${editData._id}`, payload);
      
      setSubPlaces(subPlaces.map(s => s._id === editData._id ? data : s));
      setIsEditOpen(false);
    } catch (error) {
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. INSERT FORM */}
      {user?.isAdmin && (
        <SubPlaceForm 
          parentPlaces={parentPlaces} 
          onCreated={handleCreate} 
          isSubmitting={loading} 
        />
      )}

      {/* 2. TABLE */}
      <SubPlaceList 
        subPlaces={subPlaces} 
        isAdmin={!!user?.isAdmin}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {/* 3. EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Edit Sub-Place</DialogTitle></DialogHeader>
          
          <div className="grid gap-4 py-4 grid-cols-2">
            
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={editData?.name} onChange={e => setEditData({...editData, name: e.target.value})} />
            </div>
            
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={editData?.location} onChange={e => setEditData({...editData, location: e.target.value})} />
            </div>

            {/* --- ADDED ENTRY FEE FIELD HERE --- */}
            <div className="space-y-2">
              <Label>Entry Fee (₹)</Label>
              <Input 
                type="number"
                value={editData?.entryFee} 
                onChange={e => setEditData({...editData, entryFee: e.target.value})} 
              />
            </div>
            {/* ---------------------------------- */}

            <div className="space-y-2">
              <Label>Features (Comma separated)</Label>
              <Input value={editData?.featuresString} onChange={e => setEditData({...editData, featuresString: e.target.value})} />
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea value={editData?.description} onChange={e => setEditData({...editData, description: e.target.value})} />
            </div>
             
            <div className="col-span-2 space-y-2">
              <Label>Change Image</Label>
              <Input type="file" onChange={e => e.target.files && setEditImage(e.target.files[0])} />
            </div>

          </div>
          
          <DialogFooter><Button onClick={submitEdit}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubPlaces;