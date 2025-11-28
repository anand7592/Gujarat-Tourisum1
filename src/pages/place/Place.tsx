import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Place } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Plus, Pencil, MapPin } from "lucide-react";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Places = () => {
  const { user: currentUser } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price: 0,
    image: "",
  });

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const { data } = await api.get("/places");
      setPlaces(data);
    } catch (err) {
      console.error("Failed to load places");
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", location: "", price: 0, image: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (place: Place) => {
    setEditingId(place._id);
    setFormData({
      name: place.name,
      description: place.description,
      location: place.location,
      price: place.price,
      image: place.image || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.location || !formData.description) {
        alert("Please fill in Name, Location, and Description.");
        return;
      }

      if (editingId) {
        // Update
        const { data } = await api.put(`/places/${editingId}`, formData);
        setPlaces(places.map((p) => (p._id === editingId ? data : p)));
      } else {
        // Create
        const { data } = await api.post("/places", formData);
        setPlaces([data, ...places]);
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/places/${id}`);
      setPlaces(places.filter((p) => p._id !== id));
    } catch (err: any) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Destinations</h2>
        {currentUser?.isAdmin && (
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus size={16} /> Add Place
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Place" : "Add New Destination"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Place Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="loc">Location</Label>
              <Input id="loc" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="img">Image URL</Label>
                <Input id="img" placeholder="https://..." value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save Destination</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>All Locations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <div>Loading...</div> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>CreatedBy</TableHead>
                  {currentUser?.isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
             
                {places.map((p) => (
                  console.log(p),
                  <TableRow key={p._id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="flex items-center gap-1 text-gray-500">
                      <MapPin size={14} /> {p.location}
                    </TableCell>
                    <TableCell>₹{p.price}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{p.description}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{p.createdBy?.email}</TableCell>
                    
                    {currentUser?.isAdmin && (
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(p)}>
                          <Pencil size={16} className="text-blue-500" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Place?</AlertDialogTitle>
                              <AlertDialogDescription>This will remove <strong>{p.name}</strong> permanently.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600" onClick={() => handleDelete(p._id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Places;