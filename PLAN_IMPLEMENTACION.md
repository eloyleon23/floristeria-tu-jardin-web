# Plan de implementación — Floristería Tu Jardín

Cada fase sigue: **Análisis → Decisiones → Implementación → Validación → Resultado → Pendientes → STOP (aprobación)**.
Ninguna fase empieza sin aprobación explícita de la anterior.

---

## Fase 0 — Audit y arquitectura ✅ (esta entrega)
- [x] AUDIT_WEB_ACTUAL.md + inventario de productos (CSV) + listado de URLs (CSV)
- [x] ARQUITECTURA_NUEVA.md
- [x] PLAN_IMPLEMENTACION.md, PROJECT_STATUS.md, ROADMAP.md
- [x] Repositorio privado `floristeria-tu-jardin-web` con ramas `main` y `preproduccion`

---

## Fase 1 — Reconstrucción visual completa
Rama: `feature/fase-1-reconstruccion` → PR a `preproduccion`.

1. **Base del proyecto**: Next.js + TS estricto + Tailwind + ESLint/Prettier + Vitest + Playwright; `output: "export"`, `trailingSlash: true`; CI básico (`ci.yml`).
2. **Importación de recursos** (`scripts/import-wordpress.ts`): descarga logo, favicon, iconos, fondos, slider, 126 imágenes de producto y galerías; genera `data/products.json`, `data/categories.json`, `data/events.json` desde la API pública de WooCommerce. Campos no recuperables → `"TODO: pendiente"`/`null`.
3. **Optimización de imágenes** (`scripts/optimize-images.ts`, sharp).
4. **Sistema de diseño**: tokens, fuentes, componentes `ui/`.
5. **Layout**: Header (160 px, logo, menú con desplegables), MobileNavigation (cabecera transparente + logo textual + acordeón), Footer (4 columnas), Breadcrumbs, CookieBanner (visual fiel; lógica de consentimiento real en Fase 6).
6. **Home**: slider de 3 slides (sin Slider Revolution: CSS + JS mínimo, accesible, respeta `prefers-reduced-motion`), Destacados, bloque experiencia, mosaico de categorías, bloque vídeo (carga diferida de YouTube al hacer clic), testimonios.
7. **Tienda y 20 categorías**: PageHero, filtros laterales, ordenación, contador, grid 4/3/2/1 columnas, paginación de 20 (estática, `/tienda/page/2/`).
8. **126 fichas de producto**: imagen, título, precio, descripción, SKU, categorías, pestañas (Descripción / Información adicional), relacionados. *Se omiten carrito y valoraciones (no usados) — a confirmar.*
9. **Eventos + 5 portfolio** con filtro y lightbox; **Nosotros** (galerías, equipo, testimonios); **Contacto** (mapa, datos, formulario visual sin envío real).
10. **Legales**: privacidad y cookies con el texto actual marcado como pendiente de revisión; **aviso legal** creado con estructura y `TODO` (sin inventar datos).
11. **404** con estilo de marca.
12. **Validación**: lint, types, tests, build; Playwright navegación completa + 6 viewports + axe; **comparación visual** con capturas de la web actual por página; revisión de consola sin errores.
13. **Documentación**: README, `docs/desarrollo.md`, `docs/arquitectura.md`, `CLAUDE.md`.
14. **Entrega para revisión**: capturas nuevo vs. antiguo + build local servible (y preproducción si el hosting está listo).

## Fase 2 — Google Sheets + Google Drive + Brevo
1. Crear plantilla de Sheet (`PRODUCTOS`, `CATEGORIAS`, `CONFIG`, `ERRORES`) con validaciones y desplegables; importar los 126 productos del inventario.
2. Carpeta de Drive y carga de las 126 imágenes con nombre = SKU.
3. Proyecto Apps Script versionado en `apps-script/` (clasp): lectura del Sheet, resolución de imágenes de Drive.
4. Endpoint `doPost` de contacto → Brevo (API key en Script Properties), honeypot, rate limit, Turnstile opcional, checkbox RGPD.
5. Formulario de contacto real en la web (validación cliente + estados loading/éxito/error).
6. Docs: `google-sheets.md`, `google-drive.md`, `apps-script.md`, `brevo.md` (+ guía no técnica).
*Requiere de ti*: cuenta Google de la empresa, cuenta Brevo y dominio verificado, decisión sobre Turnstile.

