import { describe, expect, it } from "vitest";
import {
  applyFilters,
  availableColors,
  filtersToParams,
  maxPrice,
  paginate,
  parseFilters,
  type CardProduct,
} from "@/lib/catalog-view";

const item = (id: number, name: string, price: number | null, colors: string[], order = id): CardProduct => ({
  id: `P${id}`,
  slug: name.toLowerCase(),
  name,
  price,
  image: null,
  colors,
  subcategories: ["flores"],
  order,
});

const items = [item(10, "C", 30, ["Rojo"]), item(30, "A", 10, ["Blanco", "Rosa"]), item(20, "B", 20, ["Rojo"])];

describe("parseFilters / filtersToParams", () => {
  it("lee los parámetros de WooCommerce", () => {
    const f = parseFilters(new URLSearchParams("orderby=price&color=rojo,rosa&min_price=5&max_price=50"));
    expect(f).toEqual({ orderby: "price", colors: ["rojo", "rosa"], minPrice: 5, maxPrice: 50 });
  });
  it("ignora valores no válidos", () => {
    const f = parseFilters(new URLSearchParams("orderby=hack&min_price=abc"));
    expect(f).toEqual({ orderby: "menu_order", colors: [], minPrice: null, maxPrice: null });
  });
  it("ida y vuelta", () => {
    const f = parseFilters(new URLSearchParams("orderby=price-desc&color=rojo"));
    expect(filtersToParams(f)).toBe("?orderby=price-desc&color=rojo");
    expect(filtersToParams(parseFilters(new URLSearchParams()))).toBe("");
  });
});

describe("applyFilters", () => {
  const base = parseFilters(new URLSearchParams());
  it("orden por defecto", () => {
    expect(applyFilters(items, base).map((i) => i.name)).toEqual(["C", "B", "A"]);
  });
  it("precio ascendente y descendente", () => {
    expect(applyFilters(items, { ...base, orderby: "price" }).map((i) => i.price)).toEqual([10, 20, 30]);
    expect(applyFilters(items, { ...base, orderby: "price-desc" }).map((i) => i.price)).toEqual([30, 20, 10]);
  });
  it("los últimos primero (id mayor)", () => {
    expect(applyFilters(items, { ...base, orderby: "date" }).map((i) => i.id)).toEqual(["P30", "P20", "P10"]);
  });
  it("filtra por color sin distinguir mayúsculas", () => {
    expect(applyFilters(items, { ...base, colors: ["rojo"] }).map((i) => i.name)).toEqual(["C", "B"]);
  });
  it("filtra por rango de precio", () => {
    expect(applyFilters(items, { ...base, minPrice: 15, maxPrice: 25 }).map((i) => i.name)).toEqual(["B"]);
  });
  it("productos sin precio van al final al ordenar por precio", () => {
    const withNull = [...items, item(40, "D", null, [])];
    expect(applyFilters(withNull, { ...base, orderby: "price" }).at(-1)?.name).toBe("D");
  });
});

describe("paginate", () => {
  const list = Array.from({ length: 45 }, (_, i) => i);
  it("calcula páginas y rangos", () => {
    expect(paginate(list, 1, 20)).toMatchObject({ page: 1, totalPages: 3, from: 1, to: 20, total: 45 });
    expect(paginate(list, 3, 20)).toMatchObject({ page: 3, from: 41, to: 45 });
  });
  it("acota páginas fuera de rango", () => {
    expect(paginate(list, 99, 20).page).toBe(3);
    expect(paginate([], 1, 20)).toMatchObject({ totalPages: 1, from: 0, to: 0 });
  });
});

describe("utilidades", () => {
  it("colores disponibles ordenados y sin duplicados", () => {
    expect(availableColors(items)).toEqual(["Blanco", "Rojo", "Rosa"]);
  });
  it("precio máximo", () => {
    expect(maxPrice(items)).toBe(30);
  });
});
