/**
 * Importa el catálogo y los recursos gráficos de la web WordPress actual
 * (https://floristeriatujardin.es) y los deja listos para la nueva web:
 *
 *   - data/products.json, data/categories.json, data/portfolio.json
 *   - public/images/** optimizadas a WebP
 *
 * Solo lee la API pública de WooCommerce (Store API) y páginas públicas.
 * Es idempotente: las imágenes ya descargadas no se vuelven a procesar.
 *
 * Uso: npm run import:wordpress
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { Category, ImageRef, PortfolioItem, Product } from "../types/catalog";

const ORIGIN = "https://floristeriatujardin.es";
const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const UA = { "User-Agent": "Mozilla/5.0 (migracion floristeria-tu-jardin-web)" };

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

async function exists(file: string) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function fetchText(url: string) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function fetchJson<T>(url: string): Promise<T> {
  return JSON.parse(await fetchText(url)) as T;
}

function decodeEntities(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(s: string) {
  return decodeEntities(
    s
      .replace(/\[[^\]]*\]/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).trim();
}

function absolute(url: string) {
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("/")) return ORIGIN + url;
  return url.replace(/^http:/, "https:");
}

interface Variant {
  suffix: string;
  width: number;
}

/**
 * Descarga una imagen y genera variantes WebP. Devuelve la referencia pública
 * de la variante principal y de la miniatura.
 */
async function importImage(
  url: string,
  dest: string,
  alt: string,
  { main = 1400, thumb = 600, quality = 78 }: { main?: number; thumb?: number; quality?: number } = {},
): Promise<ImageRef> {
  const variants: Variant[] = [
    { suffix: "", width: main },
    { suffix: "-sm", width: thumb },
  ];
  const outDir = path.join(PUBLIC, path.dirname(dest));
  await mkdir(outDir, { recursive: true });
  const base = path.basename(dest);
  const mainFile = path.join(outDir, `${base}.webp`);

  if (!(await exists(mainFile))) {
    const res = await fetch(absolute(url), { headers: UA });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    for (const v of variants) {
      await sharp(buffer)
        .rotate()
        .resize({ width: v.width, withoutEnlargement: true })
        .webp({ quality })
        .toFile(path.join(outDir, `${base}${v.suffix}.webp`));
    }
  }
  const meta = await sharp(mainFile).metadata();
  const dir = "/" + path.dirname(dest).split(path.sep).join("/");
  return {
    src: `${dir}/${base}.webp`,
    thumb: `${dir}/${base}-sm.webp`,
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    alt,
  };
}

/** Copia una imagen PNG (logos, iconos) conservando el formato y la transparencia. */
async function importPng(url: string, dest: string, width?: number) {
  const file = path.join(PUBLIC, dest);
  await mkdir(path.dirname(file), { recursive: true });
  if (await exists(file)) return;
  const res = await fetch(absolute(url), { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const img = sharp(Buffer.from(await res.arrayBuffer()));
  await (width ? img.resize({ width, withoutEnlargement: true }) : img).png({ compressionLevel: 9 }).toFile(file);
}

async function pool<T, R>(items: T[], size: number, fn: (item: T, i: number) => Promise<R>) {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i] as T, i);
      }
    }),
  );
  return out;
}

// ---------------------------------------------------------------------------
// Categorías (estructura del menú de la web actual)
// ---------------------------------------------------------------------------

const HEADER = {
  rosas: "/images/headers/h-flores-rosas.webp",
  tienda: "/images/headers/tj-tienda.webp",
  plantas: "/images/headers/h-plantas-interior.webp",
  funerarios: "/images/headers/h-sf.webp",
};

