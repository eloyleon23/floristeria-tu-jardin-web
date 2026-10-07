import type { Category, Product } from "@/types/catalog";
import { getCategories, getFeaturedProducts } from "@/services/catalog";
import { toCard } from "@/lib/catalog-view";
import { shopContent } from "@/config/content/pages";
import { PageHeader } from "@/components/layout/PageHeader";
import type { Crumb } from "@/components/layout/Breadcrumbs";
import { ProductCatalog } from "./ProductCatalog";
import type { FilterGroup } from "./ProductFilters";

/** Página de listado (Tienda o categoría) con cabecera, filtros y rejilla. */
export async function CatalogPage({
  products,
  page,
  listPath,
  category,
}: {
  products: Product[];
  page: number;
  listPath: string;
  /** Categoría actual; `undefined` = Tienda. */
  category?: Category;
}) {
  const categories = await getCategories();
  const related = (await getFeaturedProducts(4)).map(toCard);
  const groups = buildGroups(categories, products, category);

  const parent = category?.parent ? categories.find((c) => c.slug === category.parent) : undefined;
  const breadcrumbs: Crumb[] | undefined = category
    ? [
        { label: "Home", href: "/" },
        { label: "Tienda", href: "/tienda/" },
        ...(parent ? [{ label: parent.name, href: parent.path }] : []),
        { label: category.name },
      ]
    : undefined;

  return (
    <>
      {category ? (
        <PageHeader title={category.name} image={category.headerImage} variant="standard" breadcrumbs={breadcrumbs} />
      ) : (
        <PageHeader title={shopContent.title} subtitle={shopContent.subtitle} image={shopContent.headerImage} />
      )}
      <ProductCatalog
        items={products.map(toCard)}
        page={page}
        listPath={listPath}
        perPage={shopContent.perPage}
        groups={groups}
        related={related}
      />
    </>
  );
}

/** Grupos de categorías de la barra lateral (solo subcategorías con productos en el listado). */
function buildGroups(categories: Category[], products: Product[], current?: Category): FilterGroup[] {
  const present = new Set(products.flatMap((p) => p.subcategories));
  const rootSlug = current ? (current.parent ?? current.slug) : null;
  const roots = categories.filter((c) => !c.parent && (rootSlug === null || c.slug === rootSlug));
  return roots
    .map((root) => ({
      title: root.name,
      links: categories
        .filter((c) => c.parent === root.slug && present.has(c.slug))
        .sort((a, b) => a.menuName.localeCompare(b.menuName, "es"))
        .map((c) => ({ label: c.menuName, href: c.path, active: c.slug === current?.slug })),
    }))
    .filter((g) => g.links.length > 0);
}
