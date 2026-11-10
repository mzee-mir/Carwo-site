import { defineArrayMember, defineField, defineType } from "sanity";
import { product } from "./product";

const imageWithAlt = (name: string, title?: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [defineField({ name: "alt", title: "Describe the photo", type: "string" })],
  });

export const category = defineType({
  name: "category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
});

export const lookbookStory = defineType({
  name: "lookbookStory",
  title: "Collection / Lookbook story",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    imageWithAlt("cover", "Cover photo"),
    defineField({ name: "season", type: "string", description: "e.g. SS27" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "slides",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "slide",
          fields: [imageWithAlt("image"), defineField({ name: "caption", type: "string" })],
          preview: { select: { title: "caption", media: "image" } },
        }),
      ],
    }),
  ],
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "whatsappNumber", title: "WhatsApp number", type: "string", description: "International format, e.g. +254 712 345 678" }),
    defineField({ name: "currencyCode", type: "string", initialValue: "KES" }),
    defineField({ name: "currencySymbol", type: "string", initialValue: "KSh" }),
    defineField({ name: "instagramUrl", title: "Instagram link", type: "url" }),
    imageWithAlt("heroImage", "Home page hero photo"),
    defineField({ name: "announcement", title: "Announcement bar text", type: "string" }),
    defineField({ name: "address", type: "string" }),
    defineField({ name: "mapUrl", title: "Google Maps link", type: "url" }),
    defineField({ name: "hours", title: "Opening hours", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const schemaTypes = [product, category, lookbookStory, siteSettings];
