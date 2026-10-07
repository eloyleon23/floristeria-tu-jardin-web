# AUDIT — Web actual de Floristería Tu Jardín

> Fecha del análisis: 2026-10-07 · URL analizada: https://floristeriatujardin.es/
> Método: descarga de HTML, sitemaps Yoast, API pública de WooCommerce (Store API, solo lectura),
> CSS del tema y capturas con navegador headless (1440×900 y 390×844).
> Anexos: [`docs/audit/inventario-productos.csv`](docs/audit/inventario-productos.csv) (126 productos) y
> [`docs/audit/urls-actuales.csv`](docs/audit/urls-actuales.csv) (239 URLs indexables).

---

## 0. Resumen ejecutivo

| Aspecto | Hallazgo |
|---|---|
| Plataforma | WordPress 6.1.15 + WooCommerce 7.4.2 + WPBakery + Slider Revolution 6.6.11 + Contact Form 7 + Yoast SEO + CookieYes (cookie-law-info) + BeRocket AJAX Filters |
| Tema | **Fiorello** (Mikado Themes) + tema hijo `fiorello-child` + 59 KB de CSS personalizado inline |
| Hosting | nginx, microcaché. El dominio de cookies indica alojamiento **IONOS** (`s838825275.mialojamiento.es`) |
| Modelo de negocio web | **Catálogo, no tienda online**: los 126 productos están marcados como "sin stock", el botón es "Leer más", el carrito existe pero no se usa, `/finalizar-compra/` y `/mi-cuenta/` dan 404 |
| Productos | 126 productos simples, 1 imagen cada uno, SKU único en todos, precios de 5 € a 600 € |
| Categorías | 4 categorías raíz + 16 subcategorías (20 en total) |
| Contenido | Home, Tienda, 20 categorías, 126 fichas, Eventos (portfolio de 6 trabajos), Nosotros, Contacto, Privacidad, Cookies |
| Problemas graves | Política de privacidad con **datos de plantilla** ("Calle Principal, 1 – Villarriba"); **no existe Aviso Legal** (404); 30 posts de demo del tema indexados en el sitemap; FAQ en *lorem ipsum* indexada; canonical relativos; sin meta description; ninguna imagen de producto con `alt` |

---

## 1. Estructura y navegación

### 1.1 Menú principal (escritorio, cabecera blanca de 160 px, logo a la izquierda, menú alineado a la derecha)

```
TIENDA                    /tienda/
OCASIONES                 /product-category/ocasiones/
  ├─ Navidad              /product-category/ocasiones/navidad/
  ├─ Regalo               /product-category/ocasiones/regalo/
  ├─ Nacimiento           /product-category/ocasiones/nacimiento/
  └─ Enamorados           /product-category/ocasiones/enamorados/
FLORES                    /product-category/flores/
  ├─ Rosas                /product-category/flores/rosas/
  ├─ Preservadas          /product-category/flores/preservadas/
  ├─ Ramos                /product-category/flores/ramos-flores/
  └─ Centros              /product-category/flores/centros-flores/
PLANTAS                   /product-category/plantas/
  ├─ Interior             /product-category/plantas/interior/
  ├─ Orquídeas            /product-category/plantas/orquideas/
  └─ Centros              /product-category/plantas/centros-plantas/
SERVICIOS FUNERARIOS      /product-category/funerarios/
  ├─ Ramos                /product-category/funerarios/funerarios-ramos/
  ├─ Centros              /product-category/funerarios/funerarios-centros/
  ├─ Coronas              /product-category/funerarios/coronas/
  ├─ Cruces               /product-category/funerarios/cruces/
  └─ Corazones            /product-category/funerarios/corazones/
EVENTOS                   /eventos/
NOSOTROS                  /nosotros/
CONTACTO                  /contacto/
```

- Elemento activo: color `#C5246E` con subrayado.
- Desplegables con la segunda planta posicionada al 100 % de la cabecera.

### 1.2 Menú móvil
- Cabecera móvil **transparente superpuesta al hero** con logotipo textual "Tu Jardín" (`TJ-logo4.png`, color crema `#E4E19D`) y botón hamburguesa a la derecha.
- Mismo árbol de navegación que escritorio (desplegables por acordeón).
- Tipografía del menú móvil: `recoleta-black`.

