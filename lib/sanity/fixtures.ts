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
    excerpt: "Retro jerseys, smart-casual layers and streetwear staples — the first drop is in store and online now.",
    cover: img("news-drop-01.jpg", "Lime-lit wall of jackets, tops and trousers under a glowing Carwo Wear The Future sign", 1448, 1086),
    body: [
      block("Drop 01 is finally here. Ten pieces, built heavy and cut loose, made for the streets of Bosaso."),
      block("What's in the drop", "h2"),
      block("Retro football jerseys, the Classic Fit knit-vest look and our Streetwear Essentials — tee, baggy denim and clean sneakers."),
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
    cover: img("lb-street-cover.jpg", "Man in a black varsity bomber against a bright yellow wall", 1122, 701),
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
    cover: img("news-bosaso-shop.jpg", "Inside the Carwo shop: lime-lit racks of jackets, a mannequin in jeans and a Carwo Wear The Future sign", 1254, 1254),
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
  { _id: "cat-jerseys", title: "Jerseys", slug: "jerseys", order: 1 },
  { _id: "cat-smart-casual", title: "Smart Casual", slug: "smart-casual", order: 2 },
  { _id: "cat-streetwear", title: "Streetwear", slug: "streetwear", order: 3 },
  { _id: "cat-outerwear", title: "Outerwear", slug: "outerwear", order: 4 },
];

const cat = (slug: string) => {
  const c = categories.find((x) => x.slug === slug)!;
  return { title: c.title, slug: c.slug };
};
const sizes = (out: string[] = []) => ["S", "M", "L", "XL", "XXL"].map((label) => ({ label, inStock: !out.includes(label) }));
const c = (name: string, hex: string) => ({ name, hex });
const black = c("Black", "#0b0b0b");
const cream = c("Cream", "#ece4d3");
const street = { title: "Street Season", slug: "street-season" };
const night = { title: "Night Shift", slug: "night-shift" };
const jersey = "Retro-inspired football jersey with a woven-pattern finish, ribbed collar and a relaxed fit.";

