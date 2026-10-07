import { z } from "zod";
import type { Category, PortfolioItem, Product } from "@/types/catalog";

/**
 * Validación del catálogo. Cualquier fuente (JSON local hoy, Apps Script en la
 * Fase 3) pasa por aquí: los productos inválidos se descartan con un aviso en
 * vez de romper el build o generar páginas rotas.
 */

const imageSchema = z.object({
  src: z.string().startsWith("/"),
  thumb: z.string().startsWith("/"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string(),
});

export const productSchema = z.object({
  id: z.string().min(1),
  sku: z.string(),
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug no válido"),
  shortDescription: z.string(),
  description: z.string(),
  price: z.number().nonnegative().nullable(),
  category: z.string().min(1),
  subcategories: z.array(z.string()).min(1),
  image: imageSchema.nullable(),
  images: z.array(imageSchema),
  available: z.boolean(),
  featured: z.boolean(),
  colors: z.array(z.string()),
  tags: z.array(z.string()),
  dimensions: z.string().nullable(),
  season: z.string().nullable(),
  occasion: z.array(z.string()),
  order: z.number(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  updatedAt: z.string().nullable(),
  pendingFields: z.array(z.string()),
});

export const categorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  menuName: z.string().min(1),
  parent: z.string().nullable(),
  path: z.string().startsWith("/"),
  headerImage: z.string(),
  order: z.number(),
});

export const portfolioSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  categories: z.array(z.string()),
  cover: imageSchema,
  gallery: z.array(imageSchema),
  order: z.number(),
});

export interface ValidationIssue {
  item: string;
  reason: string;
}

export interface CatalogValidation {
  products: Product[];
  issues: ValidationIssue[];
}

/** Valida y limpia productos: descarta inválidos, slugs duplicados y categorías desconocidas. */
export function validateProducts(raw: unknown[], categories: Category[]): CatalogValidation {
  const known = new Set(categories.map((c) => c.slug));
  const seen = new Set<string>();
  const issues: ValidationIssue[] = [];
  const products: Product[] = [];

  raw.forEach((entry, index) => {
    const parsed = productSchema.safeParse(entry);
    const label = (entry as { slug?: string; name?: string })?.slug ?? `#${index}`;
    if (!parsed.success) {
      issues.push({
        item: label,
        reason: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
      });
      return;
    }
    const p = parsed.data;
    if (seen.has(p.slug)) {
      issues.push({ item: p.slug, reason: "slug duplicado: se conserva el primero" });
      return;
    }
    const validCats = p.subcategories.filter((c) => known.has(c));
    if (!known.has(p.category) || validCats.length === 0) {
      issues.push({ item: p.slug, reason: `categoría no válida (${p.category})` });
      return;
    }
    if (validCats.length !== p.subcategories.length) {
      issues.push({ item: p.slug, reason: "se ignoran subcategorías desconocidas" });
    }
    seen.add(p.slug);
    products.push({ ...p, subcategories: validCats });
  });

  return { products, issues };
}

export function validateCategories(raw: unknown[]): Category[] {
  return z.array(categorySchema).parse(raw);
}

export function validatePortfolio(raw: unknown[]): PortfolioItem[] {
  return z.array(portfolioSchema).parse(raw);
}
