import Link from "next/link";
import { getCategories } from "@/services/catalog";
import { buildMainMenu } from "@/lib/navigation";
import { asset } from "@/lib/paths";
import { site } from "@/config/site";
import { Navigation } from "./Navigation";
import { MobileNavigation } from "./MobileNavigation";

/** Cabecera: escritorio (160 px, logotipo circular) y móvil (70 px, logotipo textual). */
export async function Header() {
  const menu = buildMainMenu(await getCategories());
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2"
      >
        Saltar al contenido
      </a>
      <header className="relative z-40 hidden h-(--spacing-header) bg-surface desktop:block">
        <div className="mx-auto flex h-full w-[calc(100%-40px)] max-w-(--container-site) items-center justify-between">
          <Link href="/" className="ml-6 block shrink-0" aria-label={`${site.name} — inicio`}>
            <img
              src={asset("/images/brand/logo.png")}
              alt={site.name}
              width={111}
              height={100}
              className="h-[100px] w-auto"
            />
          </Link>
          <Navigation items={menu} />
        </div>
      </header>
      <MobileNavigation items={menu} />
    </>
  );
}
