import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getProduct, getProducts, getProductsByIds, getSettings, getStories, getCategories, getPosts, getPost } from "./data";

describe("data module in fixtures mode", () => {
  it("filters products by category", async () => {
    const tees = await getProducts({ category: "jerseys" });
    expect(tees.length).toBeGreaterThan(0);
    expect(tees.every((p) => p.category.slug === "jerseys")).toBe(true);
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
  it("returns shop settings in US dollars at the Bosaso pin", async () => {
    expect((await getSettings()).currencySymbol).toBe("$");
    expect((await getSettings()).mapUrl).toContain("11.284851,49.177534");
  });
  it("has new-drop, featured and sold-out fixture products", async () => {
    expect((await getProducts({ newDrop: true })).length).toBeGreaterThanOrEqual(2);
    expect((await getProducts({ featured: true })).length).toBeGreaterThanOrEqual(3);
    const sold = await getProduct("green-tile-concept-jersey");
    expect(sold?.sizes.every((s) => !s.inStock)).toBe(true);
  });
  it("has news posts, newest first, and null for unknown posts", async () => {
    const posts = await getPosts();
    expect(posts).toHaveLength(3);
    const dates = posts.map((p) => p.publishedAt);
    expect([...dates].sort().reverse()).toEqual(dates);
    expect((await getPost(posts[0].slug))?.body.length).toBeGreaterThan(0);
    expect(await getPost("nope")).toBeNull();
  });

  it("gives every product a real photo (no grey placeholders)", async () => {
    const all = await getProducts();
    expect(all).toHaveLength(17);
    for (const p of all) {
      expect(p.images.length, p.name).toBeGreaterThan(0);
      for (const img of p.images) {
        expect(img.url, p.name).not.toMatch(/\/fixtures\/p\d+-[ab]\.jpg$/); // old generated placeholders
        expect(existsSync(join(process.cwd(), "public", img.url)), img.url).toBe(true);
        expect(img.alt.length, p.name).toBeGreaterThan(10);
      }
    }
  });

  it("gives every lookbook story a real cover and photos that exist", async () => {
    for (const s of await getStories()) {
      for (const img of [s.cover, ...s.slides.map((x) => x.image)]) {
        expect(img.url, s.title).toMatch(/^\/fixtures\/lb-/);
        expect(existsSync(join(process.cwd(), "public", img.url)), img.url).toBe(true);
      }
    }
  });

  it("has categories and lookbook stories", async () => {
    expect((await getCategories()).map((c) => c.slug)).toEqual(["jerseys", "smart-casual", "streetwear", "outerwear"]);
    const stories = await getStories();
    expect(stories).toHaveLength(2);
    expect(stories[0].slides).toHaveLength(5);
  });
});
