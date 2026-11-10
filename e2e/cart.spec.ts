import { test, expect, type Page } from "@playwright/test";

async function addToCart(page: Page, slug: string, size: string) {
  await page.goto(`/product/${slug}`);
  await page.getByRole("button", { name: size, exact: true }).click();
  await page.getByRole("button", { name: /add to cart/i }).click();
  await expect(page.getByRole("dialog", { name: "Cart" })).toBeVisible();
}

test("drawer shows lines, updates quantities and total, removes lines", async ({ page }) => {
  await addToCart(page, "oversized-tee", "M");
  await page.getByRole("button", { name: "Close cart" }).click();
  await addToCart(page, "logo-tee", "L");
  const cart = page.getByRole("dialog", { name: "Cart" });
  await expect(cart.getByTestId("cart-total")).toHaveText("$47");
  await cart.getByRole("button", { name: "Increase Oversized Tee" }).click();
  await expect(cart.getByTestId("cart-total")).toHaveText("$72");
  await cart.getByRole("button", { name: "Decrease Oversized Tee" }).click();
  await expect(cart.getByTestId("cart-total")).toHaveText("$47");
  await cart.getByRole("button", { name: "Remove Logo Tee" }).click();
  await expect(cart.getByTestId("cart-total")).toHaveText("$25");
  await cart.getByRole("button", { name: "Remove Oversized Tee" }).click();
  await expect(cart.getByText("Your cart is empty")).toBeVisible();
  await expect(cart.getByRole("link", { name: "Shop now" })).toHaveAttribute("href", "/shop");
});

test("order button opens WhatsApp with the full order", async ({ page }) => {
  await addToCart(page, "oversized-tee", "M");
  const cart = page.getByRole("dialog", { name: "Cart" });
  await cart.getByLabel("Your name (optional)").fill("Amina");
  await cart.getByText("Pickup", { exact: true }).click();
  const href = await cart.getByRole("link", { name: /order on whatsapp/i }).getAttribute("href");
  expect(href).toMatch(/^https:\/\/wa\.me\/252610000000\?text=/);
  const text = new URL(href!).searchParams.get("text")!;
  expect(text).toContain("1× Oversized Tee — Black — M — $25");
  expect(text).toContain("Total: $25");
  expect(text).toContain("Name: Amina");
  expect(text).toContain("Delivery/Pickup: Pickup");
});

test("cart survives a reload", async ({ page }) => {
  await addToCart(page, "oversized-tee", "M");
  await page.reload();
  await expect(page.getByRole("button", { name: /cart, 1 item/i })).toBeVisible();
});

test("removed products are dropped with a notice", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "carwo-cart",
      JSON.stringify({ state: { lines: [{ key: "ghost|M|Black", productId: "ghost", slug: "ghost", name: "Ghost Tee", size: "M", colour: "Black", quantity: 1, unitPrice: 1000 }] }, version: 0 }),
    ),
  );
  await page.reload();
  await page.getByRole("button", { name: /cart, 1 item/i }).click();
  const cart = page.getByRole("dialog", { name: "Cart" });
  await expect(cart.getByText("Ghost Tee is no longer available and was removed.")).toBeVisible();
  await expect(cart.getByText("Your cart is empty")).toBeVisible();
});

test("Escape closes the drawer and returns focus to the cart button", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /cart, 0 items/i });
  await button.click();
  await expect(page.getByRole("dialog", { name: "Cart" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Cart" })).toHaveCount(0);
  await expect(button).toBeFocused();
});
