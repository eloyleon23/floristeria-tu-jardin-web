import type { CardProduct } from "@/lib/catalog-view";
import { ProductCard } from "./ProductCard";

/** Rejilla de productos: 4 columnas en escritorio, 3 en tablet, 2 en móvil (como el original). */
export function ProductGrid({
  products,
  columns = 4,
  headingLevel,
}: {
  products: CardProduct[];
  columns?: 3 | 4;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <ul className={`grid grid-cols-2 gap-x-[10px] gap-y-12 sm:grid-cols-3 ${columns === 4 ? "lg:grid-cols-4" : ""}`}>
      {products.map((p) => (
        <li key={p.slug}>
          <ProductCard product={p} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
