"use client";

import { useState } from "react";
import StarRating from "./StarRating";

interface Product {
  description: string;
  specifications?: Record<string, string>;
  rating?: number;
  reviewCount?: number;
}

const TABS = [
  { id: "description", label: "Descriere" },
  { id: "specs", label: "Specificații" },
  { id: "reviews", label: "Recenzii" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProductInfoTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<TabId>("description");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
      <div className="mb-6 flex gap-2 border-b border-white/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              active === tab.id ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab.label}
            {active === tab.id && (
              <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-voltaic" />
            )}
          </button>
        ))}
      </div>

      {active === "description" && (
        <p className="whitespace-pre-line text-sm leading-relaxed text-white/80">
          {product.description}
        </p>
      )}

      {active === "specs" &&
        (product.specifications && Object.keys(product.specifications).length > 0 ? (
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 border-b border-white/5 pb-2 text-sm">
                <dt className="text-white/50">{key}</dt>
                <dd className="text-right text-white/90">{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm text-white/50">Specificațiile nu sunt disponibile momentan.</p>
        ))}

      {active === "reviews" &&
        (typeof product.rating === "number" ? (
          <div className="flex flex-col gap-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            <p className="text-sm text-white/50">
              {product.reviewCount
                ? `${product.reviewCount} evaluări din partea clienților.`
                : "Nu există încă evaluări pentru acest produs."}
            </p>
          </div>
        ) : (
          <p className="text-sm text-white/50">Sistemul de recenzii nu este disponibil momentan.</p>
        ))}
    </div>
  );
}