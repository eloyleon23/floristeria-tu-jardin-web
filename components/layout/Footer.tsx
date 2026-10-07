import Link from "next/link";
import { footerColumns } from "@/config/navigation";
import { site } from "@/config/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="bg-navy text-accent">
      <Container className="grid grid-cols-1 gap-10 pt-20 pb-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {footerColumns.map((column, i) => (
          <div key={i} className="space-y-10">
            {column.map((group) => (
              <div key={group.title}>
                <h2 className="mb-5 text-xs font-medium tracking-[0.1em] uppercase">{group.title}</h2>
                <ul className="space-y-[7px]">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className="text-xs leading-5 font-medium hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </Container>
      <Container className="flex flex-col items-center gap-6 border-t border-accent/60 py-6 text-center text-xs sm:flex-row sm:justify-between sm:text-left">
        <p>
          Diseño y maquetación{" "}
          <a href={site.credits.url} className="font-medium hover:text-white" rel="noopener" target="_blank">
            {site.credits.label}
          </a>{" "}
          {site.credits.year} ©
        </p>
        <ul className="flex gap-7 text-[11px] font-medium tracking-[0.15em] uppercase">
          <li>
            <a href={site.social.facebook} target="_blank" rel="noopener" className="hover:text-white">
              Facebook
            </a>
          </li>
          <li>
            <a href={site.social.instagram} target="_blank" rel="noopener" className="hover:text-white">
              Instagram
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
