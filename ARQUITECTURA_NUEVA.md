# Arquitectura nueva — Floristería Tu Jardín

> Estado: **APROBADA** (Fase 0). Basada en [AUDIT_WEB_ACTUAL.md](AUDIT_WEB_ACTUAL.md). Tipografía: Fraunces (decisión del cliente, sin licencia de Recoleta).

## 1. Decisión principal

**Next.js (App Router) + React + TypeScript + Tailwind CSS, compilado como sitio 100 % estático (`output: "export"`).**

¿Por qué estático?
- La web actual es un **catálogo**: no hay carrito, pago ni área de clientes. Todo el contenido puede generarse en el build.
- Requisito: desplegar en el **servidor de la empresa** (hoy IONOS) sin depender de un servidor Node.js permanente ni de Vercel/Netlify. Un export estático es HTML + CSS + JS + imágenes que sirve cualquier Apache/nginx.
- Máxima velocidad y SEO: cada página es HTML prerenderizado.
- Si la API de Google cae, **la web publicada no se ve afectada**: los datos ya están dentro del HTML.

### Alternativa evaluada
*Astro* encaja igual de bien en un sitio estático y envía menos JS por defecto. Se mantiene Next.js porque es lo que pediste, tiene mayor ecosistema para mantenimiento por IA y permite, si algún día hay tienda online, pasar a SSR sin reescribir. **No hay razón técnica de peso para cambiarlo.**

### Qué NO se puede usar con export estático (y la alternativa)
| Funcionalidad Next.js | Alternativa |
|---|---|
| API Routes / Server Actions | **Google Apps Script** (formulario → Brevo) |
| `next/image` con optimización en servidor | Script de build con `sharp` que genera WebP/AVIF en varios tamaños + componente `<ResponsiveImage>` propio |
| ISR / revalidación | **Rebuild automático** disparado al cambiar el Sheet (ver §6) |
| `redirects()` de `next.config` | `.htaccess` (Apache) o `nginx.conf` **generados** desde `config/redirects.ts` |
| Middleware | No necesario |

**Ninguna funcionalidad requiere backend persistente propio.** Las dos piezas dinámicas (formulario y datos) las cubre Apps Script.

---

## 2. Diagrama

```
 ┌────────────────┐   ┌──────────────┐
 │ GOOGLE SHEETS  │   │ GOOGLE DRIVE │
 │ PRODUCTOS      │   │ /productos   │
 │ CATEGORIAS     │   │ imágenes     │
 │ CONFIG         │   └──────┬───────┘
 └───────┬────────┘          │
         └─────────┬─────────┘
                   ▼
        ┌─────────────────────┐   onEdit/cron (debounce)   ┌──────────────────────┐
        │ GOOGLE APPS SCRIPT  │ ─────────────────────────▶ │ GitHub repository_   │
        │ API JSON (doGet)    │   repository_dispatch      │ dispatch "sync"      │
        │ Contacto (doPost) ──┼──▶ BREVO API               └──────────┬───────────┘
        └─────────┬───────────┘                                       │
                  │ JSON (token)                                      ▼
                  ▼                                        ┌──────────────────────┐
        ┌─────────────────────┐                            │ GITHUB ACTIONS       │
        │ API Adapter (TS)    │◀── build ──────────────────│ lint·types·test·build│
        │ validación (zod)    │                            │ optimización imágenes│
        │ snapshot fallback   │                            └──────────┬───────────┘
        └─────────┬───────────┘                                       │ deploy (SFTP/rsync/FTP)
                  ▼                                                   ▼
        ┌─────────────────────┐                     ┌──────────────────────────────┐
        │ Product model       │                     │ preproduccion → pre.floristeriatujardin.es (noindex)
        │ React components    │──── out/ ──────────▶│ release vX.Y.Z → floristeriatujardin.es
        └─────────────────────┘                     └──────────────────────────────┘
```

---

## 3. Capas de datos (el frontend nunca conoce el Sheet)

```
Google Sheets ─▶ Apps Script (JSON "crudo" con nombres de columna del Sheet)
              ─▶ services/catalog/appsScriptAdapter.ts   (mapea columnas → modelo)
              ─▶ lib/validation/product.schema.ts        (zod: valida, descarta o corrige)
              ─▶ types/product.ts  (Product, Category)    ← único contrato del frontend
              ─▶ services/catalog/index.ts  (getProducts, getProductBySlug, getCategories, getFeatured, search)
              ─▶ app/** y components/**
```

