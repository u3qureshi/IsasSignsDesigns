import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AddCartItemInput, CartItem } from "../../types/cart";
import { CartContext, type CartContextValue } from "./CartContext";

const CART_STORAGE_KEY = "thread-and-butter-cart:v1";
const MAX_ITEM_QUANTITY = 99;

function clampQuantity(quantity: number) {
  return Math.min(MAX_ITEM_QUANTITY, Math.max(1, Math.trunc(quantity)));
}

function lineIdFor(item: AddCartItemInput) {
  return [item.productId, item.variant?.id ?? "default", item.size ?? "default"].join(":");
}

function isStoredCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.lineId === "string" &&
    typeof item.productId === "string" &&
    typeof item.productSlug === "string" &&
    typeof item.productName === "string" &&
    Number.isInteger(item.unitPriceCents) &&
    (item.unitPriceCents ?? -1) >= 0 &&
    typeof item.currency === "string" &&
    Number.isInteger(item.quantity) &&
    (item.quantity ?? 0) > 0
  );
}

function loadStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredCartItem).map((item) => ({
      ...item,
      quantity: clampQuantity(item.quantity),
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadStoredCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: AddCartItemInput, quantity = 1) => {
    const lineId = lineIdFor(item);
    const amount = clampQuantity(quantity);
    setItems((current) => {
      const existing = current.find((entry) => entry.lineId === lineId);
      if (!existing) return [...current, { ...item, lineId, quantity: amount }];
      return current.map((entry) =>
        entry.lineId === lineId
          ? { ...entry, quantity: clampQuantity(entry.quantity + amount) }
          : entry,
      );
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((item) => item.lineId !== lineId));
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.lineId === lineId ? { ...item, quantity: clampQuantity(quantity) } : item,
      ),
    );
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((current) => current.filter((item) => item.lineId !== lineId));
  }, []);
  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  );

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      isOpen,
      totalQuantity,
      subtotalCents,
      currency: items[0]?.currency ?? "CAD",
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
    };
  }, [
    addItem,
    clearCart,
    closeCart,
    isOpen,
    items,
    openCart,
    removeItem,
    subtotalCents,
    totalQuantity,
    updateQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
