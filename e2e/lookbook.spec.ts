import { test, expect } from "@playwright/test";

const stories = {
  "Street Season": ["Retro Jerseys", "Streetwear Essentials", "Sky Blue Retro Jersey", "Black & White Retro Jersey", "Navy Pinstripe Jersey"],
  "Night Shift": ["Monochrome Quarter-Zip", "Striped Knit Polo", "Colour-Block Knit Polo", "Black & Gold Concept Jersey", "Navy & Gold Retro Jersey"],
};

test("lookbook stories use the client's photos, captioned in order", async ({ page }) => {
  await page.goto("/lookbook");
  await expect(page.getByRole("heading", { level: 1, name: "Lookbook" })).toBeVisible();
  for (const [title, looks] of Object.entries(stories)) {
    const story = page.getByRole("article").filter({ has: page.getByRole("heading", { level: 2, name: title }) });
    await expect(story.locator("figcaption")).toHaveText(looks);
    const imgs = story.getByRole("img");
    await expect(imgs).toHaveCount(6); // cover + 5 looks
    for (const src of await imgs.evaluateAll((els) => els.map((e) => (e as HTMLImageElement).currentSrc || (e as HTMLImageElement).src))) {
      expect(decodeURIComponent(src)).toMatch(/\/fixtures\/lb-/); // real photos, not the old grey s1-/s2- placeholders
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
