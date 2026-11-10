import { describe, expect, it } from "vitest";
import { formatPrice, isSoldOut } from "./format";
import type { Product } from "./types";

const product = (sizes: Product["sizes"]): Product => ({
  _id: "p", name: "P", slug: "p", price: 1, category: { title: "Tees", slug: "tees" },
  images: [], sizes, colours: [], featured: false, newDrop: false,
});

describe("formatPrice", () => {
  it("formats with symbol, space and thousands separator", () => {
    expect(formatPrice(2500, { currencySymbol: "KSh" })).toBe("KSh 2,500");
    expect(formatPrice(11500, { currencySymbol: "KSh" })).toBe("KSh 11,500");
  });
});

describe("isSoldOut", () => {
  it("is true when no size is in stock", () => {
    expect(isSoldOut(product([{ label: "M", inStock: false }]))).toBe(true);
  });
  it("is false when any size is in stock", () => {
    expect(isSoldOut(product([{ label: "M", inStock: false }, { label: "L", inStock: true }]))).toBe(false);
  });
  it("is true when there are no sizes", () => {
    expect(isSoldOut(product([]))).toBe(true);
  });
});