### 1.3 Footer (fondo azul marino `#212A40`, texto/enlaces crema `#E4E19D`)
Cuatro columnas con títulos en mayúsculas espaciadas:

| Sobre nosotros | Ocasiones | Flores / Plantas | Servicios Funerarios |
|---|---|---|---|
| Nosotros, Eventos, Contacto, Tienda, Política de privacidad | Navidad, Regalo, Nacimiento, Enamorados | Rosas, Preservado*, Ramos, Centros / Interior, Orquídeas, Centros | Coronas, Ramos, Centros, Corazones, Cruces |

Barra inferior: "Diseño y maquetación MunDesignStudio 2021 ©" · enlaces FACEBOOK / INSTAGRAM.

\* **Enlace roto**: el footer apunta a `/product-category/flores/preservado/` (la categoría real es `/preservadas/`).

> El footer **no muestra** dirección, teléfonos ni enlace a política de cookies; esos datos solo aparecen en `/contacto/`.

### 1.4 Breadcrumbs
Presentes en categorías y carrito: `Home / Tienda / Servicios Funerarios / Coronas`. El JSON-LD de Yoast incluye `BreadcrumbList`.

---

## 2. Inventario de páginas

| Página | URL | Estado | Contenido |
|---|---|---|---|
| Home | `/` | 200 | Slider (3), destacados, bloque eventos, mosaico de categorías, San Valentín + vídeo, testimonios |
| Tienda | `/tienda/` | 200 | Cabecera con imagen + filtros laterales + grid de 20 productos/página, ordenación |
| Categorías (20) | `/product-category/...` | 200 | Mismo layout que tienda filtrado |
| Producto (126) | `/producto/{slug}/` | 200 | Imagen, título, precio, descripción, SKU, categorías, pestañas, valoraciones, relacionados |
| Eventos | `/eventos/` | 200 | Portfolio filtrable (Bautizos, Bodas, Carnaval, Celebraciones, Comuniones, Semana Santa) |
| Portfolio (5) | `/portfolio-item/{slug}/` | 200 | Galerías: ramos-novia (35 fotos), decoracion-bodas, carnaval, diademas, semana-santa |
| Nosotros | `/nosotros/` | 200 | Historia, 2 galerías (12 + 16 fotos), equipo (3), testimonios |
| Contacto | `/contacto/` | 200 | Google Maps, datos de contacto, formulario CF7 |
| Política de privacidad | `/politica-privacidad/` | 200 | **Plantilla de WordPress sin rellenar** |
| Política de cookies | `/politica-cookies/` | 200 | Texto genérico CookieYes, dominio de hosting en vez del real |
| Aviso legal | `/aviso-legal/` | **404** | **No existe** — obligatorio por LSSI-CE |
| Carro | `/carro/` | 200 | Carrito vacío (residual, no se usa) |
| FAQ | `/faq-page/` | 200 | **Demo del tema en inglés + lorem ipsum** — indexada |
| Posts de blog (30) | `/for-every-home/`, `/elegant/`… | 200 | **Contenido demo del tema en inglés** — indexado |
| Taxonomías blog / galerías / testimonios | `/category/*`, `/tag/*`, `/masonry-gallery-category/*`, `/testimonials-category/*`, `/author/tujardin/` | 200 | Archivos residuales del tema |
| Etiquetas producto (19) | `/product-tag/*` | 200 | Duplican las categorías |
| Atributo color (8) | `/color/{color}/` | 200 | Listados por color (amarillo, azul, blanco, multicolor, naranja, rojo, rosa, violeta) |

---

## 3. Contenido por página (textos literales a conservar)

### 3.1 Home
1. **Slider Revolution (3 slides, autoplay, numeración 01/02/03 a la izquierda)**, imágenes duotono rosa/verde, títulos en `recoleta-black` color crema:
   - "Ramos únicos. ¡Díselo con flores!" → botón *Nuestros Ramos* → `/product-category/flores/ramos-flores/`
   - "Un gran recuerdo, la mejor despedida." → *Servicios funerarios* → `/product-category/funerarios/`
   - "La planta perfecta para cada hogar." → *Nuestras Plantas* → `/product-category/plantas/`
