"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import MoltenMetalBG from "./MoltenMetalBG";
import type { Product } from "./ProductCard";

const INTERVAL_MS = 5500;

/** Carousel showing one product at a time, cross-fading between them. */
export default function OffersSpotlight({ products }: { products: Product[] }) {
  const items = products.slice(0, 8);
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + n) % n), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => go(1), INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused, n, go]);

  if (n === 0) return null;

  return (
    <section
      id="oferte"
      aria-roledescription="carusel"
      aria-label="Ofertele săptămânii"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative isolate h-[500px] overflow-hidden rounded-3xl bg-navy-deep text-white sm:h-[400px]"
    >
      <MoltenMetalBG
        color1="#DC1F5A"
        color2="#4A6A8C"
        color3="#FFFFFF"
        speed={0.3}
        scale={5}
        detail={3}
        glow={1.6}
        coreSize={0.2}
        blackPoint={0}
        grainIntensity={0}
        brightness={1}
        mouseInteraction={false}
        opacity={0.85}
        className="absolute inset-0 -z-10 h-full w-full"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep/85 via-navy-deep/40 to-transparent" />

      {items.map((p, i) => {
        const visible = i === index;
        return (
          <div
            key={p.id}
            aria-hidden={!visible}
            className={`absolute inset-0 grid grid-rows-[1fr_auto] gap-4 p-6 pb-16 transition-opacity duration-700 ease-out sm:grid-cols-[1.1fr_1fr] sm:grid-rows-1 sm:p-10 ${
              visible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="order-2 flex flex-col justify-center sm:order-1">
              <span className="mb-3 w-fit rounded-full bg-crimson px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Oferta săptămânii
              </span>
              {p.brand && (
                <span className="text-sm font-semibold uppercase tracking-wider text-seal-light">{p.brand}</span>
              )}
              <h2 className="mt-1 line-clamp-2 font-display text-2xl font-semibold leading-tight sm:text-4xl">
                {p.title}
              </h2>
              <p className="mt-3 font-price text-3xl font-bold sm:text-4xl">
                {p.price.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="ml-1 text-lg font-medium text-white/70">lei</span>
              </p>
              <div className="mt-5 flex gap-3">
                <Link
                  href={`/product/${p.id}`}
                  tabIndex={visible ? 0 : -1}
                  className="rounded-lg bg-crimson px-6 py-3 text-sm font-semibold transition-colors hover:bg-crimson-deep"
                >
                  Vezi produsul
                </Link>
                <Link
                  href={`/category/${encodeURIComponent(p.category)}`}
                  tabIndex={visible ? 0 : -1}
                  className="hidden rounded-lg bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20 sm:block"
                >
                  {p.category}
                </Link>
              </div>
            </div>

            <div className="relative order-1 flex items-center justify-center sm:order-2">
              <div
                className={`relative h-full max-h-[300px] w-full max-w-[340px] rounded-3xl bg-white/95 shadow-2xl transition-transform duration-700 ${
                  visible ? "scale-100" : "scale-95"
                }`}
              >
                {p.mainImage ? (
                  <Image
                    src={p.mainImage}
                    alt={p.title}
                    fill
                    sizes="340px"
                    priority={i === 0}
                    className="object-contain p-6"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-seal">
                    <ImageOff className="h-10 w-10" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {n > 1 && (
        <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between sm:left-10 sm:right-10">
          <div className="flex gap-2">
            {items.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Oferta ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-crimson" : "w-3 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Oferta anterioară"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white/25"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Oferta următoare"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white/25"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
