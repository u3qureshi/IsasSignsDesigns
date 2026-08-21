import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../products/ProductCard";
import type { Product } from "../../types/product";

export default function ClothingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/products?category=clothing", { signal: controller.signal })
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

  return (
    <main className="min-h-screen bg-[hsl(var(--theme-kids-bg))] text-[hsl(var(--theme-brown-900))]">
      <section className="bg-[hsl(var(--theme-sage-100)/0.42)] px-4 py-5 text-center sm:py-6">
        <div className="mx-auto max-w-3xl">
          <p className="mb-1 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">
            Quality blanks, one piece at a time
          </p>
          <h1 className="font-aoki text-3xl tracking-wide sm:text-[2rem]">Clothing</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-5 text-[hsl(var(--theme-brown-700))] sm:text-[0.95rem]">
            Shop dependable blank apparel in individual quantities, with colours and sizes selected
            before ordering.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-screen-xl px-6 py-8 sm:py-10">
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center text-[hsl(var(--theme-brown-700))]">
            Loading clothing...
          </div>
        ) : error ? (
          <div className="flex min-h-[40vh] items-center justify-center text-red-600">
            Failed to load clothing: {error}
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center text-[hsl(var(--theme-brown-700))]">
            No clothing products found yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
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
