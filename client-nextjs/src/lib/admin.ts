import { getToken } from "@/lib/auth";
import type { OrderLine } from "@/lib/account";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SalesStats {
  days: number;
  revenue: number;
  orders: number;
  averageOrder: number;
  itemsSold: number;
  customers: number;
  pendingOrders: number;
  daily: { date: string; revenue: number; orders: number }[];
  byStatus: Record<string, number>;
  topProducts: { id: number; title: string; image: string | null; quantity: number; revenue: number }[];
  lowStock: { id: number; title: string; stock: number }[];
}

export interface AdminOrder {
  id: number;
  orderDate: string;
  status: string;
  userId: number;
  customerEmail: string;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  deliveryMethod: string | null;
  paymentMethod: string | null;
  notes: string | null;
  shippingCost: number;
  total: number;
  items: OrderLine[];
}

export interface OrderUpdate {
  status?: string;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  notes?: string;
}

export interface AdminProduct {
  id: number;
  title: string;
  brand: string | null;
  category: string | null;
  subcategory: string | null;
  description: string | null;
  price: number;
  stock: number;
  sellerId: number;
  sellerEmail: string | null;
  mainImage: string | null;
  sold: number;
  offer: boolean;
}

export type ProductUpdate = Pick<AdminProduct, "title" | "brand" | "category" | "subcategory" | "description" | "price" | "stock">;

export interface TableInfo {
  name: string;
  rows: number;
}

export interface QueryResult {
  columns: string[];
  rows: (string | number | boolean | null)[][];
  total: number;
  truncated: boolean;
  tookMs: number;
}

async function call<T>(path: string, init: RequestInit = {}, fallback = "A apărut o eroare."): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 403) throw new Error("Nu ai drepturi de administrator.");
  if (!res.ok) throw new Error((await res.text().catch(() => "")) || fallback);
  if (res.status === 204) return undefined as T;
  return res.json();
}

const qs = (params: Record<string, string | number | undefined>) => {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v !== undefined && v !== "" && p.set(k, String(v)));
  const s = p.toString();
  return s ? `?${s}` : "";
};

export const getSalesStats = (days: number) => call<SalesStats>(`/admin/stats${qs({ days })}`);

export const getAdminOrders = (status: string, q: string) => call<AdminOrder[]>(`/admin/orders${qs({ status, q })}`);

export const updateAdminOrder = (id: number, update: OrderUpdate) =>
  call<void>(`/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(update) }, "Comanda nu a putut fi salvată.");

export const getAdminProducts = (q: string) => call<AdminProduct[]>(`/admin/products${qs({ q })}`);

export const updateAdminProduct = (id: number, update: ProductUpdate) =>
  call<void>(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(update) }, "Produsul nu a putut fi salvat.");

export const deleteAdminProduct = (id: number) =>
  call<void>(`/admin/products/${id}`, { method: "DELETE" }, "Produsul nu a putut fi șters.");

export const getAdminOffers = () => call<AdminProduct[]>("/admin/offers");

export const setAdminOffers = (productIds: number[]) =>
  call<AdminProduct[]>("/admin/offers", { method: "PUT", body: JSON.stringify({ productIds }) }, "Ofertele nu au putut fi salvate.");

export const getTables = () => call<TableInfo[]>("/admin/db/tables");

export const browseTable = (name: string, page: number, size = 50) =>
  call<QueryResult>(`/admin/db/tables/${encodeURIComponent(name)}${qs({ page, size })}`);

export const runQuery = (sql: string) =>
  call<QueryResult>("/admin/db/query", { method: "POST", body: JSON.stringify({ sql }) }, "Interogarea a eșuat.");

export const fmtLei = (n: number) =>
  `${n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} lei`;
