# Carwo Website — Design Spec

**Date:** 2026-11-09
**Status:** Awaiting review

## 1. Goal

A bold, animated streetwear **brand showcase + lookbook** for the clothing shop Carwo. Shoppers browse products and collections, build a cart, and send the order to the shop through **WhatsApp**. There is no online payment; buying happens in-store, on WhatsApp/Instagram, or via links.

### Success criteria
- Feels alive: smooth scroll, reveal, text and page-transition animation on every page.
- A shopper on a phone can go from landing → product → cart → pre-filled WhatsApp message in under a minute.
- Shop staff can add/edit products, stock and photos themselves through an admin panel, with changes live within ~1 minute.
- Lighthouse mobile performance and accessibility ≥ 85.
- Free (or near-free) to host.

### Decisions made
| Topic | Decision |
|---|---|
| Purpose | Showcase + lookbook, cart → WhatsApp ordering |
| Brand feel | Streetwear / bold |
| Assets | Client supplies real logo and product photos |
| Product updates | Admin panel (CMS) used by shop staff |
| 3D | None — motion and 2.5D (parallax/layered) effects only |
| Stack | Next.js (App Router, TypeScript) + Sanity CMS + Vercel |
| Design workflow | Figma first (once Figma is connected), then code |

### Assumptions (to confirm)
- Most visitors are on mobile.
- One WhatsApp business number receives all orders.
- English only; single currency (set in admin, e.g. KSh).
- No customer accounts, no online payment, no stock reservation.

### Out of scope
Online payment, customer accounts/order history, 3D models/WebGL, multiple languages, automatic inventory deduction on order.

## 2. Pages

| Route | Purpose | Key content |
|---|---|---|
| `/` | Home | Full-screen hero (giant CARWO wordmark that splits/reassembles on scroll over a parallax model photo); "New Drop" horizontal-scroll strip; featured collections; lookbook teaser; Instagram/WhatsApp CTA |
| `/shop` | Product grid | Category filter (tees, hoodies, bottoms, accessories, …), hover/tap image swap, "New" and "Sold out" badges |
| `/product/[slug]` | Product detail | Image gallery, size + colour pickers (out-of-stock sizes shown but disabled), price, Add to cart, "Ask about this on WhatsApp" link |
| `/lookbook` | Editorial | Each collection is a full-screen scroll story: pinned images, moving type, captions |
| `/lookbook/[slug]` | Single story | Optional deep link to one collection story |
| `/about` | About + Contact | Brand story, shop address + map link, hours, WhatsApp, Instagram |
| `/studio` | Admin | Sanity Studio (staff only) |
| Cart drawer | Overlay on every page | Lines, quantities, total, optional name + delivery/pickup, **Order on WhatsApp** |

## 3. Visual direction

- **Colour:** near-black `#0B0B0B` and off-white `#F2F0EA` base, plus one loud accent (proposed high-voltage lime `#C6FF00` or safety orange `#FF5A1F`; final pick matched to the logo). WhatsApp button uses WhatsApp green.
- **Type:** heavy condensed display face (Google Fonts: Anton or Archivo Black) for headings; clean sans (Inter or Space Grotesk) for body.
- **Texture/details:** subtle film grain, oversized numbering, infinite marquee text bands, hard edges.
- **Layout:** full-bleed photography, one idea per screen, generous negative space between bold blocks.

## 4. Motion (no 3D)

| Effect | Where | Tool |
|---|---|---|
| Smooth (inertial) scroll | Whole site | Lenis |
| Scroll-triggered reveals (image clip/mask, fade-up) | All sections | GSAP ScrollTrigger |
| Split-text headline animation | Hero, section titles | GSAP (SplitText-style splitting) |
| Pinned scroll stories + horizontal scroll strip | Home "New Drop", Lookbook | GSAP ScrollTrigger pin |
| Layered parallax (2.5D depth) | Hero, lookbook | GSAP |
| Page transitions | Route changes | Framer Motion |
| Magnetic buttons, custom cursor | Desktop only | Framer Motion |
| Cart drawer slide + cart count bounce | Header/cart | Framer Motion |

**Reduced motion:** when `prefers-reduced-motion` is set, disable smooth scroll, pinning, parallax and split-text; keep simple fades. Custom cursor and magnetic effects are off on touch devices.

## 5. Cart & WhatsApp ordering

### Cart
- Client-side state (Zustand) persisted to `localStorage`; no login.
- Line item: `productId, slug, name, size, colour, quantity, unitPrice, image`.
- Adding an identical product/size/colour increments quantity.
- Header icon shows live count with a bounce on add.

