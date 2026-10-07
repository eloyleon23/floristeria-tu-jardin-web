import { expect, test } from "@playwright/test";

const WIDTHS = [320, 414, 768, 1024, 1440, 1920];
const PAGES = [
  "./",
  "tienda/",
  "product-category/flores/rosas/",
  "producto/abanico/",
  "eventos/",
  "nosotros/",
  "contacto/",
];

test.describe("responsive", () => {
  test.skip(({ isMobile }) => isMobile, "los anchos se fijan en la prueba");

  for (const width of WIDTHS) {
    test(`sin desbordamiento horizontal a ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const url of PAGES) {
        await page.goto(url);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${url} a ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("menú de escritorio desde 1025px y móvil por debajo", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("./");
    await expect(page.getByRole("button", { name: "Abrir menú" })).toBeVisible();
    await page.setViewportSize({ width: 1025, height: 800 });
    await expect(page.getByRole("button", { name: "Abrir menú" })).toBeHidden();
  });
});
