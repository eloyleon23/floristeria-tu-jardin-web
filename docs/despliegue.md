# Despliegue

La web es un conjunto de archivos estáticos (`out/`). Cualquier servidor web los puede servir.

## Preproducción: GitHub Pages

- URL: https://eloyleon23.github.io/floristeria-tu-jardin-web/
- Se publica automáticamente en cada push a `main` con el workflow `.github/workflows/deploy-pages.yml`
  (lint + tipos + tests + build con `NEXT_PUBLIC_BASE_PATH=/floristeria-tu-jardin-web`).
- Lleva `noindex, nofollow`: Google no la indexará.
- **Configuración necesaria (una sola vez):** GitHub → Settings → Pages → *Build and deployment* →
  *Source*: **GitHub Actions**. (Con "Deploy from a branch" GitHub publicaría el README con Jekyll en
  lugar de la web.)
- Versión publicada: `/floristeria-tu-jardin-web/version.json` (versión, commit, entorno, fecha).

## Producción (Fase 7)

```bash
NEXT_PUBLIC_SITE_ENV=production NEXT_PUBLIC_SITE_URL=https://floristeriatujardin.es npm run build
```

y subir el contenido de `out/` a la raíz del dominio. Requisitos del servidor: HTTPS y reglas de
redirección (las genera la Fase 6). El despliegue automatizado (SFTP/FTPS) y el rollback por tag se
preparan en la Fase 4.

## Variables de entorno

| Variable | Uso | Preproducción | Producción |
|---|---|---|---|
| `NEXT_PUBLIC_BASE_PATH` | Subdirectorio de publicación | `/floristeria-tu-jardin-web` | vacío |
| `NEXT_PUBLIC_SITE_URL` | URL canónica | `https://floristeriatujardin.es` | igual |
| `NEXT_PUBLIC_SITE_ENV` | `preview` = noindex | `preview` | `production` |
| `NEXT_PUBLIC_APP_VERSION` / `NEXT_PUBLIC_APP_COMMIT` | Identificación de versión | automático | automático |

Ninguna de estas variables es secreta. Los secretos (Brevo, Google) nunca irán al frontend.
