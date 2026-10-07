import Link from "next/link";
import type { CardProduct } from "@/lib/catalog-view";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/paths";
import { Picture } from "@/components/ui/Picture";

/** Tarjeta de producto: imagen 3:4, nombre y precio centrados. */
export function ProductCard({
  product,
  sizes = "(min-width: 1025px) 320px, (min-width: 640px) 33vw, 50vw",
  headingLevel: H = "h2",
}: {
  product: CardProduct;
  sizes?: string;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <article className="group text-center">
      <Link href={routes.product(product.slug)} className="block">
        <div className="aspect-[3/4] overflow-hidden bg-border">
          {product.image ? (
            <Picture
              image={product.image}
              sizes={sizes}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted">Imagen pendiente</div>
          )}
        </div>
        <H className="mt-[22px] px-2 text-[13px] leading-5 font-medium tracking-[0.02em] text-navy transition-colors group-hover:text-brand">
          {product.name}
        </H>
      </Link>
      <p className="mt-1 text-[15px] text-brand">{formatPrice(product.price)}</p>
    </article>
  );
}
