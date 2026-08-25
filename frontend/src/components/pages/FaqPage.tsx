import { Mail, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import threadButterLogo from "../../assets/brand/threadnbutterLogoIMG.png";

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
    heading: "About Thread & Butter",
    items: [
      {
        question: "What does Thread & Butter make?",
        answer:
          "We create custom embroidered and printed apparel, ready-to-order designs, and quality blank garments. Our collection includes T-shirts, polos, hoodies, crewnecks, fleece, hats, long sleeves, and more for individuals, teams, events, and businesses.",
      },
      {
        question: "Why choose Thread & Butter?",
        answer: (
          <>
            <p className="mb-2">
              We combine the flexibility of a small Canadian business with a guided,
              easy-to-use ordering experience. That means:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Personal support for custom ideas and artwork</li>
              <li>Careful review before a custom design enters production</li>
              <li>Ready-to-order pieces and flexible custom options in one place</li>
              <li>Apparel selected with comfort, decoration, and everyday wear in mind</li>
            </ul>
          </>
        ),
      },
      {
        question: "Is your work made in Canada?",
        answer:
          "Thread & Butter is a Canadian business, and our custom decoration and order preparation are handled with care through our Canadian studio. Some blank garments are sourced from established apparel manufacturers before we print or embroider them.",
      },
      {
        question: "Do I need an account to shop?",
        answer:
          "No. Guest checkout is available. You can also create a passwordless account using a one-time email code, making it easier to keep your contact details connected to future account features.",
      },
      {
        question: "What is the difference between Gallery and Clothing?",
        answer:
          "Gallery features finished, ready-to-order Thread & Butter designs. Clothing is our collection of undecorated blank garments in multiple colours and sizes, ready to wear as-is or use as the starting point for a custom request.",
      },
    ],
  },
  {
    heading: "Custom Printing & Embroidery",
    items: [
      {
        question: "Should I choose printing or embroidery?",
        answer: (
          <>
            <p className="mb-2">
              It depends on the artwork, garment, and finish you want:
            </p>
            <ul className="mb-2 list-inside list-disc space-y-1 text-sm">
              <li>Embroidery offers a textured, polished finish suited to logos, names, hats, and uniforms.</li>
              <li>Printing works well for colourful artwork, larger graphics, and detailed shirt or hoodie designs.</li>
            </ul>
            <p>
              If you are unsure, submit a quick request and we will help you choose.
            </p>
          </>
        ),
      },
      {
        question: "Can I submit my own logo, artwork, or inspiration image?",
        answer:
          "Yes. Our quick-request and Custom Design Studio forms accept PNG, JPG, and WEBP images up to 10 MB. Upload the clearest version you have, and include notes about placement, colours, size, and the result you have in mind.",
      },
      {
        question: "How does the AI Custom Design Studio work?",
        answer:
          "Choose embroidery or printing, describe your idea, add garment and placement details, and optionally upload an inspiration image. The studio can generate a visual concept to help communicate your direction before you submit the complete request for review.",
      },
      {
        question: "Is an AI preview the final production proof?",
        answer:
          "No. AI previews are concept images, so details, colours, scale, and placement may differ from the final result. We review the submitted request and artwork before confirming production details or pricing.",
      },
      {
        question: "Can you handle team, event, or business apparel?",
        answer:
          "Yes. We welcome coordinated apparel for teams, staff, clubs, events, creators, and businesses. Use the quick-request form to list each garment and quantity, then include your deadline and branding requirements in the notes.",
      },
      {
        question: "Is there a minimum quantity for a custom request?",
        answer:
          "You can contact us about a single custom piece or a larger coordinated order. Feasibility and pricing depend on the garment, decoration method, artwork, and quantity, so we confirm those details after reviewing your request.",
      },
    ],
  },
  {
    heading: "Products, Sizing & Care",
    items: [
      {
        question: "Which apparel styles and colours are available?",
        answer: (
          <>
            <p className="mb-2">Our current selection includes:</p>
            <ul className="mb-2 list-inside list-disc space-y-1 text-sm">
              <li>T-shirts, tanks, and long sleeves</li>
              <li>Polos and work-ready apparel</li>
              <li>Hoodies, crewnecks, sweatpants, fleece, and turtlenecks</li>
              <li>Caps, trucker hats, performance hats, bucket hats, and visors</li>
            </ul>
            <p>Available colours and sizes are shown on each applicable product page.</p>
          </>
        ),
      },
      {
        question: "How should I choose a size?",
        answer:
          "Check the sizes offered for the selected garment and consider the fit described on its product page. Different brands and styles can fit differently, so contact us before ordering if you need garment measurements or help coordinating group sizes.",
      },
      {
        question: "Will colours look exactly the same on my screen?",
        answer:
          "Screens, lighting, fabric blends, and production methods can all affect colour appearance. We aim to represent each garment and design clearly, but minor differences between the online preview and physical product are normal.",
      },
      {
        question: "How should I care for decorated apparel?",
        answer: (
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>Follow the garment label and any instructions included with your order</li>
            <li>Wash inside out in cold water with similar colours</li>
            <li>Avoid bleach and harsh chemicals</li>
            <li>Use low heat or hang dry, and do not iron directly over the decoration</li>
          </ul>
        ),
      },
    ],
  },
  {
    heading: "Ordering, Payment & Delivery",
    items: [
      {
        question: "How is pricing determined?",
        answer:
          "Ready-to-order and blank-apparel prices appear directly on their product pages. Custom pricing depends on the garment, quantity, artwork, placement, dimensions, colours, and decoration method. A custom request is reviewed before final production details are confirmed.",
      },
      {
        question: "How can I pay for an online order?",
        answer:
          "Online product orders use Stripe's secure hosted checkout. Thread & Butter does not store your complete card information on its own servers.",
      },
      {
        question: "How much is shipping?",
        answer:
          "Standard shipping is calculated in your checkout summary. The current storefront offers free shipping when the qualifying merchandise subtotal reaches $100; any applicable tax is shown during checkout.",
      },
      {
        question: "How long will a custom order take?",
        answer:
          "Timing varies with garment availability, quantity, artwork readiness, approvals, and current workload. If your order is for an event or deadline, include the date in your request so feasibility can be confirmed before production.",
      },
      {
        question: "What if my item arrives damaged?",
        answer:
          "Contact us promptly with your order information and clear photos of the item and packaging. We will review what happened and help determine the appropriate next step.",
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
  const location = useLocation();
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [contactError, setContactError] = useState("");

  async function handleContactMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const request = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    setContactStatus("sending");
    setContactError("");
    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as {
          message?: string;
          details?: string[];
        } | null;
        throw new Error(body?.details?.[0] || body?.message || "Your message could not be sent.");
      }

      formElement.reset();
      setContactStatus("sent");
    } catch (error) {
      setContactError(error instanceof Error ? error.message : "Your message could not be sent.");
      setContactStatus("error");
    }
  }

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.querySelector(location.hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "hsl(var(--theme-kids-bg))" }}
    >
      <section className="bg-[hsl(var(--theme-sage-100)/0.48)] px-6 py-10 sm:px-10 sm:py-14">
        <div className="mx-auto max-w-6xl text-center" style={{ color: "hsl(var(--theme-brown-900))" }}>
          <p className="font-aoki text-[clamp(1.75rem,3.2vw,3rem)] font-bold leading-none tracking-wide text-[hsl(var(--theme-brown-600))]">
            About Thread &amp; Butter
          </p>
          <h1 className="mx-auto mt-3 max-w-4xl font-aoki text-[clamp(2.2rem,4.3vw,4.3rem)] leading-[1.04] tracking-[-0.02em]">
            Your ideas, made wearable.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-7 text-[hsl(var(--theme-brown-700))] sm:text-lg">
            Thread &amp; Butter is a{" "}
            <span className="relative inline-block font-black text-[#c1121f]">
              Canadian
              <svg
                viewBox="-2015 -2000 4030 4030"
                aria-hidden="true"
                className="absolute -right-2 -top-2 h-3.5 w-3.5 text-[#c1121f] sm:-top-2.5 sm:h-4 sm:w-4"
              >
                <path
                  fill="currentColor"
                  d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"
                />
              </svg>
            </span>{" "}
            custom-apparel studio built around personal ideas, thoughtful details, and clothing people genuinely want to wear. We
            bring embroidery, printing, ready-to-order designs, and carefully selected
            blanks together in one approachable experience.
          </p>

          <div className="mt-7 grid gap-4 text-left md:grid-cols-3">
            {[
              ["Made together", "Start with a finished favourite, send a quick request, or shape a custom concept with our guided design studio."],
              ["Reviewed with care", "Artwork, garment choices, placement, and production details are considered before a custom request moves forward."],
              ["Made for your moment", "Create one meaningful piece or coordinate apparel for a team, business, event, gift, or everyday wardrobe."],
            ].map(([title, description]) => (
              <article key={title} className="rounded-3xl bg-white p-5 shadow-[0_16px_45px_hsl(var(--theme-brown-900)/0.08)]">
                <h2 className="font-aoki text-2xl tracking-wide">{title}</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-[hsl(var(--theme-brown-700))]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-28 bg-white px-6 py-10 sm:px-10 sm:py-12"
        aria-labelledby="contact-title"
      >
        <div className="mx-auto max-w-5xl text-center text-[hsl(var(--theme-brown-900))]">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[hsl(var(--theme-brown-600))]">
            We would love to hear from you
          </p>
          <h2 id="contact-title" className="mt-2 font-aoki text-4xl tracking-wide sm:text-5xl">
            Contact Us
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-base font-medium leading-7 text-[hsl(var(--theme-brown-700))] sm:text-lg">
            Have a question about an order, product, or custom idea? Reach out using whichever option is easiest for you.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <a
              href="tel:+16477005182"
              className="rounded-3xl bg-[hsl(var(--theme-sage-100)/0.55)] p-5 transition-transform hover:-translate-y-1"
            >
              <Phone className="mx-auto h-8 w-8 text-[hsl(var(--theme-green-900))]" aria-hidden="true" />
              <h3 className="mt-2 font-aoki text-2xl">Call us</h3>
              <p className="mt-1 font-bold text-[hsl(var(--theme-brown-700))]">+1 (647) 700-5182</p>
            </a>

            <a
              href="mailto:chrastinovakajaa@outlook.com"
              className="rounded-3xl bg-[hsl(var(--theme-sand-200)/0.65)] p-5 transition-transform hover:-translate-y-1"
            >
              <Mail className="mx-auto h-8 w-8 text-[hsl(var(--theme-green-900))]" aria-hidden="true" />
              <h3 className="mt-2 font-aoki text-2xl">Email us</h3>
              <p className="mt-1 break-all font-bold text-[hsl(var(--theme-brown-700))]">
                chrastinovakajaa@outlook.com
              </p>
            </a>

            <a
              href="https://wa.me/16477005182"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-3xl bg-[hsl(var(--theme-sage-100)/0.55)] p-5 transition-transform hover:-translate-y-1"
            >
              <MessageCircle className="mx-auto h-8 w-8 text-[hsl(var(--theme-green-900))]" aria-hidden="true" />
              <h3 className="mt-2 font-aoki text-2xl">WhatsApp</h3>
              <p className="mt-1 font-bold text-[hsl(var(--theme-brown-700))]">+1 (647) 700-5182</p>
            </a>
          </div>

          <div
            id="contact-form"
            className="relative mt-7 scroll-mt-28 overflow-hidden rounded-[2rem] bg-[hsl(var(--theme-kids-bg))] p-5 text-left shadow-[0_20px_60px_hsl(var(--theme-brown-900)/0.1)] sm:p-6 lg:p-7"
          >
            <img
              src={threadButterLogo}
              alt="Thread & Butter"
              className="absolute right-4 top-4 h-20 w-20 object-contain sm:right-6 sm:top-5 sm:h-24 sm:w-24"
            />

            <div className="max-w-2xl pr-16 sm:pr-24">
              <p className="text-lg font-bold uppercase tracking-[0.22em] text-[hsl(var(--theme-brown-600))] sm:text-xl">
                Get in touch
              </p>
              <h3 className="mt-1 font-aoki text-3xl leading-tight sm:text-4xl">
                Tell us what you have in mind.
              </h3>
              <p className="mt-2 text-sm font-medium leading-6 text-[hsl(var(--theme-brown-700))] sm:text-base">
                Have a question we haven't answered? Whether you're curious about custom orders,
                want to bring your brand to life, or are looking to partner with us—we'd love to
                hear from you.
              </p>
            </div>

            <form className="mt-5 grid gap-3 sm:grid-cols-2" onSubmit={handleContactMessage}>
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[hsl(var(--theme-brown-700))]">
                  What's your name?
                  <span className="ml-1 align-super text-sm text-red-600" aria-hidden="true">*</span>
                </span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  className="mt-1.5 w-full rounded-xl border border-[hsl(var(--theme-brown-900)/0.16)] bg-white px-4 py-2.5 text-base outline-none transition focus:border-[hsl(var(--theme-green-700))] focus:ring-2 focus:ring-[hsl(var(--theme-sage-100))]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[hsl(var(--theme-brown-700))]">
                  What's your email?
                  <span className="ml-1 align-super text-sm text-red-600" aria-hidden="true">*</span>
                </span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="mt-1.5 w-full rounded-xl border border-[hsl(var(--theme-brown-900)/0.16)] bg-white px-4 py-2.5 text-base outline-none transition focus:border-[hsl(var(--theme-green-700))] focus:ring-2 focus:ring-[hsl(var(--theme-sage-100))]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[hsl(var(--theme-brown-700))]">
                  Subject <span className="font-bold tracking-normal text-[hsl(var(--theme-brown-600))]">(optional)</span>
                </span>
                <input
                  type="text"
                  name="subject"
                  className="mt-1.5 w-full rounded-xl border border-[hsl(var(--theme-brown-900)/0.16)] bg-white px-4 py-2.5 text-base outline-none transition focus:border-[hsl(var(--theme-green-700))] focus:ring-2 focus:ring-[hsl(var(--theme-sage-100))]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-[hsl(var(--theme-brown-700))]">
                  Your message
                  <span className="ml-1 align-super text-sm text-red-600" aria-hidden="true">*</span>
                </span>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="mt-1.5 w-full resize-y rounded-xl border border-[hsl(var(--theme-brown-900)/0.16)] bg-white px-4 py-2.5 text-base outline-none transition focus:border-[hsl(var(--theme-green-700))] focus:ring-2 focus:ring-[hsl(var(--theme-sage-100))]"
                />
              </label>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={contactStatus === "sending"}
                  className="inline-flex rounded-full bg-[hsl(var(--theme-green-900))] px-8 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65 disabled:hover:translate-y-0"
                >
                  {contactStatus === "sending" ? "Sending…" : "Send Message"}
                </button>

                {contactStatus === "sent" && (
                  <p className="mt-4 font-bold text-[hsl(var(--theme-green-900))]" role="status">
                    Your message has been sent. A confirmation is on its way to your email.
                  </p>
                )}
                {contactStatus === "error" && (
                  <p className="mt-4 font-bold text-red-700" role="alert">
                    {contactError}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      <div
        id="faq"
        className="mx-auto max-w-3xl scroll-mt-28 px-6 py-10"
        style={{ color: "hsl(var(--theme-brown-900))" }}
      >
        <p className="text-center text-sm font-bold uppercase tracking-[0.22em] text-[hsl(var(--theme-brown-600))]">
          Helpful details
        </p>
        <h2 className="mb-8 mt-2 text-center font-aoki text-4xl tracking-wide sm:text-5xl">
          Frequently Asked Questions
        </h2>

        <div className="space-y-7">
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