// Imagen de cabecera medida en la web original (estilo computado de .mkdf-title-holder).
const CATEGORIES: Omit<Category, "path" | "order">[] = [
  { slug: "ocasiones", name: "Ocasiones", menuName: "Ocasiones", parent: null, headerImage: HEADER.rosas },
  { slug: "navidad", name: "Navidad", menuName: "Navidad", parent: "ocasiones", headerImage: HEADER.rosas },
  { slug: "regalo", name: "Regalo", menuName: "Regalo", parent: "ocasiones", headerImage: HEADER.rosas },
  { slug: "nacimiento", name: "Nacimiento", menuName: "Nacimiento", parent: "ocasiones", headerImage: HEADER.rosas },
  { slug: "enamorados", name: "Enamorados", menuName: "Enamorados", parent: "ocasiones", headerImage: HEADER.rosas },
  { slug: "flores", name: "Flores", menuName: "Flores", parent: null, headerImage: HEADER.tienda },
  { slug: "rosas", name: "Rosas", menuName: "Rosas", parent: "flores", headerImage: HEADER.tienda },
  { slug: "preservadas", name: "Preservadas", menuName: "Preservadas", parent: "flores", headerImage: HEADER.rosas },
  { slug: "ramos-flores", name: "Ramos", menuName: "Ramos", parent: "flores", headerImage: HEADER.rosas },
  {
    slug: "centros-flores",
    name: "Centros de Flores",
    menuName: "Centros",
    parent: "flores",
    headerImage: HEADER.rosas,
  },
  { slug: "plantas", name: "Plantas", menuName: "Plantas", parent: null, headerImage: HEADER.plantas },
  { slug: "interior", name: "Interior", menuName: "Interior", parent: "plantas", headerImage: HEADER.plantas },
  { slug: "orquideas", name: "Orquídeas", menuName: "Orquídeas", parent: "plantas", headerImage: HEADER.rosas },
  {
    slug: "centros-plantas",
    name: "Centros de Plantas",
    menuName: "Centros",
    parent: "plantas",
    headerImage: HEADER.rosas,
  },
  {
    slug: "funerarios",
    name: "Servicios Funerarios",
    menuName: "Servicios Funerarios",
    parent: null,
    headerImage: HEADER.funerarios,
  },
  { slug: "funerarios-ramos", name: "Ramos", menuName: "Ramos", parent: "funerarios", headerImage: HEADER.funerarios },
  {
    slug: "funerarios-centros",
    name: "Centros",
    menuName: "Centros",
    parent: "funerarios",
    headerImage: HEADER.funerarios,
  },
  { slug: "coronas", name: "Coronas", menuName: "Coronas", parent: "funerarios", headerImage: HEADER.funerarios },
  { slug: "cruces", name: "Cruces", menuName: "Cruces", parent: "funerarios", headerImage: HEADER.funerarios },
  { slug: "corazones", name: "Corazones", menuName: "Corazones", parent: "funerarios", headerImage: HEADER.funerarios },
];

function buildCategories(): Category[] {
  return CATEGORIES.map((c, order) => ({
    ...c,
    order,
    path: c.parent ? `/product-category/${c.parent}/${c.slug}/` : `/product-category/${c.slug}/`,
  }));
}

// ---------------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------------

interface WcProduct {
  id: number;
  name: string;
  permalink: string;
  sku: string;
  short_description: string;
  description: string;
  prices: { price: string; currency_minor_unit: number };
  images: { src: string; alt: string }[];
  categories: { slug: string }[];
  tags: { slug: string }[];
  attributes: { name: string; terms: { name: string }[] }[];
}

async function readShopOrder(): Promise<Map<string, number>> {
  const order = new Map<string, number>();
  for (let page = 1; page < 50; page++) {
    const res = await fetch(`${ORIGIN}/tienda/${page > 1 ? `page/${page}/` : ""}`, { headers: UA });
    if (!res.ok) break;
    // Solo la rejilla principal: la barra lateral ("Te puede interesar") muestra productos aleatorios.
    const full = await res.text();
    const start = full.lastIndexOf('<ul class="products');
    const end = full.indexOf("</ul>", start);
    const html = start >= 0 ? full.slice(start, end) : "";
    const slugs = [
      ...html.matchAll(
        /class="mkdf-pli-link[^"]*"[^>]*href="[^"]*\/producto\/([^/"]+)\/"|href="[^"]*\/producto\/([^/"]+)\/"[^>]*class="[^"]*woocommerce-LoopProduct-link/g,
      ),
    ]
      .map((m) => m[1] ?? m[2])
      .filter((x): x is string => Boolean(x));
    const fallback = [
      ...html.matchAll(/<h6[^>]*mkdf-product-list-title[^>]*>\s*<a[^>]+href="[^"]*\/producto\/([^/"]+)\/"/g),
    ]
      .map((m) => m[1])
      .filter((x): x is string => Boolean(x));
    const found = slugs.length ? slugs : fallback;
    if (!found.length) break;
    for (const slug of found) if (!order.has(slug)) order.set(slug, order.size);
  }
  return order;
}

