import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface NewProductPayload {
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  stock: number;
  title: string;
  images: File[];
}

export async function uploadProduct(payload: NewProductPayload): Promise<number> {
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
    headers: { Authorization: `Bearer ${token}` }, // nu seta Content-Type manual — browserul pune boundary-ul corect
    body: formData,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Nu am putut adăuga produsul.");
  }

  const data = await res.json();
  return data.productId;
}