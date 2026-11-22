"use client";

import ProductGallery from "./ProductGallery";
import ProductBuyBox from "./ProductBuyBox";
import { ProductShowcaseProps } from "@/types/product";

export default function ProductShowcase({ product }: ProductShowcaseProps) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
      <ProductGallery
        title={product.title}
        mainImage={product.mainImage}
        images={product.images}
      />

      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-seal">
          {product.brand}
          {product.subcategory ? ` · ${product.subcategory}` : ""}
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold leading-tight text-navy sm:text-3xl">
          {product.title}
        </h1>
        <div className="mt-6">
          <ProductBuyBox product={product} />
        </div>
      </div>
    </div>
  );
}
