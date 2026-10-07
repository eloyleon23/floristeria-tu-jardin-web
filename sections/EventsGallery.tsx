"use client";

import Link from "next/link";
import { useState } from "react";
import type { PortfolioItem } from "@/types/catalog";
import { routes } from "@/lib/paths";
import { Picture } from "@/components/ui/Picture";

/** Rejilla de trabajos de la página Eventos con filtro por tipo de evento. */
export function EventsGallery({
  items,
  filters,
}: {
  items: PortfolioItem[];
  filters: { slug: string; label: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const visible = active ? items.filter((i) => i.categories.includes(active)) : items;
  const btn = (on: boolean) =>
    `text-xs font-medium tracking-[0.1em] uppercase transition-colors hover:text-brand ${on ? "text-brand" : "text-navy"}`;

  return (
    <div>
      <ul className="flex flex-wrap gap-x-[30px] gap-y-3" aria-label="Filtrar por tipo de evento">
        <li>
          <button
            type="button"
            className={btn(active === null)}
            aria-pressed={active === null}
            onClick={() => setActive(null)}
          >
            Ver todo
          </button>
        </li>
        {filters.map((f) => (
          <li key={f.slug}>
            <button
              type="button"
              className={btn(active === f.slug)}
              aria-pressed={active === f.slug}
              onClick={() => setActive(f.slug)}
            >
              {f.label}
            </button>
          </li>
        ))}
      </ul>
      <ul className="mt-6 columns-2 gap-[10px] lg:columns-3" aria-live="polite">
        {visible.map((item) => (
          <li key={item.slug} className="mb-10 break-inside-avoid">
            <Link href={routes.portfolio(item.slug)} className="group block">
              <div className="overflow-hidden">
                <Picture
                  image={item.cover}
                  sizes="(min-width: 1025px) 425px, 50vw"
                  className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h2 className="mt-5 text-xs font-medium tracking-[0.1em] text-navy uppercase group-hover:text-brand">
                {item.title}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