2. **Destacados del mes** — subtítulo "DESTACADOS DEL MES", título "Dale color a la primavera" (texto estacional desactualizado). 4 productos destacados (de 5 marcados como *featured*: Ramo Tornasol, Centro Oriental, Bouquet Rosas Kira, Orquídea Phalaenopsis azul, Cesta Plantas Garden).
3. **Bloque experiencia** — icono floral + "Bodas, bautizos, comuniones, eventos... más de 30 años de experiencia nos avalan para hacer que tu día sea inolvidable."
4. **Mosaico de categorías** (grid irregular 4 columnas, tarjetas imagen con título superpuesto y "+" en la esquina; tarjetas de texto sobre fondo con textura menta):
   Nuestras Flores · "Flores exóticas o de temporada. Tú eliges el color que tiene el día." · Rosas · "¿Os casáis? Pregunta por nuestros packs especiales de decoración y ramos de novia." · Ramos (→ portfolio ramos-novia) · Orquídeas · Coronas · Plantas para el hogar · Servicios funerarios · "Trabajos por encargo y a medida de tus necesidades."
5. **San Valentín** — vídeo YouTube (`K-0cjGCNYfs`) + "¡SORPRENDE ESTE SAN VALENTÍN!" / "Ideas para un día muy especial" + 3 iconos: "Seleccionadas a mano solo para ti.", "Composiciones únicas.", "La mejor manera de demostrar tu cariño." (contenido estacional fijo todo el año).
6. **Testimonios** (carrusel, fondo azul claro): Cristina Luengo (boda) y Carlos Pérez (aniversario). *Textos reales existentes; se conservan tal cual.*

### 3.2 Nosotros
- "Dónde las flores son nuestra inspiración" / "UNA EMPRESA FAMILIAR" / **"Más de 30 años de experiencia"**: "Somos una empresa familiar que nace en la década de los 80…" "Dos generaciones de floristas expertos…"
- Galería 1: N001–N012 (12 fotos). "MÁS DE 30 AÑOS A TU SERVICIO" / **"Díselo con flores"** (texto con errata "ápoca").
- Galería 2: 16 fotos DSC_*.
- "EL MEJOR EQUIPO" / **"Expertos floristas"**: Miguél León (Florista Master), Marisa (Florista), Miguél León (Senior Florista Master) — *nombres duplicados, pendiente de confirmar*.
- Testimonios (los mismos 2 de la home).
- Logo indica "EST. 1987".

### 3.3 Eventos
"Cuidamos cada detalle para que tu día sea inolvidable." Filtros: Ver todo, Bautizos, Bodas, Carnaval, Celebraciones, Comuniones, Semana Santa. Trabajos: Ramos de Novia, Decoración Bodas, Carnaval, Diademas, Semana Santa. *Las categorías Bautizos/Comuniones/Celebraciones no tienen trabajo propio salvo cruces.*

### 3.4 Contacto
- Mapa Google Maps embebido (Pl. de la Constitución, 5).
- "TRABAJOS PERSONALIZADOS Y A MEDIDA" / **"Ven a conocernos"** / "Una idea, un evento o una ocasión especial…"
- **Datos reales (a conservar):**
  - Plaza de la Constitución, 5 – 13170, Miguelturra (Ciudad Real)
  - Tel.: 926 24 15 23 · 926 24 03 67
  - Móvil: 659 86 82 52 · 637 52 20 84
  - contacto@floristeriatujardin.es
  - Facebook: `facebook.com/Floristeria-TU-Jardin-800317736684884` · Instagram: `@floristeriatujardin`
- Horario: **no publicado** → `TODO: información pendiente de confirmar`.

### 3.5 Ficha de producto (ej. `/producto/ramo-rosas-peluche/`)
Imagen grande izquierda (proporción 3:4 aprox.), a la derecha título (`recoleta-black` 58 px, **etiqueta H2, no H1**), precio en rosa 33 px peso 300 ("95.00€", formato con punto decimal y sin espacio), descripción corta, "Categorías: …". Debajo: pestañas Descripción / Información adicional (Ocasiones, Color) / Valoraciones (0, formulario de comentarios activo), y "Productos relacionados" (4). El estado "Agotado" existe en el HTML pero está oculto visualmente.

