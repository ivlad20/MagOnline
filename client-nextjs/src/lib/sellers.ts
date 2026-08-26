import { getToken } from "@/lib/auth";
import { SellerRegistration, SellerStatus } from "@/types/sellers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMySellerStatus(): Promise<SellerStatus> {
  const token = getToken();
  if (!token) return { isSeller: false, seller: null };

  const res = await fetch(`${API_URL}/sellers/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return { isSeller: false, seller: null };
  return res.json();
}

export async function registerAsSeller(payload: SellerRegistration): Promise<void> {
  const token = getToken();
  const res = await fetch(`${API_URL}/sellers/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Nu am putut crea contul de seller.");
  }
}