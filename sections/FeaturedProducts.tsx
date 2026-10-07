import type { CardProduct } from "@/lib/catalog-view";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";

export function FeaturedProducts({
  eyebrow,
  title,
  products,
}: {
  eyebrow: string;
  title: string;
  products: CardProduct[];
}) {
  return (
    <section className="pt-5 pb-[60px] desktop:pt-0">
      <Container>
        <div className="text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="font-display-regular mt-2 text-[28px] leading-tight text-navy desktop:text-h3">{title}</h2>
        </div>
        <ul className="mt-[60px] grid grid-cols-2 gap-x-[10px] gap-y-10 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} headingLevel="h3" sizes="(min-width: 1025px) 318px, 50vw" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
