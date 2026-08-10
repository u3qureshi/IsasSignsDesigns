import {
  ArrowRight,
  Check,
  Droplets,
  Leaf,
  Layers3,
  ShieldCheck,
  Shirt,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/brand/custom-tshirts-hero.webp";
import classicTShirtImage from "../../assets/brand/vecteezy_ai-generated-tshirt-isolated-on-transparent-background_35200581.png";
import tankTopImage from "../../assets/brand/shirt-tank.webp";
import longSleeveImage from "../../assets/brand/blank-white-long-sleeve-tshirt-mockup-design-presentation_632498-25179.png";
import oversizedTShirtImage from "../../assets/brand/shirt-oversized.webp";

const PLACEMENTS = [
  { name: "Full front", detail: "A bold, centred canvas for artwork that deserves the spotlight.", mark: "front" },
  { name: "Left chest", detail: "A polished option for logos, teams, uniforms, and everyday branding.", mark: "chest" },
  { name: "Full back", detail: "Extra room for detailed artwork, messages, dates, or sponsor lists.", mark: "back" },
  { name: "Sleeve", detail: "A thoughtful detail that complements your main front or back design.", mark: "sleeve" },
  { name: "Right chest", detail: "A balanced alternative for names, secondary logos, or paired front details.", mark: "right-chest" },
] as const;

const SHIRT_TYPES = [
  {
    name: "Classic short sleeve",
    description: "The dependable all-rounder for staff shirts, launches, family gatherings, fundraisers, and merch.",
    image: classicTShirtImage,
  },
  {
    name: "Tank tops",
    description: "A lightweight, easy-moving choice for summer events, studios, sports, and casual collections.",
    image: tankTopImage,
  },
  {
    name: "Long sleeve tees",
    description: "Added coverage and more space for creative sleeve details, seasonal uniforms, or layered looks.",
    image: longSleeveImage,
  },
  {
    name: "Oversized T-shirts",
    description: "A relaxed, roomier silhouette with a modern streetwear feel and plenty of space for statement artwork.",
    image: oversizedTShirtImage,
  },
] as const;

const MATERIALS = [
  {
    name: "100% cotton",
    description: "Naturally breathable with a familiar feel and a smooth surface that takes colour beautifully.",
    Icon: Leaf,
  },
  {
    name: "Tri-blend",
    description: "Cotton, polyester, and rayon combine for a soft drape and an elevated retail-ready finish.",
    Icon: Layers3,
  },
  {
    name: "Ring-spun cotton",
    description: "Finer yarn creates a noticeably smoother shirt with a premium hand feel.",
    Icon: Sparkles,
  },
  {
    name: "Cotton/poly blend",
    description: "Comfort meets everyday resilience in an easy-care fabric made for repeat wear.",
    Icon: ShieldCheck,
  },
  {
    name: "Performance fabric",
    description: "Moisture-managing material helps active teams and outdoor crews stay comfortable.",
    Icon: Droplets,
  },
] as const;

const FAQS = [
  {
    question: "Is there a minimum order for custom T-shirts?",
    answer:
      "Minimums depend on the garment, artwork, and print method. Share your quantity—even if it is a small run—and we will recommend the most practical option for your budget.",
  },
  {
    question: "Which printing method will you use?",
    answer:
      "We match the process to your design, fabric, and order size. That can include screen printing for durable multi-piece runs or a detail-friendly transfer method for colourful artwork and smaller quantities.",
  },
  {
    question: "How do I send you my design?",
    answer:
      "Start in our Custom Design Studio and upload the best file you have. Vector artwork or a high-resolution image is ideal, but our team can also help prepare a rough concept for production.",
  },
  {
    question: "When will my order be ready?",
    answer:
      "Timing varies with garment availability, quantity, and artwork complexity. We will confirm a production schedule with your quote, and printing begins only after you approve the final design details.",
  },
  {
    question: "How should I care for printed shirts?",
    answer:
      "For the longest-lasting result, wash shirts inside out in cool water with similar colours, avoid bleach, and tumble dry low or hang to dry. Do not iron directly over the printed area.",
  },
] as const;

function PlacementShirt({ mark }: { mark: (typeof PLACEMENTS)[number]["mark"] }) {
  const markerClass =
    mark === "front"
      ? "left-1/2 top-[38%] h-12 w-16 -translate-x-1/2"
      : mark === "chest"
        ? "left-[34%] top-[33%] h-6 w-7"
        : mark === "right-chest"
          ? "right-[34%] top-[33%] h-6 w-7"
        : mark === "back"
          ? "left-1/2 top-[32%] h-20 w-14 -translate-x-1/2"
          : mark === "sleeve"
            ? "right-[14%] top-[19%] h-7 w-4 rotate-[7deg]"
            : "";

  return (
    <div className="relative mx-auto h-40 w-40" aria-hidden="true">
      <Shirt className="h-full w-full stroke-[1.15] text-[hsl(var(--theme-green-700))]" />
      <span className={`absolute rounded-sm bg-[hsl(var(--theme-brown-500))] ${markerClass}`} />
    </div>
  );
}

function CtaButton({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      to="/printing/custom"
      className={[
        "group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition duration-200",
        inverse
          ? "bg-[hsl(var(--theme-kids-bg))] text-[hsl(var(--theme-brown-900))] hover:bg-white"
          : "bg-[hsl(var(--theme-green-900))] text-white hover:bg-[hsl(var(--theme-green-700))]",
      ].join(" ")}
    >
      Start your T-shirt design
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export default function TShirtsPage() {
  return (
    <main className="overflow-hidden bg-[hsl(var(--theme-kids-bg))] text-[hsl(var(--theme-brown-900))]">
      <section className="relative min-h-[37rem] lg:min-h-[43rem]">
        <img
          src={heroImage}
          alt="A creative team wearing original custom printed T-shirts in an apparel studio"
          className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--theme-kids-bg))] via-[hsl(var(--theme-kids-bg)/0.93)] to-transparent lg:via-[hsl(var(--theme-kids-bg)/0.58)]" />
        <div className="relative mx-auto flex min-h-[37rem] max-w-[90rem] items-center px-6 py-20 sm:px-10 lg:min-h-[43rem] lg:px-16">
          <div className="max-w-[39rem]">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[hsl(var(--theme-green-700))]">
              Printed your way • Made in Canada
            </p>
            <h1 className="font-aoki text-[clamp(3.7rem,7.5vw,7.6rem)] leading-[0.88] tracking-[-0.04em]">
              Custom T-Shirts
            </h1>
            <p className="mt-7 max-w-xl text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))] sm:text-xl">
              Turn your artwork, brand, or big idea into shirts people will actually want to wear. We help with the garment, print, placement, and finishing details from first sketch to final press.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <CtaButton />
              <a href="#shirt-options" className="text-sm font-bold underline decoration-2 underline-offset-4">
                Explore your options
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Built around your idea</p>
            <h2 className="mt-4 font-aoki text-[clamp(2.8rem,5vw,5rem)] leading-[0.96] tracking-[-0.035em]">
              A better blank makes a better finished shirt.
            </h2>
          </div>
          <div className="space-y-6 text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
            <p>
              Custom tees can bring a crew together, give an event its identity, or put your small business in front of new people. The result should feel considered—not like a logo dropped onto the nearest available shirt.
            </p>
            <p>
              Tell us how the shirts will be worn and what matters most to you. We’ll help balance comfort, durability, colour, sizing, and print method so your order looks sharp on day one and keeps its character through everyday wear.
            </p>
            <ul className="grid gap-3 pt-2 sm:grid-cols-2">
              {["Artwork guidance", "Thoughtful placement", "Garment recommendations", "Approval before production"].map((item) => (
                <li key={item} className="flex items-center gap-3 font-bold text-[hsl(var(--theme-green-900))]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--theme-sage-100))]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--theme-sand-300)/0.28)] px-6 py-20 sm:px-10 sm:py-24" aria-labelledby="placements-title">
        <div className="mx-auto max-w-[88rem] text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Print placement</p>
          <h2 id="placements-title" className="mt-3 font-aoki text-[clamp(2.8rem,5vw,5.2rem)] leading-none">Put the design where it works hardest.</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
            Go big, keep it subtle, or combine locations. We’ll size and position your artwork so it feels balanced on the garment—not just centred on a screen.
          </p>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PLACEMENTS.map((placement) => (
              <article key={placement.name} className="rounded-[1.75rem] bg-white px-5 pb-7 pt-5 shadow-[0_16px_40px_rgba(50,31,21,0.07)]">
                <PlacementShirt mark={placement.mark} />
                <h3 className="mt-3 font-aoki text-2xl font-bold">{placement.name}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-[hsl(var(--theme-brown-700))]">{placement.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--theme-green-900))] px-6 py-14 text-white sm:px-10">
        <div className="mx-auto flex max-w-[82rem] flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-sage-100))]">Have artwork ready?</p>
            <h2 className="mt-2 font-aoki text-3xl sm:text-5xl">Let’s turn it into something wearable.</h2>
          </div>
          <CtaButton inverse />
        </div>
      </section>

      <section id="shirt-options" className="px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="types-title">
        <div className="mx-auto max-w-[82rem]">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Choose your fit</p>
            <h2 id="types-title" className="mt-3 font-aoki text-[clamp(2.8rem,5vw,5.2rem)] leading-none">A shirt for every kind of day.</h2>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
              Shape, weight, and fabric all influence how a print feels. We’ll help you choose a style that suits the people wearing it and the job it needs to do.
            </p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-[hsl(var(--theme-sand-300))] md:grid-cols-2">
            {SHIRT_TYPES.map((type, index) => (
              <article key={type.name} className="group flex min-h-72 flex-col justify-between bg-white p-8 sm:p-10">
                <div className="flex items-start justify-between gap-5">
                  <span className="font-aoki text-lg text-[hsl(var(--theme-brown-500))]">0{index + 1}</span>
                  <img
                    src={type.image}
                    alt={`Blank ${type.name.toLowerCase()} ready for custom printing`}
                    className="h-44 w-64 object-contain object-center transition-transform duration-300 group-hover:scale-105 sm:h-52 sm:w-72"
                  />
                </div>
                <div className="mt-8">
                  <h3 className="font-aoki text-3xl font-bold sm:text-4xl">{type.name}</h3>
                  <p className="mt-4 max-w-xl text-base font-medium leading-7 text-[hsl(var(--theme-brown-700))]">{type.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--theme-brown-footer))] px-6 py-20 text-white sm:px-10 sm:py-28" aria-labelledby="materials-title">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-sand-300))]">Fabric guide</p>
              <h2 id="materials-title" className="mt-3 font-aoki text-[clamp(3rem,5vw,5.5rem)] leading-[0.94]">Pick the feel that fits.</h2>
              <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-white/75">
                Soft and lived-in, crisp and substantial, or built to keep up with movement—the right fabric sets the tone before ink ever meets the shirt.
              </p>
            </div>
            <div className="space-y-3">
              {MATERIALS.map(({ name, description, Icon }) => (
                <article key={name} className="grid grid-cols-[3.5rem_1fr] gap-5 rounded-2xl border border-white/15 bg-white/[0.06] p-5 sm:grid-cols-[4rem_12rem_1fr] sm:items-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--theme-sand-300))] text-[hsl(var(--theme-brown-footer))]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-aoki text-xl font-bold sm:text-2xl">{name}</h3>
                  <p className="col-start-2 text-sm font-medium leading-6 text-white/70 sm:col-start-auto sm:text-base">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Good to know</p>
            <h2 id="faq-title" className="mt-3 font-aoki text-[clamp(3rem,5vw,5.3rem)] leading-[0.94]">T-shirt printing, answered.</h2>
            <p className="mt-6 text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
              Still deciding? Send us your idea and quantity. We’ll help you make sense of the details.
            </p>
          </div>
          <div className="border-t border-[hsl(var(--theme-sand-300))]">
            {FAQS.map((faq, index) => (
              <details key={faq.question} className="group border-b border-[hsl(var(--theme-sand-300))] py-2" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-bold marker:hidden sm:text-xl">
                  {faq.question}
                  <span className="relative h-6 w-6 shrink-0 rounded-full border border-[hsl(var(--theme-brown-500))] before:absolute before:left-1/2 before:top-1/2 before:h-px before:w-2.5 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-current after:absolute after:left-1/2 after:top-1/2 after:h-2.5 after:w-px after:-translate-x-1/2 after:-translate-y-1/2 after:bg-current after:transition-transform group-open:after:rotate-90" />
                </summary>
                <p className="max-w-3xl pb-6 pr-10 font-medium leading-7 text-[hsl(var(--theme-brown-700))]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--theme-sand-300)/0.28)] px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="reviews-title">
        <div className="mx-auto max-w-[82rem] text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Customer reviews</p>
          <h2 id="reviews-title" className="mx-auto mt-3 max-w-4xl font-aoki text-[clamp(2.8rem,5vw,5.2rem)] leading-none">
            What people are saying about us
          </h2>

          <article className="mx-auto mt-12 max-w-4xl rounded-[2rem] bg-white px-7 py-10 shadow-[0_18px_50px_rgba(50,31,21,0.08)] sm:px-12 sm:py-14">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--theme-sage-100))] text-[hsl(var(--theme-green-900))]">
              <UserRound className="h-10 w-10" strokeWidth={1.6} aria-hidden="true" />
            </div>
            <div className="mt-6 flex justify-center gap-1 text-[hsl(var(--theme-brown-500))]" aria-label="No ratings yet">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-6 w-6 fill-current" strokeWidth={2.5} aria-hidden="true" />
              ))}
            </div>
            <h3 className="mt-6 font-aoki text-2xl font-bold sm:text-3xl">Customer stories are coming soon.</h3>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-[hsl(var(--theme-brown-700))] sm:text-lg sm:leading-8">
              We’re looking forward to sharing real experiences from the people, teams, and businesses we create for. Check back soon for verified customer feedback.
            </p>
            <span className="mt-8 inline-flex rounded-full border-2 border-[hsl(var(--theme-brown-500)/0.42)] px-6 py-3 text-sm font-bold text-[hsl(var(--theme-brown-700)/0.7)]" aria-disabled="true">
              Reviews coming soon
            </span>
          </article>
        </div>
      </section>
    </main>
  );
}
