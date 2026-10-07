import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("tj-cookie-consent", JSON.stringify({ necessary: true, analytics: false, date: "x" })),
  );
});

test("tienda: recuento, paginación y orden", async ({ page }) => {
  await page.goto("tienda/");
  await expect(page.getByText("Mostrando 1–20 de 126 resultados")).toBeVisible();
  await expect(page.locator("main article")).toHaveCount(20);
  await page.getByRole("link", { name: "Página 7" }).click();
  await expect(page).toHaveURL(/tienda\/page\/7\/$/);
  await expect(page.getByText("Mostrando 121–126 de 126 resultados")).toBeVisible();

  await page.goto("tienda/");
  await page.getByLabel("Ordenar productos").selectOption("price");
  await expect(page).toHaveURL(/orderby=price/);
  await expect(page.locator("main article").first()).toContainText("5.00€");
});

test("categoría: filtro de color", async ({ page }) => {
  await page.goto("product-category/funerarios/coronas/");
  await expect(page.getByText("Mostrando los 16 resultados")).toBeVisible();
  await page.getByText("Rosa", { exact: true }).click();
  await expect(page).toHaveURL(/color=rosa/);
  const count = await page.locator("main article").count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(16);
});

test("ficha de producto", async ({ page }) => {
  await page.goto("producto/ramo-rosas-peluche/");
  await expect(page.getByRole("heading", { level: 1, name: "Ramo de Rosas con Peluche" })).toBeVisible();
  await expect(page.getByText("95.00€")).toBeVisible();
  await expect(page.getByText("Composición de dos docenas de rosas, peluche y verdes variados").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Enamorados" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Productos relacionados" })).toBeVisible();
  await expect(page.locator("main img").first()).toHaveAttribute("alt", "Ramo de Rosas con Peluche");
});

test("formulario de contacto: validación", async ({ page }) => {
  await page.goto("contacto/");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText("Indica tu nombre.")).toBeVisible();
  await expect(page.getByText("Introduce un email válido.")).toBeVisible();
  await page.getByPlaceholder("Nombre completo").fill("Ana");
  await page.getByPlaceholder("Email").fill("ana@example.com");
  await page.getByPlaceholder("Tu pedido...").fill("Quiero un ramo de rosas");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Fase 2" })).toBeVisible();
  await expect(page.getByText("contacto@floristeriatujardin.es").first()).toBeVisible();
});

test("eventos: filtro y galería", async ({ page }) => {
  await page.goto("eventos/");
  await expect(page.locator("main li a[href*='portfolio-item']")).toHaveCount(5);
  await page.getByRole("button", { name: "Carnaval" }).click();
  await expect(page.locator("main li a[href*='portfolio-item']")).toHaveCount(1);
  await page.goto("portfolio-item/ramos-novia/");
  await page
    .getByRole("button", { name: /Ampliar/ })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("aviso de cookies", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL ?? "/");
  const banner = page.getByRole("region", { name: "Aviso de cookies" });
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Aceptar" }).click();
  await expect(banner).toBeHidden();
  await page.reload();
  await expect(page.getByRole("region", { name: "Aviso de cookies" })).toBeHidden();
  await context.close();
});
