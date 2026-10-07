import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import portfolio from "@/data/portfolio.json";
import { validateCategories, validatePortfolio, validateProducts } from "@/lib/validation/catalog";
import { formatPrice, resultCountText } from "@/lib/format";
import { hasImageHeader, isActive } from "@/lib/navigation";

const publicDir = path.resolve(import.meta.dirname, "../../public");

describe("datos importados de la web original", () => {
  const cats = validateCategories(categories);
  const { products: valid, issues } = validateProducts(products, cats);

  it("los 126 productos son válidos", () => {
    expect(issues).toEqual([]);
    expect(valid).toHaveLength(126);
  });
  it("20 categorías: 4 raíces y 16 subcategorías", () => {
    expect(cats).toHaveLength(20);
    expect(cats.filter((c) => !c.parent)).toHaveLength(4);
  });
  it("todas las imágenes referenciadas existen", () => {
    const refs = [
      ...valid.flatMap((p) => p.images.flatMap((i) => [i.src, i.thumb])),
      ...validatePortfolio(portfolio).flatMap((p) => [p.cover.src, ...p.gallery.map((g) => g.thumb)]),
      ...cats.map((c) => c.headerImage),
    ];
    const missing = refs.filter((r) => !existsSync(path.join(publicDir, r)));
    expect(missing).toEqual([]);
  });
  it("cada categoría tiene productos", () => {
    for (const c of cats) expect(valid.some((p) => p.subcategories.includes(c.slug))).toBe(true);
  });
  it("hay productos destacados para la home", () => {
    expect(valid.filter((p) => p.featured).length).toBeGreaterThanOrEqual(4);
  });
});

describe("formato y navegación", () => {
  it("precio con el formato de la web original", () => {
    expect(formatPrice(95)).toBe("95.00€");
    expect(formatPrice(null)).toBe("Consultar precio");
  });
  it("textos de recuento de WooCommerce", () => {
    expect(resultCountText(126, 1, 20)).toBe("Mostrando 1–20 de 126 resultados");
    expect(resultCountText(16, 1, 16)).toBe("Mostrando los 16 resultados");
    expect(resultCountText(1, 1, 1)).toBe("Mostrando el único resultado");
  });
  it("elemento activo del menú", () => {
    expect(isActive("/product-category/flores/", "/product-category/flores/rosas")).toBe(true);
    expect(isActive("/", "/tienda/")).toBe(false);
    expect(isActive("/tienda/", "/tienda/page/2")).toBe(true);
  });
  it("cabeceras con imagen", () => {
    expect(hasImageHeader("/")).toBe(true);
    expect(hasImageHeader("/tienda")).toBe(true);
    expect(hasImageHeader("/producto/abanico/")).toBe(false);
    expect(hasImageHeader("/contacto/")).toBe(false);
  });
});
