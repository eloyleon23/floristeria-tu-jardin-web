import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="font-display-black mt-3 text-[44px] leading-tight text-navy desktop:text-h2">
        Página no encontrada
      </h1>
      <p className="mx-auto mt-6 max-w-[520px] text-body text-navy">
        La página que buscas no existe o ha cambiado de dirección.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/">Volver al inicio</ButtonLink>
        <ButtonLink href="/tienda/">Ver la tienda</ButtonLink>
      </div>
    </Container>
  );
}
