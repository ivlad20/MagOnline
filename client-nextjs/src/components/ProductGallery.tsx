"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface ProductGalleryProps {
  title: string;
  mainImage: string | null;
  images: string[];
}

export default function ProductGallery({ title, mainImage, images }: ProductGalleryProps) {
  const gallery = [...new Set([mainImage, ...images].filter((src): src is string => Boolean(src)))];
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => setIndex((i + gallery.length) % gallery.length);

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse">
      <div className="relative flex aspect-square flex-1 items-center justify-center overflow-hidden rounded-2xl border border-mist bg-white">
        {gallery.length > 0 ? (
          // Plain <img>: sources may be local uploads or remote buckets with unknown sizes.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gallery[index]} alt={title} className="h-full w-full object-contain p-8" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-seal-light">
            <ImageOff className="h-10 w-10" />
            <span className="text-sm">Imaginea produsului urmează</span>
          </div>
        )}

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Imaginea anterioară"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-mist bg-white text-navy shadow-sm transition-colors hover:border-crimson hover:text-crimson"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Imaginea următoare"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-mist bg-white text-navy shadow-sm transition-colors hover:border-crimson hover:text-crimson"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Imaginea ${i + 1}`}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 transition-colors lg:h-20 lg:w-20 ${
                i === index ? "border-crimson" : "border-mist hover:border-seal-light"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
