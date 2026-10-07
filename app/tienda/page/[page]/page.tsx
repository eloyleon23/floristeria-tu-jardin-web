import { notFound } from "next/navigation";
import { getProducts } from "@/services/catalog";
import { totalPages } from "@/lib/catalog-view";
import { pageMetadata } from "@/lib/seo";
import { shopContent } from "@/config/content/pages";
import { CatalogPage } from "@/components/product/CatalogPage";

export const dynamicParams = false;

export async function generateStaticParams() {
  const pages = totalPages((await getProducts()).length, shopContent.perPage);
  return Array.from({ length: pages - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return pageMetadata({ title: `Tienda - Página ${page}`, path: `/tienda/page/${page}/` });
}

export default async function ShopPaginated({ params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 2) notFound();
  return <CatalogPage products={await getProducts()} page={page} listPath="/tienda/" />;
}
