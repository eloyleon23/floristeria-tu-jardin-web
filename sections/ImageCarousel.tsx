"use client";

import { useState } from "react";
import type { ImageRef } from "@/types/catalog";
import { Picture } from "@/components/ui/Picture";
import { Icon } from "@/components/ui/Icon";

/** Carrusel de imágenes con flechas menta (página Nosotros). */
export function ImageCarousel({ images, label }: { images: ImageRef[]; label: string }) {
  const [current, setCurrent] = useState(0);
  const go = (i: number) => setCurrent((i + images.length) % images.length);
  return (
    <div className="relative aspect-[3/2] overflow-hidden" aria-roledescription="carrusel" aria-label={label}>
      {images.map((img, i) => (
        <div
          key={img.src}
          aria-hidden={i !== current}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          {Math.abs(i - current) <= 1 || i === images.length - 1 ? (
            <Picture image={img} sizes="(min-width: 1025px) 650px, 100vw" className="h-full w-full object-cover" />
          ) : null}
        </div>
      ))}
      <button
        type="button"
        onClick={() => go(current - 1)}
        aria-label="Imagen anterior"
        className="absolute top-1/2 left-[30px] -translate-y-1/2 text-mint hover:text-accent"
      >
        <Icon name="arrowLeft" className="h-6 w-[60px]" strokeWidth={1} />
      </button>
      <button
        type="button"
        onClick={() => go(current + 1)}
        aria-label="Imagen siguiente"
        className="absolute top-1/2 right-[30px] -translate-y-1/2 text-mint hover:text-accent"
      >
        <Icon name="arrowRight" className="h-6 w-[60px]" strokeWidth={1} />
      </button>
      <p className="sr-only" aria-live="polite">
        Imagen {current + 1} de {images.length}
      </p>
    </div>
  );
}
