import { useState } from "react";
import type { Hotel } from "@/types";
import { Edit, Trash2, MapPin, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HotelListProps {
  hotels: Hotel[];
  isAdmin: boolean;
  onEdit: (hotel: Hotel) => void;
  onDelete: (id: string) => void;
}

const HotelList = ({ hotels, isAdmin, onEdit, onDelete }: HotelListProps) => {
  // State for Image Gallery
  const [galleryImages, setGalleryImages] = useState<string[] | null>(null);

  return (
    <>
      <Card className="border-t-4 border-t-indigo-600 shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-semibold text-gray-700">Manage Hotels</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel Info</TableHead>
                <TableHead>Place</TableHead>
                <TableHead>Images</TableHead> {/* New Column */}
                <TableHead>Category</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead>Rooms</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotels.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center h-24 text-gray-500">No hotels found.</TableCell></TableRow>
              ) : (
                hotels.map((h) => (
                  <TableRow key={h._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">{h.name}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <MapPin size={10} className="mr-1"/> {h.location}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline">{typeof h.place === 'object' ? h.place.name : "Unknown"}</Badge>
                    </TableCell>

                    {/* IMAGE GALLERY BUTTON */}
                    <TableCell>
                      {h.images && h.images.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <img src={h.images[0]} alt="thumb" className="w-10 h-10 rounded object-cover border" />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-blue-600 h-8 px-2"
                            onClick={() => setGalleryImages(h.images)}
                          >
                            <ImageIcon size={14} className="mr-1" /> View ({h.images.length})
                          </Button>
                        </div>
                      ) : <span className="text-gray-400 text-xs">No images</span>}
                    </TableCell>

                    <TableCell><Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">{h.category}</Badge></TableCell>
                    
                    <TableCell className="font-medium">₹{h.pricePerNight}</TableCell>

                    <TableCell className="text-xs text-gray-600">
                      {h.roomTypes.length} Types
                    </TableCell>

                    {isAdmin && (
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(h)} className="text-teal-600">
                          <Edit size={16} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500"><Trash2 size={16}/></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Hotel?</AlertDialogTitle>
                              <AlertDialogDescription>This action is permanent.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600" onClick={() => onDelete(h._id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- GALLERY MODAL --- */}
      <Dialog open={!!galleryImages} onOpenChange={() => setGalleryImages(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hotel Images</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
            {galleryImages?.map((img, idx) => (
              <div key={idx} className="relative aspect-video group">
                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover rounded-lg border shadow-sm" />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HotelList;