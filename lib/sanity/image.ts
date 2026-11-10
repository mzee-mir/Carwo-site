import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./client";

const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

/** URL for a raw Sanity image field (e.g. an image placed inside an article); null if it can't be resolved. */
export function imageUrl(source: unknown, width = 1400): string | null {
  if (!builder || !source || typeof source !== "object" || !("asset" in source)) return null;
  return builder.image(source as Parameters<typeof builder.image>[0]).width(width).auto("format").url();
}
