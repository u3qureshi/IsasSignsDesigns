import {
  ArrowRight,
  Check,
  Feather,
  Layers3,
  Paintbrush,
  Sparkles,
  Wind,
} from "lucide-react";
import CustomerReviewsPreview from "../reviews/CustomerReviewsPreview";
import { openQuickRequest } from "../../types/quickRequest";
import heroImage from "../../assets/brand/custom-sweatshirts-hero.webp";
import fullZipImage from "../../assets/brand/sweater-full-zip.webp";
import halfZipImage from "../../assets/brand/sweater-half-zip.webp";
import hoodieImage from "../../assets/brand/sweater-hoodie.webp";
import crewneckImage from "../../assets/brand/sweater-crewneck.webp";
import turtleneckImage from "../../assets/brand/sweater-turtleneck.webp";

const LAYER_TYPES = [
  {
    name: "Full-zip fleece",
    eyebrow: "Easy to layer",
    description:
      "A versatile top layer that opens fully for quick temperature changes and gives teams a polished, practical uniform option.",
    image: fullZipImage,
  },
  {
    name: "Quarter & half zip",
    eyebrow: "Smart and adaptable",
    description:
      "A structured collar and adjustable neckline bring comfortable warmth to offices, job sites, events, and everyday branded wear.",
    image: halfZipImage,
  },
  {
    name: "Pullover hoodies",
    eyebrow: "A familiar favourite",
    description:
      "Relaxed, warm, and made for repeat wear, hoodies offer a generous canvas for bold prints or subtle embroidered details.",
    image: hoodieImage,
  },
  {
    name: "Crewneck sweatshirts",
    eyebrow: "Clean and timeless",
    description:
      "A classic collar and uninterrupted front make crewnecks an easy choice for team names, artwork, logos, and event merchandise.",
    image: crewneckImage,
  },
  {
    name: "Turtleneck sweaters",
    eyebrow: "Elevated warmth",
    description:
      "A high neckline and cozy knit create a refined cold-weather layer with room for subtle embroidered branding.",
    image: turtleneckImage,
  },
] as const;

const FAQS = [
  {
    question: "Should I choose screen printing or embroidery?",
    answer:
      "Screen printing works beautifully for larger graphics, bold colour, and coordinated group orders. Embroidery adds durable texture and is especially effective for smaller chest logos on fleece and zip styles. We’ll recommend the method that best suits your artwork, garment, and quantity.",
  },
  {
    question: "Can you add our company logo to hoodies and fleece?",
    answer:
      "Yes. Upload your artwork through the appropriate Custom Design Studio and we’ll prepare it for print or thread. You’ll confirm the garment, placement, size, and final preview before production begins.",
  },
  {
    question: "Is there a minimum sweatshirt order?",
    answer:
      "Minimums vary with the garment and decoration process. Share your expected quantity and budget, and we’ll help you choose an efficient setup for a focused team order or a larger organization-wide run.",
  },
  {
    question: "Will the decoration hold up through regular washing?",
    answer:
      "Our print and embroidery methods are selected for dependable wear. For the best longevity, follow the garment label, wash decorated pieces inside out in cool water, and avoid ironing directly over printed or stitched areas.",
  },
  {
    question: "What are custom sweatshirts useful for?",
    answer:
      "They’re a flexible choice for staff uniforms, clubs, schools, sports teams, volunteer crews, family events, retreats, merchandise, and gifts—especially when your group needs a comfortable layer for changing Canadian weather.",
  },
] as const;

