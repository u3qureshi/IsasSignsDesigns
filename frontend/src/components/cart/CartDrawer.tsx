import { LoaderCircle, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCloudinaryUrl } from "../../lib/cloudinary";
import { formatPrice } from "../products/ProductCard";
import { useCart } from "./CartContext";

const FREE_SHIPPING_THRESHOLD_CENTS = 10_000;

export default function CartDrawer() {
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const {
    items,
    isOpen,
    totalQuantity,
    subtotalCents,
    currency,
    updateQuantity,
    removeItem,
    clearCart,
    closeCart,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCart, isOpen]);

  if (!isOpen) return null;

  const freeShippingRemaining = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents,
  );
  const shippingProgress = Math.min(
    100,
    (subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100,
  );

  async function startCheckout() {
    if (isStartingCheckout || items.length === 0) return;
    setIsStartingCheckout(true);
    setCheckoutError(null);
    try {
      const response = await fetch("/api/checkout/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variant?.id ?? null,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await response.json().catch(() => null) as
        | { checkoutUrl?: string; message?: string; details?: string[] }
        | null;
      if (!response.ok || !data?.checkoutUrl) {
        throw new Error(data?.details?.[0] ?? data?.message ?? "Checkout could not be started.");
      }
      window.location.assign(data.checkoutUrl);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Checkout could not be started.");
      setIsStartingCheckout(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[140]" role="presentation">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 bg-[hsl(var(--theme-brown-900)/0.45)] backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="absolute right-0 top-0 flex h-full w-full max-w-[30rem] flex-col bg-[hsl(var(--theme-kids-bg))] shadow-[-22px_0_60px_hsl(var(--theme-brown-900)/0.2)]"
      >
        <header className="flex items-center justify-between border-b border-[hsl(var(--theme-sand-300)/0.55)] px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[hsl(var(--theme-brown-500))]">
              Your selections
            </p>
            <h2 id="cart-title" className="mt-1 font-aoki text-3xl text-[hsl(var(--theme-brown-900))]">
              Shopping cart
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close shopping cart"
            className="rounded-full p-2 text-[hsl(var(--theme-brown-700))] transition hover:bg-[hsl(var(--theme-sand-300)/0.28)]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--theme-sage-100)/0.5)] text-[hsl(var(--theme-green-900))]">
              <ShoppingBag className="h-9 w-9" strokeWidth={1.8} />
            </div>
            <h3 className="mt-5 font-aoki text-2xl text-[hsl(var(--theme-brown-900))]">
              Your cart is ready when you are
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-500">
              Choose a product, colour, and size to begin your order.
            </p>
            <Link
              to="/clothing"
              onClick={closeCart}
              className="mt-6 rounded-full bg-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-green-700))]"
            >
              Browse clothing
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-2 sm:px-6">
              <div className="flex items-center justify-between border-b border-stone-100 py-3 text-sm">
                <span className="font-semibold text-stone-500">
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="font-semibold text-[hsl(var(--theme-brown-600))] underline decoration-1 underline-offset-4"
                >
                  Clear cart
                </button>
              </div>

              {items.map((item) => {
                const imageSrc = item.imagePublicId
                  ? getCloudinaryUrl(item.imagePublicId, {
                      width: 220,
                      height: 220,
                      crop: "fit",
                    })
                  : "https://placehold.co/220x220?text=Thread+%26+Butter";

                return (
                  <article
                    key={item.lineId}
                    className="grid grid-cols-[5.75rem_1fr] gap-4 border-b border-stone-100 py-5"
                  >
                    <Link
                      to={`/products/${item.productSlug}`}
                      onClick={closeCart}
                      className="aspect-square overflow-hidden rounded-xl bg-gray-100"
                    >
                      <img
                        src={imageSrc}
                        alt={item.productName}
                        className="h-full w-full object-contain p-2 mix-blend-multiply"
                      />
                    </Link>

                    <div className="min-w-0">
                      <div className="flex gap-3">
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/products/${item.productSlug}`}
                            onClick={closeCart}
                            className="line-clamp-2 font-aoki text-base leading-snug text-[hsl(var(--theme-brown-900))] hover:underline"
                          >
                            {item.productName}
                          </Link>
                          {(item.variant || item.size) && (
                            <p className="mt-1 text-xs text-stone-500">
                              {[item.variant?.name, item.size].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.lineId)}
                          aria-label={`Remove ${item.productName}`}
                          className="self-start rounded-full p-1.5 text-stone-400 transition hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-stone-200 bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                            aria-label={`Decrease ${item.productName} quantity`}
                            className="rounded-l-full p-2 text-stone-500 transition hover:bg-stone-50"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-8 text-center text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                            aria-label={`Increase ${item.productName} quantity`}
                            className="rounded-r-full p-2 text-stone-500 transition hover:bg-stone-50"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-[hsl(var(--theme-brown-900))]">
                          {formatPrice(item.unitPriceCents * item.quantity, item.currency)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <footer className="border-t border-[hsl(var(--theme-sand-300)/0.55)] bg-white px-5 py-5 sm:px-6">
              <div className="rounded-2xl bg-[hsl(var(--theme-sage-100)/0.36)] px-4 py-3">
                <p className="text-xs font-semibold text-[hsl(var(--theme-green-900))]">
                  {freeShippingRemaining > 0
                    ? `Add ${formatPrice(freeShippingRemaining, currency)} more for free shipping.`
                    : "You qualify for free shipping."}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[hsl(var(--theme-green-700))] transition-[width]"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400">Estimated subtotal</p>
                  <p className="text-xs text-stone-400">Shipping and taxes calculated at checkout</p>
                </div>
                <p className="font-aoki text-2xl text-[hsl(var(--theme-brown-900))]">
                  {formatPrice(subtotalCents, currency)}
                </p>
              </div>

              {checkoutError && (
                <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  {checkoutError}
                </p>
              )}
              <button
                type="button"
                onClick={startCheckout}
                disabled={isStartingCheckout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--theme-green-900))] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[hsl(var(--theme-green-700))] disabled:cursor-wait disabled:opacity-65"
              >
                {isStartingCheckout ? (
                  <><LoaderCircle className="h-4 w-4 animate-spin" /> Opening secure checkout…</>
                ) : (
                  <><ShieldCheck className="h-4 w-4" /> Secure checkout</>
                )}
              </button>
              <p className="mt-2 text-center text-[11px] text-stone-400">
                Guest checkout securely powered by Stripe
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 w-full py-2 text-sm font-bold text-[hsl(var(--theme-brown-700))] underline decoration-1 underline-offset-4"
              >
                Continue shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
