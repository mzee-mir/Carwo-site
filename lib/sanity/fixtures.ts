import type { Branch, Category, Img, LookbookStory, Product, SiteSettings } from "../types";

const img = (file: string, alt: string, width = 800, height = 1000): Img => ({ url: `/fixtures/${file}`, alt, width, height });

export const settings: SiteSettings = {
  whatsappNumber: "+252 61 000 0000",
  currencyCode: "USD",
  currencySymbol: "$",
  instagramUrl: "https://instagram.com/carwo",
  heroImage: img("hero.jpg", "Model wearing the Carwo Oversized Tee on a city street", 1600, 1000),
  announcement: "Drop 01 out now ✦ Order on WhatsApp",
  address: "Bosaso, Somalia",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=11.284851,49.177534",
  hours: "Mon–Sat · 10am–8pm",
};

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
