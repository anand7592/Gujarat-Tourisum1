import { useState } from "react";
import type { Place } from "@/types";
import { Edit, Trash2, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // <--- Import Dialog
import { Badge } from "@/components/ui/badge";

interface PlaceListProps {
  places: Place[];
  isAdmin: boolean;
  onEdit: (place: Place) => void;
  onDelete: (id: string) => void;
}

const PlaceList = ({ places, isAdmin, onEdit, onDelete }: PlaceListProps) => {
  // State to track which image is being viewed
  const [viewImage, setViewImage] = useState<string | null>(null);

  return (
    <>
      <Card className="border-t-4 border-t-blue-600 shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-semibold text-gray-700">
            Manage Place:
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Place Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Place Image</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-center">Delete</TableHead>
                <TableHead className="text-center">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {places.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                    No places found. Add one above!
                  </TableCell>
                </TableRow>
              ) : (
                places.map((place) => (
                  <TableRow key={place._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700">
                      {place.name}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin size={14} className="mr-1" /> {place.location}
                      </div>
                    </TableCell>

                    {/* CLICKABLE IMAGE THUMBNAIL */}
                    <TableCell>
                      {place.image ? (
                        <div 
                          className="group relative h-12 w-20 cursor-pointer overflow-hidden rounded-md border bg-gray-100"
                          onClick={() => setViewImage(place.image || "")}
                        >
                          <img
                            src={place.image}
                            alt={place.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                          {/* Hover Overlay Icon */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                            <Eye className="text-white h-4 w-4" />
                          </div>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-gray-400">
                          No Image
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>₹{place.price}</TableCell>

                    <TableCell className="text-center">
                      {isAdmin && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-500 hover:text-red-600"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete <strong>{place.name}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(place._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-teal-600 hover:text-teal-800"
                          onClick={() => onEdit(place)}
                        >
                          <Edit size={18} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- IMAGE VIEWER MODAL --- */}
      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent shadow-none p-0">
          <DialogHeader className="sr-only">
             <DialogTitle>View Image</DialogTitle>
          </DialogHeader>
          <div className="relative flex justify-center items-center">
            {viewImage && (
              <img
                src={viewImage}
                alt="Full View"
                className="max-h-[85vh] w-auto max-w-full rounded-lg shadow-2xl"
              />
            )}
            {/* Close hint */}
            <Button 
                className="absolute -top-10 right-0 rounded-full bg-white/20 hover:bg-white/40 text-white"
                onClick={() => setViewImage(null)}
                variant="ghost"
            >
                Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaceList;