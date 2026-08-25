import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  className?: string;
  starClassName?: string;
}

export default function StarRating({
  rating,
  className = "",
  starClassName = "h-5 w-5",
}: StarRatingProps) {
  return (
    <div className={`flex gap-1 text-[#d97812] ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating;
        return (
          <Star
            key={index}
            className={`${starClassName} ${filled ? "fill-current" : "fill-transparent"}`}
            strokeWidth={2.6}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
