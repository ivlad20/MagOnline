"use client";

import { useState } from "react";
import StarRating from "./StarRating";

interface ProductGalleryProps {
  mainImage: string | null;
  images: string[];
  rating?: number;
  reviewCount?: number;
}

export default function ProductGallery({
  mainImage,
  images,
  rating,
  reviewCount,
}: ProductGalleryProps) {
  const gallery = [mainImage, ...images].filter((src): src is string => Boolean(src));
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => setIndex((i + gallery.length) % gallery.length);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-black/20">
        {gallery.length > 0 ? (
          <img src={gallery[index]} alt="" className="h-full w-full object-contain" />
        ) : (
          <span className="font-display text-sm text-white/50">Imaginea produsului urmează</span>
        )}

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Imaginea anterioară"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-transparent text-white/80 transition-colors hover:text-white"
            >
              <svg viewBox="0 0 12 20" className="h-5 w-5 fill-none stroke-current" strokeWidth={2}>
                <path d="M10 2L2 10L10 18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Imaginea următoare"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-transparent text-white/80 transition-colors hover:text-white"
            >
              <svg viewBox="0 0 12 20" className="h-5 w-5 fill-none stroke-current" strokeWidth={2}>
                <path d="M2 2L10 10L2 18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border transition-colors ${
                i === index ? "border-voltaic" : "border-white/15 hover:border-white/40"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
        {typeof rating === "number" && <StarRating rating={rating} reviewCount={reviewCount} />}

        <div className="flex flex-col gap-1.5 text-sm text-white/60">
          <p>Garanție 24 luni</p>
          <p>Livrare estimată în 24–48h</p>
          <p>Plată securizată — card, transfer sau ramburs</p>
          <p>Retur în 30 de zile</p>
        </div>
      </div>
    </div>
  );
}