function SweatshirtCta({ inverse = false }: { inverse?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => openQuickRequest("printing")}
      className={[
        "group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition duration-200",
        inverse
          ? "bg-[hsl(var(--theme-kids-bg))] text-[hsl(var(--theme-brown-900))] hover:bg-white"
          : "bg-[hsl(var(--theme-green-900))] text-white hover:bg-[hsl(var(--theme-green-700))]",
      ].join(" ")}
    >
      Start your sweatshirt design
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

export default function SweatshirtsFleecePage() {
  return (
    <main className="overflow-hidden bg-[hsl(var(--theme-kids-bg))] text-[hsl(var(--theme-brown-900))]">
      <section className="relative min-h-[37rem] lg:min-h-[43rem]">
        <img
          src={heroImage}
          alt="A creative team wearing custom hoodies, crewnecks, and fleece layers in an apparel studio"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--theme-kids-bg))] via-[hsl(var(--theme-kids-bg)/0.94)] to-transparent lg:via-[hsl(var(--theme-kids-bg)/0.58)]" />
        <div className="relative mx-auto flex min-h-[37rem] max-w-[90rem] items-center px-6 py-20 sm:px-10 lg:min-h-[43rem] lg:px-16">
          <div className="max-w-[42rem]">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[hsl(var(--theme-green-700))]">
              Comfort, customized • Made in Canada
            </p>
            <h1 className="font-aoki text-[clamp(3.5rem,7.2vw,7.3rem)] leading-[0.88] tracking-[-0.04em]">
              Sweatshirts &amp; Fleece
            </h1>
            <p className="mt-7 max-w-xl text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))] sm:text-xl">
              Create warm, wearable layers for your staff, team, event, or merch collection. We’ll help you choose the garment and finish your artwork with print or embroidery.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <SweatshirtCta />
              <a href="#layer-styles" className="text-sm font-bold underline decoration-2 underline-offset-4">
                Explore layer styles
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--theme-sage-100)/0.28)] px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Layers with purpose</p>
            <h2 className="mt-4 font-aoki text-[clamp(2.8rem,5vw,5rem)] leading-[0.96] tracking-[-0.035em]">
              Made for cool days and everyday rotation.
            </h2>
          </div>
          <div className="space-y-6 text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
            <p>
              A great sweatshirt has to do more than keep people warm. It should feel comfortable, suit the setting, and carry your artwork with the right balance of visibility and restraint.
            </p>
            <p>
              Tell us who will wear it and where it will go. We’ll help compare fleece weight, fit, closures, fabric performance, decoration method, and placement so the finished layer feels considered from every angle.
            </p>
            <ul className="grid gap-3 pt-2 sm:grid-cols-2">
              {["Garment recommendations", "Print or thread guidance", "Inclusive size planning", "Approval before production"].map((item) => (
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

      <section id="layer-styles" className="bg-[hsl(var(--theme-sand-300)/0.28)] px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="layers-title">
        <div className="mx-auto max-w-[88rem]">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Find your layer</p>
            <h2 id="layers-title" className="mt-3 font-aoki text-[clamp(2.8rem,5vw,5.2rem)] leading-none">Warmth in all the right forms.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
              Zip it, pull it on, or keep it lightweight. Each silhouette offers a different combination of warmth, movement, and decoration space.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {LAYER_TYPES.map((layer) => (
              <article key={layer.name} className="group flex flex-col rounded-[1.75rem] bg-white px-6 pb-8 pt-5 shadow-[0_16px_40px_rgba(50,31,21,0.07)]">
                <div className="mx-auto flex h-52 w-full max-w-[15rem] items-center justify-center rounded-[1.4rem] bg-[hsl(var(--theme-sage-100)/0.32)] p-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03]">
                  <img
                    src={layer.image}
                    alt={`Blank ${layer.name.toLowerCase()} ready for customization`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--theme-brown-500))]">{layer.eyebrow}</p>
                <h3 className="mt-2 font-aoki text-3xl font-bold">{layer.name}</h3>
                <p className="mt-4 text-sm font-medium leading-6 text-[hsl(var(--theme-brown-700))]">{layer.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="decoration-title">
        <div className="mx-auto max-w-[82rem]">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Choose your finish</p>
            <h2 id="decoration-title" className="mt-3 font-aoki text-[clamp(2.8rem,5vw,5.2rem)] leading-none">Bold in ink or built in thread.</h2>
            <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
              The artwork, placement, quantity, and fabric all shape the right method. We’ll help you choose a finish that looks intentional and wears well.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] bg-[hsl(var(--theme-green-900))] p-8 text-white sm:p-12">
              <Paintbrush className="h-12 w-12 stroke-[1.4] text-[hsl(var(--theme-sage-100))]" />
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[hsl(var(--theme-sage-100))]">Screen printing</p>
              <h3 className="mt-3 font-aoki text-4xl font-bold sm:text-5xl">Made to make an impact.</h3>
              <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/75">
                Ideal for larger front or back graphics, bold artwork, and coordinated team or event runs. Screen printing gives colour a strong, clean presence across fleece and crewnecks.
              </p>
              <button type="button" onClick={() => openQuickRequest("printing")} className="group mt-8 inline-flex items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4">
                Start a printed design <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </article>
            <article className="rounded-[2rem] bg-[hsl(var(--theme-brown-footer))] p-8 text-white sm:p-12">
              <Sparkles className="h-12 w-12 stroke-[1.4] text-[hsl(var(--theme-sand-300))]" />
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[hsl(var(--theme-sand-300))]">Embroidery</p>
              <h3 className="mt-3 font-aoki text-4xl font-bold sm:text-5xl">Texture that feels refined.</h3>
              <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/75">
                A natural fit for chest logos, names, and smaller branding on quarter-zips, full-zips, and heavyweight layers. Thread adds dimension with a polished, durable finish.
              </p>
              <button type="button" onClick={() => openQuickRequest("embroidery")} className="group mt-8 inline-flex items-center gap-2 text-sm font-bold underline decoration-2 underline-offset-4">
                Start an embroidered design <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--theme-brown-footer))] px-6 py-20 text-white sm:px-10 sm:py-28" aria-labelledby="fleece-details-title">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-20">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-sand-300))]">Comfort considered</p>
              <h2 id="fleece-details-title" className="mt-3 font-aoki text-[clamp(3rem,5vw,5.5rem)] leading-[0.94]">Choose the warmth that works.</h2>
              <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-white/75">
                Fabric weight and construction shape everything from softness to movement. We’ll help match the layer to the season, setting, and people wearing it.
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Soft fleece interiors",
                  copy: "Brushed finishes add cozy warmth for everyday hoodies, crewnecks, and team layers.",
                  Icon: Feather,
                },
                {
                  title: "Balanced fabric blends",
                  copy: "Cotton-rich comfort and polyester durability come together for reliable repeat wear.",
                  Icon: Layers3,
                },
                {
                  title: "Performance-ready options",
                  copy: "Lighter, moisture-managing textiles support movement and changing temperatures.",
                  Icon: Wind,
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

      <section className="bg-[hsl(var(--theme-green-900))] px-6 py-14 text-white sm:px-10">
        <div className="mx-auto flex max-w-[82rem] flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-sage-100))]">Ready to create your layer?</p>
            <h2 className="mt-2 font-aoki text-3xl sm:text-5xl">Bring the idea. We’ll make it wearable.</h2>
          </div>
          <SweatshirtCta inverse />
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 sm:py-28" aria-labelledby="sweatshirt-faq-title">
        <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Good to know</p>
            <h2 id="sweatshirt-faq-title" className="mt-3 font-aoki text-[clamp(3rem,5vw,5.3rem)] leading-[0.94]">Sweatshirts, answered.</h2>
            <p className="mt-6 text-lg font-medium leading-8 text-[hsl(var(--theme-brown-700))]">
              Have a garment weight, placement, or deadline in mind? Send us the details and we’ll help shape the order.
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

      <CustomerReviewsPreview titleId="sweatshirt-reviews-title" />
    </main>
  );
}
