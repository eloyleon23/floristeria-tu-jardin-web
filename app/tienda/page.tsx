import { getProducts } from "@/services/catalog";
import { pageMetadata } from "@/lib/seo";
import { CatalogPage } from "@/components/product/CatalogPage";

export const metadata = pageMetadata({ title: "Tienda", path: "/tienda/" });

export default async function ShopPage() {
  return <CatalogPage products={await getProducts()} page={1} listPath="/tienda/" />;
}
