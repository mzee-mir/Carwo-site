import { test, expect } from "@playwright/test";

test("header shows logo linking home and nav links", async ({ page, isMobile }) => {
  await page.goto("/");
  const logo = page.getByRole("link", { name: "Carwo home" });
  await expect(logo).toHaveAttribute("href", "/");
  if (isMobile) {
    await page.getByRole("button", { name: "Menu" }).click();
  }
  const nav = page.getByRole("navigation", { name: "Main" });
  for (const name of ["Shop", "Lookbook", "About"]) {
    await expect(nav.getByRole("link", { name })).toBeVisible();
  }
});

test("footer shows Instagram and WhatsApp links", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "Instagram" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "WhatsApp" })).toBeVisible();
});
