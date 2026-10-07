import Link from "next/link";
import { notFound } from "next/navigation";
import { eventsContent } from "@/config/content/pages";
import { getPortfolio, getPortfolioItem } from "@/services/catalog";
import { pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/paths";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { PortfolioGallery } from "@/sections/PortfolioGallery";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPortfolio()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getPortfolioItem((await params).slug);
  return item
    ? pageMetadata({ title: item.title, description: item.description, path: routes.portfolio(item.slug) })
    : {};
}

export default async function PortfolioItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await getPortfolio();
  const index = all.findIndex((p) => p.slug === slug);
  const item = all[index];
  if (!item) notFound();
  const prev = all[index - 1];
  const next = all[index + 1];
  const label = (s: string) => eventsContent.filters.find((f) => f.slug === s)?.label ?? s;

  return (
    <>
      <PageHeader title={item.title} image={eventsContent.headerImage} variant="standard" />
      <Container className="pt-10 pb-24 desktop:pt-[50px]">
        <PortfolioGallery images={item.gallery} />
        <div className="mt-12 grid gap-8 md:grid-cols-[2fr_1fr]">
          <p className="text-body leading-[1.875] text-navy">{item.description}</p>
          <p className="text-xs tracking-[0.05em] text-navy">
            <span className="font-medium uppercase">Categoría:</span> {item.categories.map(label).join(", ")}
          </p>
        </div>
        <nav
          aria-label="Otros trabajos"
          className="mt-16 flex items-center justify-between border-t border-border pt-8 text-brand"
        >
          {prev ? (
            <Link href={routes.portfolio(prev.slug)} aria-label={`Anterior: ${prev.title}`}>
              <Icon name="arrowLeft" className="h-6 w-[50px]" strokeWidth={1} />
            </Link>
          ) : (
            <span />
          )}
          <Link href="/eventos/" className="text-xs font-medium tracking-[0.1em] uppercase hover:text-navy">
            Eventos
          </Link>
          {next ? (
            <Link href={routes.portfolio(next.slug)} aria-label={`Siguiente: ${next.title}`}>
              <Icon name="arrowRight" className="h-6 w-[50px]" strokeWidth={1} />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </Container>
    </>
  );
}
