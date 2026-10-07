import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Las URLs importantes de la web original (páginas, categorías y productos)
 * deben existir con la misma ruta en la nueva web (ver docs/audit/urls-actuales.csv).
 */
const csv = readFileSync(path.resolve(import.meta.dirname, "../../docs/audit/urls-actuales.csv"), "utf8");
const KEEP = new Set(["page", "product", "product_cat", "portfolio-item"]);
// Páginas residuales de WordPress que no se reconstruyen (se redirigirán en la Fase 6).
const DROPPED = new Set(["/faq-page/", "/carro/", "/portfolio-item/"]);
const urls = csv
  .trim()
  .split("\n")
  .slice(1)
  .map((l) => l.split(","))
  .filter(([type, url]) => KEEP.has(type ?? "") && url && !DROPPED.has(url))
  .map(([, url]) => url as string);

test.describe("URLs de la web original", () => {
  test.skip(({ isMobile }) => isMobile, "basta con un viewport");

  test("se conservan todas las URLs importantes", async ({ request }) => {
    expect(urls.length).toBeGreaterThan(150);
    const failures: string[] = [];
    for (const url of urls) {
      const res = await request.get(url.replace(/^\//, ""));
      if (res.status() !== 200) failures.push(`${res.status()} ${url}`);
    }
    expect(failures).toEqual([]);
  });

  test("una URL inexistente muestra la página 404", async ({ page }) => {
    const res = await page.goto("no-existe/");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Página no encontrada" })).toBeVisible();
  });
});
