# Carwo Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Carwo's bold, animated streetwear showcase + lookbook site where shoppers fill a cart and send the order to the shop on WhatsApp, with products managed by staff in a Sanity admin panel.

**Architecture:** Next.js App Router site reading content from Sanity through one data module (`lib/sanity/data.ts`) that can switch to local fixtures (`CARWO_FIXTURES=1`) so dev and tests run before a Sanity account exists. Cart state and WhatsApp formatting are pure, unit-tested modules; motion lives in small reusable components that all respect reduced motion.

**Tech Stack:** Next.js 15 (App Router, TypeScript), Tailwind CSS v4, Sanity v3 + `next-sanity`, Zustand, GSAP + ScrollTrigger, Lenis, Framer Motion (`motion`), Vitest + Testing Library, Playwright, Vercel.

**Spec:** `docs/superpowers/specs/2026-11-09-carwo-website-design.md`

## Global Constraints

- No 3D/WebGL. Motion and 2.5D (parallax/layered) effects only.
- No online payment, customer accounts or stock reservation.
- Colours: ink `#0B0B0B`, paper `#F2F0EA`, accent `#C6FF00` (default; swap to match logo), WhatsApp green `#25D366`.
- Fonts (via `next/font/google`): display **Anton**, body **Inter**.
- `prefers-reduced-motion: reduce` → no smooth scroll, pinning, parallax, split-text; simple fades only.
- Custom cursor and magnetic buttons only on `(hover: hover) and (pointer: fine)`.
- Cart persists in `localStorage` key `carwo-cart`; no login.
- Content revalidation: `revalidate = 60` plus on-demand webhook.
- Mobile-first; test at 390×844 and 1440×900.
- Lighthouse mobile performance and accessibility ≥ 85.
- Node ≥ 20. Package manager: npm.

## Review Focus

1. **WhatsApp numbers typed with `+`, spaces or dashes** (`+254 712-345 678`) → link must use digits only (`254712345678`); fewer than 8 digits → treated as not set (button hidden). Tested in Task 4.
2. **Product names with `&`, `#`, `?`, emoji or newlines** → message arrives intact in WhatsApp (fully URL-encoded). Tested in Task 4.
3. **`localStorage` corrupted or unavailable** (private mode, bad JSON) → cart starts empty, site doesn't crash. Tested in Task 3.
4. **Quantity limits** → quantity clamps to 1–10; merging the same item never exceeds 10. Tested in Task 3.
5. **Product with every size out of stock** → card shows "Sold out", product page Add to cart disabled. Tested in Task 7.

---

### Task 1: Figma style kit and key screens (design gate)

Requires the Figma connector. No code.

**Files:** none in repo. Record the Figma file URL in `docs/figma.md`.

- [ ] **Step 1:** Create a Figma file "Carwo — Website". Page "Style kit": colour styles (Global Constraints), text styles (Anton display 160/96/64/40, Inter 18/16/14), button (primary accent, WhatsApp green, ghost), product card (default, hover, sold out), header (with cart count), cart drawer, badges (New, Sold out), marquee band.
- [ ] **Step 2:** Page "Screens": Home, Shop, Product, Lookbook, Cart drawer open, each at 390 px and 1440 px frames. Use the client's logo/photos if in the folder, else neutral placeholders labelled "PHOTO".
- [ ] **Step 3:** Annotate motion on each frame with sticky notes (effect name from spec §4).
- [ ] **Step 4:** Share the link with the user and **stop until they approve**. Apply requested changes, then write `docs/figma.md` with the file URL and the approved accent colour.

---

### Task 2: Project scaffold, tokens and layout shell

