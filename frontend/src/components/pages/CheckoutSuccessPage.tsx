import { CheckCircle2, Clock3, LoaderCircle, Mail, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { formatPrice } from "../products/ProductCard";
import type { CheckoutOrder } from "../../types/checkout";

const MAX_POLLS = 8;

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { clearCart } = useCart();

  useEffect(() => {
    if (!sessionId) {
      setError("This confirmation link is missing its checkout session.");
      return;
    }
    setError(null);
    setTimedOut(false);
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function load(attempt: number) {
      try {
        const response = await fetch(`/api/checkout/orders?sessionId=${encodeURIComponent(sessionId!)}`);
        if (!response.ok) throw new Error("We could not load this order confirmation.");
        const data = await response.json() as CheckoutOrder;
        if (cancelled) return;
        setOrder(data);
        if (data.status === "PAID") {
          clearCart();
          return;
        }
        if (attempt < MAX_POLLS) {
          timer = setTimeout(() => load(attempt + 1), 1500);
        } else {
          setTimedOut(true);
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "We could not load this order.");
      }
    }

    load(1);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [clearCart, retryCount, sessionId]);

  const paid = order?.status === "PAID";

  return (
    <main className="bg-[hsl(var(--theme-kids-bg))] px-5 py-14 sm:py-20">
      <section className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-[0_20px_55px_hsl(var(--theme-brown-900)/0.1)] sm:p-10">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${paid ? "bg-emerald-50 text-emerald-700" : "bg-[hsl(var(--theme-sage-100)/0.55)] text-[hsl(var(--theme-green-900))]"}`}>
          {paid
            ? <CheckCircle2 className="h-8 w-8" />
            : timedOut
              ? <Clock3 className="h-8 w-8" />
              : <LoaderCircle className="h-8 w-8 animate-spin" />}
        </div>
        <div className="mt-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--theme-brown-500))]">
            {paid ? "Payment confirmed" : timedOut ? "Confirmation delayed" : "Confirming payment"}
          </p>
          <h1 className="mt-2 font-aoki text-4xl text-[hsl(var(--theme-brown-900))]">
            {paid ? "Thank you for your order" : timedOut ? "Your payment is still processing" : "Your checkout is complete"}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-500">
            {paid
              ? `Your order ${order?.orderNumber} is in. We’ll email your receipt and keep you updated.`
              : timedOut
                ? "Your order is safe. Check again in a moment while we verify its status with Stripe."
                : "Stripe is sending us the final confirmation. This usually takes only a few seconds."}
          </p>
        </div>

        {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">{error}</p>}

        {order && (
          <div className="mt-8 border-t border-stone-100 pt-6">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={`${item.productSlug}-${item.variantName}-${item.size}-${index}`} className="flex justify-between gap-5 text-sm">
                  <div>
                    <p className="font-semibold text-[hsl(var(--theme-brown-900))]">{item.quantity} × {item.productName}</p>
                    {(item.variantName || item.size) && <p className="mt-0.5 text-xs text-stone-400">{[item.variantName, item.size].filter(Boolean).join(" · ")}</p>}
                  </div>
                  <p className="font-semibold text-stone-600">{formatPrice(item.lineTotalCents, order.currency)}</p>
                </div>
              ))}
            </div>
            <dl className="mt-6 space-y-2 border-t border-stone-100 pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-stone-500">Subtotal</dt><dd>{formatPrice(order.subtotalCents, order.currency)}</dd></div>
              <div className="flex justify-between"><dt className="text-stone-500">Shipping</dt><dd>{order.shippingCents === 0 ? "Free" : formatPrice(order.shippingCents, order.currency)}</dd></div>
              <div className="flex justify-between"><dt className="text-stone-500">Tax</dt><dd>{formatPrice(order.taxCents, order.currency)}</dd></div>
              <div className="flex justify-between pt-2 font-aoki text-xl text-[hsl(var(--theme-brown-900))]"><dt>Total</dt><dd>{formatPrice(order.totalCents, order.currency)}</dd></div>
            </dl>
          </div>
        )}

        {paid && order?.customerEmail && (
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-stone-500">
            <Mail className="h-4 w-4" /> Confirmation sent to {order.customerEmail}
          </p>
        )}
        {timedOut && !paid && (
          <div className="mt-7 text-center">
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-[hsl(var(--theme-green-900))] transition hover:bg-[hsl(var(--theme-sage-100)/0.55)]"
            >
              <RefreshCw className="h-4 w-4" /> Check payment again
            </button>
          </div>
        )}
        <div className="mt-7 text-center">
          <Link to="/gallery" className="inline-flex rounded-full bg-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-green-700))]">
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
