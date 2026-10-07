/**
 * API del catálogo para páginas y componentes. Es la única puerta de acceso a
 * los datos: los componentes nunca leen los JSON ni la fuente remota directamente.
 */
import { cache } from "react";
import type { Category, PortfolioItem, Product } from "@/types/catalog";
import { validateCategories, validatePortfolio, validateProducts } from "@/lib/validation/catalog";
import { localAdapter } from "./localAdapter";
import type { CatalogSource } from "./types";

const source: CatalogSource = localAdapter;

const loadCatalog = cache(async () => {
  const categories = validateCategories(await source.loadCategories()).sort((a, b) => a.order - b.order);
  const { products, issues } = validateProducts(await source.loadProducts(), categories);
  if (issues.length && process.env.NODE_ENV !== "test") {
    console.warn(
      `[catálogo] ${issues.length} incidencias:\n` + issues.map((i) => ` - ${i.item}: ${i.reason}`).join("\n"),
    );
  }
  products.sort((a, b) => a.order - b.order);
  return { categories, products };
});

export async function getCategories(): Promise<Category[]> {
  return (await loadCatalog()).categories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getRootCategories(): Promise<Category[]> {
  return (await getCategories()).filter((c) => !c.parent);
}

export async function getSubcategories(parent: string): Promise<Category[]> {
  return (await getCategories()).filter((c) => c.parent === parent);
}

/** Resuelve una ruta `/product-category/a/b/` a partir de sus segmentos. */
export async function getCategoryByPath(segments: string[]): Promise<Category | undefined> {
  const path = `/product-category/${segments.join("/")}/`;
  return (await getCategories()).find((c) => c.path === path);
}

export async function getProducts(): Promise<Product[]> {
  return (await loadCatalog()).products.filter((p) => p.available);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.subcategories.includes(slug));
}

export async function getFeaturedProducts(limit?: number): Promise<Product[]> {
  const featured = (await getProducts()).filter((p) => p.featured);
  return limit ? featured.slice(0, limit) : featured;
}

/** Productos relacionados: comparten subcategoría, orden determinista para builds reproducibles. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const leafs = product.subcategories.filter((s) => s !== product.category);
  const pool = (await getProducts()).filter(
    (p) =>
      p.slug !== product.slug &&
      p.subcategories.some((s) => (leafs.length ? leafs : product.subcategories).includes(s)),
  );
  const start = pool.length ? product.order % pool.length : 0;
  return [...pool.slice(start), ...pool.slice(0, start)].slice(0, limit);
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  return validatePortfolio(await source.loadPortfolio()).sort((a, b) => a.order - b.order);
}

export async function getPortfolioItem(slug: string): Promise<PortfolioItem | undefined> {
  return (await getPortfolio()).find((p) => p.slug === slug);
}

export async function getGalleries() {
  return source.loadGalleries();
}
