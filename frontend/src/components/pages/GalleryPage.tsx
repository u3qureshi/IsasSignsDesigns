import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../products/ProductCard";
import type { Product } from "../../types/product";

const FILTERS = [
  { label: "All", tag: "all" },
  { label: "Hoodies & Sweatshirts", tag: "hoodies-sweatshirts" },
  { label: "T-Shirts", tag: "t-shirts" },
  { label: "Hats", tag: "hats" },
  { label: "Wall Art", tag: "wall-art" },
  { label: "Personalized", tag: "personalized" },
  { label: "Anime-Inspired", tag: "anime-inspired" },
  { label: "Seasonal & Holidays", tag: "seasonal" },
  { label: "Baby & Kids", tag: "baby" },
] as const;

const FIRST_ROW_SLUGS = [
  "itachi-inspired-embroidered-hoodie",
  "if-i-shenan-once-pigeon-t-shirt",
  "beyond-the-wall-embroidered-hoodie",
  "unproducktive-duck-embroidered-hat",
] as const;

type GalleryPageProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export default function GalleryPage({
  eyebrow = "Ready-to-order collection",
  title = "Gallery",
  description = "Explore embroidered apparel, printed favourites, personalized gifts, and statement hats—thoughtfully made to order in Canada.",
}: GalleryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/products?category=gallery", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "Unknown error");
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const visibleFilters = useMemo(
    () =>
      FILTERS.filter(
        (filter) =>
          filter.tag === "all" || products.some((product) => product.tags.includes(filter.tag)),
      ),
    [products],
  );

  const visibleProducts = useMemo(() => {
    const filteredProducts =
      activeFilter === "all"
        ? products
        : products.filter((product) => product.tags.includes(activeFilter));
    const priority = new Map<string, number>(
      FIRST_ROW_SLUGS.map((slug, index) => [slug, index]),
    );

    return filteredProducts
      .map((product, originalIndex) => ({ product, originalIndex }))
      .sort((left, right) => {
        const leftPriority = priority.get(left.product.slug) ?? Number.MAX_SAFE_INTEGER;
        const rightPriority = priority.get(right.product.slug) ?? Number.MAX_SAFE_INTEGER;
        return leftPriority - rightPriority || left.originalIndex - right.originalIndex;
      })
      .map(({ product }) => product);
  }, [activeFilter, products]);

  return (
    <main className="min-h-screen bg-[hsl(var(--theme-kids-bg))] text-[hsl(var(--theme-brown-900))]">
      <section className="bg-[hsl(var(--theme-sage-100)/0.42)] px-4 py-3.5 text-center sm:py-4">
        <div className="mx-auto max-w-3xl">
          <p className="mb-1.5 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">
            {eyebrow}
          </p>
          <h1 className="font-aoki text-3xl tracking-wide sm:text-[2rem]">{title}</h1>
          <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-5 text-[hsl(var(--theme-brown-700))] sm:text-[0.95rem] sm:leading-6">
            {description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-screen-xl px-6 py-5 sm:py-6">
        {!loading && !error && products.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center justify-center gap-2.5" aria-label={`Filter ${title.toLowerCase()} products`}>
            {visibleFilters.map((filter) => {
              const isActive = activeFilter === filter.tag;
              return (
                <button
                  key={filter.tag}
                  type="button"
                  onClick={() => setActiveFilter(filter.tag)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${
                    isActive
                      ? "border-[hsl(var(--theme-green-900))] bg-[hsl(var(--theme-green-900))] text-white"
                      : "border-[hsl(var(--theme-sage-200))] bg-white text-[hsl(var(--theme-green-900))] hover:bg-[hsl(var(--theme-sage-100)/0.35)]"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center text-[hsl(var(--theme-brown-700))]">
            Loading {title.toLowerCase()} products...
          </div>
        ) : error ? (
          <div className="flex min-h-[40vh] items-center justify-center text-red-600">
            Failed to load {title.toLowerCase()} products: {error}
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center text-[hsl(var(--theme-brown-700))]">
            No {title.toLowerCase()} products found yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.slug}`} className="block">
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
