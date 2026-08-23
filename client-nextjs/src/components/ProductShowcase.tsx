"use client";

import ProductGallery from "./ProductGallery";
import ProductBuyBox from "./ProductBuyBox";
import { ProductShowcaseProps } from "@/types/product";



export default function ProductShowcase({ product }: ProductShowcaseProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-xl sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
        {product.brand} · {product.subcategory}
      </span>
      <h1 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
        {product.title}
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        <ProductGallery
          mainImage={product.mainImage}
          images={product.images}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
        <ProductBuyBox product={product} />
      </div>
    </div>
  );
}
