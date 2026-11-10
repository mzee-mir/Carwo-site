"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "carwo",
  title: "Carwo admin",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Site settings is a single document: hide it from "create new"
    templates: (templates) => templates.filter((t) => t.schemaType !== "siteSettings"),
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Carwo")
          .items([
            S.listItem().title("Site settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.documentTypeListItem("product").title("Products"),
            S.documentTypeListItem("category").title("Categories"),
            S.documentTypeListItem("lookbookStory").title("Collections / Lookbook"),
            S.documentTypeListItem("branch").title("Branches / offices"),
          ]),
    }),
  ],
});