type Seed = [id: number, name: string, slug: string, price: number, category: string, extra?: Partial<Product>];
const seeds: Seed[] = [
  // ── New drop (shown on the home page, in this order)
  [11, "Retro Jerseys", "retro-jerseys", 45, "jerseys", {
    newDrop: true,
    colours: [c("Gold", "#e2b021")],
    images: [img("nd-retro-jerseys.jpg", "Man in a long-sleeve gold-and-green retro Brazil jersey against a red wall", 864, 1080)],
    description: "Long-sleeve retro football jerseys with a woven-pattern finish, contrast collar and striped sleeves.",
  }],
  [12, "Classic Fit", "classic-fit", 65, "smart-casual", {
    newDrop: true,
    colours: [c("Brown", "#5a3a22"), c("Navy", "#1f2a44")],
    sizes: sizes(["XL"]),
    collection: street,
    images: [img("nd-classic-fit.jpg", "Man in a brown and navy checked knit vest, light blue shirt and brown trousers", 1000, 1250)],
    description: "Smart-casual layers: checked knit vest, crisp shirt and tailored wool-blend trousers.",
  }],
  [13, "Streetwear Essentials", "streetwear-essentials", 55, "streetwear", {
    newDrop: true,
    colours: [black, c("Light denim", "#9fb3cf")],
    images: [img("nd-streetwear.jpg", "Man in a black graphic tee and baggy jeans sitting on a red block", 941, 1176)],
    description: "The everyday uniform: heavyweight graphic tee and loose, wide-leg washed denim.",
  }],

  // ── Jerseys
  [21, "Sky Blue Retro Jersey", "sky-blue-retro-jersey", 40, "jerseys", {
    featured: true,
    colours: [c("Sky blue", "#8fbbe6")],
    images: [img("p-sky-blue-retro-jersey.jpg", "Man holding out a sky-blue retro football jersey with navy panels, a matching shirt hanging behind him", 864, 1080)],
    description: jersey,
  }],
  [22, "Navy Pinstripe Jersey", "navy-pinstripe-jersey", 40, "jerseys", {
    colours: [c("Navy", "#1c2541")],
    images: [img("p-navy-pinstripe-jersey.jpg", "Man sitting on the floor in a navy pinstripe football jersey with a white collar and black trousers", 720, 900)],
    description: jersey,
  }],
  [23, "Claret & Blue Split Jersey", "claret-blue-split-jersey", 40, "jerseys", {
    colours: [c("Claret & blue", "#6b1f3a")],
    images: [
      img("p-claret-blue-split-jersey-a.jpg", "Man in a half claret, half blue pinstripe football jersey sitting in a leather armchair", 809, 1011),
      img("p-claret-blue-split-jersey-b.jpg", "Half claret, half blue football jersey on a hanger against a patterned wall", 736, 920),
    ],
    description: jersey,
  }],
  [24, "Black & White Retro Jersey", "black-white-retro-jersey", 40, "jerseys", {
    colours: [black],
    images: [img("p-black-white-retro-jersey.jpg", "Man in sunglasses wearing a black retro football jersey with white shoulder stripes, holding a gold ball", 928, 1160)],
    description: jersey,
  }],
  [25, "Black & Gold Concept Jersey", "black-gold-concept-jersey", 45, "jerseys", {
    colours: [c("Black & gold", "#1a1a1a")],
    images: [img("p-black-gold-concept-jersey.jpg", "Black football jersey with a gold tonal pattern and blue collar on a wooden hanger", 735, 919)],
    description: "Concept jersey with an all-over tonal pattern, contrast collar and gold detailing.",
  }],
  [26, "Green Tile Concept Jersey", "green-tile-concept-jersey", 45, "jerseys", {
    colours: [c("Green", "#1f4d3a")],
    sizes: sizes(["S", "M", "L", "XL", "XXL"]), // sample of a sold-out product
    images: [img("p-green-tile-concept-jersey.jpg", "Dark green football jersey with a blue-and-white tile print and gold trim on a hanger", 736, 920)],
    description: "Concept jersey with a hand-painted tile print, gold piping and a red-and-gold V-neck.",
  }],
  [27, "Navy & Gold Retro Jersey", "navy-gold-retro-jersey", 40, "jerseys", {
    colours: [c("Navy & gold", "#1d2b55")],
    images: [img("p-navy-gold-retro-jersey.jpg", "Navy retro football jersey with gold pinstripes and a gold collar on a hanger", 736, 920)],
    description: jersey,
  }],

  // ── Smart casual
  [31, "Colour-Block Knit Polo", "colour-block-knit-polo", 40, "smart-casual", {
    colours: [c("Black & cream", "#ece4d3")],
    images: [img("p-colour-block-knit-polo.jpg", "Man in sunglasses wearing a black, white and beige colour-block zip knit polo with cream trousers", 1000, 1250)],
    description: "Fine-knit zip polo in bold colour blocks. Pair with tailored trousers and loafers.",
  }],
  [32, "Striped Knit Polo", "striped-knit-polo", 38, "smart-casual", {
    colours: [c("Brown", "#4a2c1d"), cream],
    collection: street,
    images: [img("p-striped-knit-polo.jpg", "Man in glasses sitting on a wooden chair in a brown striped knit polo and wide cream trousers", 1000, 1250)],
    description: "Vintage-style knit polo with cream stripes, worn with pleated wide-leg trousers.",
  }],
  [33, "Mandarin Collar Set", "mandarin-collar-set", 70, "smart-casual", {
    colours: [c("Forest green", "#1d3a32")],
    images: [img("p-mandarin-collar-set.jpg", "Man in a matching dark green mandarin-collar shirt and tapered trousers with white sneakers", 941, 1176)],
    description: "Two-piece set: band-collar shirt with a hidden placket and matching tapered trousers.",
  }],

  // ── Streetwear
  [41, "Monochrome Quarter-Zip", "monochrome-quarter-zip", 85, "streetwear", {
    featured: true,
    colours: [c("Black & white", "#0b0b0b")],
    collection: night,
    images: [img("p-monochrome-quarter-zip.jpg", "Black-and-white photo of a man in sunglasses wearing a black logo quarter-zip sweatshirt and wide white trousers", 1000, 1250)],
    description: "Heavyweight quarter-zip with sleeve print, styled with wide pleated trousers and chunky loafers.",
  }],
  [42, "Varsity Bomber Jacket", "varsity-bomber-jacket", 60, "streetwear", {
    colours: [black],
    images: [img("p-varsity-bomber-jacket.jpg", "Man in a black satin varsity bomber with patches, white tee and grey joggers on yellow steps", 1000, 1250)],
    description: "Satin bomber with embroidered patches, ribbed cuffs and a zip front.",
  }],

  // ── Outerwear
  [51, "Wool Bomber Jacket", "wool-bomber-jacket", 75, "outerwear", {
    featured: true,
    colours: [c("Brown", "#5b3a24")],
    images: [img("p-wool-bomber-jacket.jpg", "Man in a brown wool bomber jacket over a cream turtleneck with beige trousers", 941, 1176)],
    description: "Textured wool-blend bomber with flap pockets and a ribbed hem. Layer over a knit.",
  }],
  [52, "Camel Wool Co-ord", "camel-wool-coord", 80, "outerwear", {
    colours: [c("Camel", "#b39b7d")],
    images: [img("p-camel-wool-coord.jpg", "Man in a camel wool zip jacket and matching drawstring trousers over a white tee", 1000, 1250)],
    description: "Matching zip jacket and drawstring trousers in soft brushed wool-blend.",
  }],
];

