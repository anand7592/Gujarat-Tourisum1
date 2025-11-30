import type { SubPlace } from "@/types";
import { Edit, Trash2, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
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

interface SubPlaceListProps {
  subPlaces: SubPlace[];
  isAdmin: boolean;
  onEdit: (sp: SubPlace) => void;
  onDelete: (id: string) => void;
}

const SubPlaceList = ({
  subPlaces,
  isAdmin,
  onEdit,
  onDelete,
}: SubPlaceListProps) => {
  const [viewImage, setViewImage] = useState<string | null>(null);

  return (
    <>
      <Card className="border-t-4 border-t-purple-600 shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-semibold text-gray-700">
            Manage Sub-Places:
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Parent Place</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Timings</TableHead>
                <TableHead>Features</TableHead>
                {isAdmin && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {subPlaces.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center h-24 text-gray-500"
                  >
                    No sub-places found.
                  </TableCell>
                </TableRow>
              ) : (
                subPlaces.map((sp) => (
                  <TableRow key={sp._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {sp.name}
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin size={10} className="mr-1" /> {sp.location}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        {sp.place?.name || "Unknown"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {sp.image ? (
                        <div
                          className="h-10 w-16 cursor-pointer overflow-hidden rounded border"
                          onClick={() => setViewImage(sp.image!)}
                        >
                          <img
                            src={sp.image}
                            alt={sp.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    <TableCell>₹{sp.entryFee}</TableCell>

                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1">
                        <Clock size={12} /> {sp.openTime} - {sp.closeTime}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {sp.features?.slice(0, 2).map((f, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-[10px] px-1 py-0"
                          >
                            {f}
                          </Badge>
                        ))}
                        {sp.features?.length > 2 && (
                          <span className="text-[10px] text-gray-500">
                            +{sp.features.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {isAdmin && (
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(sp)}
                        >
                          <Edit size={16} className="text-teal-600" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete {sp.name}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Action is permanent.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600"
                                onClick={() => onDelete(sp._id)}
                              >
                                Delete
                              </AlertDialogAction>
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

      {/* Lightbox */}
      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-none bg-transparent">
          {viewImage && (
            <img src={viewImage} className="w-full h-auto rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubPlaceList;
