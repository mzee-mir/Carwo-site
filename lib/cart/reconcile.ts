import { formatPrice } from "../format";
import type { Product } from "../types";
import type { CartLine } from "./types";

/** Bring a saved cart in line with current product data: drop removed products, update prices, flag sold-out sizes. */
export function reconcileCart(lines: CartLine[], products: Product[], symbol = "KSh"): { lines: CartLine[]; notices: string[] } {
  const byId = new Map(products.map((p) => [p._id, p]));
  const notices: string[] = [];
  const out: CartLine[] = [];
  for (const line of lines) {
    const p = byId.get(line.productId);
    if (!p) {
      notices.push(`${line.name} is no longer available and was removed.`);
      continue;
    }
    let next = line;
    if (p.price !== line.unitPrice) {
      next = { ...next, unitPrice: p.price };
      notices.push(`${line.name} price updated to ${formatPrice(p.price, { currencySymbol: symbol })}.`);
    }
    const size = p.sizes.find((s) => s.label === line.size);
    const soldOut = !size?.inStock;
    if (soldOut && !line.unavailable) notices.push(`${line.name} (${line.size}) is sold out.`);
    if (soldOut) next = { ...next, unavailable: true };
    else if (line.unavailable) next = { ...next, unavailable: false };
    out.push(next);
  }
  return { lines: out, notices };
}
