import { createContext, useContext } from "react";
import type { AddCartItemInput, CartItem } from "../../types/cart";

export interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalQuantity: number;
  subtotalCents: number;
  currency: string;
  addItem: (item: AddCartItemInput, quantity?: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
