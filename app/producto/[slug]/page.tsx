import { notFound } from "next/navigation";
import { getCategories, getProductBySlug, getProducts, getRelatedProducts } from "@/services/catalog";
import { toCard } from "@/lib/catalog-view";
import { pageMetadata } from "@/lib/seo";
import { asset } from "@/lib/paths";
import { Container } from "@/components/ui/Container";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};
  const meta = pageMetadata({
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? (product.shortDescription || undefined),
    path: `/producto/${product.slug}/`,
  });
  return product.image ? { ...meta, openGraph: { ...meta.openGraph, images: [asset(product.image.src)] } } : meta;
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();
  const related = (await getRelatedProducts(product)).map(toCard);
  return (
    <>
      <ProductDetail product={product} categories={await getCategories()} />
      {related.length ? (
        <section className="pt-[70px] pb-[140px]" aria-labelledby="relacionados">
          <Container>
            <h2 id="relacionados" className="eyebrow mb-[60px] text-navy!">
              Productos relacionados
            </h2>
            <ProductGrid products={related} headingLevel="h3" />
          </Container>
        </section>
      ) : null}
    </>
  );
}
