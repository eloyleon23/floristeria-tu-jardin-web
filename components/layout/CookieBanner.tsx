"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";

const STORAGE_KEY = "tj-cookie-consent";
const CHANGE_EVENT = "tj:cookie-consent-change";
type Consent = { necessary: true; analytics: boolean; date: string };

/** Consentimiento guardado en el navegador como almacén externo (useSyncExternalStore). */
const consentStore = {
  subscribe(callback: () => void) {
    window.addEventListener(CHANGE_EVENT, callback);
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener(CHANGE_EVENT, callback);
      window.removeEventListener("storage", callback);
    };
  },
  getSnapshot(): string | null {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  /** En el HTML estático no se conoce el consentimiento: no se pinta el aviso. */
  getServerSnapshot(): string {
    return "server";
  },
  save(analytics: boolean) {
    try {
      const value: Consent = { necessary: true, analytics, date: new Date().toISOString() };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* almacenamiento no disponible: el aviso volverá a mostrarse */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  },
};

function parse(raw: string | null): Consent | null {
  if (!raw || raw === "server") return null;
  try {
    return JSON.parse(raw) as Consent;
  } catch {
    return null;
  }
}

/**
 * Aviso de cookies con el aspecto del original (caja rosa abajo a la derecha).
 * Fase 1: solo interfaz; la web aún no carga cookies no necesarias.
 * La lógica de consentimiento (Consent Mode, botón Rechazar) llega en la Fase 6.
 */
export function CookieBanner() {
  const raw = useSyncExternalStore(consentStore.subscribe, consentStore.getSnapshot, consentStore.getServerSnapshot);
  const consent = parse(raw);
  const [settings, setSettings] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [analytics, setAnalytics] = useState<boolean | null>(null);

  useEffect(() => {
    const open = () => setSettings(true);
    window.addEventListener("tj:open-cookie-settings", open);
    return () => window.removeEventListener("tj:open-cookie-settings", open);
  }, []);

  const accept = (value: boolean) => {
    consentStore.save(value);
    setDismissed(true);
    setSettings(false);
  };

  const showBanner = raw !== "server" && !consent && !dismissed;
  if (!showBanner && !settings) return null;
  const analyticsChecked = analytics ?? consent?.analytics ?? false;

  return (
    <>
      {!settings ? (
        <div
          role="region"
          aria-label="Aviso de cookies"
          className="fixed right-[15px] bottom-[15px] left-[15px] z-50 rounded-[2px] bg-brand p-[30px] text-xs leading-[18px] font-light text-accent sm:left-auto sm:w-[350px]"
        >
          <p>
            Usamos cookies en nuestro sitio web para brindarle la experiencia más relevante recordando sus preferencias
            y visitas repetidas. Al hacer clic en &quot;Aceptar&quot;, acepta el uso de TODAS las cookies.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <button type="button" className="underline hover:text-white" onClick={() => setSettings(true)}>
              Configuración de cookies
            </button>
            <button
              type="button"
              className="border-2 border-accent px-3 py-1.5 hover:bg-accent hover:text-brand"
              onClick={() => accept(true)}
            >
              Aceptar
            </button>
          </div>
        </div>
      ) : (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-title"
        >
          <div className="max-h-full w-full max-w-[640px] overflow-y-auto bg-surface p-8 text-sm text-text">
            <div className="flex items-start justify-between">
              <h2 id="cookie-title" className="font-display-regular text-h4">
                Resumen de privacidad
              </h2>
              <button type="button" onClick={() => setSettings(false)} aria-label="Cerrar" className="p-1">
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 leading-relaxed">
              Este sitio web utiliza cookies para mejorar su experiencia mientras navega por el sitio web. Las cookies
              que se clasifican como necesarias se almacenan en su navegador, ya que son esenciales para el
              funcionamiento de las funcionalidades básicas del sitio web. Las demás solo se almacenarán con su
              consentimiento. Más información en la{" "}
              <Link href="/politica-cookies/" className="text-brand underline">
                política de cookies
              </Link>
              .
            </p>
            <div className="mt-6 divide-y divide-border border-y border-border">
              <div className="flex items-center justify-between py-3">
                <span className="font-medium">Necesarias</span>
                <span className="text-xs text-muted">Siempre activado</span>
              </div>
              <label className="flex cursor-pointer items-center justify-between py-3">
                <span className="font-medium">No necesarias</span>
                <input
                  type="checkbox"
                  checked={analyticsChecked}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="h-4 w-4 accent-brand"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => accept(analyticsChecked)}
              className="mt-6 bg-brand px-6 py-3 text-xs font-medium tracking-[0.1em] text-white uppercase hover:bg-brand-dark"
            >
              Guardar y aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
