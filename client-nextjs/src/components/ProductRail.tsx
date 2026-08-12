"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import type { ProductPlusImages } from "@/types/product";
import ProductCard from "./ProductCard";

type ProductRailProps = {
  title: string;
  subtitle?: string;
  products: ProductPlusImages[];
};

export default function ProductRail({ title, subtitle, products }: ProductRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, products]);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({
      left: dir * trackRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-ink-soft">{subtitle}</p>}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            aria-label="Derulează la stânga"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-mist text-ink transition-colors hover:border-voltaic hover:text-voltaic disabled:opacity-30"
          >
            <FaArrowLeft size={13} />
          </button>
          <button
            aria-label="Derulează la dreapta"
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-mist text-ink transition-colors hover:border-voltaic hover:text-voltaic disabled:opacity-30"
          >
            <FaArrowRight size={13} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
