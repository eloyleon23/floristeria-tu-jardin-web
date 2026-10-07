# Guía de desarrollo

## Principios

- **Datos separados de la presentación.** Los componentes no contienen textos ni datos de la empresa:
  todo sale de `config/` (textos, menús, datos de contacto) o de `services/catalog` (productos).
- **Un solo sitio para cada cosa.** Colores y tipografías solo en `styles/globals.css`.
- **Sin backend.** `next build` genera HTML estático en `out/`. No usar API Routes, Server Actions
  ni nada que necesite Node.js en el servidor (ver ARQUITECTURA_NUEVA.md §1).
- **No inventar contenido.** Lo que falte se marca `TODO: información pendiente de confirmar`.

## Cambios habituales

| Quiero cambiar… | Dónde |
|---|---|
| Teléfonos, email, dirección, redes, horario | `config/site.ts` |
| Textos de la home (slider, destacados, mosaico, San Valentín) | `config/content/home.ts` |
| Textos de Tienda, Nosotros, Eventos, Contacto | `config/content/pages.ts` |
| Testimonios | `config/content/testimonials.ts` |
| Textos legales | `config/content/legal.ts` |
| Menú principal / pie | `config/navigation.ts` (las subcategorías del menú salen del catálogo) |
| Colores, fuentes, tamaños | `styles/globals.css` (bloque `@theme`) |
| Muestras de color del filtro | `config/colors.ts` |
| Productos y categorías | Fase 1: `data/*.json` (regenerables con `npm run import:wordpress`). A partir de la Fase 3: Google Sheets |
| Imagen de cabecera de una categoría | `headerImage` en `data/categories.json` |

### Añadir una sección nueva
1. Crear el componente en `sections/` (recibe sus textos por props).
2. Añadir sus textos en `config/content/`.
3. Componerla en la página correspondiente de `app/`.

### Añadir una página nueva
Crear `app/<ruta>/page.tsx` exportando `metadata = pageMetadata({...})`. La ruta termina siempre en `/`
(`trailingSlash: true`). Si debe aparecer en el menú, añadirla en `config/navigation.ts`.

## Datos del catálogo

`services/catalog/index.ts` es la **única** puerta de acceso. Valida todo con `lib/validation/catalog.ts`:
los productos con precio incorrecto, categoría inexistente, slug duplicado o datos incompletos se descartan
con un aviso en la consola del build, sin romper la web. En la Fase 3 se cambiará el adaptador local por el
de Apps Script sin tocar componentes.

## Imágenes

`npm run import:wordpress` descarga las imágenes originales y genera WebP en dos tamaños (`x.webp` y
`x-sm.webp`). Son las que se usan en la web; no se enlaza a WordPress. El componente `Picture` sirve la
variante adecuada con `srcset`. Para rutas de imágenes en estilos en línea usar `asset()` (añade el
subdirectorio de publicación).

## Calidad

Antes de abrir una PR: `npm run check` (lint, tipos, unitarios, build y e2e). La CI ejecuta lo mismo.
Para cambios visuales, `npm run test:visual` genera capturas comparadas con la web original.
