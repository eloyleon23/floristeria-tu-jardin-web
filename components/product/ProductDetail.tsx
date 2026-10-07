import Link from "next/link";
import type { Category, Product } from "@/types/catalog";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/ui/Container";
import { Picture } from "@/components/ui/Picture";
import { ProductTabs } from "./ProductTabs";

/** Ficha de producto: imagen a la izquierda, título, precio, descripción y categorías a la derecha. */
export function ProductDetail({ product, categories }: { product: Product; categories: Category[] }) {
  const productCategories = product.subcategories
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is Category => Boolean(c))
    // Igual que WooCommerce: subcategorías primero, en orden alfabético.
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  return (
    <>
      <Container className="grid gap-10 pt-5 desktop:grid-cols-[580px_1fr] desktop:gap-[135px] desktop:pt-[60px]">
        <div className="bg-[#f0f2fb]">
          {product.image ? (
            <Picture
              image={product.image}
              priority
              sizes="(min-width: 1025px) 580px, 100vw"
              className="h-auto w-full"
            />
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center text-sm text-muted">Imagen pendiente</div>
          )}
        </div>
        <div className="pt-1">
          <h1 className="font-display-black text-[40px] leading-[1.1] text-heading desktop:text-h2">{product.name}</h1>
          <p className="mt-6 text-[33px] font-light text-brand">{formatPrice(product.price)}</p>
          {product.shortDescription ? (
            <p className="mt-10 text-body leading-[1.875] text-text">{product.shortDescription}</p>
          ) : null}
          <p className="mt-8 text-xs tracking-[0.05em] text-navy">
            <span className="font-medium">{productCategories.length > 1 ? "Categorías:" : "Categoría:"}</span>{" "}
            {productCategories.map((c, i) => (
              <span key={c.slug}>
                {i > 0 ? ", " : null}
                <Link href={c.path} className="text-muted hover:text-brand">
                  {c.name}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </Container>
      <ProductTabs name={product.name} description={product.description} />
    </>
  );
}
