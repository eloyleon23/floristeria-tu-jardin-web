import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Oculta el aviso de cookies para no tapar elementos.
  await page.addInitScript(() =>
    localStorage.setItem("tj-cookie-consent", JSON.stringify({ necessary: true, analytics: false, date: "x" })),
  );
});

test.describe("escritorio", () => {
  test.skip(({ isMobile }) => isMobile, "solo escritorio");

  test("menú principal y desplegables", async ({ page }) => {
    await page.goto("./");
    const nav = page.getByRole("navigation", { name: "Menú principal" }).first();
    for (const label of [
      "Tienda",
      "Ocasiones",
      "Flores",
      "Plantas",
      "Servicios Funerarios",
      "Eventos",
      "Nosotros",
      "Contacto",
    ]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await nav.getByRole("link", { name: "Flores", exact: true }).hover();
    await nav.getByRole("link", { name: "Preservadas" }).click();
    await expect(page).toHaveURL(/product-category\/flores\/preservadas\/$/);
    await expect(page.getByRole("heading", { level: 1, name: "Preservadas" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Flores", exact: true })).toHaveAttribute("aria-current", "page");
  });

  test("home → producto destacado → categoría", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ramos únicos.");
    await expect(page.getByText("Destacados del mes")).toBeVisible();
    await page.getByRole("link", { name: "Bouquet Rosas Kira" }).first().click();
    await expect(page.getByRole("heading", { level: 1, name: "Bouquet Rosas Kira" })).toBeVisible();
    await expect(page.getByText("18.00€").first()).toBeVisible();
    await page.getByRole("link", { name: "Rosas", exact: true }).first().click();
    await expect(page).toHaveURL(/product-category\/flores\/rosas\/$/);
  });

  test("la página no tiene errores de consola", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    for (const url of ["./", "tienda/", "producto/abanico/", "eventos/", "nosotros/", "contacto/"]) {
      await page.goto(url, { waitUntil: "networkidle" });
    }
    // El iframe de Google Maps puede registrar avisos propios: solo cuentan los errores de la web.
    expect(errors.filter((e) => !/google|maps|gstatic/i.test(e))).toEqual([]);
  });
});

test.describe("móvil", () => {
  test.skip(({ isMobile }) => !isMobile, "solo móvil");

  test("menú móvil con acordeón", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "Abrir menú" }).click();
    const dialog = page.getByRole("dialog", { name: "Menú" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Ver subcategorías de Plantas" }).click();
    await dialog.getByRole("link", { name: "Orquídeas" }).click();
    await expect(page).toHaveURL(/plantas\/orquideas\/$/);
    await expect(page.getByRole("dialog", { name: "Menú" })).toBeHidden();
  });

  test("cierra el menú con Escape", async ({ page }) => {
    await page.goto("contacto/");
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Menú" })).toBeHidden();
  });
});
