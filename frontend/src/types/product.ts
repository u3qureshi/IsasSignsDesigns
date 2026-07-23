export interface OnSale {
  enabled: boolean;
  percent: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  longDescription: string | null;
  category: string | null;
  priceCents: number;
  currency: string;
  images: string[];
  material: string | null;
  isActive: boolean;
  isFeatured: boolean;
  stockQty: number | null;
  isCustomizable: boolean;
  tags: string[];
  onSale: OnSale | null;
  createdAt: string | null;
  updatedAt: string | null;
}
