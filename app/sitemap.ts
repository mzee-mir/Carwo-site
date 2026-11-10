import type { MetadataRoute } from "next";
import { getPosts, getProducts, getStories } from "@/lib/sanity/data";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, stories, posts] = await Promise.all([getProducts(), getStories(), getPosts()]);
  const pages = ["", "/shop", "/lookbook", "/news", "/about"].map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }));
  return [
    ...pages,
    ...products.map((p) => ({ url: `${SITE_URL}/product/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...stories.map((s) => ({ url: `${SITE_URL}/lookbook/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/news/${p.slug}`, lastModified: p.publishedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
