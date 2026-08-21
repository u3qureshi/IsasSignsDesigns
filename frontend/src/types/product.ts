export interface OnSale {
  enabled: boolean;
  percent: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  slug: string;
  hex: string;
  image: string;
  sizes: string[];
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
  variants: ProductVariant[];
  createdAt: string | null;
  updatedAt: string | null;
}
