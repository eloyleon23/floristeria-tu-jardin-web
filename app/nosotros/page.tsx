import { aboutContent } from "@/config/content/pages";
import { testimonials } from "@/config/content/testimonials";
import { getGalleries } from "@/services/catalog";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ImageCarousel } from "@/sections/ImageCarousel";
import { TeamGrid } from "@/sections/TeamGrid";
import { Testimonials } from "@/sections/Testimonials";

export const metadata = pageMetadata({ title: "Nosotros", path: "/nosotros/" });

function TextBlock({ eyebrow, title, paragraphs }: { eyebrow: string; title: string; paragraphs: string[] }) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="font-display-black mt-2 text-[40px] leading-[1.1] text-navy desktop:text-h2">{title}</h2>
      <div className="mt-8 text-[15px] leading-[1.95] text-navy">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );
}

export default async function AboutPage() {
  const c = aboutContent;
  const galleries = await getGalleries();
  return (
    <>
      <PageHeader title={c.title} subtitle={c.subtitle} image={c.headerImage} />
      <Container className="space-y-24 py-[45px] desktop:space-y-[120px]">
        <div className="grid items-start gap-10 desktop:grid-cols-2 desktop:gap-[60px]">
          <TextBlock {...c.intro} />
          <ImageCarousel images={galleries.nosotrosTienda} label="Nuestra floristería" />
        </div>
        <div className="grid items-start gap-10 desktop:grid-cols-2 desktop:gap-[60px]">
          <TextBlock {...c.flowers} />
          <ImageCarousel images={galleries.nosotrosFlores} label="Nuestras flores" />
        </div>
      </Container>
      <section className="mt-12 bg-surface py-24">
        <Container className="text-center">
          <p className="eyebrow">{c.team.eyebrow}</p>
          <h2 className="font-display-black mt-2 text-[40px] leading-[1.1] text-navy desktop:text-h2">
            {c.team.title}
          </h2>
          <p className="mx-auto mt-6 max-w-[600px] text-[15px] leading-[1.95] text-navy">{c.team.text}</p>
          <TeamGrid members={c.team.members} />
        </Container>
      </section>
      <Testimonials items={testimonials} arrows />
    </>
  );
}
