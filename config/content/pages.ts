/** Textos de páginas interiores (literales de la web original). */

export const shopContent = {
  title: "Tienda",
  subtitle: "Flores y plantas para este otoño",
  headerImage: "/images/headers/tj-tienda.webp",
  perPage: 20,
  relatedTitle: "Te puede interesar",
};

export const aboutContent = {
  title: "Nosotros",
  subtitle: "Dónde las flores son nuestra inspiración",
  headerImage: "/images/headers/tj-eventos.webp",
  intro: {
    eyebrow: "Una empresa familiar",
    title: "Más de 30 años de experiencia",
    paragraphs: [
      "Somos una empresa familiar que nace en la década de los 80. Hoy, más de 30 años después, nuestra experiencia nos avala.",
      "Dos generaciones de floristas expertos, detallistas y ágiles, que pone todo el cariño en cada trabajo para conseguir con flores lo que no se puede transmitir con palabras.",
    ],
  },
  flowers: {
    eyebrow: "Más de 30 años a tu servicio",
    title: "Díselo con flores",
    // Texto literal; "ápoca" es una errata de la web original pendiente de confirmar su corrección.
    paragraphs: [
      "Trabajamos nuestras flores y plantas en cada ápoca del año con mimo, dando color y vitalidad en momentos y espacios muy especiales. Toda una gran variedad de productos a la disposición de las necesidades y gustos de nuestros clientes.",
    ],
  },
  team: {
    eyebrow: "El mejor equipo",
    title: "Expertos floristas",
    text: "Combinamos tradición y creatividad para que nuestras flores hablen por sí solas. Nuestro objetivo, tu sonrisa.",
    // Nombres tal cual aparecen en la web original. TODO: confirmar nombres (aparece "Miguél León" dos veces).
    members: [
      { name: "Miguél León", role: "Florista Master", photo: "/images/equipo/miguel-leon.png" },
      { name: "Marisa", role: "Florista", photo: "/images/equipo/marisa.png" },
      { name: "Miguél León Senior", role: "Florista Master", photo: "/images/equipo/miguel-leon-senior.png" },
    ],
  },
};

export const eventsContent = {
  title: "Eventos",
  subtitle: "Cuidamos cada detalle para que tu día sea inolvidable.",
  headerImage: "/images/headers/tj-eventos.webp",
  filters: [
    { slug: "bautizos", label: "Bautizos" },
    { slug: "bodas", label: "Bodas" },
    { slug: "carnaval", label: "Carnaval" },
    { slug: "celebraciones", label: "Celebraciones" },
    { slug: "comuniones", label: "Comuniones" },
    { slug: "semana-santa", label: "Semana Santa" },
  ],
};

export const contactContent = {
  eyebrow: "Trabajos personalizados y a medida",
  title: "Ven a conocernos",
  text: "Una idea, un evento o una ocasión especial. Tratamos con mimo y de manera personalizada nuestras flores y plantas para conseguir un resultado inolvidable.",
  form: {
    eyebrow: "Cuéntanos qué necesitas",
    text: "Te responderemos en la mayor brevedad posible. Gracias!",
  },
};
