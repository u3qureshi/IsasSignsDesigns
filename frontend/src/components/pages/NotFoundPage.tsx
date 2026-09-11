import { Home, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[hsl(var(--theme-kids-bg))] px-5 py-14 text-center text-[hsl(var(--theme-brown-900))]">
      <section className="max-w-2xl">
        <p className="font-aoki text-8xl text-[hsl(var(--theme-sage-200))] sm:text-9xl">404</p>
        <p className="mt-2 text-xs font-black uppercase tracking-[0.22em] text-[hsl(var(--theme-brown-600))]">This stitch went off pattern</p>
        <h1 className="mt-3 font-aoki text-4xl sm:text-5xl">We couldn’t find that page.</h1>
        <p className="mx-auto mt-4 max-w-xl font-medium leading-7 text-[hsl(var(--theme-brown-700))]">The link may have changed, or the page may no longer exist. Start again from the storefront or search the collection.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-white"><Home className="h-4 w-4" /> Return home</Link>
          <Link to="/search" className="inline-flex items-center gap-2 rounded-full border-2 border-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-[hsl(var(--theme-green-900))]"><Search className="h-4 w-4" /> Search products</Link>
        </div>
      </section>
    </main>
  );
}