**Files:**
- Create: Next.js app at repo root (`app/`, `package.json`, `tsconfig.json`, etc.), `app/globals.css`, `app/(site)/layout.tsx`, `app/(site)/page.tsx` (placeholder), `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `components/layout/AnnouncementBar.tsx`, `vitest.config.ts`, `playwright.config.ts`, `e2e/shell.spec.ts`, `.gitignore`, `.env.example`
- Public assets: `public/brand/logo.svg` (client logo; temporary text wordmark if missing)

**Interfaces:**
- Produces: Tailwind tokens `ink`, `paper`, `accent`, `wa`; font CSS vars `--font-display`, `--font-body`; `<Header cartSlot={ReactNode} />`; `<Footer />` with static links for now; Task 3 changes it to `<Footer settings={SiteSettings} />`.

- [ ] **Step 1:** `git init`; `npx create-next-app@15 . --ts --tailwind --app --eslint --no-src-dir --import-alias "@/*"`; install `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test`; `npx playwright install chromium`.
- [ ] **Step 2:** Add scripts: `"test": "vitest run"`, `"e2e": "playwright test"`. Playwright config: projects `mobile` (390×844) and `desktop` (1440×900), `webServer` runs `npm run dev` with env `CARWO_FIXTURES=1`.
- [ ] **Step 3: Write failing e2e** `e2e/shell.spec.ts`:
  - `header shows logo linking home and nav links` → `getByRole('link', { name: 'Carwo home' })` has `href="/"`; links `Shop`, `Lookbook`, `About` visible (desktop) / inside menu button `Menu` (mobile).
  - `footer shows Instagram and WhatsApp links` → `getByRole('contentinfo')` contains links named `Instagram` and `WhatsApp`.
- [ ] **Step 4:** Run `npm run e2e -- e2e/shell.spec.ts` → FAIL.
- [ ] **Step 5:** Implement tokens in `globals.css` (`@theme`), fonts in `app/(site)/layout.tsx`, Header (sticky, ink background, logo, nav, mobile menu button, empty slot on the right for the cart button), Footer, film-grain overlay (CSS SVG noise, `pointer-events: none`, opacity 0.06).
- [ ] **Step 6:** Run e2e → PASS. Run `npm run build` → succeeds.
- [ ] **Step 7:** Commit `feat: scaffold Next.js app with Carwo tokens and layout shell`.

---

### Task 3: Content model — types, fixtures, Sanity schemas, data module, Studio

**Files:**
- Create: `lib/types.ts`, `lib/sanity/client.ts`, `lib/sanity/image.ts`, `lib/sanity/queries.ts`, `lib/sanity/fixtures.ts`, `lib/sanity/data.ts`, `lib/format.ts`, `sanity/schemas/{product,category,lookbookStory,siteSettings,index}.ts`, `sanity.config.ts`, `app/studio/[[...tool]]/page.tsx`, `app/api/revalidate/route.ts`
- Test: `lib/sanity/data.test.ts`, `lib/format.test.ts`, `app/api/revalidate/route.test.ts`
- Modify: `components/layout/Footer.tsx` (take `settings`), `app/(site)/layout.tsx` (fetch settings), `.env.example`

**Interfaces:**
- Produces (`lib/types.ts`):
  ```ts
  type Img = { url: string; alt: string; lqip?: string; width: number; height: number }
  type Size = { label: string; inStock: boolean }
  type Colour = { name: string; hex: string }
  type Category = { _id: string; title: string; slug: string; order: number }
  type Product = { _id: string; name: string; slug: string; price: number;
    category: { title: string; slug: string }; collection?: { title: string; slug: string };
    images: Img[]; sizes: Size[]; colours: Colour[]; description?: string;
    featured: boolean; newDrop: boolean }
  type LookbookStory = { _id: string; title: string; slug: string; cover: Img;
    season?: string; intro?: string; slides: { image: Img; caption?: string }[] }
  type SiteSettings = { whatsappNumber?: string; currencyCode: string; currencySymbol: string;
    instagramUrl?: string; heroImage?: Img; announcement?: string;
    address?: string; mapUrl?: string; hours?: string }
  ```
- Produces (`lib/sanity/data.ts`, all `async`): `getSettings(): SiteSettings`, `getCategories(): Category[]`, `getProducts(opts?: { category?: string; featured?: boolean; newDrop?: boolean }): Product[]`, `getProduct(slug: string): Product | null`, `getProductsByIds(ids: string[]): Product[]`, `getStories(): LookbookStory[]`, `getStory(slug: string): LookbookStory | null`. When `process.env.CARWO_FIXTURES === '1'` or Sanity env vars are missing, read from `fixtures.ts`.
- Produces (`lib/format.ts`): `formatPrice(amount: number, s: Pick<SiteSettings,'currencySymbol'>): string` → `"KSh 2,500"` (symbol, space, `en-US` grouping, no decimals). `isSoldOut(p: Product): boolean` → true when no size is in stock.

- [ ] **Step 1: Write failing tests**
  - `formatPrice(2500, {currencySymbol:'KSh'}) === 'KSh 2,500'`; `formatPrice(11500, …) === 'KSh 11,500'`.
  - `isSoldOut` true for `sizes: [{label:'M',inStock:false}]`, false if any in stock, true for `sizes: []`.
  - Fixtures mode: `getProducts({category:'tees'})` returns only tees; `getProduct('nope')` → `null`; `getProductsByIds([id1,'missing'])` returns 1 product; `getSettings().currencySymbol === 'KSh'`.
  - Revalidate route: POST without valid `SANITY_REVALIDATE_SECRET` signature → 401; valid → 200 and calls `revalidatePath('/', 'layout')` (mock `next/cache`, use `parseBody` from `next-sanity/webhook`).
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Fixtures: settings (WhatsApp `+254 700 000 000`, KSh), 4 categories (tees, hoodies, bottoms, accessories), 10 products (≥2 `newDrop`, ≥3 `featured`, one fully sold out named `Sold Out Hoodie`, one named `Tee & Co. #1` for encoding tests), 2 lookbook stories × 5 slides. Fixture image URLs point to `/fixtures/*.jpg` (client photos if provided, else generated solid placeholders).
- [ ] **Step 4:** Sanity schemas per spec §6 (`siteSettings` as singleton via structure tool; `sizes` array of `{label, inStock}`; images with required `alt`). GROQ queries project fields to match `lib/types.ts` exactly (`"slug": slug.current`, images → `asset->url`, `asset->metadata.lqip`, dimensions). Studio route via `NextStudio`. Env: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_REVALIDATE_SECRET`. All site pages export `revalidate = 60`.
- [ ] **Step 5:** `npm test` → PASS; `npm run e2e` still PASS; `npm run build` OK.
- [ ] **Step 6:** Commit `feat: add content model, fixtures, Sanity studio and data layer`.

---

### Task 4: WhatsApp message builder

**Files:**
- Create: `lib/whatsapp.ts`, `lib/cart/types.ts`
- Test: `lib/whatsapp.test.ts`

**Interfaces:**
- Consumes: `formatPrice`, `SiteSettings`, `Product` (Task 3); `CartLine` (Task 5 — define the type in `lib/cart/types.ts` in this task so it exists first):
  ```ts
  type CartLine = { key: string; productId: string; slug: string; name: string;
    size: string; colour: string; quantity: number; unitPrice: number;
    image?: string; unavailable?: boolean }
  ```
- Produces:
  - `normalizeWhatsAppNumber(raw?: string): string | null` — digits only; `null` if fewer than 8 digits or empty.
  - `buildOrderMessage(lines: CartLine[], customer: { name?: string; method?: 'Delivery' | 'Pickup' }, settings: SiteSettings): string`
  - `buildProductEnquiry(product: Pick<Product,'name'>, pageUrl: string): string` → `Hi Carwo! I'm interested in ${name}: ${pageUrl}`
  - `buildWhatsAppUrl(number: string, text: string): string` → `https://wa.me/${number}?text=${encodeURIComponent(text)}`