- **Fase 1**: `services/catalog/localAdapter.ts` lee `data/products.json` y `data/categories.json` (generados desde el inventario del audit con un script, no a mano).
- **Fase 3**: se cambia a `appsScriptAdapter.ts` con una sola variable (`CATALOG_SOURCE=local|apps-script`). Ningún componente cambia.

### Modelo `Product`
```ts
interface Product {
  id: string;            // "P001"
  sku: string;           // "F-CO.003"
  name: string;
  slug: string;          // se mantiene el slug actual (incluidos "-2")
  shortDescription: string;
  description: string;
  price: number | null;  // null = "consultar precio" (nunca 0 inventado)
  category: CategorySlug;        // raíz: ocasiones | flores | plantas | funerarios
  subcategories: CategorySlug[]; // p.ej. ["coronas"]
  image: ImageRef;               // principal
  images: ImageRef[];
  available: boolean;
  featured: boolean;
  colors: string[];
  tags: string[];
  dimensions: string | null;     // TODO en datos actuales
  season: string | null;         // TODO
  occasion: string[];
  order: number;
  seoTitle: string | null;       // si null → plantilla
  seoDescription: string | null; // si null → plantilla
  updatedAt: string | null;
}
```

### Control de errores de datos (build)
| Caso | Comportamiento |
|---|---|
| Precio no numérico / negativo | Producto publicado con "Consultar precio" + aviso en informe |
| Imagen inexistente | Imagen placeholder de marca + aviso |
| Categoría inválida | Producto **excluido** + aviso |
| Slug duplicado | El segundo se excluye + aviso (nunca se sobrescribe) |
| Campos obligatorios vacíos (nombre/slug) | Excluido + aviso |
| API caída o respuesta inválida | Se usa el **último snapshot válido**; el build no publica una web vacía |
| Caída de > X % de productos respecto al snapshot | El build **falla** (protección contra borrados accidentales) |

El informe se publica como resumen del job de GitHub Actions y, opcionalmente, en una hoja `ERRORES` del Sheet.

---

## 4. Google Sheets (Fase 2, resumen)

Hojas: `PRODUCTOS`, `CATEGORIAS`, `CONFIG` (textos editables: títulos estacionales, teléfonos…), `ERRORES` (solo lectura, la escribe el script).
Columnas `PRODUCTOS`: las propuestas por ti + `OCASION`, `TEMPORADA`, `DIMENSIONES`. `IMAGEN_*` acepta **nombre de archivo en Drive** (p.ej. `F-CO003.jpg`) — más fácil que pegar enlaces. Validación de datos de Sheets (desplegables de categoría, casillas ACTIVO/DESTACADO).

## 5. Google Drive — imágenes
- Carpeta `Tu Jardín Web/productos/`. Nombre de archivo = referencia en el Sheet.
- **La web no enlaza a Drive directamente** (Drive no es un CDN: límites de tasa, URLs no garantizadas). En el build se descargan vía Apps Script/Drive API, se optimizan con `sharp` (WebP + AVIF + JPG, 400/800/1200 px) y se sirven desde el propio dominio.
- Cambiar/sustituir/eliminar una imagen = cambiar el archivo o el nombre en el Sheet → siguiente sincronización.

## 6. Sincronización (Fase 5, resumen)
1. Un activador de Apps Script detecta cambios (`onEdit` + marca `FECHA_ACTUALIZACION`) y, con **debounce de ~10 min** y como mucho N builds/día, llama a GitHub `repository_dispatch` (token de GitHub de **permisos mínimos** guardado en *Script Properties*).
2. GitHub Actions construye y despliega en **preproducción**; producción se actualiza con datos nuevos mediante un workflow de "solo datos" que reconstruye la **última release** con el contenido nuevo (el código no cambia sin release). Este punto se concretará contigo en Fase 5 (opción alternativa: los cambios de catálogo van directos a producción).
3. Botón manual "Publicar cambios" en un menú personalizado del Sheet.

## 7. Apps Script — endpoints
`GET ?action=products | product&slug= | categories | featured | search&q= | health`
- JSON limpio, cacheado con `CacheService` (5–10 min).
- Protegido con **token compartido** (`?key=`) guardado en GitHub Secrets; solo el build lo usa, nunca el navegador.
- La búsqueda pública de la web se hace en el navegador sobre un índice JSON estático generado en el build (sin llamar a Apps Script, sin exponer token).

