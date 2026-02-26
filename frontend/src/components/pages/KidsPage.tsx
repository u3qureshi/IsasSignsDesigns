import { useEffect, useState } from "react";
import { getCloudinaryUrl } from "../../lib/cloudinary";

interface OnSale {
  enabled: boolean;
  percent: number;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  images: string[];
  isFeatured: boolean;
  isCustomizable: boolean;
  tags: string[];
  onSale: OnSale | null;
}

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
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <span className="text-base font-semibold text-red-600">
          {formatPrice(discounted, currency)}
        </span>
        <span className="text-sm text-gray-600 line-through">
          {formatPrice(priceCents, currency)}
        </span>
        <span className="rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-green-800">
          Save {onSale.percent}%
        </span>
      </div>
    );
  }

  return (
    <p className="mt-1 text-base text-gray-600">
      {formatPrice(priceCents, currency)}
    </p>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const images = product.images ?? [];
  const currentPublicId = images[activeIndex] ?? null;
  const src = currentPublicId
    ? getCloudinaryUrl(currentPublicId, { width: 600, height: 600 })
    : "https://placehold.co/600x600?text=ISA+Designs";

  return (
    <div className="group flex flex-col cursor-pointer">
      {/* Image */}
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          key={src}
          src={src}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = "https://placehold.co/600x600?text=ISA+Designs";
          }}
        />
      </div>

      {/* Image dots — only show when there are multiple images */}
      {images.length > 1 && (
        <div className="mt-2 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`h-3 w-3 rounded-full transition-colors ${
                i === activeIndex
                  ? "bg-[hsl(var(--theme-brown-900))]"
                  : "bg-gray-300 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      )}

      {/* Name */}
      <p className="font-aoki mt-3 text-lg leading-snug text-gray-800">
        {product.name}
      </p>

      {/* Price */}
      <PriceDisplay product={product} />
    </div>
  );
}

export default function KidsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products?category=Kids")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500">
        Failed to load products: {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        No kids products found.
      </div>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "hsl(var(--theme-kids-bg))" }}>
      <div className="px-6 py-10 max-w-screen-xl mx-auto">
        <h1 className="font-aoki text-4xl text-center mb-10 tracking-wide">
          Kids
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
