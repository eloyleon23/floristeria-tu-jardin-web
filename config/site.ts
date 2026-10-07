/**
 * Datos de la empresa. Fuente única: cualquier componente que muestre
 * teléfonos, dirección o redes los toma de aquí.
 * Valores tomados de https://floristeriatujardin.es/contacto/ (octubre 2026).
 */
export const site = {
  name: "Floristería Tu Jardín",
  shortName: "Tu Jardín",
  tagline: "Díselo con Flores",
  foundedYear: 1987,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://floristeriatujardin.es",
  env: (process.env.NEXT_PUBLIC_SITE_ENV ?? "development") as "development" | "preview" | "production",
  address: {
    street: "Plaza de la Constitución, 5",
    postalCode: "13170",
    city: "Miguelturra",
    region: "Ciudad Real",
    country: "España",
  },
  phones: ["926 24 15 23", "926 24 03 67"],
  mobiles: ["659 86 82 52", "637 52 20 84"],
  email: "contacto@floristeriatujardin.es",
  /** TODO: información pendiente de confirmar */
  openingHours: null as string | null,
  social: {
    facebook: "https://www.facebook.com/Floristeria-TU-Jardin-800317736684884",
    instagram: "https://www.instagram.com/floristeriatujardin/",
  },
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Plaza%20de%20la%20Constituci%C3%B3n%2C%205%2C%2013170%20Miguelturra%2C%20Ciudad%20Real&t=m&z=18&output=embed&iwloc=near",
  credits: { label: "MunDesignStudio", url: "https://mundesignstudio.es/", year: 2021 },
} as const;

export const formattedAddress = `${site.address.street} - ${site.address.postalCode}, ${site.address.city}`;