- [ ] **Step 1: Write failing tests** with lines `1× Oversized Tee/Black/L @2500` and `2× Cargo Pant/Olive/M @4500`:
  - Message equals exactly:
    ```
    Hi Carwo! I'd like to order:
    1× Oversized Tee — Black — L — KSh 2,500
    2× Cargo Pant — Olive — M — KSh 9,000
    Total: KSh 11,500
    ```
  - With `{name:'Amina', method:'Pickup'}` appends `Name: Amina` then `Delivery/Pickup: Pickup`; blank/whitespace name omitted.
  - Lines with `unavailable: true` are excluded from lines and total.
  - `normalizeWhatsAppNumber('+254 712-345 678') === '254712345678'`; `('123')` → `null`; `(undefined)` → `null`.
  - URL for name `Tee & Co. #1 🔥` decodes back (`decodeURIComponent(new URL(u).searchParams.get('text'))`) to the original message; raw URL contains no literal `&` after `?text=` except encoded.
- [ ] **Step 2:** `npx vitest run lib/whatsapp.test.ts` → FAIL.
- [ ] **Step 3:** Implement. Lines joined with `\n`; line totals = `quantity * unitPrice`.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: add WhatsApp order message builder`.

---

### Task 5: Cart store and reconciliation

**Files:**
- Create: `lib/cart/store.ts`, `lib/cart/reconcile.ts`
- Test: `lib/cart/store.test.ts`, `lib/cart/reconcile.test.ts`

**Interfaces:**
- Consumes: `CartLine` (Task 4), `Product` (Task 3).
- Produces:
  - `lineKey(productId: string, size: string, colour: string): string` → `${productId}|${size}|${colour}`
  - `useCart` (Zustand + `persist`, name `carwo-cart`, only `lines` persisted): `{ lines: CartLine[]; isOpen: boolean; add(item: Omit<CartLine,'key'|'quantity'|'unavailable'>, qty?: number): void; setQuantity(key: string, qty: number): void; remove(key: string): void; clear(): void; open(): void; close(): void }`
  - `cartCount(lines: CartLine[]): number`, `cartTotal(lines: CartLine[]): number` (excludes `unavailable`)
  - `reconcileCart(lines: CartLine[], products: Product[], symbol = 'KSh'): { lines: CartLine[]; notices: string[] }`

- [ ] **Step 1: Write failing tests**
  - `add` same product/size/colour twice → one line, quantity 2; different size → two lines.
  - Quantity clamps: `setQuantity(k, 0)` → 1, `setQuantity(k, 99)` → 10; `add` with qty 8 onto existing 5 → 10.
  - `add` calls `open()` (isOpen true).
  - `cartCount` sums quantities; `cartTotal` ignores `unavailable` lines.
  - Storage: with `localStorage['carwo-cart'] = '{bad json'` the store hydrates to `lines: []` without throwing; with `localStorage.setItem` throwing, `add` still updates state (use a custom `createJSONStorage` wrapper that try/catches).
  - `reconcileCart`: product missing → line removed, notice `"<name> is no longer available and was removed."`; price changed 2500→3000 → `unitPrice` 3000, notice `"<name> price updated to KSh 3,000."`; size now out of stock → `unavailable: true`, notice `"<name> (<size>) is sold out."`; unchanged → no notices.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: add persistent cart store and reconciliation`.

