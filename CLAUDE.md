# Instrucciones para agentes de IA

Proyecto: nueva web de Floristería Tu Jardín. Leer primero `PROJECT_STATUS.md`, `ARQUITECTURA_NUEVA.md` y `PLAN_IMPLEMENTACION.md`.

## Reglas
- Trabajar por fases. No empezar una fase sin aprobación explícita de la anterior.
- Nunca commitear ni hacer push directo a `main`. Flujo provisional (docs/ramas.md): ramas `feature/*`, `fix/*`, `docs/*` desde `main` e integradas por PR en `main`, que hace de preproducción (GitHub Pages).
- Nunca crear tags ni Releases sin aprobación explícita del usuario.
- Conventional Commits, commits pequeños y separados por tema.
- No inventar contenido (precios, teléfonos, horarios, testimonios, datos legales…). Si falta: `TODO: información pendiente de confirmar`.
- Reutilizar imágenes y textos reales de la web actual; no sustituirlos por contenido generado.
- Fase 1 = reconstrucción fiel. Nada de rediseño creativo hasta que se apruebe.
- Ningún secreto (Brevo, Google, GitHub, deploy) en el código ni en variables `NEXT_PUBLIC_*`.
- Colores, fuentes y espaciados solo a través de los tokens del sistema de diseño.
- Productos y catálogo: se gestionan en Google Sheets, no en código (a partir de Fase 3).
- Actualizar `PROJECT_STATUS.md` y `ROADMAP.md` al cerrar trabajo relevante.

## Antes de entregar
- `npm run check` (lint, tipos, unitarios, build, e2e) debe pasar.
- Cambios visuales: `npm run test:visual` y revisar las capturas frente a la web original.
- Ver docs/desarrollo.md para saber dónde va cada tipo de cambio.
