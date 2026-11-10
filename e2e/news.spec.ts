import { test, expect } from "@playwright/test";

test("news page lists posts and opens one", async ({ page }) => {
  await page.goto("/news");
  await expect(page.getByRole("heading", { level: 1, name: "News" })).toBeVisible();
  const posts = page.getByRole("article");
  await expect(posts).toHaveCount(3);
  const first = posts.first();
  const title = (await first.getByRole("heading").textContent())!.trim();
  await first.getByRole("link").first().click();
  await expect(page).toHaveURL(/\/news\/[a-z0-9-]+$/);
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  await expect(page.locator("time").first()).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}/);
  await expect(page.getByRole("main").locator("p").nth(1)).toBeVisible();
  await expect(page.getByRole("link", { name: "← All news" })).toHaveAttribute("href", "/news");
});

test("news posts use the new shop photos as covers", async ({ page }) => {
  for (const [slug, file] of [
    ["our-bosaso-shop-is-open", "news-bosaso-shop.jpg"],
    ["drop-01-is-here", "news-drop-01.jpg"],
  ]) {
    await page.goto(`/news/${slug}`);
    const cover = page.getByRole("main").getByRole("img").first();
    await expect.poll(() => cover.evaluate((i: HTMLImageElement) => decodeURIComponent(i.currentSrc || i.src)), slug).toContain(file);
    await expect.poll(() => cover.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth), slug).toBeGreaterThan(0);
  }
});

test("unknown post returns 404", async ({ page }) => {
  const res = await page.goto("/news/nope");
  expect(res?.status()).toBe(404);
});

test("News is in the main menu and the sitemap", async ({ page, isMobile, request }) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "News" })).toHaveAttribute("href", "/news");
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("/news</loc>");
  expect(xml).toMatch(/\/news\/[a-z0-9-]+<\/loc>/);
});
