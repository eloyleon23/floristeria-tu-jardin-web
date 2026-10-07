import type { LegalSection } from "@/config/content/legal";
import { legalNotice } from "@/config/content/legal";
import { shopContent } from "@/config/content/pages";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "./PageHeader";

export function LegalPage({
  title,
  sections,
  pendingReview = true,
}: {
  title: string;
  sections: LegalSection[];
  pendingReview?: boolean;
}) {
  return (
    <>
      <PageHeader
        title={title}
        image={shopContent.headerImage}
        variant="standard"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
      />
      <Container className="prose-legal max-w-[900px] py-16 desktop:py-24">
        {pendingReview ? (
          <p role="note" className="mb-10 border-l-4 border-brand bg-brand/5 p-4 text-sm! text-navy">
            {legalNotice}
          </p>
        ) : null}
        {sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            {s.paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {s.list ? (
              <ul>
                {s.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </Container>
    </>
  );
}
