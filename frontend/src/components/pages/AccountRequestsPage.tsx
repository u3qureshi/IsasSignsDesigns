import { CalendarDays, ClipboardList, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountPageShell from "../account/AccountPageShell";
import { useAuth } from "../auth/auth-context";
import { getCloudinaryUrl } from "../../lib/cloudinary";
import type { AccountCustomRequest } from "../../types/account";

export default function AccountRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AccountCustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    fetch("/api/account/custom-requests", { credentials: "same-origin", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("We could not load your custom requests.");
        return response.json() as Promise<AccountCustomRequest[]>;
      })
      .then(setRequests)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "We could not load your custom requests.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [user]);

  return (
    <AccountPageShell title="My Custom Requests" description="Keep embroidery and printing ideas, reference artwork, quantities, and request numbers together in one place.">
      {loading && user ? <p className="rounded-2xl bg-white p-8 text-center text-stone-500">Loading requests…</p> : error ? <p role="alert" className="rounded-2xl bg-red-50 p-5 font-semibold text-red-700">{error}</p> : requests.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <ClipboardList className="mx-auto h-12 w-12 text-[hsl(var(--theme-sage-200))]" />
          <h2 className="mt-4 font-aoki text-3xl">No custom requests yet</h2>
          <p className="mt-2 text-stone-500">Submit with {user?.email} and the request will appear here.</p>
          <Link to="/embroidery/custom-designs" className="mt-5 inline-flex rounded-full bg-[hsl(var(--theme-green-900))] px-6 py-3 text-sm font-bold text-white">Start a custom design</Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {requests.map((request) => {
            const image = request.images[0]?.publicId;
            const item = request.itemType === "Other" ? request.customItemDescription : request.itemType;
            const placement = request.placement === "Other" ? request.customPlacementDescription : request.placement;
            return (
              <article key={request.requestNumber} className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm">
                {image && <div className="aspect-[16/9] bg-[hsl(var(--theme-sage-100)/0.35)]"><img src={getCloudinaryUrl(image, { width: 900, height: 506, crop: "fit" })} alt={`Artwork for ${request.requestNumber}`} loading="lazy" className="h-full w-full object-contain" /></div>}
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[hsl(var(--theme-brown-600))]">{request.serviceType}</p>
                      <h2 className="mt-1 font-aoki text-2xl">{request.requestNumber}</h2>
                    </div>
                    <span className="rounded-full bg-[hsl(var(--theme-sage-100)/0.55)] px-3 py-1 text-[0.65rem] font-black uppercase tracking-wide text-[hsl(var(--theme-green-900))]">{request.status.toLowerCase().replaceAll("_", " ")}</span>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-400"><CalendarDays className="h-3.5 w-3.5" /> {new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" }).format(new Date(request.createdAt))}</p>
                  <p className="mt-4 line-clamp-3 text-sm font-medium leading-6 text-stone-600">{request.ideaDescription}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div><dt className="text-xs font-bold uppercase tracking-wide text-stone-400">Item</dt><dd className="mt-1 font-semibold">{item || "Custom item"}</dd></div>
                    <div><dt className="text-xs font-bold uppercase tracking-wide text-stone-400">Quantity</dt><dd className="mt-1 font-semibold">{request.quantity}</dd></div>
                    <div><dt className="text-xs font-bold uppercase tracking-wide text-stone-400">Placement</dt><dd className="mt-1 font-semibold">{placement || "To confirm"}</dd></div>
                    <div><dt className="text-xs font-bold uppercase tracking-wide text-stone-400">Colour</dt><dd className="mt-1 font-semibold">{request.garmentColor || "To confirm"}</dd></div>
                  </dl>
                  {request.aiUsed && <p className="mt-4 flex items-center gap-2 text-xs font-bold text-[#711f3d]"><Sparkles className="h-4 w-4" /> AI concept preview included</p>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AccountPageShell>
  );
}
