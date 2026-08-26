// lib/api.ts
import type { Product, ProductCardInterface, ProductPlusImages } from "@/types/product";
import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL && typeof window === "undefined") {
  // Fails loudly at build/server time instead of silently fetching "undefined/..."
  console.warn(
    "NEXT_PUBLIC_API_URL nu este setat — request-urile către backend vor eșua."
  );
}

export async function apiFetch<T>(path: string, revalidateSeconds = 60): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) {
      console.error(`API ${path} → ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`API ${path} a eșuat:`, err);
    return null;
  }
}



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
