import { getToken } from "@/lib/auth";
import { NewProductPayload } from "@/types/product";
import { apiFetch } from "./api";
import { USE_MOCK } from "./mock";
import {
  ProductCardInterface,
  ProductPlusImages,
  Product,
} from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function uploadProduct(
  payload: NewProductPayload,
): Promise<number> {
  const token = getToken();
  const formData = new FormData();
  formData.append("brand", payload.brand);
  formData.append("category", payload.category);
  formData.append("subcategory", payload.subcategory);
  formData.append("description", payload.description);
  formData.append("price", String(payload.price));
  formData.append("stock", String(payload.stock));
  formData.append("title", payload.title);
  payload.images.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_URL}/products/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // don't set Content-Type manually — the browser adds the multipart boundary
    body: formData,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Nu am putut adăuga produsul.");
  }

  const data = await res.json();
  return data.productId;
}

export function getRandomProducts(count: number) {
  return apiFetch<ProductCardInterface[]>(`/products/random/${count}`).then(
    (data) => data ?? [],
  );
}

/** "Ofertele săptămânii" chosen in the admin panel; falls back to random products when none are set. */
export async function getWeeklyOffers(count = 8) {
  const offers = await apiFetch<ProductCardInterface[]>("/offers", 30);
  return offers && offers.length > 0 ? offers.slice(0, count) : getRandomProducts(count);
}

export function getProductById(id: number | string) {
  return apiFetch<ProductPlusImages>(`/products/${id}/detail`, 30);
}

export function getProductsByCategory(category: string) {
  return apiFetch<Product[]>(
    `/products/category/${encodeURIComponent(category)}`,
  ).then((data) => data ?? []);
}

export async function recordProductView(productId: number): Promise<void> {
  if (USE_MOCK) return;
  const token = getToken();
  if (!token) return;

  await fetch(`${API_URL}/recently-viewed/${productId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getRecentlyViewed(): Promise<ProductPlusImages[]> {
  if (USE_MOCK) return [];
  const token = getToken();
  if (!token) return [];

  const res = await fetch(`${API_URL}/recently-viewed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}
