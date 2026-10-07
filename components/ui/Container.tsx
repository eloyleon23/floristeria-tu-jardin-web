import type { ElementType, ReactNode } from "react";

/** Contenedor de 1300 px de la web original, con 20 px de margen lateral en pantallas pequeñas. */
export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={`mx-auto w-[calc(100%-40px)] max-w-(--container-site) ${className}`}>{children}</Tag>;
}
