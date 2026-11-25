/**
 * Turns the site's built-in content (fixtures.ts) into Sanity documents, so the shop can be copied into a
 * fresh Sanity project once. Pure: image uploads happen in scripts/seed-sanity.ts, which passes in assetRef.
 */
import type { Img } from "../types";
import * as fx from "./fixtures";

type Doc = { _id: string; _type: string; [k: string]: unknown };

/** Every distinct local photo the content uses (url relative to /public, plus its size). */
export function seedImageFiles(): Img[] {
  const all: (Img | undefined)[] = [
    fx.settings.heroImage,
    ...fx.products.flatMap((p) => p.images),
    ...fx.stories.flatMap((s) => [s.cover, ...s.slides.map((x) => x.image)]),
    ...fx.posts.map((p) => p.cover),
  ];
  const byUrl = new Map<string, Img>();
  for (const img of all) if (img && !byUrl.has(img.url)) byUrl.set(img.url, img);
  return [...byUrl.values()];
}

const slug = (current: string) => ({ _type: "slug", current });
const ref = (_ref: string) => ({ _type: "reference", _ref });
const keyed = <T extends object>(items: T[], prefix: string, type?: string) =>
  items.map((item, i) => ({ _key: `${prefix}${i}`, ...(type ? { _type: type } : {}), ...item }));

/** Builds every document. assetRef maps a local photo url to its uploaded Sanity asset id. */
export function buildSeedDocuments(assetRef: (url: string) => string): Doc[] {
  const image = (img?: Img) => (img ? { _type: "image", asset: ref(assetRef(img.url)), alt: img.alt } : undefined);
  const storyIdBySlug = new Map(fx.stories.map((s) => [s.slug, s._id]));
  const catIdBySlug = new Map(fx.categories.map((c) => [c.slug, c._id]));
  const s = fx.settings;

  const docs: Doc[] = [
    {
      _id: "siteSettings",
      _type: "siteSettings",
      whatsappNumber: s.whatsappNumber,
      currencyCode: s.currencyCode,
      currencySymbol: s.currencySymbol,
      instagramUrl: s.instagramUrl,
      heroImage: image(s.heroImage),
      announcement: s.announcement,
      address: s.address,
      mapUrl: s.mapUrl,
      hours: s.hours,
    },
    ...fx.categories.map((c) => ({ _id: c._id, _type: "category", title: c.title, slug: slug(c.slug), order: c.order })),
    ...fx.stories.map((st, i) => ({
      _id: st._id,
      _type: "lookbookStory",
      title: st.title,
      slug: slug(st.slug),
      cover: image(st.cover),
      season: st.season,
      intro: st.intro,
      order: i + 1,
      slides: keyed(st.slides.map((x) => ({ image: image(x.image), caption: x.caption })), "slide", "slide"),
    })),
    ...fx.products.map((p, i) => ({
      _id: p._id,
      _type: "product",
      name: p.name,
      slug: slug(p.slug),
      price: p.price,
      category: ref(catIdBySlug.get(p.category.slug)!),
      ...(p.collection ? { collection: ref(storyIdBySlug.get(p.collection.slug)!) } : {}),
      images: keyed(p.images.map((img) => image(img)!), "img"),
      sizes: keyed(p.sizes, "size", "size"),
      colours: keyed(p.colours, "colour", "colour"),
      description: p.description,
      featured: p.featured,
      newDrop: p.newDrop,
      order: i + 1,
    })),
    ...fx.posts.map((p) => ({
      _id: p._id,
      _type: "post",
      title: p.title,
      slug: slug(p.slug),
      publishedAt: p.publishedAt,
      excerpt: p.excerpt,
      cover: image(p.cover),
      body: p.body,
    })),
    ...fx.branches.map((b) => ({
      _id: b._id,
      _type: "branch",
      name: b.name,
      city: b.city,
      address: b.address,
      ...(typeof b.lat === "number" && typeof b.lng === "number" ? { location: { _type: "geopoint", lat: b.lat, lng: b.lng } } : {}),
      phone: b.phone,
      whatsappNumber: b.whatsappNumber,
      hours: b.hours,
      isMain: b.isMain,
    })),
  ];
  // Drop undefined fields so Sanity never stores empty values.
  return JSON.parse(JSON.stringify(docs));
}
