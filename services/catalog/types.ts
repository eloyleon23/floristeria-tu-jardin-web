import type { ImageRef } from "@/types/catalog";

/** Contrato que debe cumplir cualquier origen de datos del catálogo. */
export interface CatalogSource {
  loadProducts(): Promise<unknown[]>;
  loadCategories(): Promise<unknown[]>;
  loadPortfolio(): Promise<unknown[]>;
  loadGalleries(): Promise<{ nosotrosTienda: ImageRef[]; nosotrosFlores: ImageRef[] }>;
}
