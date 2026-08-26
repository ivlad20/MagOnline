"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductPlusImages } from "@/types/product";

const ITEM_WIDTH = 220; // px — trebuie să corespundă cu w-[220px] de mai jos
const GAP = 16; // px — corespunde cu gap-4
const STEP = ITEM_WIDTH + GAP;
const SETTLE_DELAY = 150; // ms fără scroll => considerăm "așezat"

export default function HeroHistoryCarousel({ products }: { products: ProductPlusImages[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);
  const settleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCentered = useRef(false);

  const n = products.length;
  const loopedProducts = n > 0 ? [...products, ...products, ...products] : [];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || n === 0 || hasCentered.current) return;

    const middleStart = n * STEP;
    const center = middleStart - track.clientWidth / 2 + ITEM_WIDTH / 2;
    track.scrollLeft = Math.max(0, center);
    hasCentered.current = true;
  }, [n]);

  function normalizeLoop() {
    const track = trackRef.current;
    if (!track || n === 0) return;

    const middleStart = n * STEP;
    const middleEnd = 2 * n * STEP;

    if (track.scrollLeft < middleStart) {
      track.scrollLeft += n * STEP;
    } else if (track.scrollLeft >= middleEnd) {
      track.scrollLeft -= n * STEP;
    }
  }

  function handleScroll() {
    if (settleTimeout.current) clearTimeout(settleTimeout.current);
    settleTimeout.current = setTimeout(normalizeLoop, SETTLE_DELAY);
  }

  function scrollByStep(direction: 1 | -1) {
    trackRef.current?.scrollBy({ left: direction * STEP, behavior: "smooth" });
  }

  function handlePointerDown(e: React.PointerEvent) {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartLeft.current = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = scrollStartLeft.current - (e.clientX - dragStartX.current);
  }

  function handlePointerUp() {
    isDragging.current = false;
  }

  if (n === 0) return null;

  return (
    <div className="relative w-full">
      <button
        type="button"
        aria-label="Produsul anterior"
        onClick={() => scrollByStep(-1)}
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Produsul următor"
        onClick={() => scrollByStep(1)}
        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="flex w-full cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-110px)] pb-2 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loopedProducts.map((product, i) => (
          <Link
            key={`${product.id}-${i}`}
            href={`/product/${product.id}`}
            draggable={false}
            className="flex w-[220px] flex-shrink-0 snap-center flex-col gap-2 rounded-2xl border border-white/20 bg-white/10 p-3 text-left backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <div className="relative h-28 w-full overflow-hidden rounded-xl bg-white/5">
              {product.mainImage && (
                <Image
                  src={product.mainImage}
                  alt={product.title}
                  fill
                  draggable={false}
                  className="object-contain"
                  sizes="220px"
                />
              )}
            </div>
            <p className="line-clamp-2 text-sm font-medium text-white">{product.title}</p>
            <p className="text-sm font-semibold text-white/80">{product.price} lei</p>
          </Link>
        ))}
      </div>
    </div>
  );
}