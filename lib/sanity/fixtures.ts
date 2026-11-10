import type { Branch, Category, Img, LookbookStory, Post, Product, SiteSettings } from "../types";

const img = (file: string, alt: string, width = 800, height = 1000): Img => ({ url: `/fixtures/${file}`, alt, width, height });

export const settings: SiteSettings = {
  whatsappNumber: "+252 61 000 0000",
  currencyCode: "USD",
  currencySymbol: "$",
  instagramUrl: "https://instagram.com/carwo",
  heroImage: img("shop-hero.jpg", "Inside the Carwo shop: jackets on mannequins and lime-lit shelves of clothes and bags", 1672, 941),
  announcement: "Drop 01 out now ✦ Order on WhatsApp",
  address: "Bosaso, Somalia",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=11.284851,49.177534",
  hours: "Mon–Sat · 10am–8pm",
};

let k = 0;
const block = (text: string, style = "normal") => ({
  _type: "block" as const,
  _key: `b${k++}`,
  style,
  markDefs: [],
  children: [{ _type: "span" as const, _key: `s${k++}`, text, marks: [] }],
});

export const posts: Post[] = [
  {
    _id: "post-3",
    title: "Drop 01 is here",
    slug: "drop-01-is-here",
    publishedAt: "2026-11-01",
    excerpt: "Heavyweight tees, cargo pants and our first hoodie — the full first drop is in store and online now.",
    cover: img("shop-hero.jpg", "Pieces from Carwo Drop 01 in the shop", 1672, 941),
    body: [
      block("Drop 01 is finally here. Ten pieces, built heavy and cut loose, made for the streets of Bosaso."),
      block("What's in the drop", "h2"),
      block("Oversized tees in black, bone and olive, cargo pants with deep pockets, and the Heavy Hoodie — our first one, and already a favourite in the shop."),
      block("How to get yours", "h2"),
      block("Add what you like to your cart and tap Order on WhatsApp. We'll confirm your sizes and have it ready for pickup or delivery."),
    ],
  },
  {
    _id: "post-2",
    title: "Behind the lookbook: Street Season",
    slug: "behind-the-lookbook-street-season",
    publishedAt: "2026-10-18",
    excerpt: "We spent a week shooting at golden hour across the city. Here's how the Street Season story came together.",
    cover: img("s1-cover.jpg", "Street Season lookbook cover", 1600, 1000),
    body: [
      block("Street Season was shot over seven evenings, chasing the last hour of light across the city."),
      block("No studio, just the street. Every look was styled with pieces from Drop 01 so you can shop exactly what you see."),
    ],
  },
  {
    _id: "post-1",
    title: "Our Bosaso shop is open",
    slug: "our-bosaso-shop-is-open",
    publishedAt: "2026-09-30",
    excerpt: "Come through, try everything on, and say hello. Our first shop is now open in Bosaso.",
    cover: img("s2-cover.jpg", "Inside the Carwo Bosaso shop", 1600, 1000),
    body: [
      block("Carwo Bosaso is open. It's our first shop and the home of everything we make."),
      block("Find us on the map from the About page, or message us on WhatsApp and we'll send you directions."),
    ],
  },
];

export const branches: Branch[] = [
  {
    _id: "branch-bosaso",
    name: "Carwo Bosaso",
    city: "Bosaso",
    address: "Bosaso, Somalia",
    lat: 11.284851,
    lng: 49.177534,
    phone: "+252 61 000 0000",
    whatsappNumber: "+252 61 000 0000",
    hours: "Mon–Sat · 10am–8pm",
    isMain: true,
  },
];

export const categories: Category[] = [
  { _id: "cat-tees", title: "Tees", slug: "tees", order: 1 },
  { _id: "cat-hoodies", title: "Hoodies", slug: "hoodies", order: 2 },
  { _id: "cat-bottoms", title: "Bottoms", slug: "bottoms", order: 3 },
  { _id: "cat-accessories", title: "Accessories", slug: "accessories", order: 4 },
];

const cat = (slug: string) => {
  const c = categories.find((x) => x.slug === slug)!;
  return { title: c.title, slug: c.slug };
};
const sizes = (out: string[] = []) => ["S", "M", "L", "XL", "XXL"].map((label) => ({ label, inStock: !out.includes(label) }));
const oneSize = [{ label: "One size", inStock: true }];
const black = { name: "Black", hex: "#0b0b0b" };
const bone = { name: "Bone", hex: "#e6e0d2" };
const olive = { name: "Olive", hex: "#545b33" };
const street = { title: "Street Season", slug: "street-season" };
const night = { title: "Night Shift", slug: "night-shift" };

type Seed = [id: number, name: string, slug: string, price: number, category: string, extra?: Partial<Product>];
const seeds: Seed[] = [
  [1, "Oversized Tee", "oversized-tee", 25, "tees", { featured: true, newDrop: true, colours: [black, bone, olive], sizes: sizes(["XL"]), collection: street }],
  [2, "Cargo Pant", "cargo-pant", 45, "bottoms", { newDrop: true, colours: [olive, black], collection: street }],
  [3, "Heavy Hoodie", "heavy-hoodie", 52, "hoodies", { featured: true, newDrop: true, collection: night }],
  [4, "Bucket Hat", "bucket-hat", 18, "accessories", { sizes: oneSize }],
  [5, "Track Jacket", "track-jacket", 60, "hoodies", { featured: true, collection: night }],
  [6, "Sold Out Hoodie", "sold-out-hoodie", 52, "hoodies", { sizes: sizes(["S", "M", "L", "XL", "XXL"]) }],
  [7, "Logo Tee", "logo-tee", 22, "tees", { colours: [bone, black] }],
  [8, "Wide Denim", "wide-denim", 48, "bottoms"],
  [9, "Tee & Co. #1", "tee-and-co-1", 24, "tees"],
  [10, "Utility Bag", "utility-bag", 30, "accessories", { sizes: oneSize }],
];

export const products: Product[] = seeds.map(([id, name, slug, price, category, extra = {}]) => ({
  _id: `product-${id}`,
  name,
  slug,
  price,
  category: cat(category),
  images: [img(`p${id}-a.jpg`, `${name} — front`), img(`p${id}-b.jpg`, `${name} — back`)],
  sizes: sizes(),
  colours: [black],
  description: "Heavyweight cotton with a boxy, dropped-shoulder fit. Built to be worn loud and washed hard.",
  featured: false,
  newDrop: false,
  ...extra,
}));

const story = (n: number, title: string, slug: string, season: string, intro: string): LookbookStory => ({
  _id: `story-${n}`,
  title,
  slug,
  season,
  intro,
  cover: img(`s${n}-cover.jpg`, `${title} lookbook cover`, 1600, 1000),
  slides: [1, 2, 3, 4, 5].map((i) => ({ image: img(`s${n}-${i}.jpg`, `${title} look ${i}`, 1200, 1500), caption: `Look ${i}` })),
});

export const stories: LookbookStory[] = [
  story(1, "Street Season", "street-season", "SS27", "Shot across the CBD at golden hour. Oversized cuts, loud colour."),
  story(2, "Night Shift", "night-shift", "SS27", "After dark in reflective black. Built for the late ones."),
];
