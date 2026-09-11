export function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function salePriceCents(priceCents: number, percent: number): number {
  return Math.round(priceCents * (1 - percent / 100));
}
