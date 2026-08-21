export interface CheckoutOrderItem {
  productSlug: string;
  productName: string;
  variantName: string | null;
  size: string | null;
  imagePublicId: string | null;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface CheckoutOrder {
  orderNumber: string;
  status: "PENDING_PAYMENT" | "PAYMENT_PROCESSING" | "PAID" | "CHECKOUT_FAILED" | "PAYMENT_FAILED" | "EXPIRED";
  currency: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  customerEmail: string | null;
  createdAt: string;
  paidAt: string | null;
  items: CheckoutOrderItem[];
}
