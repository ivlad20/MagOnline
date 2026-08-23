import Image from "next/image";
import Link from "next/link";
import { ImageOff, Star } from "lucide-react";

export interface Product {
  id: string | number;
  mainImage: string | null;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  brand?: string;
  rating?: number;
  reviewCount?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { id, mainImage, title, category, price, oldPrice, brand, rating, reviewCount } =
    product;

  const discount =
    oldPrice && oldPrice > price ? Math.round(100 - (price / oldPrice) * 100) : null;

  return (
    <Link
      href={`/product/${id}`}
      className="group flex w-[240px] shrink-0 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={title}
            fill
            sizes="240px"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        {discount && (
          <span className="absolute left-3 top-3 rounded-full bg-voltaic px-2.5 py-1 text-xs font-semibold text-paper">
            -{discount}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4 min-h-[160px]">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {brand ? `${brand} · ${category}` : category}
        </span>
        <h3 className="line-clamp-3 text-sm font-medium text-[#111111]">{title}</h3>

        {typeof rating === "number" && (
          <div className="flex items-center gap-1 pt-0.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-200 text-slate-200"
                  }`}
                />
              ))}
            </div>
            {typeof reviewCount === "number" && (
              <span className="text-xs text-slate-400">({reviewCount})</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-semibold text-[#111111]">
            {price.toLocaleString("ro-RO")} lei
          </span>
          {oldPrice && (
            <span className="text-xs text-slate-400 line-through">
              {oldPrice.toLocaleString("ro-RO")} lei
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
