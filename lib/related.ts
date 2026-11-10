import type { Product } from "./types";

/** Same-category products first, topped up from everything else; never the current product, never a repeat (compared by id). */
export function moreLikeThis(current: Product, sameCategory: Product[], all: Product[], count = 4): Product[] {
  const seen = new Set<string>([current._id]);
  const out: Product[] = [];
  for (const p of [...sameCategory, ...all]) {
    if (out.length >= count) break;
    if (seen.has(p._id)) continue;
    seen.add(p._id);
    out.push(p);
  }
  return out;
}
