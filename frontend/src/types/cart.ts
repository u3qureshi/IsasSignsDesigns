export interface CartVariantSnapshot {
  id: string;
  name: string;
  slug: string;
  hex: string;
}

export interface CartItem {
  lineId: string;
  productId: string;
  productSlug: string;
  productName: string;
  unitPriceCents: number;
  currency: string;
  imagePublicId: string | null;
  variant: CartVariantSnapshot | null;
  size: string | null;
  quantity: number;
}

export type AddCartItemInput = Omit<CartItem, "lineId" | "quantity">;
