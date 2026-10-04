"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "../types";

type CartContextValue = {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: CartItem) => void;
  updateQuantity: (productVariantId: number, quantity: number) => void;
  removeItem: (productVariantId: number) => void;
  clear: () => void;
  totalAmount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "apparel-ec:cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.resolve().then(() => {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoading]);

  function addItem(newItem: CartItem) {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.productVariantId === newItem.productVariantId,
      );

      if (existing) {
        return prev.map((item) =>
          item.productVariantId === newItem.productVariantId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item,
        );
      }

      return [...prev, newItem];
    });
  }

  function updateQuantity(productVariantId: number, quantity: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.productVariantId === productVariantId
          ? { ...item, quantity }
          : item,
      ),
    );
  }

  function removeItem(productVariantId: number) {
    setItems((prev) =>
      prev.filter((item) => item.productVariantId !== productVariantId),
    );
  }

  function clear() {
    setItems([]);
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        clear,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartはCartProviderの内側で使用してください");
  }

  return context;
}
