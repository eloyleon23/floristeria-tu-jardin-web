"use client";

import { useEffect, useState } from "react";
import { asset } from "@/lib/paths";
import { Icon } from "@/components/ui/Icon";

interface Testimonial {
  text: string;
  author: string;
  role: string;
  avatar: string;
}

/** Carrusel de testimonios sobre fondo azul claro, con flechas menta. */
export function Testimonials({ items, arrows = false }: { items: Testimonial[]; arrows?: boolean }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (i: number) => setCurrent((i + items.length) % items.length);

  useEffect(() => {
    if (paused || items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setCurrent((c) => (c + 1) % items.length), 7000);
    return () => window.clearTimeout(id);
  }, [current, paused, items.length]);

  const t = items[current];
  if (!t) return null;

  return (
    <section
      className="bg-sky pt-[84px] pb-[112px]"
      aria-roledescription="carrusel"
      aria-label="Testimonios"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto flex w-[calc(100%-40px)] max-w-(--container-site) items-center">
        {arrows ? (
          <button
            type="button"
            onClick={() => go(current - 1)}
            aria-label="Testimonio anterior"
            className="hidden text-mint md:block"
          >
            <Icon name="arrowLeft" className="h-6 w-[60px]" strokeWidth={1} />
          </button>
        ) : null}
        <figure className="mx-auto max-w-[1180px] flex-1 text-center" aria-live="polite">
          <img
            src={asset(t.avatar)}
            alt=""
            width={86}
            height={86}
            className="mx-auto h-[86px] w-[86px] rounded-full"
            loading="lazy"
          />
          <blockquote className="font-display-regular mt-[30px] text-[22px] leading-[1.25] text-navy desktop:text-[26px]">
            {t.text}
          </blockquote>
          <figcaption className="mt-12">
            <span className="block text-xs tracking-[0.1em] text-mint uppercase">{t.author}</span>
            <span className="mt-1 block text-[13px] text-navy">{t.role}</span>
          </figcaption>
        </figure>
        {arrows ? (
          <button
            type="button"
            onClick={() => go(current + 1)}
            aria-label="Testimonio siguiente"
            className="hidden text-mint md:block"
          >
            <Icon name="arrowRight" className="h-6 w-[60px]" strokeWidth={1} />
          </button>
        ) : null}
      </div>
      {arrows && items.length > 1 ? (
        <div className="mt-8 flex justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.author}
              type="button"
              onClick={() => go(i)}
              aria-label={`Testimonio ${i + 1}`}
              aria-current={i === current}
              className={`h-2 w-2 rounded-full ${i === current ? "bg-mint" : "bg-mint/30"}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
