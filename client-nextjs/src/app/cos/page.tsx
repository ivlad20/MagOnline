"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff, Minus, Plus, ShoppingCart, Trash2, Truck, ShieldCheck } from "lucide-react";
import { MAX_CART_QTY, shop, useShop } from "@/lib/shopStore";
import { useHydrated } from "@/lib/useHydrated";
import { FREE_SHIPPING_FROM, shippingCost } from "@/lib/shipping";

const fmt = (n: number) =>
  n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CartPage() {
  const { cart } = useShop();
  const hydrated = useHydrated();

  const itemCount = cart.reduce((n, i) => n + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  // Estimate with the default (courier) method; the final choice is made at checkout.
  const shipping = shippingCost("courier", subtotal);
  const total = subtotal + shipping;
  const missingForFree = Math.max(0, FREE_SHIPPING_FROM - subtotal);

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10">
        <h1 className="font-display text-2xl font-semibold text-navy sm:text-3xl">Coșul meu</h1>

        {!hydrated ? (
          <div className="mt-6 h-64 animate-pulse rounded-2xl bg-white" />
        ) : cart.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
            <section aria-label="Produse în coș" className="rounded-2xl border border-mist bg-white">
              <div className="flex items-center justify-between border-b border-mist px-5 py-4">
                <p className="text-sm text-ink-soft">
                  {itemCount} {itemCount === 1 ? "produs" : "produse"}
                </p>
                <button
                  type="button"
                  onClick={() => shop.clearCart()}
                  className="text-sm font-medium text-ink-soft hover:text-crimson"
                >
                  Golește coșul
                </button>
              </div>

              <ul className="divide-y divide-mist">
                {cart.map((item) => (
                  <li key={item.id} className="flex gap-4 p-5">
                    <Link
                      href={`/product/${item.id}`}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-mist bg-white sm:h-28 sm:w-28"
                    >
                      {item.mainImage ? (
                        <Image src={item.mainImage} alt={item.title} fill sizes="112px" className="object-contain p-2" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-seal-light">
                          <ImageOff className="h-6 w-6" />
                        </span>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        {item.brand && (
                          <p className="text-xs font-semibold uppercase tracking-wider text-seal">{item.brand}</p>
                        )}
                        <Link
                          href={`/product/${item.id}`}
                          className="mt-0.5 line-clamp-2 text-sm font-medium text-ink hover:text-crimson"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-1 text-xs text-ink-soft">{fmt(item.price)} lei / buc.</p>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                        <p className="font-price text-lg font-bold text-navy">{fmt(item.price * item.quantity)} lei</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-lg border border-mist">
                            <button
                              type="button"
                              onClick={() => shop.setQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label="Scade cantitatea"
                              className="flex h-9 w-9 items-center justify-center text-ink-soft hover:text-navy disabled:opacity-40"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => shop.setQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= MAX_CART_QTY}
                              aria-label="Crește cantitatea"
                              className="flex h-9 w-9 items-center justify-center text-ink-soft hover:text-navy disabled:opacity-40"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => shop.removeFromCart(item.id)}
                            aria-label={`Elimină ${item.title} din coș`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-crimson-soft hover:text-crimson"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="rounded-2xl border border-mist bg-white p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-lg font-semibold text-navy">Sumar comandă</h2>

              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Subtotal</dt>
                  <dd className="font-medium text-ink">{fmt(subtotal)} lei</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Livrare</dt>
                  <dd className={`font-medium ${shipping === 0 ? "text-signal" : "text-ink"}`}>
                    {shipping === 0 ? "Gratuită" : `${fmt(shipping)} lei`}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-mist pt-3 text-base">
                  <dt className="font-semibold text-navy">Total</dt>
                  <dd className="font-price text-xl font-bold text-navy">{fmt(total)} lei</dd>
                </div>
              </dl>

              {missingForFree > 0 && (
                <div className="mt-4 rounded-lg bg-seal-soft p-3 text-xs text-navy">
                  <p>
                    Mai adaugă produse de <strong>{fmt(missingForFree)} lei</strong> pentru livrare gratuită.
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-seal"
                      style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <Link
                href="/checkout"
                className="mt-5 block w-full rounded-lg bg-crimson px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-crimson-deep"
              >
                Finalizează comanda
              </Link>
              <p className="mt-2 text-center text-xs text-ink-soft">Alegi livrarea și plata la pasul următor.</p>

              <ul className="mt-5 flex flex-col gap-2 border-t border-mist pt-4 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-seal" /> Livrare în 24–48h
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-seal" /> Plată securizată și retur 30 de zile
                </li>
              </ul>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 flex flex-col items-center rounded-2xl border border-mist bg-white px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-seal-soft text-seal">
        <ShoppingCart className="h-8 w-8" />
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold text-navy">Coșul tău este gol</h2>
      <p className="mt-1 max-w-sm text-sm text-ink-soft">
        Descoperă ofertele noastre și adaugă produsele preferate în coș.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white hover:bg-crimson-deep">
          Începe cumpărăturile
        </Link>
        <Link
          href="/favorite"
          className="rounded-lg border border-mist px-6 py-3 text-sm font-semibold text-navy hover:border-seal"
        >
          Vezi favoritele
        </Link>
      </div>
    </div>
  );
}
