import { Star } from "lucide-react";

interface StarInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
  size?: number;
}

export const StarInput = ({ rating, onRatingChange, disabled = false, size = 24 }: StarInputProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onRatingChange(star)}
          className={`focus:outline-none transition-transform hover:scale-110 ${
            disabled ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <Star
            size={size}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-100 text-gray-300 hover:text-yellow-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
};