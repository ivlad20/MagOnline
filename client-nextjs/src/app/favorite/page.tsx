"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, ImageOff, ShoppingCart, X } from "lucide-react";
import { shop, useShop, type ShopProduct } from "@/lib/shopStore";
import { useHydrated } from "@/lib/useHydrated";

const fmt = (n: number) =>
  n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function FavoritesPage() {
  const { favorites } = useShop();
  const hydrated = useHydrated();

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-navy sm:text-3xl">Favorite</h1>
            {hydrated && favorites.length > 0 && (
              <p className="mt-1 text-sm text-ink-soft">
                {favorites.length} {favorites.length === 1 ? "produs salvat" : "produse salvate"}
              </p>
            )}
          </div>
          {hydrated && favorites.length > 1 && (
            <button
              type="button"
              onClick={() => favorites.forEach((p) => shop.addToCart(p))}
              className="flex items-center gap-2 rounded-lg border border-mist bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:border-crimson hover:text-crimson"
            >
              <ShoppingCart className="h-4 w-4" /> Adaugă toate în coș
            </button>
          )}
        </div>

        {!hydrated ? (
          <div className="mt-6 h-64 animate-pulse rounded-2xl bg-white" />
        ) : favorites.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-mist bg-white px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-crimson-soft text-crimson">
              <Heart className="h-8 w-8" />
            </span>
            <h2 className="mt-4 font-display text-xl font-semibold text-navy">Nu ai produse favorite</h2>
            <p className="mt-1 max-w-sm text-sm text-ink-soft">
              Apasă pe inimioara de pe orice produs ca să-l salvezi aici pentru mai târziu.
            </p>
            <Link
              href="/"
              className="mt-6 rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white hover:bg-crimson-deep"
            >
              Descoperă produse
            </Link>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((p) => (
              <FavoriteCard key={p.id} product={p} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FavoriteCard({ product }: { product: ShopProduct }) {
  const [added, setAdded] = useState(false);

  return (
    <li className="group relative flex flex-col overflow-hidden rounded-2xl border border-mist bg-white transition-shadow hover:shadow-lg">
      <button
        type="button"
        onClick={() => shop.removeFavorite(product.id)}
        aria-label={`Elimină ${product.title} de la favorite`}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-soft shadow-sm ring-1 ring-black/5 hover:text-crimson"
      >
        <X className="h-4 w-4" />
      </button>

      <Link href={`/product/${product.id}`} className="relative block aspect-square bg-white">
        {product.mainImage ? (
          <Image
            src={product.mainImage}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-seal-light">
            <ImageOff className="h-8 w-8" />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 border-t border-mist p-4">
        {product.brand && (
          <span className="text-xs font-semibold uppercase tracking-wider text-seal">{product.brand}</span>
        )}
        <Link href={`/product/${product.id}`} className="line-clamp-2 text-sm font-medium text-ink hover:text-crimson">
          {product.title}
        </Link>
        <p className="mt-auto pt-2 font-price text-lg font-bold text-navy">{fmt(product.price)} lei</p>
        <button
          type="button"
          onClick={() => {
            shop.addToCart(product);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-crimson px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-crimson-deep"
        >
          {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          {added ? "Adăugat" : "Adaugă în coș"}
        </button>
      </div>
    </li>
  );
}
