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

export const post = defineType({
  name: "post",
  title: "News post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "publishedAt", title: "Date", type: "date", initialValue: () => new Date().toISOString().slice(0, 10), validation: (r) => r.required() }),
    imageWithAlt("cover", "Cover photo"),
    defineField({ name: "excerpt", title: "Short summary", type: "text", rows: 3, description: "Shown on the News page and in link previews", validation: (r) => r.max(200) }),
    defineField({
      name: "body",
      title: "Article",
      type: "array",
      of: [
        defineArrayMember({ type: "block", styles: [{ title: "Normal", value: "normal" }, { title: "Heading", value: "h2" }, { title: "Quote", value: "blockquote" }] }),
        defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Describe the photo", type: "string" })] }),
      ],
    }),
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "publishedAt", media: "cover" } },
});

export const branch = defineType({
  name: "branch",
  title: "Branch / office",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", description: "e.g. Carwo Bosaso", validation: (r) => r.required() }),
    defineField({ name: "city", type: "string" }),
    defineField({ name: "address", type: "string", description: "Street, area, landmark" }),
    defineField({ name: "location", title: "Map pin", type: "geopoint", description: "Drop the pin on the shop so 'Open in Maps' is exact" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "whatsappNumber", title: "WhatsApp number", type: "string", description: "Orders for this branch go here. International format, e.g. +252 61 234 5678. Leave empty to use the main shop number." }),
    defineField({ name: "hours", title: "Opening hours", type: "string", description: "e.g. Sat–Thu · 9am–9pm" }),
    defineField({ name: "isMain", title: "Main shop", type: "boolean", initialValue: false, description: "The main shop is listed first and pre-selected in the cart" }),
  ],
  preview: { select: { title: "name", subtitle: "city" } },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "whatsappNumber", title: "WhatsApp number", type: "string", description: "International format, e.g. +252 61 234 5678" }),
    defineField({ name: "currencyCode", type: "string", initialValue: "USD" }),
    defineField({ name: "currencySymbol", type: "string", initialValue: "$" }),
    defineField({ name: "instagramUrl", title: "Instagram link", type: "url" }),
    imageWithAlt("heroImage", "Home page hero photo"),
    defineField({
      name: "heroVideo",
      title: "Home page hero video (optional)",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description:
        "Plays silently on a loop over the hero photo. MP4, 6–10 seconds, 1080p max, under 4 MB, no sound. The photo above is still required — it shows while the video loads and on slow connections.",
    }),
    defineField({ name: "announcement", title: "Announcement bar text", type: "string" }),
    defineField({ name: "address", type: "string" }),
    defineField({ name: "mapUrl", title: "Google Maps link", type: "url" }),
    defineField({ name: "hours", title: "Opening hours", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const schemaTypes = [product, category, lookbookStory, post, branch, siteSettings];
