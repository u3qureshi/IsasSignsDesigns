import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Droplets,
  Feather,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import CustomerReviewsPreview from "../reviews/CustomerReviewsPreview";
import { openQuickRequest } from "../../types/quickRequest";
import heroImage from "../../assets/brand/custom-polos-hero.webp";
import poloEmbroideryImage from "../../assets/brand/polo_embroidery.webp";
import performanceIcon from "../../assets/brand/performance.png";
import easyCareIcon from "../../assets/brand/easy_care.png";
import softTouchIcon from "../../assets/brand/feather.png";
import cottonIcon from "../../assets/brand/cotton.png";
import workwearIcon from "../../assets/brand/hard-hat.png";

const POLO_TYPES = [
  {
    name: "Performance",
    eyebrow: "For movement",
    description:
      "Breathable, moisture-managing polos built for active teams, warm venues, outdoor shifts, and event days that rarely slow down.",
    icon: performanceIcon,
    iconClass: "scale-125",
  },
  {
    name: "Easy-care",
    eyebrow: "For busy teams",
    description:
      "Wrinkle-resistant fabric keeps uniforms looking composed with less maintenance—an easy choice for reliable everyday presentation.",
    icon: easyCareIcon,
    iconClass: "scale-[1]",
  },
  {
    name: "Soft-touch",
    eyebrow: "For all-day comfort",
    description:
      "A lightweight, smooth finish gives client-facing teams a refined shirt that feels comfortable from the first meeting to the last.",
    icon: softTouchIcon,
    iconClass: "",
  },
  {
    name: "Classic cotton",
    eyebrow: "For natural comfort",
    description:
      "Soft, breathable, and familiar, cotton polos bring an easy professional look to offices, community groups, and casual events.",
    icon: cottonIcon,
    iconClass: "",
  },
  {
    name: "Workwear",
    eyebrow: "For demanding days",
    description:
      "A sturdier knit and practical construction give trade and service crews a polished uniform designed for regular, hard-working wear.",
    icon: workwearIcon,
    iconClass: "",
  },
] as const;

const FAQS = [
  {
    question: "Which decoration method works best on polo shirts?",
    answer:
      "Embroidery is usually the strongest choice for polos because its textured finish suits structured collars and professional uniforms. If your artwork contains very fine detail or many colours, we’ll review it and recommend the cleanest production approach.",
  },
  {
    question: "Can you embroider our existing company logo?",
    answer:
      "Yes. Upload the best version of your logo in our Custom Design Studio. We’ll prepare it for thread, confirm the size and colours, and make sure the design remains clear at polo-shirt scale before production begins.",
  },
  {
    question: "Do polo orders have a minimum quantity?",
    answer:
      "Minimums can vary with the garment and decoration setup. Tell us how many people you’re outfitting and we’ll recommend an efficient option for your team, whether it is a focused staff order or a larger organization-wide run.",
  },
  {
    question: "What sizes and fits are available?",
    answer:
      "We can source inclusive size ranges and different garment cuts across cotton, performance, blended, and workwear polos. We’ll help you choose a coordinated style that works comfortably across your whole team.",
  },
  {
    question: "How long does a custom polo order take?",
    answer:
      "Turnaround depends on garment availability, order size, and embroidery complexity. Your quote will include a clear schedule, and production starts after you approve the garment, placement, and final artwork details.",
  },
] as const;

