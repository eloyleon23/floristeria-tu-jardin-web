import { legalAdvice } from "@/config/content/legal";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = pageMetadata({ title: "Aviso legal", path: "/aviso-legal/" });

export default function LegalAdvicePage() {
  return <LegalPage title="Aviso legal" sections={legalAdvice} />;
}
