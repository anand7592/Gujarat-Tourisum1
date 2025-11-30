import { useState } from "react";
import api from "@/lib/api";
import { StarInput } from "@/components/ratings/star-input";
import { Loader2, UploadCloud } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddRatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string; // The ID of the Hotel or Place
  entityType: "Hotel" | "Place" | "SubPlace";
  onSuccess: () => void; // Callback to refresh the list
}

const AddRatingDialog = ({
  isOpen,
  onClose,
  entityId,
  entityType,
  onSuccess,
}: AddRatingDialogProps) => {
  const [loading, setLoading] = useState(false);

  // Form State
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<FileList | null>(null);

  // Optional Sub-ratings (For Hotels)
  const [cleanliness, setCleanliness] = useState(0);
  const [service, setService] = useState(0);
  const [locationScore, setLocationScore] = useState(0);
  const [valueForMoney, setValueForMoney] = useState(0);

  const handleSubmit = async () => {
    // Validation
    if (rating === 0) return alert("Please select a star rating");
    if (!title.trim() || !comment.trim()) return alert("Please fill in Title and Review");

    try {
      setLoading(true);
      const formData = new FormData();

      // 1. Required Fields
      formData.append("ratingType", entityType);
      formData.append("rating", rating.toString());
      formData.append("title", title);
      formData.append("comment", comment);

      // 2. Dynamic ID Linking (Based on your Backend Logic)
      if (entityType === "Hotel") formData.append("hotelId", entityId);
      if (entityType === "Place") formData.append("placeId", entityId);
      if (entityType === "SubPlace") formData.append("subPlaceId", entityId);

      // 3. Optional Ratings
      if (cleanliness) formData.append("cleanliness", cleanliness.toString());
      if (service) formData.append("service", service.toString());
      if (locationScore) formData.append("location", locationScore.toString());
      if (valueForMoney) formData.append("valueForMoney", valueForMoney.toString());

      // 4. Images
      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      // 5. Send to Backend
      await api.post("/ratings", formData);

      alert("Review submitted successfully!");
      onSuccess(); // Refresh parent
      handleClose(); // Close modal
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setRating(0);
    setTitle("");
    setComment("");
    setImages(null);
    setCleanliness(0);
    setService(0);
    setLocationScore(0);
    setValueForMoney(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience for this {entityType}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Main Rating */}
          <div className="flex flex-col items-center gap-2">
            <Label className="text-lg font-semibold">Your Rating</Label>
            <StarInput rating={rating} onRatingChange={setRating} size={32} />
          </div>

          {/* Text Fields */}
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input
              placeholder="Summary (e.g., Great experience!)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Review</Label>
            <Textarea
              placeholder="What did you like or dislike?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Extra Ratings (Only show for Hotels) */}
          {entityType === "Hotel" && (
            <div className="bg-gray-50 p-4 rounded-md space-y-3 border">
              <Label className="font-semibold text-sm">Detailed Ratings (Optional)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Cleanliness</Label>
                  <StarInput rating={cleanliness} onRatingChange={setCleanliness} size={16} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Service</Label>
                  <StarInput rating={service} onRatingChange={setService} size={16} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Location</Label>
                  <StarInput rating={locationScore} onRatingChange={setLocationScore} size={16} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Value</Label>
                  <StarInput rating={valueForMoney} onRatingChange={setValueForMoney} size={16} />
                </div>
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="grid gap-2">
            <Label>Add Photos</Label>
            <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer relative transition-colors">
              <Input
                type="file"
                multiple
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setImages(e.target.files)}
              />
              <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                {images && images.length > 0
                  ? `${images.length} files selected`
                  : "Click to upload images"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRatingDialog;