import { test, expect } from "@playwright/test";

test("sitemap lists main pages and every product", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/shop", "/lookbook", "/about", "/product/classic-fit", "/product/sky-blue-retro-jersey", "/product/wool-bomber-jacket", "/lookbook/night-shift"]) {
    expect(xml).toContain(`${path}</loc>`);
  }
});

test("robots.txt points to the sitemap and hides the studio", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toMatch(/Sitemap: .*\/sitemap\.xml/);
  expect(txt).toContain("Disallow: /studio");
});

test("each page has a unique title ending in | Carwo and an og:image", async ({ page }) => {
  const titles = new Set<string>();
  for (const path of ["/", "/shop", "/product/classic-fit", "/lookbook", "/lookbook/street-season", "/about"]) {
    await page.goto(path);
    // Next streams metadata, so wait for the title rather than reading it immediately
    await expect(page, path).toHaveTitle(/ \| Carwo$/);
    const title = await page.title();
    titles.add(title);
    await expect(page.locator('meta[property="og:image"]').first(), path).toHaveAttribute("content", /.+/);
  }
  expect(titles.size).toBe(6);
});
