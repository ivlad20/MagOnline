"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ProductCard, { type Product } from "./ProductCard";

interface ProductCarouselProps {
  eyebrow?: string;
  title: string;
  products: Product[];
  href?: string;
  linkLabel?: string;
}

export default function ProductCarousel({
  eyebrow,
  title,
  products,
  href,
  linkLabel = "Vezi tot",
}: ProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;

    // Măsurăm distanța reală dintre carduri (lățime card + gap),
    // ca să derulăm exact cu un produs, indiferent de breakpoint.
    const items = el.querySelectorAll<HTMLElement>("[data-carousel-item]");
    let amount = el.clientWidth * 0.8;

    if (items.length > 1) {
      amount = items[1].offsetLeft - items[0].offsetLeft;
    } else if (items.length === 1) {
      amount = items[0].offsetWidth;
    }

    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (!products?.length) return null;

  return (
    <section className="mx-auto max-w-[1800px] px-4 py-12 sm:px-6 lg:px-10">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        action={
          <>
            {href && (
              <Link
                href={href}
                className="hidden text-sm font-medium text-voltaic hover:text-voltaic/70 sm:inline-block"
              >
                {linkLabel}
              </Link>
            )}
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Derulează la stânga"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-black/10 text-[#111111] transition-colors hover:bg-black/5 sm:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Derulează la dreapta"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-black/10 text-[#111111] transition-colors hover:bg-black/5 sm:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        }
      />

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div key={product.id} data-carousel-item className="snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}