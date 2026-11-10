import type { Branch } from "./types";

/** Google Maps link for a branch: exact pin when set, otherwise its address; null when neither exists. */
export function branchMapUrl(b: Pick<Branch, "lat" | "lng" | "address">): string | null {
  const base = "https://www.google.com/maps/search/?api=1&query=";
  if (typeof b.lat === "number" && typeof b.lng === "number") return `${base}${b.lat},${b.lng}`;
  if (b.address) return base + encodeURIComponent(b.address);
  return null;
}