---

### Task 6: Motion primitives

**Files:**
- Create: `components/motion/{useMotionPrefs.ts,SmoothScroll.tsx,Reveal.tsx,SplitText.tsx,Parallax.tsx,Marquee.tsx,MagneticButton.tsx,Cursor.tsx,PageTransition.tsx,HorizontalScroll.tsx,PinnedStory.tsx}`
- Modify: `app/(site)/layout.tsx` (wrap with `SmoothScroll`, `PageTransition`, mount `Cursor`)
- Create: `app/(site)/dev/motion/page.tsx` (demo page, `notFound()` in production)
- Test: `components/motion/useMotionPrefs.test.ts`, `e2e/motion.spec.ts`

**Interfaces:**
- Produces:
  - `useMotionPrefs(): { reduced: boolean; finePointer: boolean }`
  - `<SmoothScroll>{children}</SmoothScroll>` (Lenis synced to GSAP ticker + ScrollTrigger; disabled when `reduced`)
  - `<Reveal as?: ElementType; delay?: number; variant?: 'fade-up' | 'mask'>` 
  - `<SplitText text: string; as?: ElementType; className?: string>` (words/chars split into spans; full text kept in `aria-label`, spans `aria-hidden`)
  - `<Parallax speed?: number>` (−1..1; 0 when reduced)
  - `<Marquee items: string[]; speed?: number>` (CSS animation; paused when reduced)
  - `<MagneticButton>` (passes through props; effect only when `finePointer && !reduced`)
  - `<Cursor />` (renders nothing unless `finePointer && !reduced`)
  - `<PageTransition>` (Framer `AnimatePresence` keyed on pathname; opacity-only when reduced)
  - `<HorizontalScroll>` and `<PinnedStory slides: ReactNode[]>` (GSAP pin; stacked vertical layout when reduced)

- [ ] **Step 1: Write failing tests**
  - Unit: `useMotionPrefs` returns `reduced: true` when `matchMedia('(prefers-reduced-motion: reduce)')` matches (mock `matchMedia`).
  - e2e on `/dev/motion`: `SplitText` headline has accessible name equal to full text; with `page.emulateMedia({ reducedMotion: 'reduce' })` the `<html>` has no `lenis` class and `[data-pinned]` elements have no `pin-spacer` parent; on mobile project `[data-cursor]` is absent.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Install `gsap lenis motion`; implement. Register ScrollTrigger once in `SmoothScroll`; kill triggers on unmount (`useGSAP` from `@gsap/react`).
- [ ] **Step 4:** Run unit + e2e → PASS. Manually scroll the demo page in the browser preview at both sizes.
- [ ] **Step 5:** Commit `feat: add motion primitives with reduced-motion support`.

---

### Task 7: Shop grid and product page

