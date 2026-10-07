import { eventsContent } from "@/config/content/pages";
import { getPortfolio } from "@/services/catalog";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { EventsGallery } from "@/sections/EventsGallery";

export const metadata = pageMetadata({ title: "Eventos", path: "/eventos/" });

export default async function EventsPage() {
  return (
    <>
      <PageHeader title={eventsContent.title} subtitle={eventsContent.subtitle} image={eventsContent.headerImage} />
      <Container className="pt-[55px] pb-32">
        <EventsGallery items={await getPortfolio()} filters={eventsContent.filters} />
      </Container>
    </>
  );
}