export const products: Product[] = seeds.map(([id, name, slug, price, category, extra = {}]) => ({
  _id: `product-${id}`,
  name,
  slug,
  price,
  category: cat(category),
  images: [],
  sizes: sizes(),
  colours: [black],
  description: "",
  featured: false,
  newDrop: false,
  ...extra,
}));

/** A look in a story: photo (4:5 crop in public/fixtures) captioned with the piece it shows. */
const look = (file: string, w: number, h: number, caption: string, alt: string) => ({ image: img(file, alt, w, h), caption });

export const stories: LookbookStory[] = [
  {
    _id: "story-1",
    title: "Street Season",
    slug: "street-season",
    season: "SS27",
    intro: "Retro kits, bold colour and loose fits — made for the street.",
    cover: img("lb-street-cover.jpg", "Man in a black varsity bomber, white tee and grey joggers against a bright yellow wall", 1122, 701),
    slides: [
      look("lb-street-1.jpg", 864, 1080, "Retro Jerseys", "Man in a long-sleeve gold-and-green retro jersey against a red wall"),
      look("lb-street-2.jpg", 941, 1176, "Streetwear Essentials", "Man in a black graphic tee and baggy jeans sitting on a red block"),
      look("lb-street-3.jpg", 864, 1080, "Sky Blue Retro Jersey", "Man holding out a sky-blue retro football jersey with navy panels"),
      look("lb-street-4.jpg", 922, 1153, "Black & White Retro Jersey", "Man in sunglasses wearing a black retro jersey with white stripes, holding a gold ball"),
      look("lb-street-5.jpg", 720, 900, "Navy Pinstripe Jersey", "Man sitting on the floor in a navy pinstripe jersey and black trousers"),
    ],
  },
  {
    _id: "story-2",
    title: "Night Shift",
    slug: "night-shift",
    season: "SS27",
    intro: "Darker tones, sharp tailoring and gold details — dressed for after dark.",
    cover: img("lb-night-cover.jpg", "Man in a half claret, half blue jersey sitting in a dark leather armchair", 809, 506),
    slides: [
      look("lb-night-1.jpg", 1024, 1280, "Monochrome Quarter-Zip", "Black-and-white photo of a man in sunglasses wearing a black quarter-zip and wide white trousers"),
      look("lb-night-2.jpg", 1086, 1358, "Striped Knit Polo", "Man in glasses sitting on a wooden chair in a brown striped knit polo and cream trousers"),
      look("lb-night-3.jpg", 1024, 1280, "Colour-Block Knit Polo", "Man in sunglasses wearing a black, white and beige colour-block knit polo"),
      look("lb-night-4.jpg", 735, 919, "Black & Gold Concept Jersey", "Black football jersey with a gold tonal pattern on a wooden hanger"),
      look("lb-night-5.jpg", 589, 736, "Navy & Gold Retro Jersey", "Navy retro football jersey with gold pinstripes on a hanger"),
    ],
  },
];
