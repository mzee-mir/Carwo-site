"use client";

import { create } from "zustand";
import { persist, type PersistStorage, type StorageValue } from "zustand/middleware";
import type { CartLine } from "./types";

export const MAX_QTY = 10;
const clamp = (q: number) => Math.min(MAX_QTY, Math.max(1, Math.round(q)));

export function lineKey(productId: string, size: string, colour: string): string {
  return `${productId}|${size}|${colour}`;
}

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.quantity, 0);
export const cartTotal = (lines: CartLine[]) => lines.filter((l) => !l.unavailable).reduce((n, l) => n + l.quantity * l.unitPrice, 0);

type Persisted = { lines: CartLine[] };

// Never let a broken or blocked localStorage break the cart: bad data → empty cart, failed writes → ignored.
const safeStorage: PersistStorage<Persisted> = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(name);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StorageValue<Persisted>;
      return Array.isArray(parsed?.state?.lines) ? parsed : null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch {
      /* storage full or blocked: keep the in-memory cart */
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (item: Omit<CartLine, "key" | "quantity" | "unavailable">, qty?: number) => void;
  setQuantity: (key: string, qty: number) => void;
  remove: (key: string) => void;
  setLines: (lines: CartLine[]) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      add: (item, qty = 1) =>
        set((s) => {
          const key = lineKey(item.productId, item.size, item.colour);
          const existing = s.lines.find((l) => l.key === key);
          const lines = existing
            ? s.lines.map((l) => (l.key === key ? { ...l, quantity: clamp(l.quantity + qty) } : l))
            : [...s.lines, { ...item, key, quantity: clamp(qty) }];
          return { lines, isOpen: true };
        }),
      setQuantity: (key, qty) => set((s) => ({ lines: s.lines.map((l) => (l.key === key ? { ...l, quantity: clamp(qty) } : l)) })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      setLines: (lines) => set({ lines }),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: "carwo-cart", storage: safeStorage, partialize: (s) => ({ lines: s.lines }) },
  ),
);