function PoloCta({ inverse = false }: { inverse?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => openQuickRequest("embroidery")}
      className={[
        "group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition duration-200",
        inverse
          ? "bg-[hsl(var(--theme-kids-bg))] text-[hsl(var(--theme-brown-900))] hover:bg-white"
          : "bg-[hsl(var(--theme-green-900))] text-white hover:bg-[hsl(var(--theme-green-700))]",
      ].join(" ")}
    >
      Start your polo order
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

export default function PoloShirtsPage() {
  return (
    <main className="overflow-hidden bg-[hsl(var(--theme-kids-bg))] text-[hsl(var(--theme-brown-900))]">
      <section className="relative min-h-[37rem] lg:min-h-[43rem]">
        <img
          src={heroImage}
          alt="A team wearing custom embroidered polo shirts in a bright apparel studio"
          className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--theme-kids-bg))] via-[hsl(var(--theme-kids-bg)/0.94)] to-transparent lg:via-[hsl(var(--theme-kids-bg)/0.58)]" />
        <div className="relative mx-auto flex min-h-[37rem] max-w-[90rem] items-center px-6 py-20 sm:px-10 lg:min-h-[43rem] lg:px-16">
          <div className="max-w-[41rem]">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[hsl(var(--theme-green-700))]">
              Polished in every stitch • Made in Canada
            </p>
            <h1 className="font-aoki text-[clamp(3.5rem,7.2vw,7.3rem)] leading-[0.88] tracking-[-0.04em]">
              Custom Polo Shirts
            </h1>
            <p className="mt-7 max-w-xl text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))] sm:text-xl">
              Give your team a consistent, professional look without losing comfort. We’ll help pair your logo with the right polo, fit, colour, and embroidery placement.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <PoloCta />
              <a href="#polo-styles" className="text-sm font-bold underline decoration-2 underline-offset-4">
                Compare polo styles
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--theme-sage-100)/0.28)] px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Uniforms with intention</p>
            <h2 className="mt-4 font-aoki text-[clamp(2.8rem,5vw,5rem)] leading-[0.96] tracking-[-0.035em]">
              Professional doesn’t have to feel predictable.
            </h2>
          </div>
          <div className="space-y-6 text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
            <p>
              Custom polos create a cohesive look for staff, trade shows, hospitality teams, community organizations, and client-facing events. The collar adds structure while the right knit keeps the shirt easy to wear throughout the day.
            </p>
            <p>
              Share where and how your team will wear them. We’ll guide you through fabric performance, garment weight, fit, sizing, logo scale, and thread colour so every piece feels like part of the same brand.
            </p>
            <ul className="grid gap-3 pt-2 sm:grid-cols-2">
              {["Logo preparation", "Inclusive sizing guidance", "Thread colour matching", "Approval before stitching"].map((item) => (
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

      <section id="polo-styles" className="bg-[hsl(var(--theme-sand-300)/0.28)] px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="styles-title">
        <div className="mx-auto max-w-[88rem]">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Choose your polo</p>
            <h2 id="styles-title" className="mt-3 font-aoki text-[clamp(2.8rem,5vw,5.2rem)] leading-none">The right shirt for the way your team works.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
              From lightweight performance knits to dependable workwear, each option brings a different balance of comfort, structure, and durability.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {POLO_TYPES.map((type) => (
              <article key={type.name} className="group flex flex-col rounded-[1.75rem] bg-white px-6 pb-8 pt-5 shadow-[0_16px_40px_rgba(50,31,21,0.07)]">
                <div className="mx-auto flex h-52 w-full max-w-[15rem] items-center justify-center rounded-[1.4rem] bg-[hsl(var(--theme-sage-100)/0.32)] p-8 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03]">
                  <img
                    src={type.icon}
                    alt=""
                    className={`max-h-full max-w-full object-contain mix-blend-multiply ${type.iconClass}`}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--theme-brown-500))]">{type.eyebrow}</p>
                <h3 className="mt-2 font-aoki text-3xl font-bold">{type.name}</h3>
                <p className="mt-4 text-sm font-medium leading-6 text-[hsl(var(--theme-brown-700))]">{type.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--theme-brown-footer))] px-6 py-20 text-white sm:px-10 sm:py-28" aria-labelledby="embroidery-title">
        <div className="mx-auto max-w-[82rem]">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-sand-300))]">Made to represent you</p>
            <h2 id="embroidery-title" className="mt-3 font-aoki text-[clamp(3rem,5vw,5.5rem)] leading-[0.94]">A logo with dimension.</h2>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-white/75">
              Embroidery gives polos a textured, long-wearing finish that feels at home in professional settings. We translate your artwork into thread with close attention to clarity and proportion.
            </p>
            <div className="mt-9"><PoloCta inverse /></div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch lg:gap-8">
            <div className="min-h-[28rem] overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[0.06]">
              <img
                src={poloEmbroideryImage}
                alt="Close-up of detailed crest embroidery on a navy polo shirt"
                className="h-full min-h-[28rem] w-full object-cover object-center"
              />
            </div>
            <div className="grid gap-4">
              {[
                {
                  title: "Built to last",
                  copy: "Dense, secure stitching stands up to repeat wear and routine washing.",
                  Icon: ShieldCheck,
                },
                {
                  title: "Colour considered",
                  copy: "Thread shades are chosen to complement both your artwork and garment.",
                  Icon: Sparkles,
                },
                {
                  title: "Placed with purpose",
                  copy: "We size the design for a clean left or right chest presentation.",
                  Icon: BriefcaseBusiness,
                },
              ].map(({ title, copy, Icon }) => (
                <article key={title} className="grid grid-cols-[3.5rem_1fr] items-center gap-5 rounded-[1.5rem] border border-white/15 bg-white/[0.06] p-6 sm:grid-cols-[4rem_1fr] sm:p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--theme-sand-300))] text-[hsl(var(--theme-brown-footer))] sm:h-14 sm:w-14">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-aoki text-2xl font-bold">{title}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-white/70">{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="details-title">
        <div className="mx-auto max-w-[82rem]">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Details that matter</p>
            <h2 id="details-title" className="mt-3 font-aoki text-[clamp(2.8rem,5vw,5.2rem)] leading-none">Comfort, care, and consistency.</h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] bg-[hsl(var(--theme-sand-300))] md:grid-cols-3">
            {[
              {
                title: "Stay comfortable",
                copy: "Choose breathable cotton, smooth blends, or moisture-managing fabric to suit the environment.",
                Icon: Feather,
              },
              {
                title: "Keep moving",
                copy: "Performance options help active teams manage warm spaces, long shifts, and outdoor events.",
                Icon: Droplets,
              },
              {
                title: "Look coordinated",
                copy: "Aligned garment colours, logo scale, and placements create a consistent team presentation.",
                Icon: BriefcaseBusiness,
              },
            ].map(({ title, copy, Icon }) => (
              <article key={title} className="bg-white p-8 sm:p-10">
                <Icon className="h-10 w-10 stroke-[1.4] text-[hsl(var(--theme-green-700))]" />
                <h3 className="mt-8 font-aoki text-3xl font-bold">{title}</h3>
                <p className="mt-4 text-base font-medium leading-7 text-[hsl(var(--theme-brown-700))]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--theme-green-900))] px-6 py-14 text-white sm:px-10">
        <div className="mx-auto flex max-w-[82rem] flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-sage-100))]">Ready to outfit your team?</p>
            <h2 className="mt-2 font-aoki text-3xl sm:text-5xl">Bring us the logo. We’ll help with the rest.</h2>
          </div>
          <PoloCta inverse />
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="polo-faq-title">
        <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Good to know</p>
            <h2 id="polo-faq-title" className="mt-3 font-aoki text-[clamp(3rem,5vw,5.3rem)] leading-[0.94]">Custom polos, answered.</h2>
            <p className="mt-6 text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
              Have a particular garment, fit, or deadline in mind? Send us the details and we’ll help map out the order.
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

      <CustomerReviewsPreview titleId="polo-reviews-title" />
    </main>
  );
}
