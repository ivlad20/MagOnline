"use client";

import { useEffect, useState } from "react";
import ProductCarousel from "./ProductCarousel";
import type { Product } from "./ProductCard";

const STORAGE_KEY = "magonline:recently-viewed";
const MAX_ITEMS = 12;

/**
 * Call this from the product detail page (e.g. in useEffect)
 * so the visited product shows up here next time.
 */
export function trackProductView(product: Product) {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const existing: Product[] = raw ? JSON.parse(raw) : [];
    const next = [product, ...existing.filter((p) => p.id !== product.id)].slice(
      0,
      MAX_ITEMS
    );
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private mode etc.) — ignore silently
  }
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      setProducts(raw ? JSON.parse(raw) : []);
    } catch {
      setProducts([]);
    }
  }, []);

  if (!products?.length) return null;

  return (
    <ProductCarousel
      eyebrow="Istoric de navigare"
      title="Continuă de unde ai rămas"
      products={products}
    />
  );
}
