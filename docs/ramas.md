# Ramas, commits y versiones

## Flujo actual (provisional, acordado al inicio de la Fase 1)

```
feature/* · fix/* · docs/*  ──PR──▶  main  ──▶  preproducción (GitHub Pages)
```

Mientras no exista servidor de producción, **`main` hace de preproducción**: cada PR fusionada en `main`
se publica en GitHub Pages para revisarla. No se trabaja directamente en `main`; todo cambio llega por PR.

## Flujo objetivo (antes de producción, Fase 4)

```
feature/* ──PR──▶ preproduccion ──PR (aprobación)──▶ main ──▶ tag vX.Y.Z ──▶ Release ──▶ producción
```

## Convenciones

- Commits: [Conventional Commits](https://www.conventionalcommits.org/es/) — `feat:`, `fix:`, `docs:`,
  `refactor:`, `perf:`, `seo:`, `chore:`, `test:`, `ci:`.
- Versiones: SemVer. Nunca se crea un tag ni una Release sin aprobación explícita.
