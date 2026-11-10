import { test, expect } from "@playwright/test";

test("split headline keeps its full text as the accessible name", async ({ page }) => {
  await page.goto("/dev/motion");
  await expect(page.getByRole("heading", { level: 1, name: "Built loud for the city" })).toBeVisible();
});

test("smooth scroll and pinning run when motion is allowed (desktop)", async ({ page, isMobile }) => {
  test.skip(isMobile, "pinning is desktop-only");
  await page.goto("/dev/motion");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await expect(page.locator(".pin-spacer [data-pinned]").first()).toBeAttached();
});

test("reduced motion turns off smooth scroll and pinning", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/dev/motion");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator("[data-pinned]").first()).toBeAttached();
  await expect(page.locator(".pin-spacer [data-pinned]")).toHaveCount(0);
});

test("custom cursor only on mouse devices", async ({ page, isMobile }) => {
  await page.goto("/dev/motion");
  if (isMobile) {
    await expect(page.locator("[data-cursor]")).toHaveCount(0);
  } else {
    // keep moving until the page has hydrated and attached its pointer listener
    let x = 300;
    await expect
      .poll(async () => {
        await page.mouse.move((x += 7), 300);
        return page.locator("[data-cursor]").count();
      })
      .toBe(1);
  }
});
