import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  /** Botón píldora con borde crema (slider de la home). */
  outlineAccent: "rounded-full border-2 border-accent px-10 py-5 text-accent hover:bg-accent hover:text-navy",
  /** Botón rectangular rosa (formularios). */
  solid: "bg-brand px-11 py-5 text-white hover:bg-brand-dark",
};

export const buttonClass = (variant: keyof typeof variants) =>
  `inline-block text-xs font-medium uppercase tracking-[0.1em] transition-colors ${variants[variant]}`;

export function ButtonLink({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <Link href={href} className={`${buttonClass(variant)} ${className}`}>
      {children}
    </Link>
  );
}