### 3.6 Tienda / categoría
Cabecera con imagen de fondo duotono y título grande ("Tienda" + subtítulo "FLORES Y PLANTAS PARA ESTE OTOÑO"). Sidebar de filtros (Ocasiones, Flores, Plantas, Servicios funerarios — radio buttons, con huecos vacíos y un "Preservado" mal nombrado), botón "OCULTAR FILTROS", contador "Mostrando 1–20 de 126 resultados", selector de ordenación, grid de **4 columnas** con imagen 300×400, título y precio, paginación de 20.

---

## 4. Catálogo de productos

Datos completos en [`docs/audit/inventario-productos.csv`](docs/audit/inventario-productos.csv).

### 4.1 Categorías (id WooCommerce · nº productos)

| Raíz | Subcategoría (slug) | Nº |
|---|---|---|
| **Ocasiones** (`ocasiones`, 47) | Navidad (`navidad`) 5 · Regalo (`regalo`) 29 · Nacimiento (`nacimiento`) 3 · Enamorados (`enamorados`) 10 | |
| **Flores** (`flores`, 25) | Rosas (`rosas`) 17 · Preservadas (`preservadas`) 8 · Ramos (`ramos-flores`) 12 · Centros (`centros-flores`) 2 | |
| **Plantas** (`plantas`, 18) | Interior (`interior`) 6 · Orquídeas (`orquideas`) 3 · Centros de Plantas (`centros-plantas`) 9 | |
| **Servicios Funerarios** (`funerarios`, 36) | Ramos (`funerarios-ramos`) 6 · Centros (`funerarios-centros`) 9 · Coronas (`coronas`) 16 · Cruces (`cruces`) 3 · Corazones (`corazones`) 2 | |

Un producto puede pertenecer a varias subcategorías (p. ej. rosas que están también en Ramos).

### 4.2 Datos disponibles por producto

| Campo requerido | ¿Disponible? | Origen |
|---|---|---|
| id | Sí | ID WooCommerce (se generará ID propio `P###`) |
| sku | Sí (126/126, únicos) | Prefijos: `OC-RE` Regalo, `OC-EN` Enamorados, `OC-N`/`OC-NA` Navidad/Nacimiento, `FL-R` Rosas/Flores, `P-C` Centros plantas, `P-IN` Interior, `P-OR` Orquídeas, `F-CO` Coronas, `F-CE` Centros funerarios, `F-RA` Ramos funerarios, `F-CR` Cruces, `F-ZO` Corazones |
| name, slug | Sí | |
| price | Sí (5 € – 600 €) | |
| shortDescription | 104/126 | 22 vacías → `TODO` |
| description | Sí, pero es *título + descripción corta* envuelto en shortcodes WPBakery | Se limpiará |
| category / subcategories | Sí | |
| image | Sí, **1 por producto** (sin galería) | `/wp-content/uploads/2020/0x/{SKU}.jpg`, original + miniatura 300×400 |
| images | Solo 1 | — |
| available | Todos "sin stock" (modo catálogo) | Se modelará como `available: true` para catálogo — **pendiente de confirmar** |
| featured | 5 productos | |
| colors | 121/126 (atributo `pa_color`) | |
| tags | Sí (duplican categorías) | |
| occasion | 47/126 (atributo Ocasiones) | |
| dimensions, season | **No existen** | `TODO` |
| seoTitle, seoDescription | No hay personalizados (Yoast por defecto) | Se generarán por plantilla |
| alt de imagen | **0/126** | Se usará el nombre del producto |

### 4.3 Incidencias de datos
- **Nombres duplicados** (7): Centro Orquídeas, Centro Anthurium y Orquídeas, Centro Oriental, Rosa Preservada Cúpula, Rosa Preservada Caja, Centro mesa Navidad, Orquídea Phalaenopsis → slugs con sufijo `-2` (se mantienen por SEO).
- 5 productos sin color: tartas-bebe, tronco-brasil, sansevieria, ficus-elastica, centro-cactus.
- "Tartas Bebé" sin descripción.
- Formato de precio "95.00€" (no es formato español "95,00 €"). Se replicará en Fase 1 y se propondrá corregir después.

---

## 5. Identidad visual

