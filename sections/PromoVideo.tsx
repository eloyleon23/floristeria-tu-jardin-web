"use client";

import { useState } from "react";
import { asset } from "@/lib/paths";
import { Container } from "@/components/ui/Container";

/**
 * Bloque "San Valentín" con vídeo de YouTube. El reproductor (youtube-nocookie)
 * solo se carga al pulsar el botón: no hay peticiones a terceros antes.
 */
export function PromoVideo({
  eyebrow,
  title,
  youtubeId,
  poster,
  items,
}: {
  eyebrow: string;
  title: string;
  youtubeId: string;
  poster?: string;
  items: { icon: string; text: string }[];
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="bg-surface py-20 desktop:py-[120px]">
      <Container className="grid items-center gap-12 desktop:grid-cols-2 desktop:gap-[70px]">
        <div className="relative aspect-[650/414] overflow-hidden bg-[#bcbfc7]">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 flex items-center justify-center"
              aria-label={`Reproducir vídeo: ${title}`}
            >
              {poster ? (
                <img
                  src={asset(poster)}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
              <span className="relative flex h-[105px] w-[105px] items-center justify-center rounded-full border-2 border-accent bg-navy/30 text-accent transition-transform group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
            </button>
          )}
        </div>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="font-display-black mt-2 max-w-[520px] text-[40px] leading-[1.1] text-navy desktop:text-h2">
            {title}
          </h2>
          <ul className="mt-10 space-y-4">
            {items.map((item) => (
              <li key={item.text} className="flex items-center gap-4 text-[15px] text-navy">
                <img
                  src={asset(item.icon)}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                  loading="lazy"
                />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
