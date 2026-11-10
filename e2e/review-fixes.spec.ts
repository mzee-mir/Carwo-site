import { test, expect } from "@playwright/test";

test("cart controls are at least 44px tap targets", async ({ page }) => {
  await page.goto("/product/oversized-tee");
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: /add to cart/i }).click();
  await page.getByRole("button", { name: "Increase Oversized Tee" }).click();
  const cart = page.getByRole("dialog", { name: "Cart" });
  for (const name of ["Increase Oversized Tee", "Decrease Oversized Tee", "Remove Oversized Tee", "Close cart"]) {
    const box = await cart.getByRole("button", { name }).boundingBox();
    expect(box, name).not.toBeNull();
    expect(box!.width, name).toBeGreaterThanOrEqual(44);
    expect(box!.height, name).toBeGreaterThanOrEqual(44);
  }
});

test("mobile menu closes on navigation and on Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "menu button is mobile-only");
  await page.goto("/shop");
  const nav = page.getByRole("navigation", { name: "Main" });
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(nav).toBeVisible();
  await page.getByRole("link", { name: "Carwo home" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(nav).toBeHidden();
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(nav).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
});