### 5.1 Logo y recursos gráficos
| Recurso | URL | Uso |
|---|---|---|
| Logo circular "Tu Jardín · Floristería · Est. 1987" (rosa + tallo verde) | `/wp-content/uploads/2019/11/TJ-logo2.png` (31 KB) | Cabecera escritorio (~111×100 px) |
| Logo textual "Tu Jardín" crema | `/wp-content/uploads/2019/11/TJ-logo4.png` | Cabecera móvil |
| Favicon | `/wp-content/uploads/2019/11/cropped-TJ-fav-1-*.png` | |
| Iconos ilustrados | `TJ-h-ico2.png`, `TJ-hand-1.png`, `TJ-compo.png`, `TJ-love.png` | Home |
| Fotos equipo | `TJ-nosotros01/02/03.png` | Nosotros |
| Avatares testimonios | `TJ-testimonials01/02.png` | Home / Nosotros |
| Fondos de cabecera | `TJ-tienda.jpg`, `TJ-eventos.jpg`, `TJ-footer.jpg`, `H-plantas-interior-1.jpg`, `H-sf-1.jpg` | |
| Slider | 3 imágenes duotono (Slider Revolution, carga diferida) | |
| Mosaico | `DSC_0128/0133/0137.jpg`, `MS-img01/02/03.jpg`, `RN017.jpg`, `ms04.jpg` (textura) | |
| Productos | 126 JPG (`{SKU}.jpg`) | |
| Galerías | N001–N012, 16 × DSC_*, RN001–RN035, D0xx, SS0xx… | Nosotros / Eventos |

Todos los recursos son descargables con HTTP 200 → **reutilizables**. Se descargarán en Fase 1 con un script (no a mano).

### 5.2 Paleta de colores (extraída del CSS, por frecuencia de uso)

| Token propuesto | Hex | Uso actual |
|---|---|---|
| `brand` | **#C5246E** | Rosa/magenta corporativo: menú activo/hover, precios, subtítulos H6, botones, banner cookies, `theme-color` |
| `brand-dark` | #A9296C | H1 por defecto del tema, hover |
| `accent` | **#E4E19D** | Crema/amarillo: títulos sobre hero, enlaces del footer, texto del banner cookies, botón outline |
| `accent-dark` | #D6D28D | Hover del crema |
| `mint` | #70CDA9 | Verde menta: duotono, detalles, nombre en testimonios |
| `mint-light` | (textura `ms04.jpg`) / azul claro testimonios | Fondos de bloques de texto |
| `navy` / `text` | **#212A40** | Texto párrafos, menú, fondo footer |
| `heading` | #283349 | H2–H5 |
| `background` | #F8F8F8 | Fondo general del body |
| `surface` | #FFFFFF | Cabecera |
| `muted` | #6D6A6A | Texto base del body |
| `border` | #E2E2E2 / #CFCCCC | Inputs y separadores |
| `success` | #11AC70 | Mensajes OK |

### 5.3 Tipografía

| Rol | Fuente | Tamaño / peso medidos |
|---|---|---|
| H1 hero | **Recoleta Black** (`recoleta-black`, woff alojado en `/wp-content/uploads/useanyfont/`) | 98 px / 600, interlineado 1.05 |
| H2 | Recoleta Black | 58 px / 600, tracking −0.5 px |
| H3–H4 | **Recoleta Alt** (Regular/Medium/Light/Black, `/fonts/RecoletaAlt-*.woff`) | 32 px y 24 px / 400 |
| H6 / sobretítulos | **Montserrat** | 12 px / 500, MAYÚSCULAS, tracking 0.1em, color brand |
| Menú | Montserrat | 12 px / 500, MAYÚSCULAS, tracking 1.2 px, padding 0 20 px |
| Párrafos | Montserrat | 16 px / 400, color #212A40 |
| Precio en ficha | Montserrat | 33 px / 300 brand |
| Precio en card | Montserrat | 15 px / 400 brand |

> ⚠️ **Licencia**: Recoleta es una fuente **comercial** (Latinotype). Hay que confirmar que la empresa tiene licencia web. Si no, alternativa libre visualmente cercana: *Fraunces* (Google Fonts, variable, SOFT/WONK) — **pendiente de decisión**.
> ⚠️ **Bug actual**: el CSS inline carga Recoleta Alt con rutas relativas (`fonts/…`), que solo funcionan en la home; en subpáginas devuelven 404 y caen a la fuente de reserva.
> Se cargan además Lora, Playfair Display y Roboto que **no se usan**.

