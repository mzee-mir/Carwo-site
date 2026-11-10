"use client";

import Link from "next/link";
import { useState } from "react";
import { cartTotal, useCart } from "@/lib/cart/store";
import type { CartLine } from "@/lib/cart/types";
import { formatPrice } from "@/lib/format";
import type { Branch, SiteSettings } from "@/lib/types";
import { buildOrderMessage, buildWhatsAppUrl, orderNumberFor, type OrderCustomer } from "@/lib/whatsapp";

export function OrderForm({ lines, settings, branches = [] }: { lines: CartLine[]; settings: SiteSettings; branches?: Branch[] }) {
  const clear = useCart((s) => s.clear);
  const [name, setName] = useState("");
  const [method, setMethod] = useState<OrderCustomer["method"]>();
  const [branchId, setBranchId] = useState(branches[0]?._id);
  const branch = branches.find((b) => b._id === branchId);
  const number = orderNumberFor(branch, settings);
  const total = cartTotal(lines);
  const orderable = lines.some((l) => !l.unavailable);
  const href = number ? buildWhatsAppUrl(number, buildOrderMessage(lines, { name, method, branch: branch?.name }, settings)) : null;

  return (
    <div className="flex flex-col gap-4 border-t border-ink-3 px-6 pt-5 pb-6">
      {branches.length > 1 ? (
        <label className="flex flex-col gap-2">
          <span className="label text-[0.6875rem] text-muted">Your nearest branch</span>
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="border-[1.5px] border-ink-3 bg-ink-2 px-4 py-3 outline-none focus:border-paper"
          >
            {branches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
                {b.city && !b.name.includes(b.city) ? ` — ${b.city}` : ""}
              </option>
            ))}
          </select>
        </label>
      ) : branch ? (
        <p className="flex items-center justify-between text-sm">
          <span className="label text-[0.6875rem] text-muted">Branch</span>
          <span>{branch.name}</span>
        </p>
      ) : null}
      <label className="flex flex-col gap-2">
        <span className="label text-[0.6875rem] text-muted">Your name (optional)</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="border-[1.5px] border-ink-3 bg-transparent px-4 py-3 outline-none focus:border-paper"
        />
      </label>
      <fieldset className="grid grid-cols-2 border-[1.5px] border-ink-3">
        <legend className="sr-only">Delivery or pickup</legend>
        {(["Pickup", "Delivery"] as const).map((m) => (
          <label key={m} className={`label cursor-pointer py-3 text-center text-[0.75rem] ${method === m ? "bg-paper text-ink" : ""}`}>
            <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} className="sr-only" />
            {m}
          </label>
        ))}
      </fieldset>
      <div className="flex items-end justify-between">
        <span className="label text-muted">Total</span>
        <span data-testid="cart-total" className="font-display text-4xl">
          {formatPrice(total, settings)}
        </span>
      </div>
      {href ? (
        <a
          href={orderable ? href : undefined}
          aria-disabled={!orderable}
          target="_blank"
          rel="noopener"
          className="label flex items-center justify-center gap-3 bg-wa px-6 py-5 text-ink transition hover:brightness-110 aria-disabled:opacity-40"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          Order on WhatsApp
        </a>
      ) : (
        <Link href="/about" className="label flex justify-center bg-paper px-6 py-5 text-ink">
          Contact us
        </Link>
      )}
      <div className="flex items-center justify-between gap-4 text-sm text-muted">
        <span>{href ? "Opens WhatsApp with your order ready to send." : "Online ordering is coming soon."}</span>
        <button
          type="button"
          className="label shrink-0 text-[0.6875rem] text-paper"
          onClick={() => {
            if (window.confirm("Empty your cart?")) clear();
          }}
        >
          Clear cart
        </button>
      </div>
    </div>
  );
}
