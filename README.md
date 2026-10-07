# Floristería Tu Jardín — nueva web

Reconstrucción de [floristeriatujardin.es](https://floristeriatujardin.es/) sin WordPress:
Next.js + TypeScript + Tailwind (export estático), catálogo gestionado desde Google Sheets/Drive
vía Google Apps Script, y formulario de contacto con Brevo.

> Estado: **Fase 0 — auditoría y arquitectura**. Todavía no hay código de la web. Ver [PROJECT_STATUS.md](PROJECT_STATUS.md).

## Documentación

| Documento | Contenido |
|---|---|
| [AUDIT_WEB_ACTUAL.md](AUDIT_WEB_ACTUAL.md) | Análisis completo de la web WordPress actual |
| [ARQUITECTURA_NUEVA.md](ARQUITECTURA_NUEVA.md) | Arquitectura propuesta y decisiones técnicas |
| [PLAN_IMPLEMENTACION.md](PLAN_IMPLEMENTACION.md) | Las 7 fases y sus tareas |
| [ROADMAP.md](ROADMAP.md) | Progreso por fases |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Estado actual, pendientes y bloqueos |
| [docs/audit/inventario-productos.csv](docs/audit/inventario-productos.csv) | 126 productos de la web actual |
| [docs/audit/urls-actuales.csv](docs/audit/urls-actuales.csv) | 239 URLs indexadas (base del mapa de redirecciones) |

## Ramas

```
feature/* · fix/* · docs/* · seo/*  ──PR──▶  preproduccion  ──PR (aprobación)──▶  main  ──▶  tag vX.Y.Z  ──▶  Release  ──▶  producción
```

- **`main`**: código estable de producción. No se trabaja directamente en ella.
- **`preproduccion`**: integración y validación. Todo trabajo nuevo sale de aquí.
- Commits con [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat:`, `fix:`, `docs:`, `seo:`…).
- Versiones con SemVer y Releases de GitHub. Nunca se crea una Release sin aprobación explícita.
