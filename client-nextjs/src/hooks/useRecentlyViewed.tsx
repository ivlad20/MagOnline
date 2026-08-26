"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getRecentlyViewed } from "@/lib/products";
import { ProductPlusImages } from "@/types/product";

export function useRecentlyViewed() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [products, setProducts] = useState<ProductPlusImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getRecentlyViewed()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, [user, isAuthLoading]);

  return { products, isLoading };
}