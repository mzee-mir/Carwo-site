import { test, expect } from "@playwright/test";

test("hero shows the wordmark and a shop link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Carwo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Shop the drop" })).toHaveAttribute("href", "/shop");
});

test("hero shows the shop photo, loaded and uncovered", async ({ page }) => {
  await page.goto("/");
  const hero = page.getByRole("region", { name: "Intro" });
  const photo = hero.getByRole("img", { name: /inside the carwo shop/i });
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth)).toBeGreaterThan(0);
  await page.waitForTimeout(800);
  await expect(hero.locator("video")).toHaveCount(0); // no video set → nothing covers the photo
});

test("new drop section lists every new-drop product", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "New drop" });
  for (const name of ["Oversized Tee", "Cargo Pant", "Heavy Hoodie"]) {
    await expect(section.getByRole("heading", { name })).toBeAttached();
  }
});

test("new drop row can be swiped on phones to reach every product", async ({ page, isMobile }) => {
  test.skip(!isMobile, "desktop uses scroll-driven pinning instead");
  await page.goto("/");
  const row = page.getByRole("region", { name: "New drop" }).locator("[data-pinned]");
  await row.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 100));
  const scrolled = await row.evaluate(async (el) => {
    el.scrollLeft = 10_000;
    await new Promise((r) => setTimeout(r, 100));
    return { scrollLeft: el.scrollLeft, overflows: el.scrollWidth > el.clientWidth, overflowX: getComputedStyle(el).overflowX };
  });
  expect(scrolled.overflows).toBe(true);
  expect(["auto", "scroll"]).toContain(scrolled.overflowX); // a finger can only swipe a scrollable box
  expect(scrolled.scrollLeft).toBeGreaterThan(0);
  await expect(page.getByRole("link", { name: "SEE ALL →" })).toBeInViewport();
});

test("new drop cards sit side by side in one row", async ({ page }) => {
  await page.goto("/");
  const boxes = await page
    .getByRole("region", { name: "New drop" })
    .getByRole("article")
    .evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => ({ top: Math.round(r.top), left: Math.round(r.left) })));
  expect(boxes).toHaveLength(3);
  expect(new Set(boxes.map((b) => b.top)).size).toBe(1); // same line
  expect(boxes.map((b) => b.left)).toEqual([...boxes.map((b) => b.left)].sort((a, b) => a - b)); // left to right
  expect(boxes[1].left).toBeGreaterThan(boxes[0].left);
});

test("lookbook teaser and social CTA link out", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Open the lookbook" })).toHaveAttribute("href", "/lookbook");
  const cta = page.getByRole("region", { name: "Order on WhatsApp" });
  await expect(cta.getByRole("link", { name: "Chat on WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\/252610000000/);
  await expect(cta.getByRole("link", { name: "Instagram" })).toBeVisible();
});

test("reduced motion renders every section without pinning", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const name of ["New drop", "Collections", "Lookbook", "Order on WhatsApp"]) {
    await expect(page.getByRole("region", { name })).toBeAttached();
  }
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});
