import { privacyPolicy } from "@/config/content/legal";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = pageMetadata({ title: "Política de privacidad", path: "/politica-privacidad/" });

export default function PrivacyPage() {
  return <LegalPage title="Política de privacidad" sections={privacyPolicy} />;
}
