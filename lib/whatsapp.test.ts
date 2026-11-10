import { describe, expect, it } from "vitest";
import type { CartLine } from "./cart/types";
import type { SiteSettings } from "./types";
import { buildOrderMessage, buildProductEnquiry, buildWhatsAppUrl, normalizeWhatsAppNumber, orderNumberFor } from "./whatsapp";

const settings: SiteSettings = { currencyCode: "KES", currencySymbol: "KSh", whatsappNumber: "+254 700 000 000" };
const line = (name: string, colour: string, size: string, quantity: number, unitPrice: number, extra: Partial<CartLine> = {}): CartLine => ({
  key: `${name}|${size}|${colour}`, productId: name, slug: name, name, size, colour, quantity, unitPrice, ...extra,
});
const lines = [line("Oversized Tee", "Black", "L", 1, 2500), line("Cargo Pant", "Olive", "M", 2, 4500)];

describe("buildOrderMessage", () => {
  it("formats the order exactly", () => {
    expect(buildOrderMessage(lines, {}, settings)).toBe(
      ["Hi Carwo! I'd like to order:", "1× Oversized Tee — Black — L — KSh 2,500", "2× Cargo Pant — Olive — M — KSh 9,000", "Total: KSh 11,500"].join("\n"),
    );
  });

  it("appends name and delivery method when given", () => {
    const msg = buildOrderMessage(lines, { name: "Amina", method: "Pickup" }, settings);
    expect(msg.endsWith("Total: KSh 11,500\nName: Amina\nDelivery/Pickup: Pickup")).toBe(true);
  });

  it("omits a blank name", () => {
    expect(buildOrderMessage(lines, { name: "   " }, settings)).not.toContain("Name:");
  });

  it("excludes unavailable lines from items and total", () => {
    const msg = buildOrderMessage([...lines, line("Hoodie", "Black", "S", 1, 5000, { unavailable: true })], {}, settings);
    expect(msg).not.toContain("Hoodie");
    expect(msg).toContain("Total: KSh 11,500");
  });
});

describe("branch in the order", () => {
  it("adds the chosen branch before the name", () => {
    const msg = buildOrderMessage(lines, { branch: "Carwo Bosaso", name: "Amina" }, settings);
    expect(msg.endsWith("Total: KSh 11,500\nBranch: Carwo Bosaso\nName: Amina")).toBe(true);
  });

  it("sends to the branch's own WhatsApp, falling back to the main number", () => {
    expect(orderNumberFor({ whatsappNumber: "+252 61 111 2222" }, settings)).toBe("252611112222");
    expect(orderNumberFor({ whatsappNumber: "" }, settings)).toBe("254700000000");
    expect(orderNumberFor(undefined, settings)).toBe("254700000000");
    expect(orderNumberFor(undefined, { ...settings, whatsappNumber: undefined })).toBeNull();
  });
});

describe("normalizeWhatsAppNumber", () => {
  it("keeps digits only", () => {
    expect(normalizeWhatsAppNumber("+254 712-345 678")).toBe("254712345678");
  });
  it("returns null for too-short or missing numbers", () => {
    expect(normalizeWhatsAppNumber("123")).toBeNull();
    expect(normalizeWhatsAppNumber(undefined)).toBeNull();
    expect(normalizeWhatsAppNumber("")).toBeNull();
  });
});

describe("buildWhatsAppUrl", () => {
  it("round-trips names with special characters and emoji", () => {
    const text = buildOrderMessage([line("Tee & Co. #1 🔥", "Black", "M", 1, 2400)], {}, settings);
    const url = buildWhatsAppUrl("254700000000", text);
    expect(url.startsWith("https://wa.me/254700000000?text=")).toBe(true);
    expect(new URL(url).searchParams.get("text")).toBe(text);
    expect(url.split("?text=")[1]).not.toMatch(/[&#\s]/);
  });
});

describe("buildProductEnquiry", () => {
  it("names the product and links the page", () => {
    expect(buildProductEnquiry({ name: "Oversized Tee" }, "https://carwo.shop/product/oversized-tee")).toBe(
      "Hi Carwo! I'm interested in Oversized Tee: https://carwo.shop/product/oversized-tee",
    );
  });
});