`POST` contacto (público, llamado desde el navegador):
- `Content-Type: text/plain` para evitar CORS preflight.
- Validación de servidor, **honeypot**, tiempo mínimo de rellenado, límite por IP/email con `CacheService`, y opcionalmente **Cloudflare Turnstile** (gratuito, sin cookies de seguimiento).
- Llama a Brevo (`/v3/smtp/email` y, si hay consentimiento, `/v3/contacts`) con la **API key en Script Properties**. Nunca en el frontend.

## 8. Brevo
Email transaccional a `contacto@floristeriatujardin.es` + acuse al cliente (opcional) + alta en lista solo con casilla de consentimiento explícita separada. Requiere verificar dominio remitente (SPF/DKIM) en Brevo.

---

## 9. Estructura del proyecto

```
/
├── app/                          # Rutas (App Router) — solo composición
│   ├── layout.tsx                # Header, Footer, CookieBanner, fuentes
│   ├── page.tsx                  # Home
│   ├── tienda/page.tsx
│   ├── product-category/[...slug]/page.tsx   # 20 categorías (generateStaticParams)
│   ├── producto/[slug]/page.tsx              # 126 fichas
│   ├── eventos/page.tsx
│   ├── portfolio-item/[slug]/page.tsx
│   ├── nosotros/ · contacto/ · politica-privacidad/ · politica-cookies/ · aviso-legal/
│   ├── not-found.tsx
│   ├── sitemap.ts · robots.ts
├── components/
│   ├── ui/                       # Button, Container, Heading, Eyebrow, ResponsiveImage, Icon
│   ├── layout/                   # Header, Navigation, MobileNavigation, Footer, Breadcrumbs, CookieBanner
│   ├── product/                  # ProductCard, ProductGrid, ProductDetail, ProductFilters, SortSelect
│   └── category/                 # CategoryCard, CategoryGrid
├── sections/                     # Hero(Slider), FeaturedProducts, ExperienceBanner, CategoryMosaic,
│                                 # PromoVideo, Testimonials, EventsGallery, ContactSection, PageHero
├── config/
│   ├── site.ts                   # nombre, contacto, redes, dirección (fuente única)
│   ├── navigation.ts             # menú principal y footer
│   ├── content/home.ts …         # textos de cada página (editables por IA sin tocar componentes)
│   ├── redirects.ts              # mapa URL antigua → nueva
│   └── env.ts                    # lectura tipada y validada de variables de entorno
├── data/                         # products.json, categories.json, events.json, testimonials.json (Fase 1) + snapshot
├── services/catalog/             # adapters + API pública del catálogo
├── lib/                          # validation/, seo/ (metadata + JSON-LD), format/ (precio), analytics/
├── types/
├── hooks/                        # useConsent, useMediaQuery…
├── styles/globals.css            # tokens de diseño (@theme de Tailwind)
├── public/                       # logo, favicon, fuentes, imágenes estáticas
├── scripts/                      # import-wordpress.ts, optimize-images.ts, generate-htaccess.ts, check-links.ts
├── apps-script/                  # código de Apps Script versionado (clasp)
├── tests/                        # unit/ (vitest) · e2e/ (playwright) · visual/ (comparación con web antigua)
├── docs/                         # ver PLAN, incluye guías no técnicas
├── .github/workflows/            # ci.yml, deploy-preproduccion.yml, release.yml, sync.yml
├── .env.example · README.md · PROJECT_STATUS.md · ROADMAP.md · CLAUDE.md (reglas para IA)
```

`CLAUDE.md` documentará para la IA: dónde vive cada tipo de cambio ("cambiar un texto → `config/content`", "nuevo producto → Google Sheet, nunca código"), comandos de verificación y reglas (no tocar `main`, no inventar datos).

## 10. Sistema de diseño (tokens en `styles/globals.css`)

```css
@theme {
  --color-brand: #C5246E;      --color-brand-dark: #A9296C;
  --color-accent: #E4E19D;     --color-accent-dark: #D6D28D;
  --color-mint: #70CDA9;
  --color-text: #212A40;       --color-heading: #283349;   --color-muted: #6D6A6A;
  --color-background: #F8F8F8; --color-surface: #FFFFFF;   --color-border: #E2E2E2;
  --color-success: #11AC70;    --color-error: #C0392B; /* TODO: no existe en la web actual */
  --font-display: "Recoleta", …; --font-display-alt: "Recoleta Alt", …; --font-sans: "Montserrat", …;
  --container-max: 1300px;  --header-height: 160px;
}
```
Ningún color ni fuente se escribirá fuera de los tokens (regla de lint).

