"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductDetail } from "@/types/product";

const AUTO_SLIDE_INTERVAL = 3000;
const AUTO_SLIDE_STEP = 260;

export default function HeroHistoryCarousel({
  products,
}: {
  products: ProductDetail[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);

  useEffect(() => {
    if (isPaused) return;
    const track = trackRef.current;
    if (!track) return;

    const interval = setInterval(() => {
      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({
        left: atEnd ? 0 : track.scrollLeft + AUTO_SLIDE_STEP,
        behavior: "smooth",
      });
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused]);

  function handlePointerDown(e: React.PointerEvent) {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    setIsPaused(true);
    dragStartX.current = e.clientX;
    scrollStartLeft.current = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft =
      scrollStartLeft.current - (e.clientX - dragStartX.current);
  }

  function handlePointerUp() {
    isDragging.current = false;
    setTimeout(() => setIsPaused(false), 2000);
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="flex w-full max-w-5xl cursor-grab gap-4 overflow-x-auto px-4 pb-2 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.id}`}
          draggable={false}
          className="flex w-[220px] flex-shrink-0 flex-col gap-2 rounded-2xl border border-white/20 bg-white/10 p-3 text-left backdrop-blur-md transition-colors hover:bg-white/20"
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
          <p className="line-clamp-2 text-sm font-medium text-white">
            {product.title}
          </p>
          <p className="text-sm font-semibold text-white/80">
            {product.price} lei
          </p>
        </Link>
      ))}
    </div>
  );
}
