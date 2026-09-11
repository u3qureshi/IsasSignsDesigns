import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../products/ProductCard";
import type { Product } from "../../types/product";

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  return (
    <main className="min-h-[65vh] bg-[hsl(var(--theme-kids-bg))] px-5 py-10 text-[hsl(var(--theme-brown-900))] sm:py-14">
      <div className="mx-auto max-w-screen-xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-600))]">Store search</p>
        <h1 className="mt-2 font-aoki text-4xl sm:text-5xl">Find your next favourite</h1>
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const nextQuery = String(new FormData(event.currentTarget).get("query") ?? "").trim();
            if (nextQuery.length >= 2) setSearchParams({ q: nextQuery });
          }}
          className="mt-6 flex max-w-2xl items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm"
        >
          <Search className="h-5 w-5 text-[hsl(var(--theme-green-700))]" />
          <input
            type="search"
            name="query"
            key={query}
            defaultValue={query}
            placeholder="Search hoodies, hats, anime designs…"
            aria-label="Search all products"
            className="min-w-0 flex-1 bg-transparent outline-none"
          />
          <button type="submit" className="font-bold text-[hsl(var(--theme-green-900))]">Search</button>
        </form>

        <div className="mt-8">
          {query.length < 2 ? (
            <p className="py-16 text-center text-stone-500">Enter at least two characters to search.</p>
          ) : (
            <SearchResults key={query} query={query} />
          )}
        </div>
      </div>
    </main>
  );
}

function SearchResults({ query }: { query: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/products?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Search is temporarily unavailable.");
        return response.json() as Promise<Product[]>;
      })
      .then(setProducts)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "Search is temporarily unavailable.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [query]);

  if (loading) return <p className="py-16 text-center text-stone-500">Searching…</p>;
  if (error) return <p className="py-16 text-center font-semibold text-red-700" role="alert">{error}</p>;
  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-aoki text-2xl">No matches for “{query}”</p>
        <Link to="/gallery" className="mt-4 inline-flex rounded-full bg-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-white">Browse the gallery</Link>
      </div>
    );
  }
  return (
    <>
      <p className="mb-6 text-sm font-semibold text-stone-500">{products.length} result{products.length === 1 ? "" : "s"} for “{query}”</p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Link key={product.id} to={`/products/${product.slug}`}><ProductCard product={product} /></Link>
        ))}
      </div>
    </>
  );
}
