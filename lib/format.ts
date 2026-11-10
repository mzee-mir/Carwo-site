import type { Product, SiteSettings } from "./types";

/** "$25", "$24.50", "KSh 2,500": letter symbols get a space, cents only when the price has them. */
export function formatPrice(amount: number, s: Pick<SiteSettings, "currencySymbol">): string {
  const cents = Math.round(amount * 100) % 100 !== 0;
  const n = amount.toLocaleString("en-US", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
  const gap = /[a-z]$/i.test(s.currencySymbol) ? " " : "";
  return `${s.currencySymbol}${gap}${n}`;
}

export function isSoldOut(p: Product): boolean {
  return !p.sizes.some((s) => s.inStock);
}
