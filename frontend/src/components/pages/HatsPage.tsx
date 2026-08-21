import {
  ArrowRight,
  Check,
  Eye,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  UserRound,
  UsersRound,
  Wind,
} from "lucide-react";
import { openQuickRequest } from "../../types/quickRequest";
import hatEmbroideryImage from "../../assets/brand/hat_embroidery.png";
import hatFrontSidePlacementImage from "../../assets/brand/hat_embriodery1.png";
import hatBackPlacementImage from "../../assets/brand/hat_embriodery2.png";
import stretchHatImage from "../../assets/brand/hat-stretch.webp";
import performanceHatImage from "../../assets/brand/hat-performance.webp";
import truckerHatImage from "../../assets/brand/hat-trucker.webp";
import bucketHatImage from "../../assets/brand/hat-bucket.webp";
import visorImage from "../../assets/brand/hat-visor.webp";

const HAT_TYPES = [
  {
    name: "Stretch-to-fit",
    eyebrow: "Flexible comfort",
    description:
      "A close, adaptable fit with a clean profile—well suited to staff apparel, active use, and easy everyday branding.",
    image: stretchHatImage,
    imageClass: "scale-125",
  },
  {
    name: "Performance & team",
    eyebrow: "Built for activity",
    description:
      "Lightweight, secure headwear for teams, outdoor events, busy crews, and branded uniforms that need to keep moving.",
    image: performanceHatImage,
    imageClass: "scale-95",
  },
  {
    name: "Mesh-back trucker",
    eyebrow: "Breathable by design",
    description:
      "A structured front meets airy mesh panels and an adjustable closure for a familiar, relaxed outdoor style.",
    image: truckerHatImage,
    imageClass: "scale-[1.4]",
  },
  {
    name: "Bucket hats",
    eyebrow: "Coverage all around",
    description:
      "A full brim brings shade and personality to festivals, summer programs, outdoor teams, and casual merchandise.",
    image: bucketHatImage,
    imageClass: "scale-90",
  },
  {
    name: "Visors",
    eyebrow: "Open-air shade",
    description:
      "A streamlined option for events and active teams that keeps the face shaded while leaving the crown open.",
    image: visorImage,
    imageClass: "scale-150",
  },
] as const;

const FAQS = [
  {
    question: "How large can an embroidered hat design be?",
    answer:
      "The available stitch area depends on the hat profile, front-panel seams, crown height, and design shape. Most cap logos work best when they are compact and easy to read. We’ll size your artwork for the specific hat before you approve it.",
  },
  {
    question: "How much detail can embroidery reproduce?",
    answer:
      "Embroidery can hold impressive detail, but extremely fine lines, tiny lettering, and closely packed elements may need simplification at hat scale. We’ll identify anything that could lose clarity and suggest practical adjustments.",
  },
  {
    question: "Is embroidery different from printing?",
    answer:
      "Yes. Embroidery builds the design with thread for a raised, textured finish, while printing places ink or transfer material on the surface. Structured headwear typically pairs especially well with embroidery because it feels durable and polished.",
  },
  {
    question: "Is there a minimum order for custom hats?",
    answer:
      "Minimums vary by hat style and decoration setup. Share your quantity and preferred profile, and we’ll recommend an efficient route for a small team, event order, or larger branded run.",
  },
  {
    question: "How long will a custom hat order take?",
    answer:
      "Timing depends on hat availability, quantity, and embroidery complexity. Your quote will include a production schedule, and stitching begins only after you approve the hat, placement, colours, and final artwork setup.",
  },
] as const;

