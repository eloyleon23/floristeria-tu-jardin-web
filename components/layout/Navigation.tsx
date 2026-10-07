"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavLink } from "@/config/navigation";
import { isActive } from "@/lib/navigation";

/** Menú de escritorio con desplegables (hover, foco de teclado y Escape). */
export function Navigation({ items }: { items: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav aria-label="Menú principal" className="h-full">
      <ul className="flex h-full items-stretch" onKeyDown={(e) => e.key === "Escape" && setOpen(null)}>
        {items.map((item) => {
          const active = isActive(item.href, pathname);
          const expanded = open === item.href;
          return (
            <li
              key={item.href}
              className="relative flex items-center"
              onMouseEnter={() => item.children && setOpen(item.href)}
              onMouseLeave={() => setOpen(null)}
              onFocus={() => item.children && setOpen(item.href)}
              onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(null)}
            >
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-haspopup={item.children ? "true" : undefined}
                aria-expanded={item.children ? expanded : undefined}
                className={`px-5 text-xs leading-[22px] font-medium tracking-[0.1em] uppercase transition-colors hover:text-brand ${
                  active || expanded ? "text-brand" : "text-navy"
                }`}
              >
                <span className={`border-b pb-0.5 ${active || expanded ? "border-brand" : "border-transparent"}`}>
                  {item.label}
                </span>
              </Link>
              {item.children ? (
                <ul
                  className={`absolute top-full left-0 w-[210px] bg-surface py-[18px] transition-opacity duration-200 ${
                    expanded ? "visible opacity-100" : "invisible opacity-0"
                  }`}
                >
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={`block px-[26px] py-2 text-[13px] leading-[19px] font-medium hover:text-brand ${
                          isActive(child.href, pathname) ? "text-brand" : "text-navy"
                        }`}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