## 11. Fuentes
- Montserrat: autoalojada (`next/font/local` o archivos en `public/fonts`), solo pesos 300/400/500/600.
- Recoleta / Recoleta Alt: reutilizar los `.woff` actuales **solo si se confirma licencia**; si no, Fraunces como sustituto (decisión pendiente).
- Se eliminan Lora, Playfair, Roboto y los 8 paquetes de iconos → SVG inline de los pocos iconos usados.

## 12. SEO (se prepara en Fase 1, se completa en Fase 6)
- URLs **idénticas** a las actuales con barra final (`trailingSlash: true`): `/producto/{slug}/`, `/product-category/{padre}/{hijo}/`, `/tienda/`, etc.
- Metadata API de Next: title, description, canonical absoluto, OG, Twitter.
- JSON-LD: `Florist` (LocalBusiness) con dirección y teléfonos reales, `Product` + `Offer`, `BreadcrumbList`, `WebSite`.
- `sitemap.xml` y `robots.txt` generados; preproducción con `noindex` y `Disallow: /`.
- Redirecciones 301 (ver PLAN, Fase 6): posts demo, FAQ, `/carro/`, taxonomías residuales, `/product-tag/*` → categoría equivalente, `/color/*` → `/tienda/?color=`, `www` → raíz, enlace roto `preservado` → `preservadas`.

## 13. Analytics y consentimiento
- GA4 con `NEXT_PUBLIC_GA_ID` (variable de entorno, vacía en preproducción).
- **Google Consent Mode v2**: GA no se carga hasta aceptar. Banner propio con "Aceptar", "Rechazar" y "Configurar" al mismo nivel (criterio AEPD), visualmente igual al actual (caja rosa).

## 14. Entornos, ramas y despliegue

| Entorno | Rama / origen | URL | Datos | Indexable |
|---|---|---|---|---|
| Development | `feature/*` local | `localhost:3000` | snapshot local o Sheet de pruebas | No |
| Preproducción | `preproduccion` | `pre.floristeriatujardin.es` (**pendiente de confirmar**) con contraseña (`.htaccess`) | Sheet real o copia | No |
| Producción | tag `vX.Y.Z` de `main` (Release) | `floristeriatujardin.es` | Sheet real | Sí |

Flujo: `feature/* → PR → preproduccion → PR (aprobación) → main → tag → Release → deploy`.
- **CI** (`ci.yml`) en cada push/PR: install → lint → typecheck → test → build (+ e2e Playwright sobre el build).
- **Protección de `main` y `preproduccion`**: PR obligatorio, checks obligatorios, sin push directo.
- **Deploy**: GitHub Actions sube `out/` por **SFTP/rsync** (o FTPS si IONOS no da SSH). Con SSH: carpetas `releases/vX.Y.Z` + enlace simbólico `current` → rollback instantáneo. Sin SSH: rollback = re-ejecutar el workflow de deploy con el tag anterior (el artefacto se reconstruye desde el tag, sin tocar archivos a mano).
- **Versión visible**: `/version.json` (`{version, commit, builtAt}`) y `<meta name="app-version">`. Nada de paneles internos en producción.
- **Secretos**: solo en GitHub Secrets / Environments (`APPS_SCRIPT_URL`, `APPS_SCRIPT_TOKEN`, `DEPLOY_*`) y en Script Properties (`BREVO_API_KEY`, `GITHUB_DISPATCH_TOKEN`). `.env.example` documenta todo sin valores. Solo variables `NEXT_PUBLIC_*` no sensibles llegan al navegador.

## 15. Requisitos del hosting
Mínimo: servidor web estático con HTTPS, posibilidad de reglas de reescritura/redirección (`.htaccess` en Apache o config nginx) y acceso SFTP/FTPS para el despliegue. **Pendiente**: confirmar plan IONOS y si se permite SSH y subdominio de preproducción. Si el hosting no permitiera redirecciones, alternativa: páginas HTML de redirección con `meta refresh` + canonical (peor para SEO), o poner Cloudflare delante (gratuito) para las reglas.

## 16. Calidad y pruebas
- TypeScript estricto, ESLint, Prettier.
- Vitest: adapters, validación de datos inválidos, formato de precio, generación de redirects.
- Playwright: navegación por todo el menú, todas las rutas responden, menú móvil, formulario (mock), filtros, 6 viewports (320, 414, 768, 1024, 1440, 1920), accesibilidad con axe.
- **Comparación visual** contra capturas de la web antigua por página y viewport (informe con diferencias para revisión manual; criterio de aceptación de la Fase 1).
- Lighthouse CI en preproducción.
