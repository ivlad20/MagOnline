"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = {
  eyebrow: string;
  title: string;
  copy: string;
  ctaLabel: string;
  ctaHref: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Sezon laptopuri",
    title: "Putere de calcul pentru orice sarcină",
    copy: "Configurații pentru gaming, muncă și creație — livrare în 24-48h.",
    ctaLabel: "Vezi laptopuri",
    ctaHref: "/category/laptop-pc",
  },
  {
    eyebrow: "Noutăți",
    title: "Cele mai noi smartphone-uri",
    copy: "Modele recente, garanție extinsă inclusă.",
    ctaLabel: "Descoperă",
    ctaHref: "/category/smartphone",
  },
  {
    eyebrow: "Gaming",
    title: "Console & accesorii",
    copy: "Tot ce ai nevoie pentru configurația de joc.",
    ctaLabel: "Explorează",
    ctaHref: "/category/console",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const main = SLIDES[active];

  return (
    <section className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 px-4 pt-6 sm:px-8 lg:grid-cols-[2fr_1fr]">
      {/* Large rotating promo */}
      <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-xl bg-voltaic-deep p-8 text-paper sm:min-h-[380px] sm:p-10">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-voltaic-light/30 blur-2xl"
          aria-hidden
        />
        <div className="relative">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">
            {main.eyebrow}
          </span>
          <h1 className="mt-3 max-w-md font-display text-3xl font-semibold leading-tight sm:text-4xl">
            {main.title}
          </h1>
          <p className="mt-3 max-w-sm text-sm text-paper/80">{main.copy}</p>
          <Link
            href={main.ctaHref}
            className="mt-6 inline-flex items-center gap-2 bg-ember px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ember-deep"
          >
            {main.ctaLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="relative flex gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.title}
              aria-label={`Slide ${i + 1}: ${slide.title}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-8 bg-ember" : "w-4 bg-paper/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Two stacked side promos */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
        <Link
          href="/category/periferice"
          className="group flex flex-col justify-between rounded-xl border border-mist bg-white p-5 transition-shadow hover:shadow-md"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Periferice
          </span>
          <span className="font-display text-lg font-semibold text-ink group-hover:text-voltaic">
            Setup complet de birou →
          </span>
        </Link>
        <Link
          href="/category/tablete"
          className="group flex flex-col justify-between rounded-xl border border-mist bg-white p-5 transition-shadow hover:shadow-md"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Tablete
          </span>
          <span className="font-display text-lg font-semibold text-ink group-hover:text-voltaic">
            Portabile, pentru orice zi →
          </span>
        </Link>
      </div>
    </section>
  );
}
