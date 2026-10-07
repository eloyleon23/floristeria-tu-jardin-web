# Instrucciones para agentes de IA

Proyecto: nueva web de Floristería Tu Jardín. Leer primero `PROJECT_STATUS.md`, `ARQUITECTURA_NUEVA.md` y `PLAN_IMPLEMENTACION.md`.

## Reglas
- Trabajar por fases. No empezar una fase sin aprobación explícita de la anterior.
- Nunca commitear ni hacer push a `main`. Ramas de trabajo desde `preproduccion` (`feature/*`, `fix/*`, `docs/*`, `seo/*`), integradas por PR hacia `preproduccion`.
- Nunca crear tags ni Releases sin aprobación explícita del usuario.
- Conventional Commits, commits pequeños y separados por tema.
- No inventar contenido (precios, teléfonos, horarios, testimonios, datos legales…). Si falta: `TODO: información pendiente de confirmar`.
- Reutilizar imágenes y textos reales de la web actual; no sustituirlos por contenido generado.
- Fase 1 = reconstrucción fiel. Nada de rediseño creativo hasta que se apruebe.
- Ningún secreto (Brevo, Google, GitHub, deploy) en el código ni en variables `NEXT_PUBLIC_*`.
- Colores, fuentes y espaciados solo a través de los tokens del sistema de diseño.
- Productos y catálogo: se gestionan en Google Sheets, no en código (a partir de Fase 3).
- Actualizar `PROJECT_STATUS.md` y `ROADMAP.md` al cerrar trabajo relevante.
