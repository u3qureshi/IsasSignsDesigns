import { useState } from "react";

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface FaqSection {
  heading: string;
  items: FaqItem[];
}

const FAQ_SECTIONS: FaqSection[] = [
  {
    heading: "General",
    items: [
      {
        question: "What do you mean by Islamic wall art?",
        answer:
          "Islamic wall art is decor inspired by Qur'anic verses, Arabic calligraphy, and Islamic geometric design—made to bring beauty and remembrance into everyday spaces. Our pieces are designed with a clean, modern look so they fit naturally in homes, prayer corners, offices, and gift spaces.",
      },
      {
        question: "Why buy from Isa's Signs & Designs?",
        answer: (
          <>
            <p className="mb-2">
              We're a small Canadian studio and we make our products in-house—design,
              laser cutting/engraving, assembly, and finishing. That means:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Consistent quality control</li>
              <li>Faster communication for questions / custom requests</li>
              <li>No dropshipping</li>
              <li>Better turnaround times for local shipping</li>
            </ul>
          </>
        ),
      },
      {
        question: "Do I need an account to order?",
        answer:
          "No. Most customers prefer a quick checkout, so we support guest checkout. If you choose to create an account later, it can help with things like saving details and tracking orders more easily.",
      },
      {
        question: "Can I customize a piece (names, sizes, colors, wording)?",
        answer: (
          <>
            <p className="mb-2">
              Yes—many of our items are customizable. Common customizations include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mb-2">
              <li>Names (kids room signs, family name plaques)</li>
              <li>Wording and dates (nikkah / wedding signage)</li>
              <li>Size options (where available)</li>
              <li>Color / material choices (wood vs acrylic options)</li>
            </ul>
            <p>
              If you don't see the option on a product page, message us and we'll tell
              you what's possible.
            </p>
          </>
        ),
      },
      {
        question: "What materials do you use?",
        answer:
          "Most pieces are made from premium wood and acrylic (often layered for a clean 3D look). Some designs may include specialty finishes depending on the product. Each listing will clearly state the material and care tips.",
      },
      {
        question: "How do I hang or install the wall art?",
        answer: (
          <>
            <p className="mb-2">
              Most items are designed to be easy to mount. Depending on the product,
              you may receive:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mb-2">
              <li>Mounting tape (best for smooth walls / light pieces)</li>
              <li>Keyhole slots or hanging points (for larger items)</li>
              <li>Tabletop stands (for desks, shelves, and counters)</li>
            </ul>
            <p>
              We include guidance for the specific item so you feel confident
              installing it.
            </p>
          </>
        ),
      },
      {
        question: "Where does Islamic wall art look best?",
        answer: (
          <>
            <p className="mb-2">Popular spots are:</p>
            <ul className="list-disc list-inside space-y-1 text-sm mb-2">
              <li>Living room feature wall</li>
              <li>Entryway (a beautiful welcome reminder)</li>
              <li>Prayer corner / home musalla space</li>
              <li>Bedroom or office (quiet daily inspiration)</li>
            </ul>
            <p>
              Smaller pieces also look great on shelves or gallery walls.
            </p>
          </>
        ),
      },
      {
        question: "Is Islamic wall art a good gift?",
        answer: (
          <>
            <p className="mb-2">Yes—these are meaningful gifts for:</p>
            <ul className="list-disc list-inside space-y-1 text-sm mb-2">
              <li>Ramadan and Eid</li>
              <li>Nikkahs and weddings</li>
              <li>Housewarmings</li>
              <li>New babies / nurseries</li>
            </ul>
            <p>
              We also offer items at different price points so you can gift beautifully
              without overspending.
            </p>
          </>
        ),
      },
    ],
  },
  {
    heading: "Kids & Montessori",
    items: [
      {
        question: "What kind of Islamic kids products do you make?",
        answer:
          "We create faith-inspired kids products and Montessori-style learning pieces designed to be engaging, durable, and beautiful in the home—like name signs, learning boards, and interactive pieces that encourage good habits and curiosity.",
      },
      {
        question: "Are your kids / Montessori products safe?",
        answer:
          "We aim for kid-friendly design: smooth edges, durable materials, and simple forms. As with any children's product, adult supervision is recommended—especially for smaller parts. Each listing will note the recommended age range and any safety details.",
      },
    ],
  },
  {
    heading: "Weddings & Nikkahs",
    items: [
      {
        question: "Do you make nikkah and wedding signage?",
        answer: (
          <>
            <p className="mb-2">Yes! We create event signage such as:</p>
            <ul className="list-disc list-inside space-y-1 text-sm mb-2">
              <li>Welcome signs</li>
              <li>Table numbers</li>
              <li>Name / place cards</li>
              <li>Gift table signs</li>
              <li>Custom wording boards</li>
            </ul>
            <p>
              If you have a theme, color palette, or inspiration photo, send it and
              we'll match the vibe.
            </p>
          </>
        ),
      },
      {
        question: "How far in advance should I order event signage?",
        answer:
          "Earlier is better—especially for custom wording and larger pieces. As a general rule, ordering 2–4 weeks before your event gives comfortable time for design approval and production (rush options may be possible depending on workload).",
      },
    ],
  },
  {
    heading: "Business & Signage",
    items: [
      {
        question: "Do you make business signs and professional signage?",
        answer: (
          <>
            <p className="mb-2">Yes. We make clean, modern signage for:</p>
            <ul className="list-disc list-inside space-y-1 text-sm mb-2">
              <li>Reception desks / office walls</li>
              <li>Open/closed signs and hours</li>
              <li>QR code signs (Google reviews, menus, Instagram)</li>
              <li>Table-top / countertop signs for markets / pop-ups</li>
              <li>Branded plaques and displays</li>
            </ul>
            <p>If you have a logo file, we can usually work from that.</p>
          </>
        ),
      },
      {
        question: "Can you engrave my business logo?",
        answer:
          "Yes—send your logo (SVG, PDF, or high-res PNG) and we'll confirm the best method (engrave, cut-out, or layered). We'll also advise on material choice so it looks premium and readable.",
      },
    ],
  },
  {
    heading: "Ordering, Shipping & Care",
    items: [
      {
        question: "Where do you make your products?",
        answer:
          "Everything is designed and produced in Canada in our own studio. We don't outsource or dropship.",
      },
      {
        question: "How do I care for my wood / acrylic pieces?",
        answer: (
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Dust gently with a soft cloth</li>
            <li>Avoid harsh chemicals</li>
            <li>Keep away from prolonged direct moisture / heat</li>
            <li>Acrylic can scratch, so treat it like a high-gloss surface</li>
          </ul>
        ),
      },
      {
        question: "What if my item arrives damaged?",
        answer:
          "Message us right away with photos of the packaging and the item. We'll work with you to make it right as quickly as possible.",
      },
    ],
  },
];

function AccordionItem({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b last:border-0" style={{ borderColor: "hsl(var(--theme-brown-900) / 0.15)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
      >
        <span className="font-semibold text-sm sm:text-base leading-snug">
          {question}
        </span>
        <span
          className="shrink-0 text-lg leading-none transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>

      {open && (
        <div className="pb-5 text-sm leading-relaxed" style={{ color: "hsl(var(--theme-brown-900))" }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "hsl(var(--theme-kids-bg))" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-14" style={{ color: "hsl(var(--theme-brown-900))" }}>
        <h1 className="font-aoki text-4xl text-center mb-12 tracking-wide">
          Frequently Asked Questions
        </h1>

        <div className="space-y-10">
          {FAQ_SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2
                className="font-aoki text-lg mb-3 tracking-wide pb-2 border-b"
                style={{ borderColor: "hsl(var(--theme-brown-500))" }}
              >
                {section.heading}
              </h2>
              <div>
                {section.items.map((item) => (
                  <AccordionItem
                    key={item.question}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
