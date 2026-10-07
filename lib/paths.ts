/**
 * Rutas y recursos. `next/link` añade el basePath automáticamente; las rutas de
 * imágenes y estilos en línea no, así que se resuelven con `asset()`.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(src: string): string {
  if (!src.startsWith("/")) return src;
  return `${basePath}${src}`;
}

export const routes = {
  home: "/",
  shop: "/tienda/",
  product: (slug: string) => `/producto/${slug}/`,
  portfolio: (slug: string) => `/portfolio-item/${slug}/`,
  /** Página N de un listado (la 1 es la propia ruta). */
  page: (listPath: string, page: number) => (page <= 1 ? listPath : `${listPath}page/${page}/`),
};
