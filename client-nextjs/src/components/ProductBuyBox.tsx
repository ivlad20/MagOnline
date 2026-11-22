"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Truck, RotateCcw } from "lucide-react";
import StockBadge from "@/components/StockBadge";
import { MAX_CART_QTY, shop, useIsFavorite } from "@/lib/shopStore";

interface BuyBoxProduct {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  mainImage: string | null;
}

const priceFormatter = new Intl.NumberFormat("ro-RO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const WARRANTY_OPTIONS = [
  { id: "none", label: "Fără garanție extinsă", price: 0 },
  { id: "12", label: "+12 luni garanție extinsă", price: 49 },
  { id: "24", label: "+24 luni garanție extinsă", price: 89 },
];

const INSTALLMENT_OPTIONS = [3, 6, 12, 24];

function getDeliveryEstimate(): string {
  const fmt = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString("ro-RO", { day: "numeric", month: "long" });
  };
  return `${fmt(1)} – ${fmt(3)}`;
}

export default function ProductBuyBox({ product }: { product: BuyBoxProduct }) {
  const [warrantyId, setWarrantyId] = useState("none");
  const [installments, setInstallments] = useState(12);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFavorite = useIsFavorite(product.id);

  const warranty = WARRANTY_OPTIONS.find((w) => w.id === warrantyId)!;
  const unitPrice = product.price + warranty.price;
  const monthlyRate = unitPrice / installments;
  const deliveryWindow = useMemo(() => getDeliveryEstimate(), []);
  const outOfStock = product.stock <= 0;
  const maxQty = Math.max(1, Math.min(MAX_CART_QTY, product.stock));

  const shopProduct = {
    id: product.id,
    title: product.title,
    price: unitPrice,
    mainImage: product.mainImage,
    brand: product.brand,
    category: product.category,
  };

  const addToCart = () => {
    shop.addToCart(shopProduct, quantity);
    setJustAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setJustAdded(false), 2500);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-mist bg-paper p-5">
        <StockBadge stock={product.stock} />

        <p className="mt-3 flex items-baseline gap-1.5 font-price font-bold text-navy">
          <span className="text-3xl">{priceFormatter.format(unitPrice)}</span>
          <span className="font-body text-base font-medium text-ink-soft">lei</span>
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
          <span>sau</span>
          <select
            value={installments}
            onChange={(e) => setInstallments(Number(e.target.value))}
            aria-label="Număr de rate"
            className="rounded-md border border-mist bg-white px-2 py-1 text-sm text-ink focus:border-crimson focus:outline-none"
          >
            {INSTALLMENT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} rate
              </option>
            ))}
          </select>
          <span>
            de <strong className="text-ink">{priceFormatter.format(monthlyRate)} lei</strong>/lună
          </span>
        </div>

        <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-ink-soft" htmlFor="warranty">
          Garanție extinsă
        </label>
        <select
          id="warranty"
          value={warrantyId}
          onChange={(e) => setWarrantyId(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-mist bg-white px-3 py-2.5 text-sm text-ink focus:border-crimson focus:outline-none"
        >
          {WARRANTY_OPTIONS.map((w) => (
            <option key={w.id} value={w.id}>
              {w.label}
              {w.price > 0 ? ` (+${w.price} lei)` : ""}
            </option>
          ))}
        </select>

        <div className="mt-5 flex gap-3">
          <div className="flex items-center rounded-lg border border-mist bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || outOfStock}
              aria-label="Scade cantitatea"
              className="flex h-12 w-10 items-center justify-center text-ink-soft hover:text-navy disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-navy" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={quantity >= maxQty || outOfStock}
              aria-label="Crește cantitatea"
              className="flex h-12 w-10 items-center justify-center text-ink-soft hover:text-navy disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={outOfStock}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-crimson px-6 text-sm font-semibold text-white transition-colors hover:bg-crimson-deep disabled:cursor-not-allowed disabled:bg-mist disabled:text-ink-soft"
          >
            {justAdded ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
            {outOfStock ? "Stoc epuizat" : justAdded ? "Adăugat în coș" : "Adaugă în coș"}
          </button>

          <button
            type="button"
            onClick={() => shop.toggleFavorite(shopProduct)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Elimină de la favorite" : "Adaugă la favorite"}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border transition-colors ${
              isFavorite
                ? "border-crimson bg-crimson-soft text-crimson"
                : "border-mist bg-white text-ink-soft hover:border-crimson hover:text-crimson"
            }`}
          >
            <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {justAdded && (
          <Link href="/cos" className="mt-3 inline-block text-sm font-semibold text-crimson hover:underline">
            Vezi coșul →
          </Link>
        )}
      </div>

      <ul className="flex flex-col gap-3 text-sm text-ink-soft">
        <li className="flex items-start gap-3">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-seal" />
          <span>
            <strong className="text-ink">Livrare estimată {deliveryWindow}</strong>
            <br />
            Gratuită pentru comenzi de peste 250 lei
          </span>
        </li>
        <li className="flex items-start gap-3">
          <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-seal" />
          <span>Retur gratuit în 30 de zile</span>
        </li>
        <li className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-seal" />
          <span>Garanție 24 de luni · plată securizată cu card, transfer sau ramburs</span>
        </li>
      </ul>
    </div>
  );
}
