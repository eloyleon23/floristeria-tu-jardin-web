import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

/** Migas de pan sobre la cabecera con imagen ("Home / Tienda / … / Coronas"). */
export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Migas de pan" className={className}>
      <ol className="flex flex-wrap items-center text-xs text-accent">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            {i > 0 ? (
              <span className="mx-1.5" aria-hidden>
                /
              </span>
            ) : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
