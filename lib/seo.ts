import type { Metadata } from "next";
import { site } from "@/config/site";

/**
 * Metadatos por página. Fase 1: título con el mismo patrón que la web actual
 * ("Página - Floristería Tu Jardín"). La optimización SEO completa es la Fase 6.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description?: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} - ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: "es_ES",
      type: "website",
    },
  };
}
