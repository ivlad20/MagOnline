import { ProductCardInterface, ProductPlusImages } from "@/types/product";
import { apiFetch } from "./api";

export async function fetchSearchResults(q: string): Promise<ProductCardInterface[]> {
  if (!q) return [];
  const data = await apiFetch<ProductPlusImages[]>(`/products/search?q=${encodeURIComponent(q)}`, 0);
  return (data ?? []).map((p) => ({
    id: p.id,
    mainImage: p.mainImage,
    title: p.title,
    category: p.category,
    price: p.price,
    brand: p.brand,
  }));
}
