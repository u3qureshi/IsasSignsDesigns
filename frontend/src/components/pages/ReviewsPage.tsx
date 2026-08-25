import { MessageCircleMore } from "lucide-react";
import { useEffect } from "react";
import ReviewCard from "../reviews/ReviewCard";
import StarRating from "../reviews/StarRating";
import {
  CUSTOMER_REVIEW_AVERAGE,
  CUSTOMER_REVIEWS,
} from "../../data/customerReviews";

export default function ReviewsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <main className="bg-[hsl(var(--theme-sand-100))] text-[hsl(var(--theme-brown-900))]">
      <section className="overflow-hidden bg-[hsl(var(--theme-sage-100))] px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto grid max-w-[82rem] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="font-aoki text-[clamp(1.65rem,3vw,2.7rem)] font-bold leading-none text-[hsl(var(--theme-brown-600))]">
              Customer feedback
            </p>
            <h1 className="mt-5 max-w-4xl font-aoki text-[clamp(2.8rem,5.4vw,5.6rem)] leading-[0.92]">
              Kind words from real customers.
            </h1>
            <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))] sm:text-xl sm:leading-9">
              From custom hoodies and crewnecks to detailed embroidery, these ratings and comments
              come directly from customers after completed orders and custom projects.
            </p>
          </div>

          <div className="rounded-[2.25rem] bg-white p-8 text-center shadow-[0_22px_65px_rgba(50,31,21,0.1)] sm:p-10">
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--theme-sand-200))] text-[hsl(var(--theme-green-900))]">
                <MessageCircleMore className="h-8 w-8" aria-hidden="true" />
              </div>
              <div className="mt-5">
                <p className="font-aoki text-5xl font-bold leading-none sm:text-6xl">
                  {CUSTOMER_REVIEW_AVERAGE.toFixed(2)}
                </p>
                <p className="mt-2 text-2xl font-bold text-[hsl(var(--theme-brown-600))] sm:text-3xl">
                  out of 5
                </p>
              </div>
            </div>
            <StarRating rating={5} className="mt-6 justify-center" starClassName="h-8 w-8" />
            <p className="mt-5 text-xl font-bold sm:text-2xl">
              {CUSTOMER_REVIEWS.length} ratings shared
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 sm:py-24" aria-labelledby="all-reviews-title">
        <div className="mx-auto max-w-[82rem]">
          <div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">
                Newest to oldest
              </p>
              <h2 id="all-reviews-title" className="mt-3 font-aoki text-[clamp(2.8rem,5vw,5rem)] leading-none">
                Customer reviews
              </h2>
            </div>
          </div>

          <div className="mt-10 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
            {CUSTOMER_REVIEWS.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
