"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavLink } from "@/config/navigation";
import { hasImageHeader, isActive } from "@/lib/navigation";
import { asset } from "@/lib/paths";
import { site } from "@/config/site";
import { Icon } from "@/components/ui/Icon";

/**
 * Cabecera y menú móvil (< 1025 px): barra de 70 px y menú a pantalla completa
 * sobre fondo crema con submenús en acordeón, como en la web original.
 */
export function MobileNavigation({ items }: { items: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const overlay = hasImageHeader(pathname);

  // Cierra el menú al cambiar de página (patrón recomendado por React, sin efecto).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setExpanded(null);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="desktop:hidden">
      <div
        className={`z-40 flex h-(--spacing-header-mobile) w-full items-center justify-between px-5 ${
          overlay ? "absolute top-0 left-0" : "relative"
        }`}
      >
        <Link href="/" aria-label={`${site.name} — inicio`}>
          <img
            src={asset(overlay ? "/images/brand/logo-text-crema.png" : "/images/brand/logo-text-rosa.png")}
            alt={site.name}
            width={120}
            height={21}
            className="h-[21px] w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="menu-movil"
          className={`-mr-2 p-2 ${overlay ? "text-accent" : "text-brand"}`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      <div
        id="menu-movil"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        hidden={!open}
        className="fixed inset-0 z-50 overflow-y-auto bg-accent px-10 pt-[60px] pb-10"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
          className="absolute top-5 right-6 p-1 text-brand"
        >
          <Icon name="close" className="h-5 w-5" strokeWidth={2} />
        </button>
        <nav aria-label="Menú principal">
          <ul>
            {items.map((item) => (
              <li key={item.href} className="border-b border-navy/15">
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={`block py-4 text-[13px] font-medium tracking-[0.1em] uppercase ${
                      isActive(item.href, pathname) ? "text-brand" : "text-navy"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <button
                      type="button"
                      className="ml-3 p-2 text-brand"
                      aria-expanded={expanded === item.href}
                      aria-label={`Ver subcategorías de ${item.label}`}
                      onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                    >
                      <Icon
                        name="chevronDown"
                        className={`h-3 w-3 transition-transform ${expanded === item.href ? "rotate-180" : ""}`}
                        strokeWidth={2}
                      />
                    </button>
                  ) : null}
                </div>
                {item.children && expanded === item.href ? (
                  <ul className="pb-3 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="block py-2 text-[13px] font-medium text-navy">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
