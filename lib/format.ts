import type { Product, SiteSettings } from "./types";

export function formatPrice(amount: number, s: Pick<SiteSettings, "currencySymbol">): string {
  return `${s.currencySymbol} ${Math.round(amount).toLocaleString("en-US")}`;
}

export function isSoldOut(p: Product): boolean {
  return !p.sizes.some((s) => s.inStock);
}
