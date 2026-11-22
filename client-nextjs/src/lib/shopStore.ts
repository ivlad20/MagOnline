"use client";

/**
 * Client-side cart & favorites, persisted in localStorage and shared across
 * components through useSyncExternalStore (no provider needed).
 * When the backend gets cart/favorites endpoints, sync can be added here.
 */
import { useSyncExternalStore } from "react";

export interface ShopProduct {
  id: number | string;
  title: string;
  price: number;
  mainImage: string | null;
  brand?: string;
  category?: string;
}

export interface CartItem extends ShopProduct {
  quantity: number;
}

interface ShopState {
  cart: CartItem[];
  favorites: ShopProduct[];
}

const STORAGE_KEY = "magonline_shop";
const MAX_QTY = 10;
const EMPTY: ShopState = { cart: [], favorites: [] };

let state: ShopState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ShopState>;
      state = { cart: parsed.cart ?? [], favorites: parsed.favorites ?? [] };
    }
  } catch {
    state = EMPTY;
  }
}

function setState(next: ShopState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode, quota); keep the in-memory state.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  // Keep tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

const getServerSnapshot = () => EMPTY;

const pick = (p: ShopProduct): ShopProduct => ({
  id: p.id,
  title: p.title,
  price: p.price,
  mainImage: p.mainImage,
  brand: p.brand,
  category: p.category,
});

export const shop = {
  addToCart(product: ShopProduct, quantity = 1) {
    const existing = state.cart.find((i) => i.id === product.id);
    const cart = existing
      ? state.cart.map((i) =>
          i.id === product.id ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) } : i,
        )
      : [...state.cart, { ...pick(product), quantity: Math.min(MAX_QTY, quantity) }];
    setState({ ...state, cart });
  },
  setQuantity(id: ShopProduct["id"], quantity: number) {
    const q = Math.max(1, Math.min(MAX_QTY, quantity));
    setState({ ...state, cart: state.cart.map((i) => (i.id === id ? { ...i, quantity: q } : i)) });
  },
  removeFromCart(id: ShopProduct["id"]) {
    setState({ ...state, cart: state.cart.filter((i) => i.id !== id) });
  },
  clearCart() {
    setState({ ...state, cart: [] });
  },
  toggleFavorite(product: ShopProduct) {
    const isFav = state.favorites.some((f) => f.id === product.id);
    const favorites = isFav
      ? state.favorites.filter((f) => f.id !== product.id)
      : [pick(product), ...state.favorites];
    setState({ ...state, favorites });
  },
  removeFavorite(id: ShopProduct["id"]) {
    setState({ ...state, favorites: state.favorites.filter((f) => f.id !== id) });
  },
};

export const MAX_CART_QTY = MAX_QTY;

export function useShop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCartCount() {
  return useShop().cart.reduce((n, i) => n + i.quantity, 0);
}

export function useIsFavorite(id: ShopProduct["id"]) {
  return useShop().favorites.some((f) => f.id === id);
}
