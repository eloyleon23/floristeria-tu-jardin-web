/**
 * Comparación visual web original ↔ web nueva (criterio de aceptación de la Fase 1).
 * Genera capturas de ambas y una imagen lado a lado por página y viewport.
 *
 * Uso:
 *   npm run build && node scripts/visual-compare.mjs [--pages home,tienda] [--out tests/visual/report]
 * Requiere acceso a https://floristeriatujardin.es (mientras siga publicada).
 */
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith("--") ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const OUT = path.resolve(args.out ?? "tests/visual/report");
const PORT = 4174;
const ORIGINAL = "https://floristeriatujardin.es";
const NEW = `http://localhost:${PORT}`;

const PAGES = {
  home: "/",
  tienda: "/tienda/",
  categoria: "/product-category/funerarios/coronas/",
  producto: "/producto/ramo-rosas-peluche/",
  eventos: "/eventos/",
  portfolio: "/portfolio-item/ramos-novia/",
  nosotros: "/nosotros/",
  contacto: "/contacto/",
};
const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
const selected = args.pages ? args.pages.split(",") : Object.keys(PAGES);

const hideOriginalCookies = "#cookie-law-info-bar,#cookie-law-info-again{display:none!important}";
const hideNewCookies = '[aria-label="Aviso de cookies"]{display:none!important}';

async function shot(browser, url, viewport, css, file) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 }).catch(() => {});
  await page.addStyleTag({ content: css });
  // Desplaza para disparar la carga diferida de imágenes.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: file, fullPage: true });
  await ctx.close();
}

async function sideBySide(a, b, file) {
  const [ma, mb] = await Promise.all([sharp(a).metadata(), sharp(b).metadata()]);
  const w = ma.width + mb.width + 40;
  const h = Math.max(ma.height, mb.height);
  await sharp({ create: { width: w, height: h, channels: 3, background: "#ffffff" } })
    .composite([
      { input: a, left: 0, top: 0 },
      { input: b, left: ma.width + 40, top: 0 },
    ])
    .png()
    .toFile(file);
}

const server = spawn("node", ["scripts/serve-static.mjs", String(PORT)], {
  stdio: "ignore",
  env: { ...process.env, NEXT_PUBLIC_BASE_PATH: "" },
});
await new Promise((r) => setTimeout(r, 800));
await mkdir(OUT, { recursive: true });
// La web original puede requerir proxy de salida; la local nunca (navegador aparte).
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
const remote = await chromium.launch({ proxy, executablePath: process.env.PW_CHROMIUM_PATH });
const local = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH });
try {
  for (const name of selected) {
    for (const [vp, viewport] of Object.entries(VIEWPORTS)) {
      const base = path.join(OUT, `${name}-${vp}`);
      await shot(remote, ORIGINAL + PAGES[name], viewport, hideOriginalCookies, `${base}-original.png`);
      await shot(local, NEW + PAGES[name], viewport, hideNewCookies, `${base}-nueva.png`);
      await sideBySide(`${base}-original.png`, `${base}-nueva.png`, `${base}-comparacion.png`);
      console.log(`✓ ${name} (${vp})`);
    }
  }
} finally {
  await remote.close();
  await local.close();
  server.kill();
}
