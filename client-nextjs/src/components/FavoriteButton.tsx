"use client";

import { Heart } from "lucide-react";
import { shop, useIsFavorite, type ShopProduct } from "@/lib/shopStore";

/** Heart toggle used on top of product cards (which are links, so we stop navigation). */
export default function FavoriteButton({ product, className = "" }: { product: ShopProduct; className?: string }) {
  const isFav = useIsFavorite(product.id);

  return (
    <button
      type="button"
      aria-pressed={isFav}
      aria-label={isFav ? "Elimină de la favorite" : "Adaugă la favorite"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        shop.toggleFavorite(product);
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 transition-colors hover:bg-white ${
        isFav ? "text-crimson" : "text-ink-soft hover:text-crimson"
      } ${className}`}
    >
      <Heart className="h-4 w-4" fill={isFav ? "currentColor" : "none"} />
    </button>
  );
}
