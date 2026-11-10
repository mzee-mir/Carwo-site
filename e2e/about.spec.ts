import { test, expect } from "@playwright/test";

test("about page shows visit details and contact links", async ({ page }) => {
  await page.goto("/about");
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(main.getByText("Bosaso, Somalia")).toBeVisible();
  await expect(main.getByText("Mon–Sat · 10am–8pm")).toBeVisible();
  await expect(main.getByRole("link", { name: "Open in Maps" })).toHaveAttribute("href", "https://www.google.com/maps/search/?api=1&query=11.284851,49.177534");
  await expect(main.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\/252610000000/);
  await expect(main.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "https://instagram.com/carwo");
});

test("branded 404 page links back to the shop", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Back to shop" })).toHaveAttribute("href", "/shop");
});
