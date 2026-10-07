# Fase 1 — Reconstrucción visual

Estado: **en revisión** (pendiente de aprobación).
Preproducción: https://eloyleon23.github.io/floristeria-tu-jardin-web/

## 1. Análisis
Base: [AUDIT_WEB_ACTUAL.md](../AUDIT_WEB_ACTUAL.md). Además se midieron en la web original los estilos
computados (tipografías, tamaños, colores, alturas de cabecera y secciones), las imágenes de cabecera
reales de cada categoría y el orden por defecto de la tienda.

## 2. Decisiones técnicas
- Next.js 16 (App Router) + React 19 + TypeScript estricto + Tailwind CSS 4, export estático.
- **Tipografía:** Fraunces (libre, OFL) con remates suaves (`SOFT 100`) sustituye a Recoleta (sin licencia
  web). Montserrat autoalojada. Sin Google Fonts en tiempo de ejecución.
- **Imágenes:** importadas de la web original y convertidas a WebP (2 tamaños). 39 MB en total.
- **Datos:** `data/*.json` generados por `scripts/import-wordpress.ts` desde la API pública de WooCommerce
  (126 productos, 20 categorías, 5 trabajos de eventos con 77 fotos, galerías de Nosotros).
- **Sin dependencias de UI**: slider, carruseles, visor de fotos y filtros hechos a medida (sin jQuery,
  Slider Revolution ni paquetes de iconos).

## 3. Implementado
| Página | Ruta | Notas |
|---|---|---|
| Home | `/` | Slider 3 diapositivas, destacados, bloque experiencia, mosaico, San Valentín + vídeo, testimonios |
| Tienda | `/tienda/`, `/tienda/page/2-7/` | Filtros (categorías, precio, color), orden, recuento, paginación de 20 |
| 20 categorías | `/product-category/…/` (+ paginación) | Cabecera con imagen y migas, mismos filtros |
| 126 fichas | `/producto/{slug}/` | Imagen, título, precio, descripción, categorías, pestaña Descripción, relacionados |
| Eventos | `/eventos/` | Filtro por tipo de evento |
| 5 trabajos | `/portfolio-item/{slug}/` | Galería con visor a pantalla completa (teclado) |
| Nosotros | `/nosotros/` | Textos, 2 carruseles, equipo, testimonios |
| Contacto | `/contacto/` | Mapa, datos, formulario con validación (sin envío hasta la Fase 2) |
| Legales | `/politica-privacidad/`, `/politica-cookies/`, `/aviso-legal/` | Marcados como pendientes de revisión |
| 404 | cualquier ruta inexistente | |

Comunes: cabecera de escritorio con desplegables, cabecera y menú móvil a pantalla completa, pie de 4
columnas, aviso de cookies, `version.json`, `noindex` fuera de producción.

**URLs:** todas las URLs de páginas, categorías, productos y trabajos de la web original existen con la
misma ruta (lo comprueba `tests/e2e/urls.spec.ts` sobre las 157 URLs del sitemap original).

## 4. Validación
- Lint, TypeScript, 33 tests unitarios (filtros, orden, paginación, **datos inválidos**: precio incorrecto,
  categoría inválida, slug duplicado, datos incompletos, imagen no válida; integridad de las 126 fichas e imágenes).
- 26 tests e2e (escritorio y móvil): URLs originales, 404, menú y desplegables, menú móvil, filtros y orden,
  ficha, formulario, eventos y visor, aviso de cookies, consola sin errores, sin desbordamiento horizontal
  a 320/414/768/1024/1440/1920 px.
- Comparación visual página a página con la web original (`npm run test:visual`) en 1440 px y 390 px.
- Build verificado también con el subdirectorio de GitHub Pages.

## 5. Diferencias con la web original (conscientes)
| Diferencia | Motivo |
|---|---|
| Tipografía Fraunces en vez de Recoleta | Sin licencia web de Recoleta (decisión del cliente) |
| Titulares H3/H4 en Fraunces en todas las páginas | En el original Recoleta Alt fallaba en subpáginas y caía a Times |
| Pestaña "Valoraciones (0)" y formulario de reseñas eliminados | Ninguna valoración publicada; requeriría backend |
| Filtros de orden "popularidad" y "puntuación media" eliminados | No hay datos de ventas ni valoraciones |
| "Te puede interesar" muestra los destacados (fijo) | En el original eran 4 productos aleatorios |
| Productos relacionados deterministas (misma subcategoría) | En el original eran aleatorios |
| Destacados de la home: los 4 primeros de los 5 marcados | En el original se elegían 4 al azar |
| Filtros laterales sin entradas vacías y con "Preservadas" | Errores visuales del plugin original |
| Enlace "Preservado" del pie apunta a `/preservadas/` | En el original daba 404 |
| Ficha de producto con H1 y Contacto con H1 | Mejora semántica sin cambio visual |
| Cabecera de escritorio no fija al hacer scroll | Pendiente de decidir si se replica la cabecera "sticky" |
| Aviso legal creado | No existía (obligatorio por LSSI-CE); contenido pendiente |
| Datos ficticios de la política de privacidad sustituidos por TODO | No se publican datos falsos |
| Página `/carro/`, `/faq-page/` y posts de demostración no reconstruidos | Residuos de WordPress (redirecciones en Fase 6) |

## 6. Pendientes
- Información a confirmar por la floristería: horario, datos legales (razón social, NIF…), nombres del
  equipo ("Miguél León" aparece dos veces), errata "ápoca", vigencia de productos y precios (datos de 2020),
  textos estacionales ("Dale color a la primavera", "este otoño", "San Valentín"), propiedad del vídeo.
- 22 productos sin descripción corta (marcados en `pendingFields`).
- Envío real del formulario (Fase 2), consentimiento de cookies real y GA4 (Fase 6), SEO completo (Fase 6).
