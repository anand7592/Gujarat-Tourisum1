import { useState } from "react";
import type { Place } from "@/types";
import { Edit, Trash2, MapPin, Eye, Download } from "lucide-react";
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
} from "@/components/ui/dialog";
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
  const [viewName, setViewName] = useState<string>("");

  const handleOpenImage = (imageUrl: string, name: string) => {
    setViewImage(imageUrl);
    setViewName(name || "place");
  };

  const handleDownloadImage = async () => {
    if (!viewImage) return;

    // 1. Slugify the name: "Taj Mahal, Agra" -> "taj-mahal-agra"
    const baseName =
      viewName
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/(^-|-$)/g, "") || "place";

    // 2. Try to get extension from URL (before query params)
    const urlWithoutQuery = viewImage.split("?")[0];
    const extMatch = urlWithoutQuery.match(/\.[a-zA-Z0-9]+$/);
    const ext = extMatch ? extMatch[0] : ".jpg";

    const fileName = `${baseName}${ext}`;

    try {
      // 3. Fetch the image data (works with Cloudinary & other origins)
      const response = await fetch(viewImage);
      if (!response.ok) {
        console.error("Failed to fetch image for download");
        return;
      }

      // 4. Turn into Blob and object URL
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // 5. Trigger download using the blob URL
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 6. Cleanup
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

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
                  <TableCell
                    colSpan={6}
                    className="text-center h-24 text-gray-500"
                  >
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
                          onClick={() =>
                            handleOpenImage(place.image || "", place.name || "")
                          }
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
                                This will permanently delete{" "}
                                <strong>{place.name}</strong>.
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
      <Dialog
        open={!!viewImage}
        onOpenChange={(open) => {
          if (!open) {
            setViewImage(null);
            setViewName("");
          }
        }}
      >
        <DialogContent className="max-w-4xl border-none bg-transparent shadow-none p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>View Image</DialogTitle>
          </DialogHeader>
          <div className="relative flex justify-center items-center">
            {viewImage && (
              <img
                src={viewImage}
                alt={viewName || "Full View"}
                className="max-h-[85vh] w-auto max-w-full rounded-lg shadow-2xl"
              />
            )}
            {/* Top-right controls: Download + Close */}
            <div className="absolute -top-10 right-0 flex gap-2">
              <Button
                className="rounded-full bg-white/80 hover:bg-white text-gray-800 shadow"
                variant="ghost"
                onClick={handleDownloadImage}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>

              <Button
                className="rounded-full bg-white/20 hover:bg-white/40 text-white"
                onClick={() => {
                  setViewImage(null);
                  setViewName("");
                }}
                variant="ghost"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaceList;
