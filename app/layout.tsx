import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@/styles/globals.css";
import { site } from "@/config/site";
import { asset } from "@/lib/paths";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";

const indexable = site.env === "production";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s - ${site.name}` },
  description: undefined,
  robots: indexable ? undefined : { index: false, follow: false },
  icons: {
    icon: [
      { url: asset("/images/brand/favicon-32.png"), sizes: "32x32" },
      { url: asset("/images/brand/favicon-270.png"), sizes: "192x192" },
    ],
    apple: asset("/apple-icon.png"),
  },
  other: {
    "app-version": process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
    "app-commit": process.env.NEXT_PUBLIC_APP_COMMIT ?? "local",
  },
};

export const viewport: Viewport = { themeColor: "#C5246E", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
