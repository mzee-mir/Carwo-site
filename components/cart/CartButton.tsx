"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cartCount, useCart } from "@/lib/cart/store";

export function CartButton() {
  const lines = useCart((s) => s.lines);
  const open = useCart((s) => s.open);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(lines) : 0;
  return (
    <button type="button" onClick={open} aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`} className="flex items-center gap-1.5">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 7h12l1 14H5L6 7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 7a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="2" />
      </svg>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 1.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="min-w-5 rounded-full bg-accent px-1.5 text-center text-xs font-bold text-ink"
          aria-hidden
        >
          {count}
        </motion.span>
      )}
    </button>
  );
}