### WhatsApp message
Button opens `https://wa.me/<number>?text=<url-encoded message>`. Message format:

```
Hi Carwo! I'd like to order:
1× Oversized Tee — Black — L — KSh 2,500
2× Cargo Pant — Olive — M — KSh 9,000
Total: KSh 11,500
Name: <optional>
Delivery/Pickup: <optional>
```

- Built by a pure function `buildWhatsAppMessage(cart, customer, settings)` so it can be unit-tested.
- Prices shown in cart are re-checked against current CMS data when the drawer opens; changed prices update with a notice.
- Cart is **not** cleared automatically after sending; a "Clear cart" action is offered.
- Product page also has "Ask about this on WhatsApp" (pre-filled with product name + link).

### Edge cases
- Product removed in CMS → dropped from cart with a short notice.
- Size marked out of stock after being added → line flagged, excluded from the message until changed.
- WhatsApp number not set → button hidden, contact link shown.
- Missing image → branded placeholder.

## 6. Admin panel (Sanity)

Sanity Studio embedded at `/studio`; staff log in with Google or email (free plan seats).

### Schemas
- **product:** name, slug, price, category (ref), collection (ref), images (ordered, with alt text), sizes `[{label, inStock}]`, colours `[{name, hex}]`, description, `featured`, `newDrop`.
- **category:** title, slug, order.
- **collection / lookbook story:** title, slug, cover image, season/year, ordered slides `[{image, caption}]`, intro text.
- **siteSettings (singleton):** WhatsApp number, currency code + symbol, Instagram URL, hero image, announcement bar text, shop address, map link, opening hours.

### Content delivery
- Data fetched with GROQ via `next-sanity`; pages use incremental revalidation (~60 s) plus an on-demand revalidate webhook from Sanity so edits appear quickly.
- Images served through Sanity's image CDN with responsive sizes and blur placeholders.

## 7. Architecture

```
app/
  (site)/layout.tsx        header, footer, cart drawer, smooth scroll, page transitions
  (site)/page.tsx          home
  (site)/shop/page.tsx
  (site)/product/[slug]/page.tsx
  (site)/lookbook/...
  (site)/about/page.tsx
  studio/[[...tool]]/page.tsx   Sanity Studio
  api/revalidate/route.ts  Sanity webhook
components/
  motion/                  Reveal, SplitText, Parallax, Marquee, MagneticButton, Cursor, PageTransition
  shop/                    ProductCard, ProductGrid, Filters, Gallery, SizePicker
  cart/                    CartDrawer, CartLine, CartButton
lib/
  cart/store.ts            Zustand store + persistence
  whatsapp.ts              buildWhatsAppMessage, buildWhatsAppUrl
  sanity/                  client, queries, image helper
sanity/schemas/            product, category, collection, siteSettings
```

Each unit has one job: motion components are presentational and reusable; cart logic and WhatsApp formatting are pure/testable and know nothing about UI; Sanity access is isolated in `lib/sanity`.

## 8. Figma workflow

Requires the Figma connector to be authorized.

1. **Style kit:** colour tokens, type scale, buttons, product card, header, cart drawer, badges.
2. **Key screens**, mobile (390 px) and desktop (1440 px): Home, Shop, Product, Lookbook, Cart drawer open.
3. Motion is annotated on frames (Figma can't show it); real motion reviewed in browser previews.
4. Client reviews/comments in Figma → approval → code.

## 9. Build order

1. Project setup, design tokens, layout shell (header/footer), smooth scroll, page transitions.
2. Sanity Studio + schemas; load client's real photos and a few products.
3. Shop grid + product page.
4. Cart drawer + WhatsApp ordering.
5. Home hero and scroll animations.
6. Lookbook stories.
7. About/Contact, SEO (metadata, Open Graph images, sitemap), performance pass.
8. Deploy to Vercel; connect custom domain if available.

## 10. Testing

- **Unit (Vitest):** cart store (add/merge/remove/quantity/total), `buildWhatsAppMessage` formatting and URL encoding, out-of-stock and removed-product handling.
- **End-to-end (Playwright), mobile + desktop:** browse → filter → product → add to cart → drawer → WhatsApp link contains expected text; reduced-motion mode renders without pinned/parallax effects.
- **Lighthouse:** mobile performance and accessibility ≥ 85.

## 11. Needed from the client

- Logo (SVG preferred) and product/model photos.
- WhatsApp number (international format) and currency.
- Brand accent colour, if one exists.
- Free Sanity and Vercel accounts (client creates; guided setup).
- Figma connector authorized.
