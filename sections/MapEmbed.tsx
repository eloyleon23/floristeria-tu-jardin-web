import { site } from "@/config/site";

/** Mapa de Google (como en la web original), con carga diferida. */
export function MapEmbed() {
  return (
    <div className="h-[350px] desktop:ml-[max(20px,calc((100vw-1300px)/2))]">
      <iframe
        src={site.mapEmbedUrl}
        title={`Mapa: ${site.address.street}, ${site.address.city}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  );
}
