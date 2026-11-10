import { describe, expect, it } from "vitest";
import { products } from "./sanity/fixtures";
import { moreLikeThis } from "./related";

// Sanity returns fresh objects for every query, so simulate that with deep copies.
const copy = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

describe("moreLikeThis", () => {
  it("never repeats a product even when queries return different object copies", () => {
    const current = products.find((p) => p.slug === "oversized-tee")!;
    const sameCategory = copy(products.filter((p) => p.category.slug === "tees" && p._id !== current._id));
    const all = copy(products);
    const result = moreLikeThis(current, sameCategory, all, 4);
    const ids = result.map((p) => p._id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain(current._id);
    expect(result).toHaveLength(4);
    expect(ids.slice(0, sameCategory.length)).toEqual(sameCategory.map((p) => p._id));
  });
});
