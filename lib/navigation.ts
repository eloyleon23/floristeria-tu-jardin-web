import { mainMenu, type NavLink } from "@/config/navigation";
import type { Category } from "@/types/catalog";

/** Construye el menú principal con las subcategorías reales del catálogo. */
export function buildMainMenu(categories: Category[]): NavLink[] {
  return mainMenu.map((item) => ({
    label: item.label,
    href: item.href,
    children: item.category
      ? categories.filter((c) => c.parent === item.category).map((c) => ({ label: c.menuName, href: c.path }))
      : undefined,
  }));
}

/** ¿Está activo un elemento del menú para la ruta actual? (incluye subcategorías). */
export function isActive(href: string, pathname: string): boolean {
  const p = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (href === "/") return p === "/";
  return p.startsWith(href);
}

/**
 * Páginas cuya cabecera tiene imagen de fondo: en móvil la barra superior se
 * superpone a ella (transparente, logotipo crema), como en la web original.
 */
export function hasImageHeader(pathname: string): boolean {
  const p = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return (
    p === "/" ||
    ["/tienda/", "/product-category/", "/eventos/", "/nosotros/", "/politica-", "/aviso-legal/"].some((prefix) =>
      p.startsWith(prefix),
    )
  );
}
