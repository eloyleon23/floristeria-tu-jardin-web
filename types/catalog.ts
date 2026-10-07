/**
 * Contrato de datos del catálogo. Es lo único que conocen los componentes:
 * ninguna capa de presentación depende de WooCommerce ni de Google Sheets.
 */

export interface ImageRef {
  /** Ruta pública relativa a `public/` (sin basePath), p. ej. `/images/products/ramo-rojo.webp`. */
  src: string;
  /** Variante pequeña para tarjetas y miniaturas. */
  thumb: string;
  width: number;
  height: number;
  alt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  /** Precio en euros. `null` = sin precio publicado (nunca se inventa). */
  price: number | null;
  /** Slug de la categoría raíz principal. */
  category: string;
  /** Slugs de todas las categorías (raíz y subcategorías) a las que pertenece. */
  subcategories: string[];
  image: ImageRef | null;
  images: ImageRef[];
  available: boolean;
  featured: boolean;
  colors: string[];
  tags: string[];
  dimensions: string | null;
  season: string | null;
  occasion: string[];
  order: number;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string | null;
  /** Campos que no pudieron recuperarse de la web original y están pendientes de confirmar. */
  pendingFields: string[];
}

export interface Category {
  slug: string;
  name: string;
  /** Nombre corto usado en menús (p. ej. "Centros" en vez de "Centros de Flores"). */
  menuName: string;
  parent: string | null;
  /** Ruta pública, p. ej. `/product-category/flores/rosas/`. */
  path: string;
  headerImage: string;
  order: number;
}

export interface PortfolioItem {
  slug: string;
  title: string;
  description: string;
  categories: string[];
  cover: ImageRef;
  gallery: ImageRef[];
  order: number;
}
