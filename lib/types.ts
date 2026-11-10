export type Img = { url: string; alt: string; lqip?: string; width: number; height: number };
export type Size = { label: string; inStock: boolean };
export type Colour = { name: string; hex: string };
export type Category = { _id: string; title: string; slug: string; order: number };
export type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: { title: string; slug: string };
  collection?: { title: string; slug: string };
  images: Img[];
  sizes: Size[];
  colours: Colour[];
  description?: string;
  featured: boolean;
  newDrop: boolean;
};
export type LookbookStory = {
  _id: string;
  title: string;
  slug: string;
  cover: Img;
  season?: string;
  intro?: string;
  slides: { image: Img; caption?: string }[];
};
export type SiteSettings = {
  whatsappNumber?: string;
  currencyCode: string;
  currencySymbol: string;
  instagramUrl?: string;
  heroImage?: Img;
  announcement?: string;
  address?: string;
  mapUrl?: string;
  hours?: string;
};
