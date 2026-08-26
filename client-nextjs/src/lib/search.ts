import { ProductCardInterface, ProductPlusImages } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchSearchResults(q: string): Promise<ProductCardInterface[]> {
  if (!q) return [];
  const res = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(q)}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data: ProductPlusImages[] = await res.json();
  return data.map((p) => ({
    id: p.id,
    mainImage: p.mainImage,
    title: p.title,
    category: p.category,
    price: p.price,
    brand: p.brand,
  }));
}