**Files:**
- Create: `app/(site)/shop/page.tsx`, `app/(site)/product/[slug]/page.tsx`, `components/shop/{ProductCard.tsx,ProductGrid.tsx,CategoryFilter.tsx,Gallery.tsx,VariantPicker.tsx,AddToCart.tsx,AskOnWhatsApp.tsx,SanityImage.tsx}`, `components/cart/CartButton.tsx`
- Modify: `components/layout/Header.tsx` (render `CartButton` in the cart slot)
- Test: `e2e/shop.spec.ts`

**Interfaces:**
- Consumes: `getProducts`, `getCategories`, `getProduct`, `getSettings`, `formatPrice`, `isSoldOut` (Task 3); `useCart().add` (Task 5); `normalizeWhatsAppNumber`, `buildProductEnquiry`, `buildWhatsAppUrl` (Task 4); `Reveal`, `MagneticButton` (Task 6).
- Produces: `<ProductCard product: Product; symbol: string />` (reused by Home in Task 9).

- [ ] **Step 1: Write failing e2e**
  - `/shop` lists all fixture products; clicking filter `Tees` updates URL to `/shop?category=tees` and shows only tees; `All` resets.
  - `Sold Out Hoodie` card shows text `Sold out`; its product page has `Add to cart` disabled.
  - Product page: out-of-stock size button is `disabled`; selecting colour + size then `Add to cart` opens a dialog named `Cart` (cart drawer stub acceptable until Task 8 — assert `useCart` count via header badge text `1`).
  - `Add to cart` without size selected shows `Choose a size` and adds nothing.
  - `Ask about this on WhatsApp` link `href` starts with `https://wa.me/254700000000?text=`.
  - Unknown slug `/product/nope` → 404 page.
- [ ] **Step 2:** `npm run e2e -- e2e/shop.spec.ts` → FAIL.
- [ ] **Step 3:** Implement. Category filter uses `searchParams` (server-rendered). Card hover/tap swaps to `images[1]` if present. `SanityImage` wraps `next/image` with `placeholder="blur"` from `lqip` and a branded fallback when `images` is empty. Header gets a `CartButton` showing `cartCount` with a bounce (Framer) on change. Add `generateStaticParams` + `generateMetadata` for products.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: add shop grid, filters and product page`.

---

### Task 8: Cart drawer and WhatsApp ordering

**Files:**
- Create: `components/cart/{CartDrawer.tsx,CartLineRow.tsx,OrderForm.tsx}`, `app/api/products/route.ts` (GET `?ids=a,b` → `Product[]` via `getProductsByIds`)
- Modify: `app/(site)/layout.tsx` (mount drawer, pass settings)
- Test: `e2e/cart.spec.ts`

**Interfaces:**
- Consumes: `useCart`, `cartTotal`, `reconcileCart` (Task 5); `buildOrderMessage`, `buildWhatsAppUrl`, `normalizeWhatsAppNumber` (Task 4); `formatPrice` (Task 3).

- [ ] **Step 1: Write failing e2e**
  - Add 2 items → open drawer → total equals sum; `+`/`−` change quantity; `Remove` deletes line; empty cart shows `Your cart is empty` and a `Shop now` link.
  - Fill name `Amina`, choose `Pickup`; `Order on WhatsApp` link `href` decoded contains `Name: Amina` and `Total: KSh`.
  - Cart survives reload.
  - Seed `localStorage['carwo-cart']` with a line whose `productId` doesn't exist → opening drawer removes it and shows the notice text.
  - With fixture settings `whatsappNumber` blank (env `CARWO_FIXTURE_NO_WA=1`), the WhatsApp button is absent and a `Contact us` link to `/about` shows.
  - `Escape` closes the drawer; focus returns to the cart button.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement drawer as an accessible dialog (Framer slide from right, focus trap, scroll lock). On open, fetch `/api/products?ids=…` and apply `reconcileCart`, write back lines, show notices. `Clear cart` button with confirm. The WhatsApp button is a plain `<a target="_blank" rel="noopener">`.
- [ ] **Step 4:** Run → PASS; `npm test` still PASS.
- [ ] **Step 5:** Commit `feat: add cart drawer with WhatsApp ordering`.

---

### Task 9: Home page

**Files:**
- Modify: `app/(site)/page.tsx`
- Create: `components/home/{Hero.tsx,NewDropStrip.tsx,FeaturedCollections.tsx,LookbookTeaser.tsx,SocialCta.tsx}`
- Test: `e2e/home.spec.ts`

**Interfaces:**
- Consumes: `getSettings`, `getProducts({newDrop:true})`, `getProducts({featured:true})`, `getStories` (Task 3); `ProductCard` (Task 7); `SplitText`, `Parallax`, `Marquee`, `HorizontalScroll`, `Reveal`, `MagneticButton` (Task 6).

- [ ] **Step 1: Write failing e2e**
  - `h1` accessible name `Carwo`; hero image visible; `Shop the drop` link → `/shop`.
  - "New Drop" section lists every `newDrop` fixture product.
  - Lookbook teaser links to `/lookbook`; Social CTA has `Instagram` and `WhatsApp` links.
  - Reduced motion: page renders all sections with no `pin-spacer`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement per spec §2/§4: giant split CARWO wordmark that separates on scroll over a parallax hero photo (`settings.heroImage`); announcement marquee; horizontal-scroll New Drop strip (vertical on reduced motion); featured collections grid with mask reveals; lookbook teaser; social CTA. Hero image `priority`.
- [ ] **Step 4:** Run → PASS. Check in browser preview at both sizes.
- [ ] **Step 5:** Commit `feat: build animated home page`.

---

### Task 10: Lookbook

**Files:**
- Create: `app/(site)/lookbook/page.tsx`, `app/(site)/lookbook/[slug]/page.tsx`, `components/lookbook/Story.tsx`
- Test: `e2e/lookbook.spec.ts`

**Interfaces:**
- Consumes: `getStories`, `getStory` (Task 3); `PinnedStory`, `SplitText`, `Parallax` (Task 6).

- [ ] **Step 1: Write failing e2e**
  - `/lookbook` shows each story title as a heading and every slide image (by alt).
  - `/lookbook/<slug>` shows one story; unknown slug → 404.
  - Reduced motion: slides stack vertically (no `pin-spacer`).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement: each story is a full-screen pinned sequence; title type slides across; captions fade per slide.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: add lookbook stories`.

