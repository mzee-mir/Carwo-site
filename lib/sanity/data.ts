import type { Branch, Category, LookbookStory, Product, SiteSettings } from "../types";
import { client } from "./client";
import * as fx from "./fixtures";
import * as q from "./queries";

const useFixtures = () => process.env.CARWO_FIXTURES === "1" || !client;

async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return client!.fetch<T>(query, params, { next: { revalidate: 60 } });
}

export async function getSettings(): Promise<SiteSettings> {
  if (useFixtures()) return fx.settings;
  return (await fetchSanity<SiteSettings | null>(q.SETTINGS_QUERY)) ?? { currencyCode: "USD", currencySymbol: "$" };
}

/** All branches, main shop first. */
export async function getBranches(): Promise<Branch[]> {
  if (useFixtures()) return fx.branches;
  return fetchSanity<Branch[]>(q.BRANCHES_QUERY);
}

export async function getCategories(): Promise<Category[]> {
  if (useFixtures()) return fx.categories;
  return fetchSanity<Category[]>(q.CATEGORIES_QUERY);
}

export async function getProducts(opts: { category?: string; featured?: boolean; newDrop?: boolean } = {}): Promise<Product[]> {
  if (useFixtures()) {
    return fx.products.filter(
      (p) =>
        (opts.category === undefined || p.category.slug === opts.category) &&
        (opts.featured === undefined || p.featured === opts.featured) &&
        (opts.newDrop === undefined || p.newDrop === opts.newDrop),
    );
  }
  return fetchSanity<Product[]>(q.PRODUCTS_QUERY, {
    category: opts.category ?? null,
    featured: opts.featured ?? null,
    newDrop: opts.newDrop ?? null,
  });
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (useFixtures()) return fx.products.find((p) => p.slug === slug) ?? null;
  return fetchSanity<Product | null>(q.PRODUCT_QUERY, { slug });
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (useFixtures()) return fx.products.filter((p) => ids.includes(p._id));
  return fetchSanity<Product[]>(q.PRODUCTS_BY_IDS_QUERY, { ids });
}

export async function getStories(): Promise<LookbookStory[]> {
  if (useFixtures()) return fx.stories;
  return fetchSanity<LookbookStory[]>(q.STORIES_QUERY);
}

export async function getStory(slug: string): Promise<LookbookStory | null> {
  if (useFixtures()) return fx.stories.find((s) => s.slug === slug) ?? null;
  return fetchSanity<LookbookStory | null>(q.STORY_QUERY, { slug });
}
