/**
 * Menús de la web. Las subcategorías del menú principal salen del catálogo
 * (data/categories.json) para que menú y categorías no se desincronicen.
 */
export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

/** Elementos del menú principal. `category` indica que sus hijos son las subcategorías de esa raíz. */
export const mainMenu: { label: string; href: string; category?: string }[] = [
  { label: "Tienda", href: "/tienda/" },
  { label: "Ocasiones", href: "/product-category/ocasiones/", category: "ocasiones" },
  { label: "Flores", href: "/product-category/flores/", category: "flores" },
  { label: "Plantas", href: "/product-category/plantas/", category: "plantas" },
  { label: "Servicios Funerarios", href: "/product-category/funerarios/", category: "funerarios" },
  { label: "Eventos", href: "/eventos/" },
  { label: "Nosotros", href: "/nosotros/" },
  { label: "Contacto", href: "/contacto/" },
];

/** Columnas del pie, en el mismo orden y con los mismos textos que la web original. */
export const footerColumns: { title: string; links: NavLink[] }[][] = [
  [
    {
      title: "Sobre nosotros",
      links: [
        { label: "Nosotros", href: "/nosotros/" },
        { label: "Eventos", href: "/eventos/" },
        { label: "Contacto", href: "/contacto/" },
        { label: "Tienda", href: "/tienda/" },
        { label: "Política de privacidad", href: "/politica-privacidad/" },
      ],
    },
  ],
  [
    {
      title: "Ocasiones",
      links: [
        { label: "Navidad", href: "/product-category/ocasiones/navidad/" },
        { label: "Regalo", href: "/product-category/ocasiones/regalo/" },
        { label: "Nacimiento", href: "/product-category/ocasiones/nacimiento/" },
        { label: "Enamorados", href: "/product-category/ocasiones/enamorados/" },
      ],
    },
  ],
  [
    {
      title: "Flores",
      links: [
        { label: "Rosas", href: "/product-category/flores/rosas/" },
        // En la web original este enlace apuntaba a /preservado/ (404); se corrige el destino.
        { label: "Preservado", href: "/product-category/flores/preservadas/" },
        { label: "Ramos", href: "/product-category/flores/ramos-flores/" },
        { label: "Centros", href: "/product-category/flores/centros-flores/" },
      ],
    },
    {
      title: "Plantas",
      links: [
        { label: "Interior", href: "/product-category/plantas/interior/" },
        { label: "Orquídeas", href: "/product-category/plantas/orquideas/" },
        { label: "Centros", href: "/product-category/plantas/centros-plantas/" },
      ],
    },
  ],
  [
    {
      title: "Servicios Funerarios",
      links: [
        { label: "Coronas", href: "/product-category/funerarios/coronas/" },
        { label: "Ramos", href: "/product-category/funerarios/funerarios-ramos/" },
        { label: "Centros", href: "/product-category/funerarios/funerarios-centros/" },
        { label: "Corazones", href: "/product-category/funerarios/corazones/" },
        { label: "Cruces", href: "/product-category/funerarios/cruces/" },
      ],
    },
  ],
];
