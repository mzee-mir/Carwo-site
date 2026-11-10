import type { CartLine } from "./cart/types";
import { formatPrice } from "./format";
import type { Product, SiteSettings } from "./types";

export type OrderCustomer = { name?: string; method?: "Delivery" | "Pickup" };

export function normalizeWhatsAppNumber(raw?: string): string | null {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

export function buildOrderMessage(lines: CartLine[], customer: OrderCustomer, settings: SiteSettings): string {
  const available = lines.filter((l) => !l.unavailable);
  const total = available.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
  const out = [
    "Hi Carwo! I'd like to order:",
    ...available.map((l) => `${l.quantity}× ${l.name} — ${l.colour} — ${l.size} — ${formatPrice(l.quantity * l.unitPrice, settings)}`),
    `Total: ${formatPrice(total, settings)}`,
  ];
  const name = customer.name?.trim();
  if (name) out.push(`Name: ${name}`);
  if (customer.method) out.push(`Delivery/Pickup: ${customer.method}`);
  return out.join("\n");
}

export function buildProductEnquiry(product: Pick<Product, "name">, pageUrl: string): string {
  return `Hi Carwo! I'm interested in ${product.name}: ${pageUrl}`;
}

export function buildWhatsAppUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
