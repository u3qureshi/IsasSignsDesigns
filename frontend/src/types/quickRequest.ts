export type QuickRequestService = "printing" | "embroidery";

export interface QuickRequestProduct {
  id: number;
  itemType: string;
  customItem: string;
  quantity: string;
}

export interface QuickRequestDraft {
  service: QuickRequestService | "";
  products: QuickRequestProduct[];
  designFile: File | null;
  notes: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
}

export interface QuickRequestNavigationState {
  quickRequest?: QuickRequestDraft;
}

export const QUICK_REQUEST_EVENT = "open-quick-request";

export function openQuickRequest(service?: QuickRequestService) {
  window.dispatchEvent(
    new CustomEvent<QuickRequestService | undefined>(QUICK_REQUEST_EVENT, { detail: service }),
  );
}
