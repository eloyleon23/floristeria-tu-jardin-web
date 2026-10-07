/**
 * Fuente de datos local (Fase 1): JSON importados de la web WordPress.
 * En la Fase 3 se añadirá `appsScriptAdapter.ts` con la misma interfaz.
 */
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import portfolio from "@/data/portfolio.json";
import galleries from "@/data/galleries.json";
import type { CatalogSource } from "./types";

export const localAdapter: CatalogSource = {
  loadProducts: async () => products as unknown[],
  loadCategories: async () => categories as unknown[],
  loadPortfolio: async () => portfolio as unknown[],
  loadGalleries: async () => galleries,
};
