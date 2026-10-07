import { cookiesPolicy } from "@/config/content/legal";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = pageMetadata({ title: "Política de Cookies", path: "/politica-cookies/" });

export default function CookiesPage() {
  return <LegalPage title="Política de Cookies" sections={cookiesPolicy} />;
}
