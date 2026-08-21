import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../cart/CartContext";

export default function CheckoutCancelPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order");
  const { openCart } = useCart();

  return (
    <main className="bg-[hsl(var(--theme-kids-bg))] px-5 py-16 sm:py-24">
      <section className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-[0_20px_55px_hsl(var(--theme-brown-900)/0.1)] sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--theme-sage-100)/0.5)] text-[hsl(var(--theme-green-900))]">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-500))]">Checkout paused</p>
        <h1 className="mt-2 font-aoki text-4xl text-[hsl(var(--theme-brown-900))]">Nothing was charged</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-stone-500">
          Your cart is still saved, so you can change it or return to secure checkout whenever you’re ready.
          {orderNumber ? ` Reference: ${orderNumber}.` : ""}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={openCart} className="rounded-full bg-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-green-700))]">
            Return to cart
          </button>
          <Link to="/clothing" className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--theme-sand-300))] px-6 py-3 text-sm font-bold text-[hsl(var(--theme-brown-700))]">
            <ArrowLeft className="h-4 w-4" /> Keep shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
