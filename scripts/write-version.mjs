/**
 * Escribe out/version.json para identificar exactamente qué versión está publicada.
 * Se ejecuta automáticamente tras `npm run build` (script "postbuild").
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const info = {
  name: "Floristería Tu Jardín",
  version: process.env.NEXT_PUBLIC_APP_VERSION ?? pkg.version,
  commit: (process.env.NEXT_PUBLIC_APP_COMMIT ?? process.env.GITHUB_SHA ?? "local").slice(0, 7),
  environment: process.env.NEXT_PUBLIC_SITE_ENV ?? "development",
  builtAt: new Date().toISOString(),
};
await writeFile(path.join(root, "out", "version.json"), JSON.stringify(info, null, 2) + "\n");
console.log(`version.json → ${info.version} (${info.commit}, ${info.environment})`);
