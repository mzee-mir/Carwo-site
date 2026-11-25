import { evaluate, parse } from "groq-js";
import { describe, expect, it } from "vitest";
import * as fx from "./fixtures";
import * as q from "./queries";
import { buildSeedDocuments, seedImageFiles } from "./seed";
import { schemaTypes } from "../../sanity/schemas";

// Fake asset ids for each local photo, plus the asset documents Sanity would create on upload.
const files = seedImageFiles();
const assetId = (url: string) => `image-${url.replace(/\W/g, "")}`;
const assets = files.map((f) => ({
  _id: assetId(f.url),
  _type: "sanity.imageAsset",
  url: f.url, // in real Sanity this is the CDN url; using the local url lets results compare 1:1 with today's data
  metadata: { dimensions: { width: f.width, height: f.height } },
}));
// Real Sanity stamps every document with _createdAt; the seed creates them in this order, one after another.
const start = Date.parse("2026-11-25T10:00:00Z");
const dataset = [...buildSeedDocuments(assetId), ...assets].map((d, i) => ({ ...d, _createdAt: new Date(start + i * 1000).toISOString() }));

async function run(query: string, params: Record<string, unknown> = {}) {
  return (await evaluate(parse(query), { dataset, params })).get();
}

/** JSON-compare ignoring empty fields: GROQ returns null where today's data simply leaves a field out. */
function clean<T>(v: T): T {
  return JSON.parse(JSON.stringify(v, (_k, x) => (x === null ? undefined : x)));
}
const noFilters = { category: null, featured: null, newDrop: null };

describe("seed + queries reproduce today's site data", () => {
  it("covers every photo the site uses", () => {
    expect(files.length).toBeGreaterThan(30);
    expect(new Set(files.map((f) => f.url)).size).toBe(files.length);
  });

  it("site settings", async () => {
    expect(clean(await run(q.SETTINGS_QUERY))).toEqual(clean(fx.settings));
  });

  it("categories in order", async () => {
    expect(clean(await run(q.CATEGORIES_QUERY))).toEqual(clean(fx.categories));
  });

  it("all products, in the same order as today", async () => {
    expect(clean(await run(q.PRODUCTS_QUERY, noFilters))).toEqual(clean(fx.products));
  });

  it("new drop, featured and category filters", async () => {
    const pick = (f: (p: (typeof fx.products)[number]) => boolean) => clean(fx.products.filter(f));
    expect(clean(await run(q.PRODUCTS_QUERY, { ...noFilters, newDrop: true }))).toEqual(pick((p) => p.newDrop));
    expect(clean(await run(q.PRODUCTS_QUERY, { ...noFilters, featured: true }))).toEqual(pick((p) => p.featured));
    expect(clean(await run(q.PRODUCTS_QUERY, { ...noFilters, category: "jerseys" }))).toEqual(pick((p) => p.category.slug === "jerseys"));
  });

  it("single product and products by id", async () => {
    expect(clean(await run(q.PRODUCT_QUERY, { slug: "classic-fit" }))).toEqual(clean(fx.products.find((p) => p.slug === "classic-fit")));
    expect(await run(q.PRODUCT_QUERY, { slug: "nope" })).toBeNull();
    const ids = ["product-12", "product-21", "missing"];
    const got = clean((await run(q.PRODUCTS_BY_IDS_QUERY, { ids })) as { _id: string }[]).sort((a, b) => a._id.localeCompare(b._id));
    expect(got).toEqual(clean(fx.products.filter((p) => ids.includes(p._id))));
  });

  it("lookbook stories in order, and a single story", async () => {
    expect(clean(await run(q.STORIES_QUERY))).toEqual(clean(fx.stories));
    expect(clean(await run(q.STORY_QUERY, { slug: "night-shift" }))).toEqual(clean(fx.stories[1]));
  });

  it("news posts newest first, and a single post", async () => {
    const newest = [...fx.posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    expect(clean(await run(q.POSTS_QUERY))).toEqual(clean(newest));
    expect(clean(await run(q.POST_QUERY, { slug: "drop-01-is-here" }))).toEqual(clean(fx.posts.find((p) => p.slug === "drop-01-is-here")));
  });

  it("branches, main shop first", async () => {
    expect(clean(await run(q.BRANCHES_QUERY))).toEqual(clean(fx.branches));
  });

  it("only writes fields that exist in the admin panel's schema", () => {
    const fieldsByType = new Map<string, Set<string>>(schemaTypes.map((t) => [t.name, new Set((t as { fields: { name: string }[] }).fields.map((f) => f.name))]));
    const unknown: string[] = [];
    for (const d of buildSeedDocuments(assetId)) {
      const fields = fieldsByType.get(d._type);
      if (!fields) unknown.push(`type ${d._type}`);
      else for (const k of Object.keys(d)) if (!k.startsWith("_") && !fields.has(k)) unknown.push(`${d._type}.${k}`);
    }
    expect(unknown).toEqual([]);
  });

  it("every array item has a _key, as Sanity requires", () => {
    const missing: string[] = [];
    const walk = (v: unknown, path: string) => {
      if (Array.isArray(v)) v.forEach((x, i) => {
        if (x && typeof x === "object" && !("_key" in x) && !("_ref" in x)) missing.push(`${path}[${i}]`);
        walk(x, `${path}[${i}]`);
      });
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
    };
    for (const d of buildSeedDocuments(assetId)) walk(d, d._id);
    expect(missing).toEqual([]);
  });
});
