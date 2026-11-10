import { test, expect } from "@playwright/test";

test("shop lists every product and filters by category", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByRole("article")).toHaveCount(10);
  await page.getByRole("link", { name: "Tees", exact: true }).click();
  await expect(page).toHaveURL(/\/shop\?category=tees$/);
  await expect(page.getByRole("article")).toHaveCount(3);
  await page.getByRole("link", { name: "All", exact: true }).click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByRole("article")).toHaveCount(10);
});

test("sold-out product shows a badge and cannot be added", async ({ page }) => {
  await page.goto("/shop");
  const card = page.getByRole("article").filter({ hasText: "Sold Out Hoodie" });
  await expect(card.getByText("Sold out", { exact: true })).toBeVisible();
  await page.goto("/product/sold-out-hoodie");
  await expect(page.getByRole("button", { name: /add to cart/i })).toBeDisabled();
});

test("out-of-stock size is disabled and adding updates the cart count", async ({ page }) => {
  await page.goto("/product/oversized-tee");
  await expect(page.getByRole("heading", { level: 1, name: "Oversized Tee" })).toBeVisible();
  await expect(page.getByRole("button", { name: "XL", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Bone", exact: true }).click();
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: /add to cart/i }).click();
  await expect(page.getByRole("button", { name: /cart, 1 item/i })).toBeVisible();
});

test("adding without a size asks for one", async ({ page }) => {
  await page.goto("/product/oversized-tee");
  await page.getByRole("button", { name: /add to cart/i }).click();
  await expect(page.getByText("Choose a size")).toBeVisible();
  await expect(page.getByRole("button", { name: /cart, 0 items/i })).toBeVisible();
});

test("ask on WhatsApp links to the shop number", async ({ page }) => {
  await page.goto("/product/oversized-tee");
  const link = page.getByRole("link", { name: /ask about this on whatsapp/i });
  await expect(link).toHaveAttribute("href", /^https:\/\/wa\.me\/254700000000\?text=/);
});

test("unknown product returns 404", async ({ page }) => {
  const res = await page.goto("/product/nope");
  expect(res?.status()).toBe(404);
});
