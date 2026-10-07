import { asset } from "@/lib/paths";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Cabecera de página con imagen duotono (".mkdf-title-holder" del tema original):
 *  - "centered": 320 px, título grande centrado y subtítulo (Tienda, Eventos, Nosotros)
 *  - "standard": 160 px, título a la izquierda y migas a la derecha (categorías, legales)
 */
export function PageHeader({
  title,
  subtitle,
  image,
  variant = "centered",
  breadcrumbs,
}: {
  title: string;
  subtitle?: string;
  image: string;
  variant?: "centered" | "standard";
  breadcrumbs?: Crumb[];
}) {
  const centered = variant === "centered";
  return (
    <div
      className={`relative bg-cover bg-center pt-(--spacing-header-mobile) desktop:pt-0 ${
        centered ? "desktop:h-[320px]" : "desktop:h-[160px]"
      }`}
      style={{ backgroundImage: `url(${asset(image)})` }}
    >
      <div
        className={`mx-auto flex h-full w-[calc(100%-40px)] max-w-(--container-site) py-10 desktop:py-0 ${
          centered
            ? "flex-col items-center justify-center text-center"
            : "flex-col justify-center gap-3 desktop:flex-row desktop:items-center desktop:justify-between"
        }`}
      >
        <h1
          className={`font-display-black text-accent ${
            centered ? "text-[48px] leading-none desktop:text-[86px]" : "text-[40px] leading-tight desktop:text-h1"
          }`}
        >
          {title}
        </h1>
        {subtitle ? <p className="eyebrow mt-3 text-accent! desktop:mt-4">{subtitle}</p> : null}
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      </div>
    </div>
  );
}
