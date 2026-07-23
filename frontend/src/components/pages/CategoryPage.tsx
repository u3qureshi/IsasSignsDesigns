import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../products/ProductCard";
import type { Product } from "../../types/product";

type CategoryPageProps = {
  title: string;
} & (
  | { category: string; featured?: never }
  | { category?: never; featured: true }
);

export default function CategoryPage({ title, category, featured }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    const query = featured ? "featured=true" : `category=${encodeURIComponent(category)}`;

    fetch(`/api/products?${query}`, {
      signal: controller.signal,
    })
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
  }, [category, featured]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        Loading {title} products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-red-500">
        Failed to load {title} products: {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "hsl(var(--theme-kids-bg))" }}>
      <div className="mx-auto max-w-screen-xl px-6 py-10">
        <h1 className="mb-10 text-center font-aoki text-4xl tracking-wide">{title}</h1>

        {products.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center text-gray-400">
            No {title.toLowerCase()} products found yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.id} to={`/products/${product.slug}`} className="block">
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
