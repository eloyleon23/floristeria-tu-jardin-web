"use client";

import Link from "next/link";
import { useState } from "react";
import { colorSwatches } from "@/config/colors";
import type { CardProduct, CatalogFilters } from "@/lib/catalog-view";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/paths";
import { Picture } from "@/components/ui/Picture";

export interface FilterGroup {
  title: string;
  links: { label: string; href: string; active: boolean }[];
}

const groupTitle = "font-display-regular mb-5 text-[30px] leading-tight text-navy";

/** Barra lateral de filtros: categorías, precio, color y "Te puede interesar". */
export function ProductFilters({
  groups,
  colors,
  maxPrice,
  filters,
  onChange,
  related,
  className = "",
}: {
  groups: FilterGroup[];
  colors: string[];
  maxPrice: number;
  filters: CatalogFilters;
  onChange: (f: CatalogFilters) => void;
  related: CardProduct[];
  className?: string;
}) {
  return (
    <aside
      className={`self-start border border-border bg-surface/40 px-[30px] py-[40px] ${className}`}
      aria-label="Filtros"
    >
      {groups.map((group) => (
        <section key={group.title} className="mb-10">
          <h2 className={groupTitle}>{group.title}</h2>
          <ul className="space-y-1.5">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  className="flex items-center gap-4 text-[15px] text-muted hover:text-brand"
                >
                  <Radio checked={link.active} />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* La clave reinicia el estado del deslizador cuando cambian los filtros de la URL. */}
      <PriceFilter
        key={`${filters.minPrice}-${filters.maxPrice}-${maxPrice}`}
        max={maxPrice}
        filters={filters}
        onChange={onChange}
      />

      {colors.length ? (
        <section className="mb-12">
          <h2 className={groupTitle}>Color</h2>
          <ul className="space-y-2">
            {colors.map((color) => {
              const checked = filters.colors.includes(color.toLowerCase());
              return (
                <li key={color}>
                  <label className="flex cursor-pointer items-center gap-3 text-[15px] text-muted hover:text-brand has-focus-visible:outline-2 has-focus-visible:outline-brand">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() =>
                        onChange({
                          ...filters,
                          colors: checked
                            ? filters.colors.filter((c) => c !== color.toLowerCase())
                            : [...filters.colors, color.toLowerCase()],
                        })
                      }
                    />
                    <Radio checked={checked} />
                    <span
                      className="h-[25px] w-[25px] border border-navy"
                      style={{ backgroundColor: colorSwatches[color] ?? "transparent" }}
                      aria-hidden
                    />
                    {color}
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {related.length ? (
        <section>
          <h2 className="eyebrow mb-6 text-navy!">Te puede interesar</h2>
          <ul className="space-y-4">
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={routes.product(p.slug)} className="group flex items-center gap-[22px]">
                  <div className="h-[64px] w-[48px] shrink-0 overflow-hidden bg-border">
                    {p.image ? <Picture image={p.image} sizes="48px" className="h-full w-full object-cover" /> : null}
                  </div>
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.1em] text-navy uppercase group-hover:text-brand">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-muted">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      className={`inline-block h-3 w-3 shrink-0 rounded-full border ${checked ? "border-brand bg-brand" : "border-border"}`}
      aria-hidden
    />
  );
}

function PriceFilter({
  max,
  filters,
  onChange,
}: {
  max: number;
  filters: CatalogFilters;
  onChange: (f: CatalogFilters) => void;
}) {
  const [range, setRange] = useState<[number, number]>([filters.minPrice ?? 0, filters.maxPrice ?? max]);
  if (max <= 0) return null;

  const commit = () =>
    onChange({
      ...filters,
      minPrice: range[0] > 0 ? range[0] : null,
      maxPrice: range[1] < max ? range[1] : null,
    });
  const pct = (v: number) => `${(v / max) * 100}%`;
  const thumb =
    "pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-border [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-border";

  return (
    <section className="mb-12">
      <h2 className={groupTitle}>Precio</h2>
      <div className="mb-3 flex justify-between text-[13px] text-muted">
        <span>{range[0].toFixed(2)}</span>
        <span>{range[1].toFixed(2)}</span>
      </div>
      <div className="relative h-5">
        <div className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 bg-border" />
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-navy"
          style={{ left: pct(range[0]), right: `calc(100% - ${pct(range[1])})` }}
        />
        <input
          type="range"
          min={0}
          max={max}
          value={range[0]}
          aria-label="Precio mínimo"
          onChange={(e) => setRange([Math.min(Number(e.target.value), range[1]), range[1]])}
          onMouseUp={commit}
          onTouchEnd={commit}
          onKeyUp={commit}
          className={thumb}
        />
        <input
          type="range"
          min={0}
          max={max}
          value={range[1]}
          aria-label="Precio máximo"
          onChange={(e) => setRange([range[0], Math.max(Number(e.target.value), range[0])])}
          onMouseUp={commit}
          onTouchEnd={commit}
          onKeyUp={commit}
          className={thumb}
        />
      </div>
    </section>
  );
}
