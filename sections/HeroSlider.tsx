"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { asset } from "@/lib/paths";

export interface HeroSlide {
  title: readonly string[];
  cta: { label: string; href: string };
  image: string;
}

const INTERVAL = 6000;

/**
 * Slider de la home (sustituye a Slider Revolution): fundido entre 3 diapositivas,
 * numeración 01/02/03 en escritorio y puntos en móvil. Se pausa al pasar el ratón
 * o con el foco y respeta prefers-reduced-motion.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((i: number) => setCurrent((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => go(current + 1), INTERVAL);
    return () => window.clearTimeout(id);
  }, [current, paused, go]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Destacados"
      className="relative desktop:px-[60px] desktop:pb-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative h-svh min-h-[560px] overflow-hidden desktop:h-[640px] desktop:min-h-0">
        {slides.map((slide, i) => {
          const active = i === current;
          const Heading = i === 0 ? "h1" : "h2";
          return (
            <div
              key={slide.image}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${slides.length}`}
              aria-hidden={!active}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
              style={{ backgroundImage: `url(${asset(slide.image)})` }}
            >
              <div className="flex h-full flex-col items-center justify-center px-5 text-center desktop:items-start desktop:px-[60px] desktop:text-left">
                <Heading className="font-display-black text-[38px] leading-[1.1] text-accent sm:text-[64px] desktop:text-hero">
                  {slide.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </Heading>
                <Link
                  href={slide.cta.href}
                  tabIndex={active ? 0 : -1}
                  className="mt-12 inline-block rounded-full border-2 border-accent px-[42px] py-[20px] text-[13px] font-medium tracking-[0.1em] text-accent uppercase transition-colors hover:bg-accent hover:text-navy desktop:mt-[50px] desktop:text-xs"
                >
                  {slide.cta.label}
                </Link>
              </div>
            </div>
          );
        })}

        {/* Puntos (móvil) */}
        <div className="absolute bottom-[200px] left-1/2 z-20 flex -translate-x-1/2 gap-2 desktop:hidden">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              aria-current={i === current}
              className={`h-3 w-3 rounded-full border border-accent ${i === current ? "bg-accent" : ""}`}
            />
          ))}
        </div>
        <span className="absolute bottom-[270px] left-1/2 z-20 h-11 w-px bg-accent desktop:hidden" aria-hidden />
      </div>

      {/* Numeración 01 / 02 / 03 (escritorio) */}
      <ol className="absolute top-1/2 left-0 z-20 hidden -translate-y-[calc(50%+40px)] flex-col gap-4 desktop:flex">
        {slides.map((_, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              aria-current={i === current}
              className={`flex items-center gap-2.5 pl-2 font-display-regular text-lg ${
                i === current ? "text-brand" : "text-muted/70"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
              <span
                className={`block h-px transition-all ${i === current ? "w-[70px] bg-accent-dark" : "w-[30px] bg-muted/50"}`}
              />
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
