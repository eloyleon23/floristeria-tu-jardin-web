import { asset } from "@/lib/paths";
import { Container } from "@/components/ui/Container";

export function ExperienceBanner({ icon, text }: { icon: string; text: string }) {
  return (
    <section className="pb-14">
      <Container className="text-center">
        <img src={asset(icon)} alt="" width={120} height={120} className="mx-auto h-[120px] w-[120px]" loading="lazy" />
        <p className="font-display-regular mx-auto mt-6 max-w-[1000px] text-[22px] leading-[1.3] text-navy desktop:text-[28px]">
          {text}
        </p>
      </Container>
    </section>
  );
}
