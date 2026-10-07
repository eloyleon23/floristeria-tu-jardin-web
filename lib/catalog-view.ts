/**
 * Lógica pura de listados (filtrar, ordenar, paginar). Sin React, para poder
 * probarla con tests unitarios y reutilizarla en servidor y cliente.
 */
import type { Product } from "@/types/catalog";

export type CardProduct = Pick<
  Product,
  "id" | "slug" | "name" | "price" | "image" | "colors" | "subcategories" | "order"
>;

export const SORT_OPTIONS = [
  { value: "menu_order", label: "Orden por defecto" },
  { value: "date", label: "Ordenar por los últimos" },
  { value: "price", label: "Ordenar por precio: bajo a alto" },
  { value: "price-desc", label: "Ordenar por precio: alto a bajo" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface CatalogFilters {
  orderby: SortValue;
  colors: string[];
  minPrice: number | null;
  maxPrice: number | null;
}

export const defaultFilters: CatalogFilters = { orderby: "menu_order", colors: [], minPrice: null, maxPrice: null };

export function toCard(p: Product): CardProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    image: p.image,
    colors: p.colors,
    subcategories: p.subcategories,
    order: p.order,
  };
}

/** Lee los filtros de la URL (mismos nombres de parámetro que WooCommerce). */
export function parseFilters(params: URLSearchParams): CatalogFilters {
  const orderby = params.get("orderby");
  const num = (k: string) => {
    const v = params.get(k);
    return v !== null && v !== "" && Number.isFinite(Number(v)) ? Number(v) : null;
  };
  return {
    orderby: SORT_OPTIONS.some((o) => o.value === orderby) ? (orderby as SortValue) : "menu_order",
    colors: (params.get("color") ?? "").split(",").filter(Boolean),
    minPrice: num("min_price"),
    maxPrice: num("max_price"),
  };
}

export function filtersToParams(f: CatalogFilters): string {
  const p = new URLSearchParams();
  if (f.orderby !== "menu_order") p.set("orderby", f.orderby);
  if (f.colors.length) p.set("color", f.colors.join(","));
  if (f.minPrice !== null) p.set("min_price", String(f.minPrice));
  if (f.maxPrice !== null) p.set("max_price", String(f.maxPrice));
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function hasActiveFilters(f: CatalogFilters): boolean {
  return f.orderby !== "menu_order" || f.colors.length > 0 || f.minPrice !== null || f.maxPrice !== null;
}

const idNumber = (id: string) => Number(id.replace(/\D/g, "")) || 0;

export function applyFilters<T extends CardProduct>(items: T[], f: CatalogFilters): T[] {
  const colors = f.colors.map((c) => c.toLowerCase());
  const filtered = items.filter((p) => {
    if (colors.length && !p.colors.some((c) => colors.includes(c.toLowerCase()))) return false;
    if (f.minPrice !== null && (p.price ?? 0) < f.minPrice) return false;
    if (f.maxPrice !== null && (p.price ?? 0) > f.maxPrice) return false;
    return true;
  });
  const sorted = [...filtered];
  switch (f.orderby) {
    case "price":
      sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity) || a.order - b.order);
      break;
    case "price-desc":
      sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity) || a.order - b.order);
      break;
    case "date":
      sorted.sort((a, b) => idNumber(b.id) - idNumber(a.id));
      break;
    default:
      sorted.sort((a, b) => a.order - b.order);
  }
  return sorted;
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: current,
    totalPages,
    from: items.length ? start + 1 : 0,
    to: Math.min(start + perPage, items.length),
    total: items.length,
  };
}

export function totalPages(count: number, perPage: number): number {
  return Math.max(1, Math.ceil(count / perPage));
}

/** Colores presentes en un listado, en orden alfabético. */
export function availableColors(items: CardProduct[]): string[] {
  return [...new Set(items.flatMap((p) => p.colors))].sort((a, b) => a.localeCompare(b, "es"));
}

export function maxPrice(items: CardProduct[]): number {
  return Math.ceil(Math.max(0, ...items.map((p) => p.price ?? 0)));
}
