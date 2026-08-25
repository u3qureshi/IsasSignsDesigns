import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_REVIEWS } from "../../data/customerReviews";
import ReviewCard from "./ReviewCard";

interface CustomerReviewsPreviewProps {
  titleId: string;
}

const FEATURED_REVIEW_IDS = [
  "shawn-2026-08-25",
  "aisha-2026-06-21",
  "waslat-2026-06-16",
];

const FEATURED_REVIEWS = FEATURED_REVIEW_IDS.map((id) =>
  CUSTOMER_REVIEWS.find((review) => review.id === id),
).filter((review): review is (typeof CUSTOMER_REVIEWS)[number] => Boolean(review));

export default function CustomerReviewsPreview({ titleId }: CustomerReviewsPreviewProps) {
  return (
    <section
      className="bg-[hsl(var(--theme-sand-300)/0.28)] px-6 py-20 sm:px-10 sm:py-28"
      aria-labelledby={titleId}
    >
      <div className="mx-auto max-w-[82rem] text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">
          Real customer reviews
        </p>
        <h2 id={titleId} className="mx-auto mt-3 max-w-4xl font-aoki text-[clamp(2.8rem,5vw,5.2rem)] leading-none">
          Made with care. Remembered by customers.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-7 text-[hsl(var(--theme-brown-700))] sm:text-lg sm:leading-8">
          Recent feedback from customers who trusted us with their apparel and embroidery projects.
        </p>

        <div className="mt-12 grid gap-5 text-left md:grid-cols-3">
          {FEATURED_REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} compact />
          ))}
        </div>

        <Link
          to="/reviews"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-[hsl(var(--theme-green-900))] px-7 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          Read all customer reviews
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
