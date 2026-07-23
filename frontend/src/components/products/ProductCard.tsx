import { useState } from "react";
import { getCloudinaryUrl } from "../../lib/cloudinary";
import type { Product } from "../../types/product";

export function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function salePriceCents(priceCents: number, percent: number): number {
  return Math.round(priceCents * (1 - percent / 100));
}

export function ProductPrice({ product }: { product: Product }) {
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

  return <p className="mt-1 text-base text-gray-600">{formatPrice(priceCents, currency)}</p>;
}

export default function ProductCard({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = product.images ?? [];
  const currentPublicId = images[activeIndex] ?? null;
  const src = currentPublicId
    ? getCloudinaryUrl(currentPublicId, { width: 600, height: 600 })
    : "https://placehold.co/600x600?text=ISA+Designs";

  return (
    <div className="group flex cursor-pointer flex-col">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          key={src}
          src={src}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(event) => {
            const image = event.currentTarget;
            image.onerror = null;
            image.src = "https://placehold.co/600x600?text=ISA+Designs";
          }}
        />
      </div>

      {images.length > 1 && (
        <div className="mt-2 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setActiveIndex(index);
              }}
              aria-label={`View image ${index + 1} of ${images.length} for ${product.name}`}
              aria-pressed={index === activeIndex}
              className={`h-3 w-3 rounded-full transition-colors ${
                index === activeIndex
                  ? "bg-[hsl(var(--theme-brown-900))]"
                  : "bg-gray-300 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      )}

      <p className="mt-3 font-aoki text-lg leading-snug text-gray-800">{product.name}</p>
      <ProductPrice product={product} />
    </div>
  );
}
