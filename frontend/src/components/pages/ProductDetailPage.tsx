import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { getCloudinaryUrl } from "../../lib/cloudinary";

/* ── Types ─────────────────────────────────────────────────────────────── */

interface OnSale {
  enabled: boolean;
  percent: number;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string | null;
  priceCents: number;
  currency: string;
  images: string[];
  material: string | null;
  isFeatured: boolean;
  isCustomizable: boolean;
  stockQty: number | null;
  tags: string[];
  onSale: OnSale | null;
}

/* ── Price helpers ──────────────────────────────────────────────────────── */

function formatPrice(cents: number, currency: string): string {
  return `$${(cents / 100).toFixed(2)} ${currency}`;
}

function salePriceCents(priceCents: number, percent: number): number {
  return Math.round(priceCents * (1 - percent / 100));
}

function PriceDisplay({ product }: { product: Product }) {
  const { priceCents, currency, onSale } = product;

  if (onSale?.enabled) {
    const discounted = salePriceCents(priceCents, onSale.percent);
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-2xl font-bold text-red-600">
          {formatPrice(discounted, currency)}
        </span>
        <span className="text-lg text-gray-400 line-through">
          {formatPrice(priceCents, currency)}
        </span>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          Save {onSale.percent}%
        </span>
      </div>
    );
  }

  return (
    <span className="text-2xl font-bold text-gray-800">
      {formatPrice(priceCents, currency)}
    </span>
  );
}

/* ── Accordion ──────────────────────────────────────────────────────────── */

interface AccordionItemProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function AccordionItem({ title, defaultOpen = false, children }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left text-base font-semibold text-gray-800 hover:text-gray-600 transition-colors"
      >
        {title}
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Ask a Question form ────────────────────────────────────────────────── */

function AskAQuestion({ productName }: { productName: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to backend / email service
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
        Thank you! Your question has been sent. We'll get back to you shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" value={productName} readOnly />
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Your Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Fatima"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Your Question
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Ask something about "${productName}"…`}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-[0.98]"
      >
        Send Question
      </button>
    </form>
  );
}

/* ── Main page ──────────────────────────────────────────────────────────── */

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setActiveIndex(0);
    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Product) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  // Scroll active thumbnail into view
  useEffect(() => {
    thumbnailRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  /* ── Loading / error states ── */
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-gray-500">
        <p>{error ?? "Product not found."}</p>
        <Link to="/" className="text-sm underline hover:text-gray-700">
          Back to home
        </Link>
      </div>
    );
  }

  const images = product.images ?? [];
  const mainPublicId = images[activeIndex] ?? null;
  const mainSrc = mainPublicId
    ? getCloudinaryUrl(mainPublicId, { width: 900, height: 900, crop: "fill" })
    : "https://placehold.co/900x900?text=ISA+Designs";

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-8 md:px-8 md:py-12">

        {/* ── Back link ── */}
        <Link
          to={-1 as unknown as string}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">

          {/* ── LEFT: Image gallery ── */}
          <div className="flex flex-col gap-4">

            {/* Main image */}
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
              <img
                key={mainSrc}
                src={mainSrc}
                alt={product.name}
                className="h-full w-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://placehold.co/900x900?text=ISA+Designs";
                }}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((publicId, i) => {
                  const thumbSrc = getCloudinaryUrl(publicId, {
                    width: 120,
                    height: 120,
                    crop: "fill",
                  });
                  return (
                    <button
                      key={publicId + i}
                      ref={(el) => { thumbnailRefs.current[i] = el; }}
                      onClick={() => setActiveIndex(i)}
                      className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        i === activeIndex
                          ? "border-gray-800 opacity-100"
                          : "border-transparent opacity-60 hover:opacity-90"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img
                        src={thumbSrc}
                        alt={`${product.name} ${i + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://placehold.co/120x120?text=ISA";
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info + accordion ── */}
          <div className="flex flex-col">

            {/* Name */}
            <h1 className="font-aoki text-3xl leading-snug text-gray-900 md:text-4xl">
              {product.name}
            </h1>

            {/* Short description */}
            {product.description && (
              <p className="mt-2 text-sm text-gray-500">{product.description}</p>
            )}

            {/* Price */}
            <div className="mt-4">
              <PriceDisplay product={product} />
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Customizable badge */}
            {product.isCustomizable && (
              <p className="mt-3 text-sm font-medium text-amber-700">
                ✦ This product is customizable — contact us to personalise.
              </p>
            )}

            {/* ── Accordion ── */}
            <div className="mt-8 rounded-xl border border-gray-200 px-4">

              <AccordionItem title="Product Details" defaultOpen={true}>
                {product.longDescription ? (
                  <p className="whitespace-pre-line">{product.longDescription}</p>
                ) : (
                  <p>{product.description ?? "No description available."}</p>
                )}
              </AccordionItem>

              <AccordionItem title="Size & Specification">
                {product.material ? (
                  <ul className="space-y-1.5">
                    <li>
                      <span className="font-semibold text-gray-700">Material:</span>{" "}
                      {product.material}
                    </li>
                    {product.isCustomizable && (
                      <li>
                        <span className="font-semibold text-gray-700">Customizable:</span>{" "}
                        Yes — bespoke sizing available upon request.
                      </li>
                    )}
                  </ul>
                ) : (
                  <p>
                    Please contact us for detailed sizing and specification
                    information for this product.
                  </p>
                )}
              </AccordionItem>

              <AccordionItem title="Ask a Question">
                <AskAQuestion productName={product.name} />
              </AccordionItem>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
