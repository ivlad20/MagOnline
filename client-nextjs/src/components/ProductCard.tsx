import Image from "next/image";
import Link from "next/link";
import type { ProductPlusImages } from "@/types/product";
import PriceTag from "./PriceTag";
import StockBadge from "./StockBadge";

export default function ProductCard({ product }: { product: ProductPlusImages }) {
  const image = product.mainImage || product.images?.[0] || null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex w-[240px] shrink-0 flex-col overflow-hidden rounded-lg border border-mist bg-white transition-shadow hover:shadow-lg hover:shadow-ink/5 sm:w-[260px]"
    >
      <div className="relative flex h-[200px] items-center justify-center bg-paper-dim p-6">
        {image ? (
          <Image
            src={image}
            alt={product.description || "Produs"}
            fill
            sizes="260px"
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <span className="font-display text-sm text-ink-soft">Fără imagine</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          {product.brand} · {product.category}
        </span>
        <p className="line-clamp-2 min-h-[2.5rem] font-body text-sm text-ink">
          {product.description}
        </p>
        <StockBadge stock={product.stock} />
        <div className="mt-auto pt-2">
          <PriceTag price={product.price} />
        </div>
      </div>
    </Link>
  );
}
