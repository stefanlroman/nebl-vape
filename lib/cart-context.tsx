"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { Flavor, nicotineLabel } from "./flavors";

export type Format = "disposable" | "liquid";

export interface CartItem {
  slug: string;
  name: string;
  category: string;
  format: Format;
  /** Only set for format "liquid" — mg strength, 0 = nikotinfrei. */
  nicotine?: number;
  price: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (flavor: Flavor, format: Format, nicotine: number | undefined, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "nebl-vape-cart";

export function cartItemKey(slug: string, format: Format, nicotine?: number) {
  return `${slug}__${format}__${nicotine ?? "na"}`;
}

export function formatVariantLabel(item: Pick<CartItem, "format" | "nicotine">) {
  return item.format === "disposable"
    ? "Einweg-Vape"
    : `E-Liquid 10ml · ${nicotineLabel(item.nicotine ?? 0)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write failures (e.g. private browsing)
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (flavor: Flavor, format: Format, nicotine: number | undefined, quantity = 1) => {
      const key = cartItemKey(flavor.slug, format, nicotine);
      const price = format === "disposable" ? flavor.disposablePrice : flavor.liquidPrice;

      setItems((prev) => {
        const existing = prev.find(
          (item) => cartItemKey(item.slug, item.format, item.nicotine) === key
        );
        if (existing) {
          return prev.map((item) =>
            cartItemKey(item.slug, item.format, item.nicotine) === key
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prev,
          {
            slug: flavor.slug,
            name: flavor.name,
            category: flavor.category,
            format,
            nicotine: format === "liquid" ? nicotine : undefined,
            price,
            quantity,
          },
        ];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((key: string) => {
    setItems((prev) =>
      prev.filter((item) => cartItemKey(item.slug, item.format, item.nicotine) !== key)
    );
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => cartItemKey(item.slug, item.format, item.nicotine) !== key)
        : prev.map((item) =>
            cartItemKey(item.slug, item.format, item.nicotine) === key
              ? { ...item, quantity }
              : item
          )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
