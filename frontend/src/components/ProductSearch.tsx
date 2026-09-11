import { Search } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCloudinaryUrl } from "../lib/cloudinary";
import type { Product } from "../types/product";

type ProductSearchProps = {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
};

export default function ProductSearch({
  className = "",
  inputClassName = "",
  placeholder = "Search products",
  autoFocus = false,
  onNavigate,
}: ProductSearchProps) {
  const navigate = useNavigate();
  const listId = useId();
  const requestRef = useRef<AbortController | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const normalized = query.trim();
    requestRef.current?.abort();
    if (normalized.length < 2) return;

    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/products?q=${encodeURIComponent(normalized)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setResults((await response.json() as Product[]).slice(0, 6));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim();
    if (normalized.length < 2) return;
    setFocused(false);
    onNavigate?.();
    navigate(`/search?q=${encodeURIComponent(normalized)}`);
  }

  const showPanel = focused && query.trim().length >= 2;

  return (
    <div className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={submitSearch}
        className="flex items-center gap-2 border-b border-[hsl(var(--theme-sage-200))] pb-1"
      >
        <Search className="h-5 w-5 shrink-0 text-[hsl(var(--theme-green-700))]" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setResults([]);
            setLoading(nextQuery.trim().length >= 2);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setFocused(false);
              event.currentTarget.blur();
            }
          }}
          className={`min-w-0 flex-1 bg-transparent text-sm text-[hsl(var(--theme-brown-900))] placeholder:text-stone-400 outline-none ${inputClassName}`}
          type="search"
          placeholder={placeholder}
          aria-label="Search products"
          aria-controls={showPanel ? listId : undefined}
          aria-expanded={showPanel}
          autoComplete="off"
          autoFocus={autoFocus}
        />
      </form>

      {showPanel && (
        <div
          id={listId}
          className="absolute left-0 top-[calc(100%+0.65rem)] z-[120] w-[min(24rem,88vw)] overflow-hidden rounded-2xl border border-[hsl(var(--theme-sand-300))] bg-white shadow-[0_20px_55px_hsl(var(--theme-brown-900)/0.18)]"
        >
          {loading ? (
            <p className="px-4 py-5 text-sm font-semibold text-stone-400">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-5 text-sm font-semibold text-stone-500">No matching products found.</p>
          ) : (
            <>
              <div className="max-h-[22rem] overflow-y-auto py-1">
                {results.map((product) => {
                  const publicId = product.variants[0]?.image ?? product.images[0];
                  return (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      onClick={() => {
                        setFocused(false);
                        onNavigate?.();
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-[hsl(var(--theme-sage-100)/0.35)]"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                        {publicId && (
                          <img
                            src={getCloudinaryUrl(publicId, { width: 96, height: 96, crop: "fit" })}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-contain"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[hsl(var(--theme-brown-900))]">{product.name}</p>
                        <p className="mt-0.5 truncate text-xs text-stone-400">{product.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setFocused(false);
                  onNavigate?.();
                  navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                }}
                className="w-full border-t border-stone-100 px-4 py-3 text-center text-sm font-bold text-[hsl(var(--theme-green-900))] hover:bg-stone-50"
              >
                See all results
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