### 5.4 Componentes y estilo
- **Botones**: outline crema con borde 2 px y radio completo (pill) en el hero; botón sólido rosa rectangular en formularios ("ENVIAR", MAYÚSCULAS, tracking).
- **Cards de producto**: imagen 3:4 sin borde ni sombra, título Montserrat centrado, precio rosa debajo, hover con botón "Leer más". Grid de 4 columnas con gutter ~10 px.
- **Mosaico**: tarjetas imagen con título superpuesto en Recoleta Alt crema y icono "+" en esquina inferior derecha.
- **Contenedor**: ancho máximo 1300 px (`.mkdf-grid`), hero de la home con márgenes laterales de 60 px.
- **Cabecera**: 160 px alto, blanca, sin sombra; versión sticky.
- **Inputs**: fondo blanco, borde fino gris, placeholder con tracking.
- **Banner cookies**: caja rosa flotante abajo-derecha 350 px, texto crema, botón outline crema "Aceptar" y enlace "Configuración de cookies".
- **Efectos**: transiciones de slider, hover de color en menú, overlay en mosaico, carrusel de testimonios, lightbox en galerías.
- **Iconografía**: Material Icons (flecha del slider), ElegantIcons, Font Awesome, Ionicons, Linea, Linear, Simple-line, Dripicons → **8 paquetes de iconos cargados** para usar unos pocos.

---

## 6. Responsive (390 px)
- Cabecera transparente sobre el hero con logo textual.
- Hero a pantalla completa, título centrado ~40 px, botón pill centrado, indicador de scroll y bullets.
- Banner de cookies ocupa casi toda la anchura y tapa contenido.
- Grid de productos pasa a 2 columnas y después 1.
- Mosaico de categorías se apila.
- Footer en una columna.
- Sin problemas graves de desbordamiento detectados en las capturas.

---

## 7. Formularios

| Formulario | Campos | Problemas |
|---|---|---|
| Contacto (CF7 id 707) | Nombre completo, Email, Teléfono, "Tu pedido..." (textarea), Enviar | Sin campo **Asunto**; **sin casilla de aceptación de privacidad** (incumplimiento RGPD); sin protección antispam visible; locale `en_US` |
| Valoraciones de producto | Puntuación, valoración, nombre, email | Abierto en todos los productos, 0 valoraciones — residual |
| Buscador del tema | `s` | Solo en FAQ demo |

Nueva web: Nombre, Email, Teléfono, Asunto, Mensaje + checkbox de privacidad + honeypot → Brevo (Fase 2).

---

## 8. Cookies y legal
- **Plugin CookieYes (cookie-law-info 3.0.8)**: banner con "Aceptar" (acepta TODAS) + configuración (Necessary / Non-necessary, en inglés). No hay botón "Rechazar" al mismo nivel → **no cumple las directrices AEPD 2023**.
- **No hay analítica cargada** actualmente (no se detecta GA/GTM) aunque el banner lo menciona.
- **Política de privacidad**: plantilla WordPress con datos ficticios ("Nombre de la empresa/responsable", "Calle Principal, 1, 12345 Villarriba", "Tel. 123456789", "email@tujardinejemplo.es").
- **Política de cookies**: genérica; menciona publicidad que no existe; dominio de hosting.
- **Aviso legal**: no existe.

> No se redactarán textos legales inventados. Se necesita: razón social, NIF/CIF, domicilio social, datos registrales → `TODO: información pendiente de confirmar`.

---

## 9. SEO

| Elemento | Estado |
|---|---|
| `<title>` | "{Página} - Floristería Tu Jardín"; home = "Home - Floristería Tu Jardín"; categorías = "Coronas archivos - …" |
| Meta description | **Ausente en todas las páginas** |
| H1 | Home: 3 (uno por slide). Contacto: 0. **Fichas de producto: 0** (título en H2) |
| Canonical | Presente pero **relativo** (`href="/contacto/"`) |
| Open Graph / Twitter | Presentes (Yoast), og:image relativo; home og:type duplicado |
| Schema.org | WebSite, WebPage, Organization, BreadcrumbList (Yoast). **Sin `Florist`/`LocalBusiness`, sin `Product`** |
| Sitemap | `/sitemap_index.xml` con 13 sub-sitemaps; `<loc>` relativos (inválido según el protocolo) |
| robots.txt | Permite todo; Sitemap relativo |
| `www` | `https://www.floristeriatujardin.es/` responde 200 **sin redirigir** → contenido duplicado |
| `http` | Redirige 301 a https ✔ |
| Contenido basura indexado | 30 posts demo en inglés, FAQ lorem ipsum, archivos de tag/categoría/autor/galería/testimonios |
| Imágenes | Sin `alt` en productos; JPG sin WebP/AVIF |
| Idioma | `es_ES` ✔ |