## Fase 3 — JSON + Apps Script como fuente
1. Endpoints `products`, `product`, `categories`, `featured`, `search`, `health` con token y caché.
2. `appsScriptAdapter.ts` + validación zod + informe de errores.
3. Snapshot de último estado válido y protección contra vaciado.
4. Índice de búsqueda estático + buscador en cliente (loading/empty/error).
5. Tests de datos inválidos y de API caída. Eliminar dependencia de los mocks.

## Fase 4 — GitHub + Preproducción
1. Protección de ramas, CODEOWNERS, plantilla de PR (Objetivo / Cambios / Tests / Riesgos / Capturas).
2. Workflows: `ci.yml`, `deploy-preproduccion.yml` (push a `preproduccion`), `release.yml` (Release publicada → producción), `rollback` (workflow_dispatch con tag).
3. Entornos de GitHub con secretos separados y aprobación manual para producción.
4. Subdominio de preproducción con contraseña y `noindex`.
5. `/version.json` + meta de versión.
6. Docs: `github.md`, `ramas.md`, `releases.md`, `despliegue.md`.

## Fase 5 — Sincronización
1. Activador Apps Script (onEdit + debounce + límite diario) → `repository_dispatch`.
2. Menú "Tu Jardín → Publicar cambios" en el Sheet.
3. Workflow `sync.yml`: rebuild con datos nuevos y deploy (estrategia preproducción/producción a decidir).
4. Pruebas extremo a extremo: cambiar precio/imagen/nombre/disponibilidad/destacado en el Sheet → verificar en web.
5. Docs `mantenimiento.md` con guías paso a paso (modificar, añadir, eliminar, destacar, cambiar imagen/precio).

## Fase 6 — SEO + Analytics + Validación
1. Metadata completa por plantilla (title, description, canonical absoluto, OG, Twitter).
2. H1 único por página; jerarquía semántica.
3. JSON-LD: Florist/LocalBusiness, Product/Offer, BreadcrumbList, WebSite.
4. `sitemap.xml`, `robots.txt`.
5. **Mapa de redirecciones** (`docs/seo.md` + `config/redirects.ts` → `.htaccess`):
   - URLs de páginas, categorías y productos: **sin cambios**.
   - 30 posts demo, `/faq-page/`, `/category/*`, `/tag/*`, `/author/*`, `/masonry-gallery-category/*`, `/testimonials-category/*` → 301 a `/` (o 410, a decidir).
   - `/carro/` → 301 `/tienda/`.
   - `/product-tag/{x}/` → 301 a la categoría equivalente.
   - `/color/{x}/` → 301 `/tienda/` (o página de color si se decide mantener).
   - `/portfolio-category/*` → `/eventos/`.
   - `/product-category/flores/preservado/` → `/product-category/flores/preservadas/`.
   - `www.` → raíz (HTTPS).
6. Consent Mode v2 + GA4 por variable de entorno; banner con Rechazar.
7. Alt text, Core Web Vitals, Lighthouse ≥ 90 en todas las métricas como objetivo.
8. Comprobación de enlaces rotos y 404 sobre el listado completo de URLs antiguas.

## Fase 7 — Producción
1. Checklist: sin herramientas internas, sin debug, sin secretos en el bundle (escaneo), favicon, OG, sitemap, robots, analytics.
2. Merge `preproduccion → main` (con tu aprobación), tag `v1.0.0`, Release con notas.
3. Despliegue al hosting, cambio de documento raíz / DNS, verificación post-despliegue (todas las URLs antiguas → 200/301).
4. Alta en Google Search Console y envío del sitemap.
5. Plan de retirada de WordPress (copia de seguridad completa antes de borrar nada).
6. Docs: rollback probado.

---

## Riesgos identificados
| Riesgo | Mitigación |
|---|---|
| Licencia de Recoleta no disponible | Sustituto libre (Fraunces) — decisión en Fase 1 |
| Hosting sin SSH ni `.htaccess` | FTPS + Cloudflare para redirecciones |
| Cuotas de Apps Script | Caché + builds con debounce + datos embebidos en estático |
| Datos de catálogo de 2020 desactualizados | Revisión por la floristería al cargar el Sheet (Fase 2) |
| Textos legales inexistentes | Requieren datos de la empresa; se marcarán TODO hasta tenerlos |
