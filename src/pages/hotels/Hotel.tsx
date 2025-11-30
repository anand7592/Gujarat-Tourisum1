import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Hotel, Place } from "@/types";
import { useAuth } from "@/context/AuthContext";
import HotelForm from "./HotelForm";
import HotelList from "./HotelList";

const Hotels = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  // Edit State
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hRes, pRes] = await Promise.all([
        api.get("/hotels"),
        api.get("/places")
      ]);
      setHotels(hRes.data);
      setPlaces(pRes.data);
    } catch (error) {
      console.error("Failed to load data");
    }
  };

  const handleFormSubmit = async (formData: FormData, isUpdate: boolean) => {
    try {
      setLoading(true);
      
      if (isUpdate && editingHotel) {
        // --- UPDATE LOGIC ---
        const { data } = await api.put(`/hotels/${editingHotel._id}`, formData);
        setHotels(hotels.map(h => h._id === editingHotel._id ? data : h));
        setEditingHotel(null); // Exit edit mode
      } else {
        // --- CREATE LOGIC ---
        const { data } = await api.post("/hotels", formData);
        setHotels([data, ...hotels]);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/hotels/${id}`);
      setHotels(hotels.filter(h => h._id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Hotels & Stays</h2>
        <p className="text-gray-500">Manage hotel listings, room types, and amenities.</p>
      </div>

      {user?.isAdmin && (
        <HotelForm 
          places={places} 
          initialData={editingHotel} // Pass data if editing
          onSubmit={handleFormSubmit}
          onCancelEdit={() => setEditingHotel(null)} // Close edit mode
          isSubmitting={loading} 
        />
      )}

      <HotelList 
        hotels={hotels} 
        isAdmin={!!user?.isAdmin}
        onEdit={(hotel) => {
          setEditingHotel(hotel); // Trigger Edit Mode
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Hotels;