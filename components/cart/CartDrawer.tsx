"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { reconcileCart } from "@/lib/cart/reconcile";
import { cartCount, useCart } from "@/lib/cart/store";
import type { Product, SiteSettings } from "@/lib/types";
import { CartLineRow } from "./CartLineRow";
import { OrderForm } from "./OrderForm";

export function CartDrawer({ settings }: { settings: SiteSettings }) {
  const { lines, isOpen, close, setLines } = useCart();
  const [notices, setNotices] = useState<string[]>([]);
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  // On open: remember focus, lock page scroll, refresh prices/stock.
  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    let cancelled = false;
    const current = useCart.getState().lines;
    setNotices([]);
    if (current.length > 0) {
      fetch(`/api/products?ids=${encodeURIComponent(current.map((l) => l.productId).join(","))}`)
        .then((r) => (r.ok ? (r.json() as Promise<Product[]>) : Promise.reject(r.status)))
        .then((products) => {
          if (cancelled) return;
          const result = reconcileCart(useCart.getState().lines, products, settings.currencySymbol);
          setLines(result.lines);
          setNotices(result.notices);
        })
        .catch(() => {
          /* offline or server error: keep the saved cart as-is */
        });
    }
    return () => {
      cancelled = true;
      document.documentElement.style.overflow = prevOverflow;
      returnFocus.current?.focus();
    };
  }, [isOpen, setLines, settings.currencySymbol]);

  // Escape closes; Tab stays inside the drawer.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, [tabindex]:not([tabindex='-1'])");
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" data-lenis-prevent>
          <motion.div
            className="absolute inset-0 bg-black/70"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            className="absolute inset-y-0 right-0 flex w-full flex-col bg-ink-2 md:w-[460px]"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-ink-3 px-6 py-5">
              <h2 className="font-display text-3xl">Your cart ({cartCount(lines)})</h2>
              <button type="button" onClick={close} aria-label="Close cart" data-autofocus>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
            {notices.length > 0 && (
              <ul className="bg-ink-3 px-6 py-2.5 text-sm text-accent" role="status">
                {notices.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <p className="font-display text-4xl">Your cart is empty</p>
                <Link href="/shop" onClick={close} className="label bg-accent px-7 py-4 text-ink">
                  Shop now
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6">
                  {lines.map((l) => (
                    <CartLineRow key={l.key} line={l} symbol={settings.currencySymbol} onNavigate={close} />
                  ))}
                </ul>
                <OrderForm lines={lines} settings={settings} />
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