async function importProducts(categories: Category[]): Promise<Product[]> {
  const pages = await Promise.all(
    [1, 2].map((p) => fetchJson<WcProduct[]>(`${ORIGIN}/wp-json/wc/store/v1/products?per_page=100&page=${p}`)),
  );
  const raw = pages.flat();
  const featured = new Set(
    (await fetchJson<WcProduct[]>(`${ORIGIN}/wp-json/wc/store/v1/products?featured=true&per_page=100`)).map(
      (p) => p.id,
    ),
  );
  const roots = new Set(categories.filter((c) => !c.parent).map((c) => c.slug));
  const known = new Set(categories.map((c) => c.slug));

  // Orden por defecto de la tienda original (menu_order + título): se lee de las
  // páginas públicas de /tienda/ para reproducirlo exactamente.
  const shopOrder = await readShopOrder();
  const rank = (slugOf: string) => shopOrder.get(slugOf) ?? Number.MAX_SAFE_INTEGER;
  const slugFrom = (p: WcProduct) => p.permalink.replace(/\/$/, "").split("/").pop() ?? "";
  raw.sort(
    (a, b) =>
      rank(slugFrom(a)) - rank(slugFrom(b)) || decodeEntities(a.name).localeCompare(decodeEntities(b.name), "es"),
  );

  return pool(raw, 6, async (p, order) => {
    const slug = p.permalink.replace(/\/$/, "").split("/").pop()!;
    const name = decodeEntities(p.name);
    const shortDescription = stripHtml(p.short_description);
    // La descripción larga es "título + descripción corta" maquetada con WPBakery:
    // nos quedamos con el texto que no es el título.
    const descText = (p.description.match(/mkdf-st-text">([\s\S]*?)<\/p>/)?.[1] ?? "").trim();
    const description = stripHtml(descText) || shortDescription;
    const cats = p.categories.map((c) => c.slug).filter((c) => known.has(c));
    const attr = (n: string) => p.attributes.find((a) => a.name === n)?.terms.map((t) => t.name) ?? [];
    const price = Number(p.prices.price) / 10 ** p.prices.currency_minor_unit;

    const image = p.images[0]
      ? await importImage(p.images[0].src, `images/products/${slug}`, name, { main: 900, thumb: 450 })
      : null;

    const pendingFields = ["dimensions", "season"];
    if (!shortDescription) pendingFields.push("shortDescription");
    if (!description) pendingFields.push("description");
    if (!image) pendingFields.push("image");
    if (!attr("Color").length) pendingFields.push("colors");

    const product: Product = {
      id: `P${String(p.id)}`,
      sku: p.sku,
      name,
      slug,
      shortDescription,
      description,
      price: Number.isFinite(price) && price > 0 ? price : null,
      category: cats.find((c) => roots.has(c)) ?? cats[0] ?? "",
      subcategories: cats,
      image,
      images: image ? [image] : [],
      // En la web actual todos figuran "sin stock" porque funciona como catálogo, no como tienda.
      available: true,
      featured: featured.has(p.id),
      colors: attr("Color"),
      tags: p.tags.map((t) => t.slug),
      dimensions: null,
      season: null,
      occasion: attr("Ocasiones"),
      order,
      seoTitle: null,
      seoDescription: null,
      updatedAt: null,
      pendingFields,
    };
    return product;
  });
}

// ---------------------------------------------------------------------------
// Eventos (portfolio)
// ---------------------------------------------------------------------------

const PORTFOLIO = [
  { slug: "ramos-novia", title: "Ramos de Novia", cover: "/wp-content/uploads/2018/05/RN006.jpg" },
  { slug: "decoracion-bodas", title: "Decoración Bodas", cover: "/wp-content/uploads/2020/08/D013.jpg" },
  { slug: "carnaval", title: "Carnaval", cover: "/wp-content/uploads/2020/08/08.jpg" },
  { slug: "diademas", title: "Diademas", cover: "/wp-content/uploads/2020/09/D004.jpg" },
  { slug: "semana-santa", title: "Semana Santa", cover: "/wp-content/uploads/2020/09/SS001.jpg" },
];

async function importPortfolio(): Promise<PortfolioItem[]> {
  const out: PortfolioItem[] = [];
  for (const [order, item] of PORTFOLIO.entries()) {
    const html = await fetchText(`${ORIGIN}/portfolio-item/${item.slug}/`);
    // Las fotos de la galería enlazan a su original a tamaño completo.
    const urls = [
      ...new Set(
        [...html.matchAll(/<a[^>]+href="([^"]*\/wp-content\/uploads\/[^"]+\.(?:jpe?g|png))"/gi)]
          .map((m) => m[1])
          .filter((u): u is string => Boolean(u)),
      ),
    ];
    const description = stripHtml(html.match(/mkdf-ps-info-item mkdf-ps-content-item">([\s\S]*?)<\/div>/)?.[1] ?? "");
    const categories = [...html.matchAll(/portfolio-category\/([a-z-]+)\//g)]
      .map((m) => m[1])
      .filter((c): c is string => Boolean(c));
    const cover = await importImage(item.cover, `images/eventos/${item.slug}/portada`, item.title, {
      main: 1200,
      thumb: 600,
    });
    const gallery = await pool(urls, 6, (u, i) =>
      importImage(u, `images/eventos/${item.slug}/${String(i + 1).padStart(2, "0")}`, `${item.title} — foto ${i + 1}`, {
        main: 1400,
        thumb: 500,
      }),
    );
    out.push({ ...item, order, description, categories: [...new Set(categories)], cover, gallery });
    console.log(`  eventos/${item.slug}: ${gallery.length} fotos`);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Recursos del sitio (logos, iconos, cabeceras, home, nosotros)
// ---------------------------------------------------------------------------

const U = "/wp-content/uploads";

async function importSiteAssets() {
  const pngs: [string, string, number?][] = [
    [`${U}/2019/11/TJ-logo2.png`, "images/brand/logo.png", 400],
    [`${U}/2019/11/TJ-logo4.png`, "images/brand/logo-text-rosa.png", 400],
    [`${U}/2020/08/TJ-logo5.png`, "images/brand/logo-text-crema.png", 400],
    [`${U}/2019/11/cropped-TJ-fav-1-270x270.png`, "images/brand/favicon-270.png"],
    [`${U}/2019/11/cropped-TJ-fav-1-180x180.png`, "apple-icon.png"],
    [`${U}/2019/11/cropped-TJ-fav-1-32x32.png`, "images/brand/favicon-32.png"],
    [`${U}/2020/02/TJ-h-ico2.png`, "images/icons/flores.png", 240],
    [`${U}/2020/02/TJ-hand-1.png`, "images/icons/mano.png", 96],
    [`${U}/2020/02/TJ-compo.png`, "images/icons/composicion.png", 96],
    [`${U}/2020/02/TJ-love.png`, "images/icons/corazon.png", 96],
    [`${U}/2019/12/cross-1.png`, "images/icons/cruz.png"],
    [`${U}/2018/04/TJ-testimonials01.png`, "images/testimonios/cristina-luengo.png", 200],
    [`${U}/2018/04/TJ-testimonials02.png`, "images/testimonios/carlos-perez.png", 200],
    [`${U}/2020/08/TJ-nosotros02.png`, "images/equipo/miguel-leon.png", 400],
    [`${U}/2020/08/TJ-nosotros01.png`, "images/equipo/marisa.png", 400],
    [`${U}/2021/06/TJ-nosotros03.png`, "images/equipo/miguel-leon-senior.png", 400],
  ];
  await pool(pngs, 6, ([u, d, w]) => importPng(u, d, w));

  const jpgs: [string, string, number][] = [
    [`${U}/2020/02/TJ-hero01d.jpg`, "images/home/hero-ramos", 2220],
    [`${U}/2020/08/TJ-hero02.jpg`, "images/home/hero-funerarios", 2560],
    [`${U}/2020/02/TJ-hero03b.jpg`, "images/home/hero-plantas", 2220],
    [`${U}/2018/04/DSC_0128.jpg`, "images/home/mosaico-flores", 1400],
    [`${U}/2018/04/DSC_0137.jpg`, "images/home/mosaico-rosas", 1400],
    [`${U}/2018/05/RN017.jpg`, "images/home/mosaico-ramos", 1400],
    [`${U}/2018/05/MS-img01.jpg`, "images/home/mosaico-orquideas", 1400],
    [`${U}/2018/05/MS-img03.jpg`, "images/home/mosaico-coronas", 1400],
    [`${U}/2018/04/DSC_0133.jpg`, "images/home/mosaico-plantas", 1400],
    [`${U}/2018/05/MS-img02.jpg`, "images/home/mosaico-funerarios", 1400],
    [`${U}/2018/05/ms04.jpg`, "images/home/textura-menta", 800],
    [`${U}/2018/05/blog-feature-img-12.jpg`, "images/home/video-san-valentin", 1400],
    [`${U}/2020/02/TJ-tienda.jpg`, "images/headers/tj-tienda", 2400],
    [`${U}/2020/03/TJ-eventos.jpg`, "images/headers/tj-eventos", 2400],
    [`${U}/2020/02/H-flores-rosas.jpg`, "images/headers/h-flores-rosas", 2400],
    [`${U}/2020/02/H-plantas-interior-1.jpg`, "images/headers/h-plantas-interior", 2400],
    [`${U}/2020/02/H-sf-1.jpg`, "images/headers/h-sf", 2400],
  ];
  await pool(jpgs, 6, ([u, d, w]) => importImage(u, d, "", { main: w, thumb: 800 }));

  const nosotros1 = Array.from({ length: 12 }, (_, i) => `${U}/2020/09/N${String(i + 1).padStart(3, "0")}.jpg`);
  const nosotros2 = [
    "0108",
    "0149",
    "0146",
    "0140",
    "0138",
    "0134",
    "0131",
    "0126",
    "0123",
    "0041",
    "0043",
    "0104",
    "0118",
    "0122",
  ]
    .map((n) => `${U}/2018/04/DSC_${n}.jpg`)
    .concat([`${U}/2018/04/002.jpg`, `${U}/2018/04/001.jpg`]);
  const g1 = await pool(nosotros1, 6, (u, i) =>
    importImage(
      u,
      `images/nosotros/tienda-${String(i + 1).padStart(2, "0")}`,
      `Floristería Tu Jardín — foto ${i + 1}`,
      { main: 1200, thumb: 600 },
    ),
  );
  const g2 = await pool(nosotros2, 6, (u, i) =>
    importImage(u, `images/nosotros/flores-${String(i + 1).padStart(2, "0")}`, `Flores de Tu Jardín — foto ${i + 1}`, {
      main: 1200,
      thumb: 600,
    }),
  );
  return { nosotrosTienda: g1, nosotrosFlores: g2 };
}

// ---------------------------------------------------------------------------

async function main() {
  console.log("Categorías…");
  const categories = buildCategories();
  console.log("Recursos del sitio…");
  const site = await importSiteAssets();
  console.log("Productos…");
  const products = await importProducts(categories);
  console.log(`  ${products.length} productos`);
  console.log("Eventos…");
  const portfolio = await importPortfolio();

  await mkdir(path.join(ROOT, "data"), { recursive: true });
  const write = (f: string, d: unknown) => writeFile(path.join(ROOT, "data", f), JSON.stringify(d, null, 2) + "\n");
  await write("categories.json", categories);
  await write("products.json", products);
  await write("portfolio.json", portfolio);
  await write("galleries.json", site);
  console.log("Hecho.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
