/** Textos de la página de inicio (literales de la web original). */
export const homeContent = {
  hero: [
    {
      title: ["Ramos únicos.", "¡Díselo con flores!"],
      cta: { label: "Nuestros Ramos", href: "/product-category/flores/ramos-flores/" },
      image: "/images/home/hero-ramos.webp",
    },
    {
      title: ["Un gran recuerdo,", "la mejor despedida."],
      cta: { label: "Servicios funerarios", href: "/product-category/funerarios/" },
      image: "/images/home/hero-funerarios.webp",
    },
    {
      title: ["La planta perfecta", "para cada hogar."],
      cta: { label: "Nuestras Plantas", href: "/product-category/plantas/" },
      image: "/images/home/hero-plantas.webp",
    },
  ],
  featured: {
    eyebrow: "Destacados del mes",
    title: "Dale color a la primavera",
    limit: 4,
  },
  experience: {
    icon: "/images/icons/flores.png",
    text: "Bodas, bautizos, comuniones, eventos... más de 30 años de experiencia nos avalan para hacer que tu día sea inolvidable.",
  },
  /**
   * Mosaico de categorías. `span` = columnas×filas sobre una rejilla de 4 columnas
   * (orden y tamaños idénticos a la web original).
   */
  mosaic: [
    {
      type: "image",
      title: "Nuestras Flores",
      href: "/product-category/flores/",
      image: "/images/home/mosaico-flores.webp",
      span: [2, 2],
    },
    { type: "text", text: "Flores exóticas o de temporada. Tú eliges el color que tiene el día.", span: [1, 2] },
    {
      type: "image",
      title: "Rosas",
      href: "/product-category/flores/rosas/",
      image: "/images/home/mosaico-rosas.webp",
      span: [1, 2],
    },
    {
      type: "text",
      text: "¿Os casáis? Pregunta por nuestros packs especiales de decoración y ramos de novia.",
      span: [1, 2],
    },
    {
      type: "image",
      title: "Ramos",
      href: "/portfolio-item/ramos-novia/",
      image: "/images/home/mosaico-ramos.webp",
      span: [2, 2],
    },
    {
      type: "image",
      title: "Orquídeas",
      href: "/product-category/plantas/orquideas/",
      image: "/images/home/mosaico-orquideas.webp",
      span: [1, 1],
    },
    {
      type: "image",
      title: "Coronas",
      href: "/product-category/funerarios/coronas/",
      image: "/images/home/mosaico-coronas.webp",
      span: [1, 1],
    },
    {
      type: "image",
      title: "Plantas para el hogar",
      href: "/product-category/plantas/",
      image: "/images/home/mosaico-plantas.webp",
      span: [2, 1],
    },
    {
      type: "image",
      title: "Servicios funerarios",
      href: "/product-category/funerarios/",
      image: "/images/home/mosaico-funerarios.webp",
      span: [1, 1],
    },
    { type: "text", text: "Trabajos por encargo y a medida de tus necesidades.", span: [1, 1] },
  ] as const,
  promo: {
    eyebrow: "¡Sorprende este San Valentín!",
    title: "Ideas para un día muy especial",
    // Vídeo enlazado en la web original. TODO: confirmar que es propiedad de la floristería.
    youtubeId: "K-0cjGCNYfs",
    poster: "/images/home/video-san-valentin.webp",
    items: [
      { icon: "/images/icons/mano.png", text: "Seleccionadas a mano solo para ti." },
      { icon: "/images/icons/composicion.png", text: "Composiciones únicas." },
      { icon: "/images/icons/corazon.png", text: "La mejor manera de demostrar tu cariño." },
    ],
  },
};