function HatCta({ inverse = false }: { inverse?: boolean }) {
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
      Start your hat design
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

export default function HatsPage() {
  return (
    <main className="overflow-hidden bg-[hsl(var(--theme-kids-bg))] text-[hsl(var(--theme-brown-900))]">
      <section className="grid min-h-[37rem] bg-[hsl(var(--theme-kids-bg))] lg:min-h-[43rem] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex items-center px-6 py-20 sm:px-10 lg:px-16">
            <div className="max-w-[40rem]">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[hsl(var(--theme-green-700))]">
                Branding from the top down • Made in Canada
              </p>
              <h1 className="font-aoki text-[clamp(3.8rem,7.2vw,7.4rem)] leading-[0.88] tracking-[-0.04em]">
                Custom Hats
              </h1>
              <p className="mt-7 max-w-xl text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))] sm:text-xl">
                Turn caps, trucker hats, bucket hats, and visors into headwear that carries your identity with texture, precision, and everyday visibility.
              </p>
              <p className="mt-4 max-w-xl text-base font-medium leading-7 text-[hsl(var(--theme-brown-700))]">
                We’ll help choose the profile, fit, placement, thread colours, and artwork scale so your design feels made for the hat—not simply added to it.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <HatCta />
                <a href="#hat-styles" className="text-sm font-bold underline decoration-2 underline-offset-4">
                  Browse hat styles
                </a>
              </div>
            </div>
          </div>
          <div className="min-h-[28rem] overflow-hidden lg:min-h-[43rem]">
            <img
              src={hatEmbroideryImage}
              alt="An embroidery machine stitching a white design onto a blue mesh-back cap"
              className="h-full min-h-[28rem] w-full object-cover object-center lg:min-h-[43rem]"
            />
          </div>
      </section>

      <section className="bg-[hsl(var(--theme-sage-100)/0.28)] px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="hat-sizing-title">
        <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Embroidery placement</p>
            <h2 id="hat-sizing-title" className="mt-3 font-aoki text-[clamp(3rem,5vw,5.3rem)] leading-[0.94]">Sized for the hat, not a template.</h2>
            <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
              Crown height, seams, structure, and logo shape all influence the usable stitch area. We adjust the artwork for a balanced result that stays clear from a comfortable viewing distance.
            </p>
            <ul className="mt-8 grid gap-3">
              {["Artwork reviewed at true stitch size", "Placement aligned to the hat profile", "Thread colours selected before production", "Final setup approved by you"].map((item) => (
                <li key={item} className="flex items-center gap-3 font-bold text-[hsl(var(--theme-green-900))]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--theme-sage-100))]">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] bg-[hsl(var(--theme-green-900))] p-8 text-white sm:p-12">
            <div className="mx-auto max-w-2xl">
              <div className="grid gap-4 sm:grid-cols-2">
                <figure className="overflow-hidden rounded-[1.5rem] bg-[hsl(var(--theme-kids-bg))] p-4 text-[hsl(var(--theme-brown-900))]">
                  <img
                    src={hatFrontSidePlacementImage}
                    alt="Black cap showing front-panel and side embroidery placement options"
                    className="aspect-square w-full object-contain"
                  />
                  <figcaption className="pb-2 text-center text-sm font-bold">Front &amp; side placement</figcaption>
                </figure>
                <figure className="overflow-hidden rounded-[1.5rem] bg-[hsl(var(--theme-kids-bg))] p-4 text-[hsl(var(--theme-brown-900))]">
                  <img
                    src={hatBackPlacementImage}
                    alt="Black cap showing a centred back embroidery placement option"
                    className="aspect-square w-full object-contain"
                  />
                  <figcaption className="pb-2 text-center text-sm font-bold">Back placement</figcaption>
                </figure>
              </div>
              <p className="mt-6 text-center text-sm font-medium leading-6 text-white/70">
                Available placements depend on the construction and closure of your selected hat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="hat-styles" className="bg-[hsl(var(--theme-sand-300)/0.28)] px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="hat-types-title">
        <div className="mx-auto max-w-[88rem]">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Choose your profile</p>
            <h2 id="hat-types-title" className="mt-3 font-aoki text-[clamp(2.8rem,5vw,5.2rem)] leading-none">A shape for every kind of day.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
              Fit, crown structure, ventilation, and brim style change both the feel of a hat and the way embroidered artwork sits on it.
            </p>
          </div>
          <div className="mt-14 flex flex-wrap justify-center gap-5">
            {HAT_TYPES.map((hat) => (
              <article key={hat.name} className="group flex w-full flex-col rounded-[1.75rem] bg-white px-6 pb-8 pt-5 shadow-[0_16px_40px_rgba(50,31,21,0.07)] sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.875rem)]">
                <div className="mx-auto flex h-56 w-full items-center justify-center rounded-[1.4rem] bg-[hsl(var(--theme-sage-100)/0.32)] p-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03]">
                  <img
                    src={hat.image}
                    alt={`Blank ${hat.name.toLowerCase()} ready for custom embroidery`}
                    className={`max-h-full max-w-full object-contain ${hat.imageClass}`}
                  />
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--theme-brown-500))]">{hat.eyebrow}</p>
                <h3 className="mt-2 font-aoki text-3xl font-bold">{hat.name}</h3>
                <p className="mt-4 text-sm font-medium leading-6 text-[hsl(var(--theme-brown-700))]">{hat.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--theme-brown-footer))] px-6 py-20 text-white sm:px-10 sm:py-28" aria-labelledby="why-hats-title">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-sand-300))]">Why custom hats?</p>
              <h2 id="why-hats-title" className="mt-3 font-aoki text-[clamp(3rem,5vw,5.5rem)] leading-[0.94]">Branding people reach for.</h2>
              <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-white/75">
                A well-chosen hat works as a uniform piece, practical accessory, and visible brand touchpoint—all without feeling overly formal.
              </p>
              <div className="mt-9"><HatCta inverse /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Visible", copy: "Headwear keeps your mark easy to notice in daily settings and group environments.", Icon: Eye },
                { title: "Durable", copy: "Quality thread and careful setup create branding designed for repeat wear.", Icon: ShieldCheck },
                { title: "Personal", copy: "Profile, colour, closure, and stitching can all be shaped around your identity.", Icon: Sparkles },
                { title: "Practical", copy: "Shade, comfort, ventilation, and fit give people a reason to keep wearing it.", Icon: Sun },
              ].map(({ title, copy, Icon }) => (
                <article key={title} className="rounded-[1.5rem] border border-white/15 bg-white/[0.06] p-6 sm:p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--theme-sand-300))] text-[hsl(var(--theme-brown-footer))]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-aoki text-2xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-white/70">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="hat-details-title">
        <div className="mx-auto max-w-[82rem]">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Details that shape the result</p>
            <h2 id="hat-details-title" className="mt-3 font-aoki text-[clamp(2.8rem,5vw,5.2rem)] leading-none">Fit first. Artwork second. Better together.</h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] bg-[hsl(var(--theme-sand-300))] md:grid-cols-3">
            {[
              { title: "Profile & structure", copy: "Crown height and firmness determine how the hat sits and how the logo presents.", Icon: Ruler },
              { title: "Comfort & airflow", copy: "Stretch bands, mesh panels, and closures help match the fit to the setting.", Icon: Wind },
              { title: "Team consistency", copy: "Coordinated sizing, colours, and placement keep a group order looking intentional.", Icon: UsersRound },
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
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-sage-100))]">Ready to top it off?</p>
            <h2 className="mt-2 font-aoki text-3xl sm:text-5xl">Bring the logo. We’ll find its best fit.</h2>
          </div>
          <HatCta inverse />
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="hat-faq-title">
        <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Good to know</p>
            <h2 id="hat-faq-title" className="mt-3 font-aoki text-[clamp(3rem,5vw,5.3rem)] leading-[0.94]">Hat embroidery, answered.</h2>
            <p className="mt-6 text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
              Have a specific hat or logo in mind? Send us what you have and we’ll help determine the best setup.
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

      <section className="bg-[hsl(var(--theme-sand-300)/0.28)] px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="hat-reviews-title">
        <div className="mx-auto max-w-[82rem] text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Customer reviews</p>
          <h2 id="hat-reviews-title" className="mx-auto mt-3 max-w-4xl font-aoki text-[clamp(2.8rem,5vw,5.2rem)] leading-none">
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
              We’re looking forward to sharing verified feedback from the teams, businesses, and people we create for. Check back soon for their experiences.
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
