import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Address {
  street: string;
  city: string;
  zipcode: string;
  apartment: string | null;
  floor: string | null;
}

export interface UserProfile {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  phone: string | null;
  address: Address | null;
  admin: boolean;
}

export interface ProfileUpdate {
  name: string;
  surname: string;
  phone: string;
  address: Address | null;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderLine {
  productId: number;
  title: string;
  image: string | null;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  orderDate: string;
  status: OrderStatus | string;
  shippingCost: number;
  /** Items + shipping */
  total: number;
  shippingName: string | null;
  shippingAddress: string | null;
  deliveryMethod: string | null;
  paymentMethod: string | null;
  items: OrderLine[];
}

export interface CheckoutPayload {
  items: { productId: number; quantity: number }[];
  name: string;
  phone: string;
  address: Address;
  deliveryMethod: string;
  paymentMethod: string;
  notes: string;
  saveAddress: boolean;
}

/** Current price/stock/title of a product, straight from the backend (cart prices may be stale). */
export interface LiveProduct {
  id: number;
  title: string;
  price: number;
  stock: number;
  mainImage: string | null;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  orderNumber: string;
  message: string;
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function errorText(res: Response, fallback: string) {
  const text = await res.text().catch(() => "");
  return text || fallback;
}

export async function getMyProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_URL}/users/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await errorText(res, "Nu am putut încărca datele contului."));
  return res.json();
}

export async function updateMyProfile(payload: ProfileUpdate): Promise<UserProfile> {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await errorText(res, "Nu am putut salva modificările."));
  return res.json();
}

export async function getMyOrders(): Promise<Order[]> {
  const res = await fetch(`${API_URL}/orders/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await errorText(res, "Nu am putut încărca comenzile."));
  return res.json();
}

export async function placeOrder(payload: CheckoutPayload): Promise<number> {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await errorText(res, "Comanda nu a putut fi plasată."));
  const data: { orderId: number } = await res.json();
  return data.orderId;
}

/** Fetches current data for each product id; products that no longer exist map to null. */
export async function getLiveProducts(ids: number[]): Promise<Map<number, LiveProduct | null>> {
  const entries = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`${API_URL}/products/${id}/detail`, { cache: "no-store" });
      if (!res.ok) return [id, null] as const;
      const p = await res.json();
      return [id, { id, title: p.title, price: p.price, stock: p.stock, mainImage: p.mainImage }] as const;
    }),
  );
  return new Map(entries);
}

export async function sendContactMessage(payload: ContactPayload): Promise<void> {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await errorText(res, "Mesajul nu a putut fi trimis."));
}

/** Romanian label and badge colors for an order status. */
export const ORDER_STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: "Înregistrată", className: "bg-seal-soft text-seal" },
  processing: { label: "În procesare", className: "bg-seal-soft text-navy" },
  shipped: { label: "În curs de livrare", className: "bg-amber-50 text-amber-700" },
  delivered: { label: "Livrată", className: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Anulată", className: "bg-crimson-soft text-crimson-deep" },
};

/** Turns network failures into a readable message (same wording as the login page). */
export function friendlyError(err: unknown, fallback = "A apărut o eroare."): string {
  if (err instanceof TypeError) {
    return "Nu ne putem conecta la server. Verifică dacă backend-ul rulează și reîncarcă pagina.";
  }
  return err instanceof Error ? err.message : fallback;
}
