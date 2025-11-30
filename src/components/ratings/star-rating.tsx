import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // 0 to 5
  size?: number;
}

export const StarRating = ({ rating, size = 16 }: StarRatingProps) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-100 text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};