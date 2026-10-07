import { Container } from "@/components/ui/Container";

/**
 * Pestaña "Descripción" de la ficha. La pestaña "Valoraciones" de WooCommerce no se
 * reconstruye: no hay ninguna valoración publicada y requeriría un backend (ver PROJECT_STATUS).
 */
export function ProductTabs({ name, description }: { name: string; description: string }) {
  return (
    <section className="mt-20 desktop:mt-[85px]" aria-labelledby="tab-descripcion">
      <Container>
        <div role="tablist" className="flex">
          <span
            role="tab"
            id="tab-descripcion"
            aria-selected="true"
            className="-mb-px border border-brand px-[47px] py-[15px] text-xs font-medium tracking-[0.1em] text-brand uppercase"
          >
            Descripción
          </span>
        </div>
      </Container>
      <div role="tabpanel" aria-labelledby="tab-descripcion" className="border-y border-border py-[60px]">
        <Container>
          <h2 className="font-display-regular text-[28px] text-navy">{name}</h2>
          <p className="mt-4 text-body leading-[1.875] text-text">{description || " "}</p>
        </Container>
      </div>
    </section>
  );
}
