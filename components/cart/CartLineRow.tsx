"use client";

import Image from "next/image";
import Link from "next/link";
import { MAX_QTY, useCart } from "@/lib/cart/store";
import type { CartLine } from "@/lib/cart/types";
import { formatPrice } from "@/lib/format";

export function CartLineRow({ line, symbol, onNavigate }: { line: CartLine; symbol: string; onNavigate: () => void }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  return (
    <li className={`flex gap-4 border-b border-ink-3 py-4 ${line.unavailable ? "opacity-60" : ""}`}>
      <Link href={`/product/${line.slug}`} onClick={onNavigate} className="relative h-25 w-20 shrink-0 bg-ink-3">
        {line.image && <Image src={line.image} alt="" fill sizes="80px" className="object-cover" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-display text-xl">{line.name}</p>
          <button type="button" onClick={() => remove(line.key)} aria-label={`Remove ${line.name}`} className="text-muted hover:text-paper">
            ✕
          </button>
        </div>
        <p className="text-sm text-muted">
          {line.colour} · {line.size}
          {line.unavailable && <span className="ml-2 text-danger">Sold out — not included</span>}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5 border border-ink-3 px-2.5 py-1.5">
            <button
              type="button"
              aria-label={`Decrease ${line.name}`}
              disabled={line.quantity <= 1}
              onClick={() => setQuantity(line.key, line.quantity - 1)}
              className="disabled:opacity-30"
            >
              −
            </button>
            <span className="label w-4 text-center" aria-label={`Quantity ${line.quantity}`}>
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase ${line.name}`}
              disabled={line.quantity >= MAX_QTY}
              onClick={() => setQuantity(line.key, line.quantity + 1)}
              className="disabled:opacity-30"
            >
              +
            </button>
          </div>
          <p className="font-semibold">{formatPrice(line.quantity * line.unitPrice, { currencySymbol: symbol })}</p>
        </div>
      </div>
    </li>
  );
}
