import { defineArrayMember, defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "price", type: "number", description: "Price in your currency, no symbol (e.g. 2500)", validation: (r) => r.required().min(0) }),
    defineField({ name: "category", type: "reference", to: [{ type: "category" }], validation: (r) => r.required() }),
    defineField({ name: "collection", type: "reference", to: [{ type: "lookbookStory" }] }),
    defineField({
      name: "images",
      type: "array",
      description: "Drag to reorder. The second photo shows on hover.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Describe the photo", type: "string", validation: (r) => r.required() })],
        }),
      ],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "sizes",
      type: "array",
      description: 'Add every size. For caps, bags etc. add a single size called "One size". Switch "In stock" off when a size sells out.',
      validation: (r) => r.min(1).error("Add at least one size (use \"One size\" for accessories)"),
      of: [
        defineArrayMember({
          type: "object",
          name: "size",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "inStock", title: "In stock", type: "boolean", initialValue: true }),
          ],
          preview: { select: { title: "label", inStock: "inStock" }, prepare: ({ title, inStock }) => ({ title, subtitle: inStock ? "In stock" : "Sold out" }) },
        }),
      ],
    }),
    defineField({
      name: "colours",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "colour",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "hex", type: "string", description: "e.g. #0b0b0b", validation: (r) => r.regex(/^#[0-9a-fA-F]{6}$/) }),
          ],
        }),
      ],
    }),
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "newDrop", title: "New drop", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", subtitle: "price", media: "images.0" } },
});