---

### Task 11: About/Contact, SEO and performance pass

**Files:**
- Create: `app/(site)/about/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `app/(site)/not-found.tsx`
- Modify: page `generateMetadata` where missing
- Test: `e2e/about.spec.ts`, `e2e/seo.spec.ts`

- [ ] **Step 1: Write failing e2e**
  - `/about` shows address, hours, `Open in Maps` link (`settings.mapUrl`), WhatsApp + Instagram links.
  - `/sitemap.xml` contains `/shop`, `/lookbook`, `/about` and every product URL.
  - Each page has a unique `<title>` ending in `| Carwo` and an `og:image` meta.
  - Branded 404 page has a `Back to shop` link.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement. Base URL from `NEXT_PUBLIC_SITE_URL`.
- [ ] **Step 4:** Run full `npm test && npm run e2e` → PASS. Run Lighthouse (mobile) on `/`, `/shop`, a product page against `npm run build && npm start`: performance and accessibility ≥ 85; fix regressions (image sizes, font display, lazy GSAP imports) until met.
- [ ] **Step 5:** Commit `feat: add about page, SEO and performance fixes`.

---

### Task 12: Connect real Sanity project and deploy to Vercel

Needs the user to create free Sanity and Vercel accounts (guide them; never enter their passwords).

- [ ] **Step 1:** User creates Sanity project; set `NEXT_PUBLIC_SANITY_PROJECT_ID`/`DATASET` in `.env.local`; add `http://localhost:3000` and the production URL to Sanity CORS origins.
- [ ] **Step 2:** Write `scripts/seed.ts` that uploads the client's photos and creates the fixture categories/settings in Sanity (`npx sanity exec scripts/seed.ts --with-user-token`); run it; staff add real products in `/studio`.
- [ ] **Step 3:** Run `npm run build && npm start` without `CARWO_FIXTURES`; verify home, shop, product, cart→WhatsApp link with real data.
- [ ] **Step 4:** Push to GitHub, import into Vercel, set env vars (incl. `SANITY_REVALIDATE_SECRET`, `NEXT_PUBLIC_SITE_URL`); create Sanity webhook → `https://<site>/api/revalidate`. Edit a product price in Studio and confirm the live site updates within ~1 minute.
- [ ] **Step 5:** Connect custom domain if the client has one. Write `docs/staff-guide.md` (how to log in, add a product, mark a size sold out, change the WhatsApp number). Commit `docs: add staff guide`.
