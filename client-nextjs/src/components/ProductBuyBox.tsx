"use client";

import { useEffect, useMemo, useState } from "react";
import StockBadge from "@/components/StockBadge";

interface Product {
  price: number;
  stock: number;
}

const priceFormatter = new Intl.NumberFormat("ro-RO", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const WARRANTY_OPTIONS = [
  { id: "none", label: "Fără garanție extinsă", price: 0 },
  { id: "12", label: "+12 luni garanție extinsă", price: 49 },
  { id: "24", label: "+24 luni garanție extinsă", price: 89 },
];

const INSTALLMENT_OPTIONS = [3, 6, 12, 24];

function getApproxLocationLabel(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const city = tz.split("/").pop()?.replace(/_/g, " ") ?? "";
    const region = navigator.language.split("-")[1];
    const country = region
      ? new Intl.DisplayNames(["ro"], { type: "region" }).of(region)
      : undefined;
    return [city, country].filter(Boolean).join(", ") || "România";
  } catch {
    return "România";
  }
}

function getDeliveryEstimate(): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() + 1);
  const end = new Date(now);
  end.setDate(end.getDate() + 3);
  const fmt = (d: Date) =>
    d.toLocaleDateString("ro-RO", { day: "numeric", month: "long" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function ProductBuyBox({ product }: { product: Product }) {
  const [warrantyId, setWarrantyId] = useState("none");
  const [installments, setInstallments] = useState(12);
  const [isFavorite, setIsFavorite] = useState(false);
  const [location, setLocation] = useState("România");

  useEffect(() => {
    setLocation(getApproxLocationLabel());
  }, []);

  const warranty = WARRANTY_OPTIONS.find((w) => w.id === warrantyId)!;
  const totalPrice = product.price + warranty.price;
  const monthlyRate = useMemo(
    () => totalPrice / installments,
    [totalPrice, installments],
  );
  const deliveryWindow = useMemo(() => getDeliveryEstimate(), []);

  return (
    <div className="flex flex-col gap-4">
      <StockBadge stock={product.stock} />

      <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5">
        <div className="flex items-baseline gap-1.5 font-price font-bold text-white">
          <span className="text-2xl">{priceFormatter.format(totalPrice)}</span>
          <span className="text-sm font-body font-normal text-white/70">
            Lei
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
          <span>sau</span>
          <div className="relative">
            <select
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              className="appearance-none rounded-md border border-white/15 bg-white/10 py-1 pl-2 pr-6 text-sm text-white focus:border-voltaic focus:outline-none"
            >
              {INSTALLMENT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} rate
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 10 6"
              className="pointer-events-none absolute right-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 fill-none stroke-white/70"
              strokeWidth={1.5}
            >
              <path
                d="M1 1L5 5L9 1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>de {monthlyRate.toFixed(2)} lei/lună</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          disabled
          title="Coșul urmează într-un pas viitor"
          className="flex cursor-not-allowed items-center gap-2 rounded-full border border-ember/40 bg-ember/10 px-6 py-3 text-sm font-semibold text-ember opacity-50 transition-colors"
        >
          Adaugă în coș
        </button>

        <button
          type="button"
          onClick={() => setIsFavorite((f) => !f)}
          aria-pressed={isFavorite}
          className={`flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${
            isFavorite
              ? "border-ember bg-ember/10 text-ember"
              : "border-white/15 bg-white/5 text-white/80 hover:border-white/30"
          }`}
        >
          <svg
            viewBox="0 0 20 18"
            className="h-4 w-4"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              d="M10 17S1 11.5 1 5.8C1 2.6 3.4 1 5.9 1c1.6 0 3.1.9 4.1 2.4C11 1.9 12.5 1 14.1 1 16.6 1 19 2.6 19 5.8 19 11.5 10 17 10 17z"
              strokeLinejoin="round"
            />
          </svg>
          {isFavorite ? "La favorite" : "Adaugă la favorite"}
        </button>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
        <label className="text-xs font-medium text-white/60">
          Garanție extinsă
        </label>
        <select
          value={warrantyId}
          onChange={(e) => setWarrantyId(e.target.value)}
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white focus:border-voltaic focus:outline-none"
        >
          {WARRANTY_OPTIONS.map((w) => (
            <option key={w.id} value={w.id}>
              {w.label}
              {w.price > 0 ? ` — ${w.price} lei` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 border-t border-white/10 pt-4 text-sm text-white/70">
        <p className="font-medium text-white">Livrare estimată în {location}</p>
        <p>
          {deliveryWindow} (estimare bazată pe fusul orar al dispozitivului tău)
        </p>
      </div>
    </div>
  );
}
