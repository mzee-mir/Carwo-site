import { beforeEach, describe, expect, it, vi } from "vitest";

const item = (size = "M", colour = "Black") => ({
  productId: "product-1", slug: "oversized-tee", name: "Oversized Tee", size, colour, unitPrice: 2500,
});

async function freshStore() {
  vi.resetModules();
  return import("./store");
}

describe("cart store", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("merges the same product/size/colour into one line", async () => {
    const { useCart } = await freshStore();
    useCart.getState().add(item());
    useCart.getState().add(item());
    expect(useCart.getState().lines).toHaveLength(1);
    expect(useCart.getState().lines[0].quantity).toBe(2);
  });

  it("keeps different sizes as separate lines", async () => {
    const { useCart } = await freshStore();
    useCart.getState().add(item("M"));
    useCart.getState().add(item("L"));
    expect(useCart.getState().lines).toHaveLength(2);
  });

  it("clamps quantity between 1 and 10", async () => {
    const { useCart, lineKey } = await freshStore();
    useCart.getState().add(item());
    const k = lineKey("product-1", "M", "Black");
    useCart.getState().setQuantity(k, 0);
    expect(useCart.getState().lines[0].quantity).toBe(1);
    useCart.getState().setQuantity(k, 99);
    expect(useCart.getState().lines[0].quantity).toBe(10);
    useCart.getState().setQuantity(k, 5);
    useCart.getState().add(item(), 8);
    expect(useCart.getState().lines[0].quantity).toBe(10);
  });

  it("opens the drawer when adding", async () => {
    const { useCart } = await freshStore();
    useCart.getState().add(item());
    expect(useCart.getState().isOpen).toBe(true);
  });

  it("removes and clears lines", async () => {
    const { useCart, lineKey } = await freshStore();
    useCart.getState().add(item("M"));
    useCart.getState().add(item("L"));
    useCart.getState().remove(lineKey("product-1", "M", "Black"));
    expect(useCart.getState().lines.map((l) => l.size)).toEqual(["L"]);
    useCart.getState().clear();
    expect(useCart.getState().lines).toEqual([]);
  });

  it("counts quantities and totals only available lines", async () => {
    const { cartCount, cartTotal } = await freshStore();
    const lines = [
      { key: "a", productId: "a", slug: "a", name: "A", size: "M", colour: "B", quantity: 2, unitPrice: 1000 },
      { key: "b", productId: "b", slug: "b", name: "B", size: "M", colour: "B", quantity: 1, unitPrice: 500, unavailable: true },
    ];
    expect(cartCount(lines)).toBe(3);
    expect(cartTotal(lines)).toBe(2000);
  });

  it("persists lines to localStorage under carwo-cart", async () => {
    const { useCart } = await freshStore();
    useCart.getState().add(item());
    const saved = JSON.parse(localStorage.getItem("carwo-cart")!);
    expect(saved.state.lines).toHaveLength(1);
    expect(saved.state.isOpen).toBeUndefined();
  });

  it("starts empty when saved data is corrupted", async () => {
    localStorage.setItem("carwo-cart", "{bad json");
    const { useCart } = await freshStore();
    await useCart.persist.rehydrate();
    expect(useCart.getState().lines).toEqual([]);
  });

  it("still updates state when localStorage throws", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceeded");
    });
    const { useCart } = await freshStore();
    expect(() => useCart.getState().add(item())).not.toThrow();
    expect(useCart.getState().lines).toHaveLength(1);
  });
});
