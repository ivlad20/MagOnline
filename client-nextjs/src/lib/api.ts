// lib/api.ts
import type { Product, ProductDetail, ProductPlusImages } from "@/types/product";
import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL && typeof window === "undefined") {
  // Fails loudly at build/server time instead of silently fetching "undefined/..."
  console.warn(
    "NEXT_PUBLIC_API_URL nu este setat — request-urile către backend vor eșua."
  );
}

async function apiFetch<T>(path: string, revalidateSeconds = 60): Promise<T | null> {
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

export function getRandomProducts(count: number) {
  return apiFetch<ProductPlusImages[]>(`/products/random/${count}`).then(
    (data) => data ?? []
  );
}

export function getProductById(id: number | string) {
  return apiFetch<ProductDetail>(`/products/${id}/detail`, 30);
}

export function getProductsByCategory(category: string) {
  return apiFetch<Product[]>(`/products/category/${encodeURIComponent(category)}`).then(
    (data) => data ?? []
  );
}

export async function recordProductView(productId: number): Promise<void> {
  const token = getToken();
  if (!token) return;

  await fetch(`${API_URL}/recently-viewed/${productId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getRecentlyViewed(): Promise<ProductDetail[]> {
  const token = getToken();
  if (!token) return [];

  const res = await fetch(`${API_URL}/recently-viewed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}