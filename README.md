# Floristería Tu Jardín — nueva web

Reconstrucción de [floristeriatujardin.es](https://floristeriatujardin.es/) sin WordPress:
Next.js + TypeScript + Tailwind CSS exportado como **sitio 100 % estático** (se sirve desde cualquier
servidor web). El catálogo se gestionará desde Google Sheets/Drive vía Google Apps Script (Fase 2-3)
y el formulario de contacto con Brevo (Fase 2).

- **Preproducción:** https://eloyleon23.github.io/floristeria-tu-jardin-web/ (rama `main`, con `noindex`)
- **Estado:** Fase 1 — reconstrucción visual, en revisión. Ver [PROJECT_STATUS.md](PROJECT_STATUS.md).

## Puesta en marcha

Requisitos: Node.js 22+.

```bash
npm ci
cp .env.example .env.local   # opcional
npm run dev                  # http://localhost:3000
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera la web estática en `out/` (+ `out/version.json`) |
| `npm start` | Sirve `out/` en http://localhost:4173 como lo haría Apache/nginx |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm test` | Tests unitarios (Vitest) |
| `npm run test:e2e` | Tests e2e (Playwright) sobre el build |
| `npm run check` | Todo lo anterior en orden (lo mismo que la CI) |
| `npm run test:visual` | Capturas web original ↔ nueva lado a lado en `tests/visual/report/` |
| `npm run import:wordpress` | Vuelve a importar catálogo e imágenes de la web WordPress actual |

## Estructura

```
app/            Rutas (solo composición de secciones)
components/     ui/ (primitivas) · layout/ (cabecera, menús, pie, cookies) · product/ · forms/
sections/       Bloques de página (slider, mosaico, testimonios, galerías, contacto…)
config/         site.ts (datos de empresa) · navigation.ts (menús) · content/ (todos los textos) · colors.ts
data/           Catálogo importado (products, categories, portfolio, galleries)
services/       catalog/ — única puerta de acceso a los datos (adaptador local hoy, Apps Script en Fase 3)
lib/            Lógica pura: validación (zod), filtros/orden/paginación, formato, rutas, SEO
types/          Modelo de datos (Product, Category, PortfolioItem)
styles/         globals.css — tokens del sistema de diseño (colores, tipografías, medidas)
public/images/  Imágenes optimizadas (WebP) importadas de la web original
scripts/        Importación de WordPress, servidor estático, comparación visual, versión
tests/          unit/ · e2e/
docs/           Documentación (ver docs/README.md)
```

## Documentación

| Documento | Contenido |
|---|---|
| [AUDIT_WEB_ACTUAL.md](AUDIT_WEB_ACTUAL.md) | Análisis de la web WordPress actual |
| [ARQUITECTURA_NUEVA.md](ARQUITECTURA_NUEVA.md) | Arquitectura y decisiones técnicas |
| [PLAN_IMPLEMENTACION.md](PLAN_IMPLEMENTACION.md) | Las 7 fases y sus tareas |
| [docs/fase-1.md](docs/fase-1.md) | Resultado de la Fase 1, diferencias con el original y pendientes |
| [docs/desarrollo.md](docs/desarrollo.md) | Cómo cambiar textos, colores, menús, imágenes… |
| [docs/despliegue.md](docs/despliegue.md) | Preproducción en GitHub Pages y despliegue en servidor |
| [docs/ramas.md](docs/ramas.md) | Flujo de ramas y versiones |
| [ROADMAP.md](ROADMAP.md) · [PROJECT_STATUS.md](PROJECT_STATUS.md) | Progreso y estado |
