import type { NextConfig } from "next";

/**
 * Export 100 % estático (`out/`): se puede servir desde cualquier servidor web
 * (Apache, nginx, GitHub Pages) sin Node.js. Ver ARQUITECTURA_NUEVA.md.
 *
 * NEXT_PUBLIC_BASE_PATH permite publicar en un subdirectorio, p. ej.
 * "/floristeria-tu-jardin-web" en GitHub Pages. En el dominio final va vacío.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
