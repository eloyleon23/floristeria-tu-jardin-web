import { notFound } from "next/navigation";
import { getCategories, getCategoryByPath, getProductsByCategory } from "@/services/catalog";
import { totalPages } from "@/lib/catalog-view";
import { pageMetadata } from "@/lib/seo";
import { shopContent } from "@/config/content/pages";
import { CatalogPage } from "@/components/product/CatalogPage";

export const dynamicParams = false;

/** Separa "/flores/rosas/page/2" en ruta de categoría y número de página. */
function parse(slug: string[]) {
  const i = slug.indexOf("page");
  if (i === -1) return { path: slug, page: 1 };
  return { path: slug.slice(0, i), page: Number(slug[i + 1]) };
}

export async function generateStaticParams() {
  const params: { slug: string[] }[] = [];
  for (const c of await getCategories()) {
    const path = c.path.split("/").filter(Boolean).slice(1);
    params.push({ slug: path });
    const pages = totalPages((await getProductsByCategory(c.slug)).length, shopContent.perPage);
    for (let p = 2; p <= pages; p++) params.push({ slug: [...path, "page", String(p)] });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { path, page } = parse((await params).slug);
  const category = await getCategoryByPath(path);
  if (!category) return {};
  return pageMetadata({
    title: page > 1 ? `${category.name} archivos - Página ${page}` : `${category.name} archivos`,
    path: page > 1 ? `${category.path}page/${page}/` : category.path,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { path, page } = parse((await params).slug);
  const category = await getCategoryByPath(path);
  if (!category || !Number.isInteger(page) || page < 1) notFound();
  const products = await getProductsByCategory(category.slug);
  return <CatalogPage products={products} page={page} listPath={category.path} category={category} />;
}
