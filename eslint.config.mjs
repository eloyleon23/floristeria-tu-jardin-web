import next from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...next,
  ...nextTs,
  { ignores: [".next/**", "out/**", "node_modules/**", "playwright-report/**", "test-results/**", "next-env.d.ts"] },
  {
    rules: {
      // Las imágenes se sirven pre-optimizadas (export estático, sin optimizador de Next).
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
