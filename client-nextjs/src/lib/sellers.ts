import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SellerStatus {
  isSeller: boolean;
  seller: {
    userId: number;
    companyName: string;
    cui: string | null;
    address: string | null;
    phone: string | null;
    iban: string | null;
  } | null;
}

export async function getMySellerStatus(): Promise<SellerStatus> {
  const token = getToken();
  if (!token) return { isSeller: false, seller: null };

  const res = await fetch(`${API_URL}/sellers/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return { isSeller: false, seller: null };
  return res.json();
}

export interface SellerRegistration {
  companyName: string;
  cui: string;
  address: string;
  phone: string;
  iban: string;
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