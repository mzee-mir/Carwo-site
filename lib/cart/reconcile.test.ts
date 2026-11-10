import { describe, expect, it } from "vitest";
import { products } from "../sanity/fixtures";
import type { CartLine } from "./types";
import { reconcileCart } from "./reconcile";

const tee = products.find((p) => p.slug === "classic-fit")!;
const line = (extra: Partial<CartLine> = {}): CartLine => ({
  key: `${tee._id}|M|Brown`, productId: tee._id, slug: tee.slug, name: tee.name, size: "M", colour: "Brown", quantity: 1, unitPrice: tee.price, ...extra,
});

describe("reconcileCart", () => {
  it("leaves an up-to-date cart alone", () => {
    const r = reconcileCart([line()], products);
    expect(r.lines).toEqual([line()]);
    expect(r.notices).toEqual([]);
  });

  it("removes products that no longer exist", () => {
    const r = reconcileCart([line({ productId: "gone", name: "Ghost Tee" })], products);
    expect(r.lines).toEqual([]);
    expect(r.notices).toEqual(["Ghost Tee is no longer available and was removed."]);
  });

  it("updates changed prices", () => {
    const r = reconcileCart([line({ unitPrice: 2000 })], [{ ...tee, price: 3000 }], "KSh");
    expect(r.lines[0].unitPrice).toBe(3000);
    expect(r.notices).toEqual(["Classic Fit price updated to KSh 3,000."]);
  });

  it("flags sizes that sold out", () => {
    const r = reconcileCart([line({ size: "XL", key: `${tee._id}|XL|Brown` })], products);
    expect(r.lines[0].unavailable).toBe(true);
    expect(r.notices).toEqual(["Classic Fit (XL) is sold out."]);
  });

  it("clears the flag when the size is back in stock", () => {
    const r = reconcileCart([line({ unavailable: true })], products);
    expect(r.lines[0].unavailable).toBe(false);
  });
});
