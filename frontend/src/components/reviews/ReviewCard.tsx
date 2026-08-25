import { UserRound } from "lucide-react";
import type { CustomerReview } from "../../data/customerReviews";
import { formatReviewDate } from "../../data/customerReviews";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: CustomerReview;
  compact?: boolean;
}

export default function ReviewCard({ review, compact = false }: ReviewCardProps) {
  return (
    <article
      className={[
        "rounded-[1.75rem] border border-[hsl(var(--theme-sand-300))] bg-white shadow-[0_16px_45px_rgba(50,31,21,0.07)]",
        compact ? "h-full px-6 py-7 sm:px-7" : "px-6 py-7 sm:px-8 sm:py-8",
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--theme-sage-100))] text-[hsl(var(--theme-green-900))]">
          <UserRound className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-aoki text-xl font-bold text-[hsl(var(--theme-brown-900))]">
            {review.name}
          </h3>
          <p className="text-sm font-semibold text-[hsl(var(--theme-brown-600))]">
            {formatReviewDate(review.date)}
          </p>
        </div>
      </div>

      <StarRating rating={review.rating} className="mt-5" starClassName="h-5 w-5" />

      {review.body ? (
        <blockquote className={`mt-5 font-medium text-[hsl(var(--theme-brown-800))] ${compact ? "line-clamp-5 text-base leading-7" : "text-base leading-7 sm:text-lg sm:leading-8"}`}>
          “{review.body}”
        </blockquote>
      ) : (
        <p className="mt-5 text-sm font-semibold italic text-[hsl(var(--theme-brown-600))]">
          Rating shared without a written comment.
        </p>
      )}

      {!compact && review.excerpt && (
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--theme-brown-500))]">
          Visible review excerpt
        </p>
      )}

      {!compact && review.strengths && review.strengths.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2" aria-label="Customer review highlights">
          {review.strengths.map((strength) => (
            <span
              key={strength}
              className="rounded-full bg-[hsl(var(--theme-sage-100))] px-3 py-1.5 text-xs font-bold text-[hsl(var(--theme-green-900))]"
            >
              {strength}
            </span>
          ))}
        </div>
      )}

    </article>
  );
}
