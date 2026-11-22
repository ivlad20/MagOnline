"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ImageOff, Package, RotateCcw, ShoppingCart } from "lucide-react";
import AccountShell from "@/components/account/AccountShell";
import { FormMessage } from "@/components/account/FormField";
import StatusBadge from "@/components/account/StatusBadge";
import { type Order, friendlyError, getMyOrders } from "@/lib/account";
import { DELIVERY_LABEL, PAYMENT_LABEL } from "@/lib/shipping";
import { shop } from "@/lib/shopStore";

const fmt = (n: number) => n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const FILTERS = [
  { id: "all", label: "Toate", match: () => true },
  { id: "active", label: "În desfășurare", match: (s: string) => ["pending", "processing", "shipped"].includes(s) },
  { id: "delivered", label: "Livrate", match: (s: string) => s === "delivered" },
  { id: "cancelled", label: "Anulate", match: (s: string) => s === "cancelled" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export default function OrdersPage() {
  return (
    <AccountShell title="Comenzile mele" subtitle="Urmărește statusul comenzilor și comandă din nou produsele preferate.">
      <OrdersList />
    </AccountShell>
  );
}

function OrdersList() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterId>("all");

  useEffect(() => {
    let cancelled = false;
    getMyOrders()
      .then((o) => !cancelled && setOrders(o))
      .catch((err) => !cancelled && setError(friendlyError(err)));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <FormMessage kind="error">{error}</FormMessage>;
  if (!orders) {
    return (
      <div className="flex animate-pulse flex-col gap-4" aria-label="Se încarcă">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-white ring-1 ring-mist" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-mist bg-white px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-seal-soft text-seal">
          <Package className="h-7 w-7" />
        </span>
        <h2 className="mt-4 font-display text-lg font-semibold text-navy">Nu ai nicio comandă încă</h2>
        <p className="mt-1 max-w-sm text-sm text-ink-soft">Când plasezi o comandă, o vei putea urmări de aici.</p>
        <Link href="/" className="mt-6 rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white hover:bg-crimson-deep">
          Descoperă produsele
        </Link>
      </div>
    );
  }

  const active = FILTERS.find((f) => f.id === filter)!;
  const visible = orders.filter((o) => active.match(o.status));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filtrează comenzile">
        {FILTERS.map((f) => {
          const count = orders.filter((o) => f.match(o.status)).length;
          const selected = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                selected ? "border-navy bg-navy font-semibold text-white" : "border-mist bg-white text-ink-soft hover:border-seal-light hover:text-navy"
              }`}
            >
              {f.label} <span className={selected ? "text-white/70" : "text-ink-soft/70"}>({count})</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-mist bg-white px-6 py-10 text-center text-sm text-ink-soft">
          Nu ai comenzi în această categorie.
        </p>
      ) : (
        visible.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
}

const STEPS = ["Înregistrată", "În procesare", "Expediată", "Livrată"];
const STEP_INDEX: Record<string, number> = { pending: 0, processing: 1, shipped: 2, delivered: 3 };

function OrderCard({ order }: { order: Order }) {
  const [added, setAdded] = useState(false);
  const date = new Date(order.orderDate).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
  const step = STEP_INDEX[order.status];

  const reorder = () => {
    order.items.forEach((i) =>
      shop.addToCart({ id: i.productId, title: i.title, price: i.price, mainImage: i.image }, i.quantity),
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-mist bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-mist bg-paper-dim/60 px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <div>
            <p className="text-xs text-ink-soft">Comanda</p>
            <p className="text-sm font-semibold text-navy">#{order.id}</p>
          </div>
          <div>
            <p className="text-xs text-ink-soft">Plasată pe</p>
            <p className="text-sm font-medium text-ink">{date}</p>
          </div>
          <div>
            <p className="text-xs text-ink-soft">Total</p>
            <p className="font-price text-sm font-semibold text-navy">{fmt(order.total)} lei</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </header>

      {step !== undefined && (
        <ol className="grid grid-cols-4 gap-2 px-5 pt-5" aria-label="Progresul comenzii">
          {STEPS.map((label, i) => {
            const done = i <= step;
            return (
              <li key={label} className="flex flex-col gap-2">
                <span className={`h-1.5 rounded-full ${done ? "bg-crimson" : "bg-mist"}`} />
                <span className={`text-[11px] sm:text-xs ${done ? "font-medium text-navy" : "text-ink-soft/70"}`}>{label}</span>
              </li>
            );
          })}
        </ol>
      )}

      <ul className="divide-y divide-mist px-5">
        {order.items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 py-4">
            <Link
              href={`/product/${item.productId}`}
              className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-mist bg-white"
            >
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="h-full w-full object-contain p-1" />
              ) : (
                <ImageOff className="h-5 w-5 text-ink-soft/50" />
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/product/${item.productId}`} className="line-clamp-2 text-sm font-medium text-ink hover:text-crimson">
                {item.title}
              </Link>
              <p className="mt-0.5 text-xs text-ink-soft">
                {item.quantity} × {fmt(item.price)} lei
              </p>
            </div>
            <p className="hidden font-price text-sm font-semibold text-navy sm:block">{fmt(item.price * item.quantity)} lei</p>
          </li>
        ))}
      </ul>

      {(order.shippingAddress || order.deliveryMethod) && (
        <dl className="grid gap-3 border-t border-mist bg-paper-dim/30 px-5 py-4 text-sm sm:grid-cols-3">
          <div className="min-w-0">
            <dt className="text-xs text-ink-soft">Livrare către</dt>
            <dd className="mt-0.5 text-ink">
              {order.shippingName && <span className="font-medium">{order.shippingName}, </span>}
              {order.shippingAddress}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-soft">Metoda de livrare</dt>
            <dd className="mt-0.5 text-ink">
              {DELIVERY_LABEL[order.deliveryMethod ?? ""] ?? "—"}
              <span className="text-ink-soft"> · {order.shippingCost > 0 ? `${fmt(order.shippingCost)} lei` : "gratuită"}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-soft">Plată</dt>
            <dd className="mt-0.5 text-ink">{PAYMENT_LABEL[order.paymentMethod ?? ""] ?? "—"}</dd>
          </div>
        </dl>
      )}

      <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-mist px-5 py-4">
        {order.status === "delivered" && (
          <Link
            href="/livrare#retur"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:text-navy"
          >
            <RotateCcw className="h-4 w-4" /> Retur
          </Link>
        )}
        <button
          type="button"
          onClick={reorder}
          className="flex items-center gap-2 rounded-lg border border-mist px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-crimson hover:text-crimson"
        >
          {added ? <Check className="h-4 w-4 text-emerald-600" /> : <ShoppingCart className="h-4 w-4" />}
          {added ? "Adăugat în coș" : "Comandă din nou"}
        </button>
      </footer>
    </article>
  );
}
