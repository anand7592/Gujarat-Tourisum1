import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Rating, Hotel, Place, SubPlace } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { StarRating } from "@/components/ratings/star-rating";
import AddRatingDialog from "@/components/ratings/AddRatingDialog"; // Import the form
import { Trash2, MessageSquare, Plus } from "lucide-react";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Ratings = () => {
  const { user: currentUser } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  // Lists for Dropdown selection (for Admin to pick what to rate)
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [subPlaces, setSubPlaces] = useState<SubPlace[]>([]);

  // Response Modal State
  const [isRespondOpen, setIsRespondOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [responseText, setResponseText] = useState("");
  const [responseLoading, setResponseLoading] = useState(false);

  // Create Review State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTargetType, setSelectedTargetType] = useState<"Hotel" | "Place" | "SubPlace">("Hotel");
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");
  const [showRatingForm, setShowRatingForm] = useState(false); // Controls the actual form visibility

  useEffect(() => {
    fetchRatings();
    // Fetch options for the "Create Review" dropdown
    Promise.all([
      api.get("/hotels"),
      api.get("/places"),
      api.get("/subplaces")
    ]).then(([h, p, sp]) => {
      setHotels(h.data);
      setPlaces(p.data);
      setSubPlaces(sp.data);
    });
  }, []);

  const fetchRatings = async () => {
    try {
      const { data } = await api.get("/ratings");
      setRatings(data);
    } catch (error) {
      console.error("Failed to load ratings");
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/ratings/${id}`);
      setRatings(ratings.filter((r) => r._id !== id));
    } catch (error) {
      alert("Failed to delete review");
    }
  };

  const openRespondModal = (rating: Rating) => {
    setSelectedRating(rating);
    setResponseText(rating.adminResponse || "");
    setIsRespondOpen(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedRating) return;
    try {
      setResponseLoading(true);
      const { data } = await api.put(`/ratings/${selectedRating._id}/respond`, {
        response: responseText,
      });
      setRatings(ratings.map((r) => (r._id === selectedRating._id ? data : r)));
      setIsRespondOpen(false);
    } catch (error) {
      alert("Failed to send response");
    } finally {
      setResponseLoading(false);
    }
  };

  const handleCreateStep1 = () => {
    if (!selectedTargetId) return alert("Please select an item to rate");
    setIsCreateOpen(false); // Close selection dialog
    setShowRatingForm(true); // Open actual rating form
  };

  // Helpers
  const getItemName = (r: Rating) => {
    if (r.ratingType === "Hotel") return r.hotel?.name;
    if (r.ratingType === "Place") return r.place?.name;
    if (r.ratingType === "SubPlace") return r.subPlace?.name;
    return "Unknown Item";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Hotel": return "bg-indigo-100 text-indigo-800";
      case "Place": return "bg-green-100 text-green-800";
      case "SubPlace": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!currentUser?.isAdmin) return <div className="p-10 text-center">Access Denied</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Reviews & Ratings</h2>
          <p className="text-gray-500">Manage user feedback and respond to reviews.</p>
        </div>
        
        {/* NEW BUTTON: ADD REVIEW */}
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus size={16} /> Add Manual Review
        </Button>
      </div>

      <Card className="border-t-4 border-t-yellow-500 shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-semibold text-gray-700">All Reviews</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">User</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="w-[300px]">Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center h-24">Loading...</TableCell></TableRow>
              ) : ratings.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center h-24 text-gray-500">No reviews found.</TableCell></TableRow>
              ) : (
                ratings.map((r) => (
                  <TableRow key={r._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {r.user.firstName} {r.user.lastName}
                      <div className="text-xs text-gray-400 mt-1">{new Date(r.createdAt || "").toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <Badge variant="outline" className={`${getTypeColor(r.ratingType)} border-0`}>
                          {r.ratingType}
                        </Badge>
                        <span className="text-sm font-semibold truncate max-w-[150px]" title={getItemName(r)}>
                          {getItemName(r)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={r.rating} />
                      <span className="text-xs text-gray-500 font-medium mt-1 block">{r.rating}/5.0</span>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-sm text-gray-800">{r.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{r.comment}</p>
                    </TableCell>
                    <TableCell>
                      {r.adminResponse ? <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Replied</Badge> : <Badge variant="outline" className="text-gray-400">Pending</Badge>}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => openRespondModal(r)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                        <MessageSquare size={16} className="mr-1" /> Reply
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50"><Trash2 size={16} /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete Review?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600" onClick={() => handleDelete(r._id)}>Delete Review</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- RESPONSE MODAL --- */}
      <Dialog open={isRespondOpen} onOpenChange={setIsRespondOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Respond to Review</DialogTitle></DialogHeader>
          {selectedRating && (
            <div className="space-y-4 py-2">
              <div className="bg-gray-50 p-3 rounded-md text-sm border">
                <div className="flex justify-between mb-1">
                  <span className="font-bold">{selectedRating.title}</span>
                  <StarRating rating={selectedRating.rating} size={12} />
                </div>
                <p className="text-gray-600 italic">"{selectedRating.comment}"</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Response:</label>
                <Textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Thank you for your feedback..." className="min-h-[100px]" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSubmitResponse} className="bg-blue-600 hover:bg-blue-700" disabled={responseLoading}>
              {responseLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Response"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- STEP 1: SELECT WHAT TO RATE --- */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Manual Review</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Type</Label>
              {/* Using native select or Shadcn select, casting value to type */}
              <Select onValueChange={(val: any) => setSelectedTargetType(val)}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Place">Place</SelectItem>
                  <SelectItem value="SubPlace">SubPlace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Item</Label>
              <Select onValueChange={setSelectedTargetId}>
                <SelectTrigger><SelectValue placeholder={`Select ${selectedTargetType}`} /></SelectTrigger>
                <SelectContent>
                  {selectedTargetType === "Hotel" && hotels.map(h => <SelectItem key={h._id} value={h._id}>{h.name}</SelectItem>)}
                  {selectedTargetType === "Place" && places.map(p => <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>)}
                  {selectedTargetType === "SubPlace" && subPlaces.map(sp => <SelectItem key={sp._id} value={sp._id}>{sp.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter><Button onClick={handleCreateStep1}>Next</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- STEP 2: FILL FORM --- */}
      {/* We reuse the component we already built! */}
      <AddRatingDialog 
        isOpen={showRatingForm}
        onClose={() => setShowRatingForm(false)}
        entityId={selectedTargetId}
        entityType={selectedTargetType}
        onSuccess={() => {
          fetchRatings(); // Refresh list after adding
          setShowRatingForm(false);
        }}
      />

    </div>
  );
};

export default Ratings;