---

## 10. Rendimiento y técnica
- Home: 181 KB de HTML, ~30 hojas de estilo, 8 paquetes de iconos, 4 familias Google Fonts (3 sin uso), jQuery + Slider Revolution + WPBakery.
- CSS personalizado de 59 KB inline en cada página.
- Imágenes sin formatos modernos.
- WordPress 6.1 / WooCommerce 7.4 (versiones de 2023, sin actualizar) → superficie de ataque; `generator` expuesto.
- Sin cabeceras de seguridad (HSTS, CSP, X-Frame-Options).

---

## 11. Problemas detectados (priorizados)

| # | Severidad | Problema |
|---|---|---|
| 1 | 🔴 Legal | Política de privacidad con datos ficticios |
| 2 | 🔴 Legal | Falta el Aviso Legal (LSSI-CE) |
| 3 | 🔴 Legal | Formulario sin consentimiento RGPD; banner cookies sin "Rechazar" |
| 4 | 🔴 Seguridad | WordPress/WooCommerce/plugins desactualizados |
| 5 | 🟠 SEO | Contenido demo en inglés indexado (30 posts + FAQ) |
| 6 | 🟠 SEO | Sin meta descriptions, canonical/sitemap relativos, sin H1 en fichas, 3 H1 en home |
| 7 | 🟠 SEO | `www` sin redirección; sin schema `Florist`/`Product` |
| 8 | 🟡 UX | Enlace roto "Preservado" en footer; filtros con huecos vacíos |
| 9 | 🟡 UX | Contenidos estacionales fijos ("primavera", "San Valentín", "otoño") |
| 10 | 🟡 UX | Carrito, valoraciones y "Agotado" residuales de WooCommerce |
| 11 | 🟡 Visual | Fuente Recoleta Alt rota en subpáginas |
| 12 | 🟡 Rend. | Exceso de CSS/JS/fuentes/iconos |
| 13 | ⚪ Datos | Nombres de producto duplicados, 22 descripciones vacías, nombres del equipo repetidos, errata "ápoca" |

En la **Fase 1 se replican fielmente contenido y diseño**; los puntos anteriores se corrigen en fases posteriores, salvo los que no afectan a lo visual y son triviales (p. ej. el enlace roto), que se propondrán para tu aprobación.

---

## 12. Recursos reutilizables
- ✅ Logo(s), favicon, iconos ilustrados, fotos de equipo y testimonios.
- ✅ 126 fotos de producto + ~80 fotos de galerías.
- ✅ Todos los textos de Home, Nosotros, Eventos, Contacto.
- ✅ Datos de catálogo completos (CSV anexo) → semilla del Google Sheet en Fase 2.
- ✅ Estructura de URLs completa (CSV anexo) → mapa de redirecciones.
- ⚠️ Fuentes Recoleta: reutilizables solo con licencia.
- ⚠️ Vídeo de YouTube (`K-0cjGCNYfs`): enlace externo, confirmar que es suyo.
- ❌ Textos legales: no reutilizables.
- ❌ Contenido demo del tema: descartar.

---

## 13. Información pendiente de confirmar (TODO)
1. Horario de apertura.
2. Razón social, NIF/CIF, domicilio social y datos registrales (aviso legal y privacidad).
3. Licencia de la fuente Recoleta / Recoleta Alt.
4. ¿La web sigue siendo solo catálogo (sin compra online)? ¿Cómo se hace el pedido: teléfono, WhatsApp, formulario?
5. ¿Se hace entrega a domicilio? ¿Zona? (el testimonio lo menciona).
6. Nombres correctos del equipo (aparece "Miguél León" dos veces).
7. Qué productos siguen vigentes y sus precios actuales (datos de 2020).
8. Textos estacionales actuales para Home y Tienda.
9. Propiedad del vídeo de YouTube.
10. Tipo exacto de hosting IONOS (¿Apache con `.htaccess`? ¿nginx gestionado? ¿acceso SSH/FTP?).
