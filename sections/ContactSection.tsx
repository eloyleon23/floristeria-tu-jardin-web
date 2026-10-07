import { contactContent } from "@/config/content/pages";
import { formattedAddress, site } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/forms/ContactForm";

const tel = (n: string) => `tel:+34${n.replace(/\s/g, "")}`;

export function ContactSection() {
  const c = contactContent;
  return (
    <section className="bg-surface pt-16 pb-24 desktop:pt-[100px] desktop:pb-[120px]">
      <Container className="grid gap-16 desktop:grid-cols-2 desktop:gap-[60px] desktop:px-[35px]">
        <div>
          <p className="eyebrow">{c.eyebrow}</p>
          <h1 className="font-display-black mt-2 text-[44px] leading-[1.1] text-navy desktop:text-h2">{c.title}</h1>
          <p className="mt-10 text-body leading-[1.875] text-navy">{c.text}</p>
          <address className="mt-12 space-y-5 text-body text-navy not-italic">
            <p className="flex gap-6">
              <Icon name="mapPin" className="mt-1 h-5 w-5 shrink-0 text-brand" />
              {formattedAddress}
            </p>
            <div className="flex gap-6">
              <Icon name="phone" className="mt-1 h-5 w-5 shrink-0 text-brand" />
              <div className="space-y-2">
                <p>
                  {site.phones.map((p, i) => (
                    <span key={p}>
                      {i > 0 ? " | " : null}
                      <a href={tel(p)} className="hover:text-brand">
                        {p}
                      </a>
                    </span>
                  ))}
                </p>
                <p>
                  {site.mobiles.map((p, i) => (
                    <span key={p}>
                      {i > 0 ? " | " : null}
                      <a href={tel(p)} className="hover:text-brand">
                        {p}
                      </a>
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <p className="flex gap-6">
              <Icon name="mail" className="mt-1 h-5 w-5 shrink-0 text-brand" />
              <a href={`mailto:${site.email}`} className="hover:text-brand">
                {site.email}
              </a>
            </p>
          </address>
        </div>
        <div>
          <h2 className="eyebrow">{c.form.eyebrow}</h2>
          <p className="mt-5 mb-9 text-body text-navy">{c.form.text}</p>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
