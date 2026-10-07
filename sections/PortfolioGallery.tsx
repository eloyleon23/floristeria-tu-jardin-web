"use client";

import { useCallback, useEffect, useState } from "react";
import type { ImageRef } from "@/types/catalog";
import { asset } from "@/lib/paths";
import { Picture } from "@/components/ui/Picture";
import { Icon } from "@/components/ui/Icon";

/** Galería en mosaico con visor a pantalla completa (sustituye a prettyPhoto). */
export function PortfolioGallery({ images }: { images: ImageRef[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const move = useCallback(
    (d: number) => setOpen((o) => (o === null ? o : (o + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, move]);

  const current = open === null ? null : images[open];

  return (
    <>
      <ul className="columns-2 gap-[10px] md:columns-3 desktop:gap-5">
        {images.map((img, i) => (
          <li key={img.src} className="mb-[10px] break-inside-avoid desktop:mb-5">
            <button type="button" onClick={() => setOpen(i)} className="block w-full" aria-label={`Ampliar ${img.alt}`}>
              <Picture
                image={img}
                sizes="(min-width: 1025px) 420px, 50vw"
                className="w-full transition-opacity hover:opacity-85"
              />
            </button>
          </li>
        ))}
      </ul>
      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={close}
        >
          <img
            src={asset(current.src)}
            alt={current.alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button type="button" onClick={close} aria-label="Cerrar" className="absolute top-5 right-5 p-2 text-white">
            <Icon name="close" className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
            aria-label="Anterior"
            className="absolute left-4 p-2 text-white"
          >
            <Icon name="arrowLeft" className="h-6 w-[50px]" strokeWidth={1} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
            aria-label="Siguiente"
            className="absolute right-4 p-2 text-white"
          >
            <Icon name="arrowRight" className="h-6 w-[50px]" strokeWidth={1} />
          </button>
          <p className="absolute bottom-5 text-sm text-white/80">
            {(open ?? 0) + 1} / {images.length}
          </p>
        </div>
      ) : null}
    </>
  );
}
