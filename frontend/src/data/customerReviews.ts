export interface CustomerReview {
  id: string;
  name: string;
  date: string;
  rating: number;
  body?: string;
  strengths?: string[];
  excerpt?: boolean;
}

const SELLER_STRENGTHS = ["Punctuality", "Communication", "Pricing", "Item description"];

const reviews: CustomerReview[] = [
  {
    id: "shawn-2026-08-25",
    name: "Shawn",
    date: "2026-08-25",
    rating: 5,
    body: "Great item. Pricing was amazing, and the time and quality of the job were perfect. Would recommend to anyone who needs embroidery done.",
  },
  {
    id: "bernadette-2026-06-21",
    name: "Bernadette",
    date: "2026-06-21",
    rating: 5,
    body: "The sweater was so cute, and my husband loves it so much! Thank you!",
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "aisha-2026-06-21",
    name: "Aisha",
    date: "2026-06-21",
    rating: 5,
    body: "I couldn’t be happier with my experience! I ordered custom crewnecks for my husband and dad, and everything exceeded my expectations. The turnaround time was incredibly fast, the quality of the crewnecks was excellent, and the attention to detail was amazing. The customer service was friendly, responsive, and made the whole process seamless. On top of that, the pricing was very reasonable for such high-quality custom work. I would absolutely order from this seller again and highly recommend them to anyone looking for custom apparel. Thank you for creating such special gifts!",
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "maria-tanya-vera-2026-06-21",
    name: "Maria Tanya Vera",
    date: "2026-06-21",
    rating: 5,
  },
  {
    id: "juliet-2026-06-20",
    name: "Juliet",
    date: "2026-06-20",
    rating: 5,
    body: "Amazing seller.",
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "nada-2026-06-18",
    name: "Nada",
    date: "2026-06-18",
    rating: 5,
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "waslat-2026-06-16",
    name: "Waslat",
    date: "2026-06-16",
    rating: 5,
    body: "Such a lovely lady with amazing customer service and work! Definitely recommend ordering your embroidered pieces from her. Everything is exactly how I wanted, and the work is very neat!",
  },
  {
    id: "hassan-2026-06-15",
    name: "Hassan",
    date: "2026-06-15",
    rating: 5,
    body: "Great hoodie quality, thick and heavy. Great attention to detail, and she was very easy to communicate and get along with. She delivered, and the trust was there. Thank you for helping me with my university hoodie!",
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "bindi-2026-06-15",
    name: "Bindi",
    date: "2026-06-15",
    rating: 5,
    strengths: ["Punctuality", "Communication"],
  },
  {
    id: "nathalie-2026-06-13",
    name: "Nathalie",
    date: "2026-06-13",
    rating: 5,
    body: "The whole experience was fantastic from start to finish. Thank you so much!",
    strengths: ["Punctuality", "Communication", "Pricing"],
  },
  {
    id: "cheeza-2026-06-13",
    name: "Cheeza",
    date: "2026-06-13",
    rating: 5,
    body: "Genuinely amazing work! I had a different time frame for when I needed my hoodies done. It got done before the due date, and everything came out amazing! Even with the reference picture I gave, it came out 10× better than I expected! Even the pricing was wonderful! I would definitely recommend coming and getting any gifts or even a sweater for yourself done!",
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "anna-michaela-2026-06-10",
    name: "Anna Michaela",
    date: "2026-06-10",
    rating: 5,
    body: "If I could give this seller 100 stars, I would. Her work is very high quality and fast, and she was so kind too. Highly recommend!",
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "aysha-2026-06-05",
    name: "Aysha",
    date: "2026-06-05",
    rating: 5,
    body: "Super kind and willing to come up with alternative solutions to solve a problem! Great experience!",
    strengths: ["Communication"],
  },
  {
    id: "karen-2026-06-03",
    name: "Karen",
    date: "2026-06-03",
    rating: 5,
    body: "Seller was great. Product amazing!",
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "lexi-2026-05-26",
    name: "Lexi",
    date: "2026-05-26",
    rating: 5,
    body: "Excellent service! I needed something done with little notice, and Karolina executed my vision timely and perfectly! Pricing, communication, and quality were all done wonderfully!",
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "jonathan-2026-05-23",
    name: "Jonathan",
    date: "2026-05-23",
    rating: 5,
    body: "The embroidery and quality of her work is amazing. Very professional and always delivers the desired results.",
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "aby-2026-05-22",
    name: "Aby",
    date: "2026-05-22",
    rating: 5,
  },
  {
    id: "diana-2026-05-20",
    name: "Diana",
    date: "2026-05-20",
    rating: 5,
  },
  {
    id: "tazmin-2026-05-17",
    name: "Tazmin",
    date: "2026-05-17",
    rating: 5,
  },
  {
    id: "amanda-2026-05-15",
    name: "Amanda",
    date: "2026-05-15",
    rating: 5,
  },
  {
    id: "gabe-2026-05-14",
    name: "Gabe",
    date: "2026-05-14",
    rating: 5,
    body: "Beautiful work and completed quickly. I got the sweater in six days!",
  },
  {
    id: "vino-2026-05-14",
    name: "Vino",
    date: "2026-05-14",
    rating: 5,
    body: "Karolina was so helpful and communicated thoroughly throughout the process.",
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "maya-2026-05-14",
    name: "Maya",
    date: "2026-05-14",
    rating: 5,
    strengths: ["Punctuality", "Communication", "Pricing"],
  },
  {
    id: "rohma-2026-05-14",
    name: "Rohma",
    date: "2026-05-14",
    rating: 5,
    strengths: ["Communication"],
  },
  {
    id: "mallory-2026-05-13",
    name: "Mallory",
    date: "2026-05-13",
    rating: 5,
    body: "My purchase was exactly what was described, perfect size. Highly recommend Karolina. Will be purchasing again.",
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "sheila-2026-05-08",
    name: "Sheila",
    date: "2026-05-08",
    rating: 5,
    body: "It was a pleasure dealing with Karolina. Very sweet girl, and she does beautiful work. She was easy to communicate with and very flexible.",
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "jibran-2026-05-08",
    name: "Jibran",
    date: "2026-05-08",
    rating: 5,
    body: "Amazing quality and such a thoughtful Mother’s Day gift! The custom hoodie turned out beautifully, with clean design work, comfortable…",
    excerpt: true,
  },
  {
    id: "pamela-2026-05-07",
    name: "Pamela",
    date: "2026-05-07",
    rating: 5,
    body: "My purchase turned out exactly how I wanted it to be. Karolina was very responsive and extremely helpful in accommodating a quick pickup. I would recommend her to anyone wanting a personal touch on a hoodie.",
  },
  {
    id: "lee-2026-05-07",
    name: "Lee",
    date: "2026-05-07",
    rating: 5,
    body: "Beautiful work. I highly recommend Karolina. Kept updates and communication. Pricing was fair, as my item was personalized.",
  },
  {
    id: "sarah-2026-05-07",
    name: "Sarah",
    date: "2026-05-07",
    rating: 5,
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "ahmed-2026-05-07",
    name: "Ahmed",
    date: "2026-05-07",
    rating: 5,
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "alvin-2026-05-07",
    name: "Alvin",
    date: "2026-05-07",
    rating: 5,
  },
  {
    id: "moe-2026-05-07",
    name: "Moe",
    date: "2026-05-07",
    rating: 5,
    body: "Amazing experience. The quality of the embroidery is beautiful, clean, and detailed. Communication was smooth, and the seller was really helpful. They worked with all my requests. I’ll definitely be coming back! The hoodie was great quality too.",
    strengths: ["Punctuality", "Communication", "Fair negotiation"],
  },
  {
    id: "chris-2026-05-03",
    name: "Chris",
    date: "2026-05-03",
    rating: 5,
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "usman-2026-05-01",
    name: "Usman",
    date: "2026-05-01",
    rating: 5,
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "naquiya-2026-04-07",
    name: "Naquiya",
    date: "2026-04-07",
    rating: 5,
    strengths: ["Communication"],
  },
  {
    id: "anuj-2026-03-02",
    name: "Anuj",
    date: "2026-03-02",
    rating: 5,
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "ashley-2026-03-01",
    name: "Ashley",
    date: "2026-03-01",
    rating: 5,
    strengths: ["Punctuality", "Communication", "Fair negotiation"],
  },
  {
    id: "omkar-2026-03-01",
    name: "Omkar",
    date: "2026-03-01",
    rating: 4,
  },
  {
    id: "pre-2026-02-26",
    name: "Pre",
    date: "2026-02-26",
    rating: 5,
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "glenn-2026-02-25",
    name: "Glenn",
    date: "2026-02-25",
    rating: 5,
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "monisha-2026-02-07",
    name: "Monisha",
    date: "2026-02-07",
    rating: 5,
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "morgan-2025-11-04",
    name: "Morgan",
    date: "2025-11-04",
    rating: 5,
  },
  {
    id: "suzanne-2025-07-18",
    name: "Suzanne",
    date: "2025-07-18",
    rating: 5,
    strengths: SELLER_STRENGTHS,
  },
  {
    id: "k-fay-2025-07-08",
    name: "K Fay",
    date: "2025-07-08",
    rating: 5,
  },
];

export const CUSTOMER_REVIEWS = [...reviews].sort(
  (left, right) => Date.parse(right.date) - Date.parse(left.date),
);

export const CUSTOMER_REVIEW_AVERAGE =
  CUSTOMER_REVIEWS.reduce((total, review) => total + review.rating, 0) /
  CUSTOMER_REVIEWS.length;

export function formatReviewDate(date: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
