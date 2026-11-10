import { test, expect } from "@playwright/test";

test("about page lists branches with map, hours and contact links", async ({ page }) => {
  await page.goto("/about");
  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
  const branches = main.getByRole("region", { name: "Our branches" });
  const card = branches.getByRole("article").filter({ has: page.getByRole("heading", { name: "Carwo Bosaso" }) });
  await expect(card).toBeVisible();
  await expect(card.getByText("Bosaso, Somalia")).toBeVisible();
  await expect(card.getByText("Mon–Sat · 10am–8pm")).toBeVisible();
  await expect(card.getByRole("link", { name: "Open in Maps" })).toHaveAttribute("href", "https://www.google.com/maps/search/?api=1&query=11.284851,49.177534");
  await expect(card.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\/252906715405/);
  await expect(main.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "https://instagram.com/carwo");
});

test("cart sends the order to the Bosaso branch", async ({ page }) => {
  await page.goto("/product/classic-fit");
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: /add to cart/i }).click();
  const cart = page.getByRole("dialog", { name: "Cart" });
  await expect(cart.getByText("Carwo Bosaso")).toBeVisible();
  const href = await cart.getByRole("link", { name: /order on whatsapp/i }).getAttribute("href");
  expect(new URL(href!).searchParams.get("text")).toContain("Branch: Carwo Bosaso");
});

test("branded 404 page links back to the shop", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Back to shop" })).toHaveAttribute("href", "/shop");
});
