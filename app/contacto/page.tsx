import { pageMetadata } from "@/lib/seo";
import { MapEmbed } from "@/sections/MapEmbed";
import { ContactSection } from "@/sections/ContactSection";

export const metadata = pageMetadata({ title: "Contacto", path: "/contacto/" });

export default function ContactPage() {
  return (
    <>
      <MapEmbed />
      <ContactSection />
    </>
  );
}
