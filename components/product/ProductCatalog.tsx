"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import {
  SORT_OPTIONS,
  applyFilters,
  availableColors,
  defaultFilters,
  filtersToParams,
  maxPrice as getMaxPrice,
  paginate,
  parseFilters,
  type CardProduct,
  type CatalogFilters,
  type SortValue,
} from "@/lib/catalog-view";
import { resultCountText } from "@/lib/format";
import { routes } from "@/lib/paths";
import { Icon } from "@/components/ui/Icon";
import { ProductGrid } from "./ProductGrid";
import { ProductFilters, type FilterGroup } from "./ProductFilters";

export interface ProductCatalogProps {
  items: CardProduct[];
  page: number;
  /** Ruta del listado sin paginar, p. ej. "/tienda/". */
  listPath: string;
  perPage: number;
  groups: FilterGroup[];
  related: CardProduct[];
}

/**
 * Listado con filtros. El HTML estático se genera con el orden por defecto
 * (bueno para SEO); al hidratar se aplican los filtros de la URL
 * (?orderby, ?color, ?min_price, ?max_price), igual que en WooCommerce.
 */
export function ProductCatalog(props: ProductCatalogProps) {
  return (
    <Suspense fallback={<CatalogView {...props} filters={defaultFilters} onChange={() => {}} />}>
      <CatalogWithParams {...props} />
    </Suspense>
  );
}

function CatalogWithParams(props: ProductCatalogProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);

  const onChange = (next: CatalogFilters) => {
    // Al cambiar filtros se vuelve a la primera página del listado.
    const target = pathname.includes("/page/") ? props.listPath : pathname;
    router.replace(`${target}${filtersToParams(next)}`, { scroll: false });
  };

  return <CatalogView {...props} filters={filters} onChange={onChange} />;
}

function CatalogView({
  items,
  page,
  listPath,
  perPage,
  groups,
  related,
  filters,
  onChange,
}: ProductCatalogProps & { filters: CatalogFilters; onChange: (f: CatalogFilters) => void }) {
  const [showFilters, setShowFilters] = useState(true);
  const result = paginate(applyFilters(items, filters), page, perPage);
  const query = filtersToParams(filters);

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 pt-12 pb-24 desktop:flex-row desktop:pt-[50px] desktop:pr-[70px] desktop:pl-[30px]">
      {showFilters ? (
        <ProductFilters
          className="order-last w-full shrink-0 desktop:order-first desktop:w-[345px]"
          groups={groups}
          colors={availableColors(items)}
          maxPrice={getMaxPrice(items)}
          filters={filters}
          onChange={onChange}
          related={related}
        />
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-[14px]">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              aria-label={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
              className="flex h-[52px] w-[52px] items-center justify-center border border-brand text-brand hover:bg-brand hover:text-white"
            >
              <Icon name={showFilters ? "close" : "plus"} className="h-3.5 w-3.5" />
            </button>
            <div>
              <p className="text-[11px] leading-4 font-medium tracking-[0.1em] text-brand uppercase" aria-hidden>
                {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
              </p>
              <p className="text-[13px] leading-4 text-muted" role="status">
                {resultCountText(result.total, result.from, result.to)}
              </p>
            </div>
          </div>
          <label className="relative block w-[250px]">
            <span className="sr-only">Ordenar productos</span>
            <select
              value={filters.orderby}
              onChange={(e) => onChange({ ...filters, orderby: e.target.value as SortValue })}
              className="h-10 w-full cursor-pointer appearance-none border border-border bg-surface pr-10 pl-6 text-xs text-muted"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-4 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border border-brand text-brand">
              <Icon name="chevronDown" className="h-2.5 w-2.5" strokeWidth={2} />
            </span>
          </label>
        </div>

        {result.items.length ? (
          <ProductGrid products={result.items} />
        ) : (
          <p className="py-20 text-center text-muted">No se han encontrado productos que coincidan con la selección.</p>
        )}

        {result.totalPages > 1 ? (
          <nav aria-label="Paginación" className="mt-16 flex items-center justify-center gap-3 text-[13px]">
            {result.page > 1 ? (
              <Link
                href={`${routes.page(listPath, result.page - 1)}${query}`}
                aria-label="Página anterior"
                className="p-1 text-navy hover:text-brand"
              >
                <Icon name="chevronRight" className="h-3.5 w-3.5 rotate-180" />
              </Link>
            ) : null}
            {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={`${routes.page(listPath, n)}${query}`}
                aria-current={n === result.page ? "page" : undefined}
                aria-label={`Página ${n}`}
                className={`px-1 ${n === result.page ? "text-brand" : "text-navy hover:text-brand"}`}
              >
                {n}
              </Link>
            ))}
            {result.page < result.totalPages ? (
              <Link
                href={`${routes.page(listPath, result.page + 1)}${query}`}
                aria-label="Página siguiente"
                className="p-1 text-navy hover:text-brand"
              >
                <Icon name="chevronRight" className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
