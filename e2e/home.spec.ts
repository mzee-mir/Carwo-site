import { test, expect } from "@playwright/test";

test("hero shows the wordmark and a shop link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Carwo" })).toBeVisible();
  await expect(page.getByRole("img", { name: /model wearing the carwo/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Shop the drop" })).toHaveAttribute("href", "/shop");
});

test("new drop section lists every new-drop product", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "New drop" });
  for (const name of ["Oversized Tee", "Cargo Pant", "Heavy Hoodie"]) {
    await expect(section.getByRole("heading", { name })).toBeAttached();
  }
});

test("lookbook teaser and social CTA link out", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Open the lookbook" })).toHaveAttribute("href", "/lookbook");
  const cta = page.getByRole("region", { name: "Order on WhatsApp" });
  await expect(cta.getByRole("link", { name: "Chat on WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\/254700000000/);
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
