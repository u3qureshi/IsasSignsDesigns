import type { CheckoutOrder } from "./checkout";

export type AccountOrder = CheckoutOrder;

export interface AccountCustomRequestImage {
  imageType: string;
  publicId: string;
  format: string;
}

export interface AccountCustomRequest {
  requestNumber: string;
  serviceType: "embroidery" | "printing";
  status: string;
  createdAt: string;
  itemType: string;
  customItemDescription: string | null;
  garmentColor: string | null;
  placement: string;
  customPlacementDescription: string | null;
  sizeMode: string;
  requestedWidthInches: number | null;
  requestedHeightInches: number | null;
  quantity: number;
  ideaDescription: string;
  exactText: string | null;
  aiUsed: boolean;
  images: AccountCustomRequestImage[];
}
