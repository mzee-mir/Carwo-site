import { describe, expect, it } from "vitest";
import { getProduct, getProducts, getProductsByIds, getSettings, getStories, getCategories } from "./data";

describe("data module in fixtures mode", () => {
  it("filters products by category", async () => {
    const tees = await getProducts({ category: "tees" });
    expect(tees.length).toBeGreaterThan(0);
    expect(tees.every((p) => p.category.slug === "tees")).toBe(true);
  });
  it("returns null for an unknown product slug", async () => {
    expect(await getProduct("nope")).toBeNull();
  });
  it("returns only products that exist when looking up by ids", async () => {
    const [first] = await getProducts();
    const found = await getProductsByIds([first._id, "missing"]);
    expect(found).toHaveLength(1);
    expect(found[0]._id).toBe(first._id);
  });
  it("returns shop settings with KSh currency", async () => {
    expect((await getSettings()).currencySymbol).toBe("KSh");
  });
  it("has new-drop, featured and sold-out fixture products", async () => {
    expect((await getProducts({ newDrop: true })).length).toBeGreaterThanOrEqual(2);
    expect((await getProducts({ featured: true })).length).toBeGreaterThanOrEqual(3);
    const sold = await getProduct("sold-out-hoodie");
    expect(sold?.sizes.every((s) => !s.inStock)).toBe(true);
  });
  it("has categories and lookbook stories", async () => {
    expect((await getCategories()).map((c) => c.slug)).toEqual(["tees", "hoodies", "bottoms", "accessories"]);
    const stories = await getStories();
    expect(stories).toHaveLength(2);
    expect(stories[0].slides).toHaveLength(5);
  });
});
