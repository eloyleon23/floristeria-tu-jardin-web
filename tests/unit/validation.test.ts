import { describe, expect, it } from "vitest";
import { validateProducts } from "@/lib/validation/catalog";
import { validateContact } from "@/lib/validation/contact";
import type { Category } from "@/types/catalog";

const categories: Category[] = [
  {
    slug: "flores",
    name: "Flores",
    menuName: "Flores",
    parent: null,
    path: "/product-category/flores/",
    headerImage: "",
    order: 0,
  },
  {
    slug: "rosas",
    name: "Rosas",
    menuName: "Rosas",
    parent: "flores",
    path: "/product-category/flores/rosas/",
    headerImage: "",
    order: 1,
  },
];

const valid = {
  id: "P1",
  sku: "FL-R.001",
  name: "Ramo Rojo",
  slug: "ramo-rojo",
  shortDescription: "",
  description: "",
  price: 30,
  category: "flores",
  subcategories: ["flores", "rosas"],
  image: null,
  images: [],
  available: true,
  featured: false,
  colors: [],
  tags: [],
  dimensions: null,
  season: null,
  occasion: [],
  order: 0,
  seoTitle: null,
  seoDescription: null,
  updatedAt: null,
  pendingFields: [],
};

describe("validateProducts", () => {
  it("acepta un producto válido", () => {
    const r = validateProducts([valid], categories);
    expect(r.products).toHaveLength(1);
    expect(r.issues).toHaveLength(0);
  });
  it("descarta precio incorrecto", () => {
    const r = validateProducts([{ ...valid, price: "treinta" }], categories);
    expect(r.products).toHaveLength(0);
    expect(r.issues[0]?.reason).toMatch(/price/);
  });
  it("descarta precio negativo", () => {
    expect(validateProducts([{ ...valid, price: -5 }], categories).products).toHaveLength(0);
  });
  it("descarta categoría inválida", () => {
    const r = validateProducts([{ ...valid, category: "inventada", subcategories: ["inventada"] }], categories);
    expect(r.products).toHaveLength(0);
    expect(r.issues[0]?.reason).toMatch(/categoría/);
  });
  it("ignora subcategorías desconocidas pero conserva el producto", () => {
    const r = validateProducts([{ ...valid, subcategories: ["flores", "xx"] }], categories);
    expect(r.products[0]?.subcategories).toEqual(["flores"]);
  });
  it("conserva el primero ante slugs duplicados", () => {
    const r = validateProducts([valid, { ...valid, id: "P2", name: "Otro" }], categories);
    expect(r.products.map((p) => p.id)).toEqual(["P1"]);
    expect(r.issues[0]?.reason).toMatch(/duplicado/);
  });
  it("descarta datos incompletos o slug no válido", () => {
    expect(validateProducts([{ ...valid, name: "" }], categories).products).toHaveLength(0);
    expect(validateProducts([{ ...valid, slug: "Ramo Rojo" }], categories).products).toHaveLength(0);
    expect(validateProducts([null, 42], categories).issues).toHaveLength(2);
  });
  it("rechaza imagen con ruta no válida", () => {
    const image = { src: "http://x", thumb: "/a.webp", width: 1, height: 1, alt: "" };
    expect(validateProducts([{ ...valid, image }], categories).products).toHaveLength(0);
  });
});

describe("validateContact", () => {
  it("acepta datos correctos", () => {
    expect(
      validateContact({ name: "Ana", email: "ana@example.com", phone: "926 24 15 23", message: "Un ramo" }),
    ).toEqual({});
  });
  it("marca los errores", () => {
    const e = validateContact({ name: "", email: "no-email", phone: "abc", message: "" });
    expect(Object.keys(e).sort()).toEqual(["email", "message", "name", "phone"]);
  });
  it("el teléfono es opcional", () => {
    expect(validateContact({ name: "Ana", email: "a@b.es", phone: "", message: "Hola hola" })).toEqual({});
  });
});
