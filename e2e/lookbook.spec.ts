import { test, expect } from "@playwright/test";

test("lookbook shows each story title and every slide", async ({ page }) => {
  await page.goto("/lookbook");
  await expect(page.getByRole("heading", { level: 1, name: "Lookbook" })).toBeVisible();
  for (const title of ["Street Season", "Night Shift"]) {
    await expect(page.getByRole("heading", { level: 2, name: title })).toBeAttached();
    for (let i = 1; i <= 5; i++) {
      await expect(page.getByRole("img", { name: `${title} look ${i}`, exact: true })).toBeAttached();
    }
  }
});

test("single story page and 404", async ({ page }) => {
  await page.goto("/lookbook/night-shift");
  await expect(page.getByRole("heading", { level: 1, name: "Night Shift" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Street Season" })).toHaveCount(0);
  const res = await page.goto("/lookbook/nope");
  expect(res?.status()).toBe(404);
});

test("reduced motion stacks the stories without pinning", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/lookbook");
  await expect(page.getByRole("heading", { level: 2, name: "Street Season" })).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});
