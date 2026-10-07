/**
 * Servidor estático mínimo para probar `out/` tal y como lo serviría Apache/nginx,
 * incluido el subdirectorio NEXT_PUBLIC_BASE_PATH. Uso: node scripts/serve-static.mjs [puerto]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const port = Number(process.argv[2] ?? 4173);
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const root = path.resolve(import.meta.dirname, "..", "out");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

createServer(async (req, res) => {
  let url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  if (base && url.startsWith(base)) url = url.slice(base.length) || "/";
  let file = path.join(root, url);
  if (!file.startsWith(root)) return res.writeHead(403).end();
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
    res.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(await readFile(path.join(root, "404.html")).catch(() => "404"));
  }
}).listen(port, () => console.log(`out/ en http://localhost:${port}${base}/`));
