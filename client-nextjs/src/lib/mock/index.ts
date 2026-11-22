/**
 * Date mock locale, folosite cât backend-ul nu rulează.
 * Activare: NEXT_PUBLIC_USE_MOCK=true în .env.local.
 *
 * Produsele cu id < 100 sunt cele reale din baza de date (pozele lor sunt salvate
 * în public/mock/products). Cele cu id >= 100 sunt inventate, ca să nu fie goale
 * categoriile Laptopuri / Telefoane / Tablete / Console.
 */
import type { ProductPlusImages } from "@/types/product";
import data from "./products.json";

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const PRODUCTS = data as ProductPlusImages[];

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function byCategory(category: string) {
  const c = normalize(category);
  return PRODUCTS.filter((p) => normalize(p.category) === c);
}

/** Răspunde ca backend-ul la un GET; întoarce `null` pentru rute necunoscute/negăsite. */
export function mockGet<T>(path: string): T | null {
  const url = new URL(path, "http://mock");
  const parts = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);

  if (parts[0] !== "products") return null;

  // /products/random/{n}
  if (parts[1] === "random") {
    return shuffle(PRODUCTS.filter((p) => p.mainImage)).slice(0, Number(parts[2]) || 12) as T;
  }

  // /products/search?q=
  if (parts[1] === "search") {
    const terms = normalize(url.searchParams.get("q") ?? "").split(/\s+/).filter(Boolean);
    if (!terms.length) return [] as T;
    return PRODUCTS.filter((p) => {
      const hay = normalize(`${p.title} ${p.brand} ${p.category} ${p.subcategory}`);
      return terms.every((t) => hay.includes(t));
    }) as T;
  }

  // /products/category/{c}[/listing|/subcategories]
  if (parts[1] === "category" && parts[2]) {
    const list = byCategory(parts[2]);
    if (parts[3] === "subcategories") {
      return [...new Set(list.map((p) => p.subcategory).filter(Boolean))].sort() as T;
    }
    const sub = url.searchParams.get("subcategory");
    return (sub ? list.filter((p) => normalize(p.subcategory) === normalize(sub)) : list) as T;
  }

  // /products/{id}[/detail]
  if (parts[1] && /^\d+$/.test(parts[1])) {
    return (PRODUCTS.find((p) => p.id === Number(parts[1])) ?? null) as T | null;
  }

  return null;
}
