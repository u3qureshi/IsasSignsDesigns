import { CalendarDays, PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountPageShell from "../account/AccountPageShell";
import { useAuth } from "../auth/auth-context";
import { getCloudinaryUrl } from "../../lib/cloudinary";
import { formatPrice } from "../../lib/pricing";
import type { AccountOrder } from "../../types/account";

function readableStatus(status: string) {
  return status.toLowerCase().replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());
}

export default function AccountOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    fetch("/api/account/orders", { credentials: "same-origin", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("We could not load your orders.");
        return response.json() as Promise<AccountOrder[]>;
      })
      .then(setOrders)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "We could not load your orders.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [user]);

  return (
    <AccountPageShell title="My Orders" description="Review paid purchases and any checkouts started while signed in. Guest purchases using your verified email appear here too.">
      {loading && user ? <p className="rounded-2xl bg-white p-8 text-center text-stone-500">Loading orders…</p> : error ? <p role="alert" className="rounded-2xl bg-red-50 p-5 font-semibold text-red-700">{error}</p> : orders.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <PackageOpen className="mx-auto h-12 w-12 text-[hsl(var(--theme-sage-200))]" />
          <h2 className="mt-4 font-aoki text-3xl">No orders yet</h2>
          <p className="mt-2 text-stone-500">When you place an order with {user?.email}, it will appear here.</p>
          <Link to="/gallery" className="mt-5 inline-flex rounded-full bg-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-white">Shop the gallery</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order.orderNumber} className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-4 sm:px-6">
                <div>
                  <p className="font-aoki text-xl">{order.orderNumber}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-400"><CalendarDays className="h-3.5 w-3.5" /> {new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(new Date(order.createdAt))}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-[hsl(var(--theme-sage-100)/0.55)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[hsl(var(--theme-green-900))]">{readableStatus(order.status)}</span>
                  <p className="mt-2 font-bold">{formatPrice(order.totalCents, order.currency)}</p>
                </div>
              </header>
              <div className="divide-y divide-stone-100 px-5 sm:px-6">
                {order.items.map((item, index) => (
                  <Link key={`${item.productSlug}-${index}`} to={`/products/${item.productSlug}`} className="flex items-center gap-4 py-4 hover:opacity-75">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                      {item.imagePublicId && <img src={getCloudinaryUrl(item.imagePublicId, { width: 128, height: 128, crop: "fit" })} alt="" loading="lazy" className="h-full w-full object-contain" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{item.quantity} × {item.productName}</p>
                      <p className="mt-1 text-xs text-stone-400">{[item.variantName, item.size].filter(Boolean).join(" · ") || "Standard option"}</p>
                    </div>
                    <p className="text-sm font-semibold text-stone-600">{formatPrice(item.lineTotalCents, order.currency)}</p>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </AccountPageShell>
  );
}
