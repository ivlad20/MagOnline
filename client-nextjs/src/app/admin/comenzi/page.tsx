"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { AdminHeader, SegmentedControl, SkeletonRows, Thumb } from "@/components/admin/AdminUi";
import { Field, FormMessage, inputClass } from "@/components/account/FormField";
import { ORDER_STATUS, friendlyError } from "@/lib/account";
import { type AdminOrder, fmtLei, getAdminOrders, updateAdminOrder } from "@/lib/admin";
import { DELIVERY_LABEL, PAYMENT_LABEL } from "@/lib/shipping";

const FILTERS = [
  { value: "all", label: "Toate" },
  { value: "pending", label: "Înregistrate" },
  { value: "processing", label: "În procesare" },
  { value: "shipped", label: "În livrare" },
  { value: "delivered", label: "Livrate" },
  { value: "cancelled", label: "Anulate" },
];

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<SkeletonRows />}>
      <AdminOrders />
    </Suspense>
  );
}

function AdminOrders() {
  const params = useSearchParams();
  const [status, setStatus] = useState(params.get("status") ?? "all");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(() => {
    return getAdminOrders(status, debounced)
      .then((o) => {
        setOrders(o);
        setError(null);
      })
      .catch((e) => setError(friendlyError(e)));
  }, [status, debounced]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <AdminHeader title="Comenzi" subtitle="Schimbă statusul sau datele de livrare. Anularea pune produsele înapoi în stoc." />
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <SegmentedControl label="Filtrează după status" options={FILTERS} value={status} onChange={setStatus} />
        <label className="relative block xl:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nr. comandă, email, nume, telefon"
            className={`${inputClass} pl-9`}
            aria-label="Caută comenzi"
          />
        </label>
      </div>

      {error && <FormMessage kind="error">{error}</FormMessage>}
      {!orders && !error && <SkeletonRows />}
      {orders && orders.length === 0 && (
        <p className="rounded-2xl border border-mist bg-white px-6 py-10 text-center text-sm text-ink-soft">Nicio comandă găsită.</p>
      )}
      {orders && orders.length > 0 && (
        <div className="flex flex-col gap-2">
          {orders.map((o) => (
            <OrderRow key={o.id} order={o} onSaved={load} />
          ))}
          {orders.length >= 300 && <p className="text-center text-xs text-ink-soft">Se afișează ultimele 300 de comenzi. Folosește căutarea pentru altele.</p>}
        </div>
      )}
    </>
  );
}

function OrderRow({ order, onSaved }: { order: AdminOrder; onSaved: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [form, setForm] = useState({
    shippingName: order.shippingName ?? "",
    shippingPhone: order.shippingPhone ?? "",
    shippingAddress: order.shippingAddress ?? "",
    notes: order.notes ?? "",
  });
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const date = new Date(order.orderDate).toLocaleString("ro-RO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const save = async (update: Parameters<typeof updateAdminOrder>[1], success: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await updateAdminOrder(order.id, update);
      await onSaved();
      setMessage({ kind: "success", text: success });
    } catch (e) {
      setMessage({ kind: "error", text: friendlyError(e) });
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = (next: string) => {
    if (next === order.status) return;
    if (next === "cancelled" && !window.confirm(`Anulezi comanda #${order.id}? Produsele revin în stoc.`)) return;
    save({ status: next }, `Status schimbat în „${ORDER_STATUS[next]?.label ?? next}”.`);
  };

  return (
    <article className="overflow-hidden rounded-xl border border-mist bg-white">
      <div className="flex items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-2 text-left sm:gap-4"
        >
          <ChevronDown className={`h-4 w-4 shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`} />
          <span className="w-10 shrink-0 text-sm font-semibold text-navy sm:w-12">#{order.id}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm text-ink">{order.shippingName || "—"}</span>
            <span className="block truncate text-xs text-ink-soft">
              {order.customerEmail}
              <span className="hidden xl:inline"> · {date}</span>
            </span>
          </span>
          <span className="hidden shrink-0 text-xs text-ink-soft 2xl:block">{itemCount} {itemCount === 1 ? "produs" : "produse"}</span>
          <span className="hidden shrink-0 text-right font-price text-sm font-semibold text-navy sm:block">{fmtLei(order.total)}</span>
        </button>
        <select
          value={order.status}
          disabled={busy}
          onChange={(e) => changeStatus(e.target.value)}
          aria-label={`Status comanda #${order.id}`}
          className={`w-32 shrink-0 rounded-lg border-0 px-2 py-1.5 text-xs sm:w-[10.5rem] sm:px-2.5 sm:text-sm font-semibold ring-1 ring-inset ring-black/5 focus:outline-none focus:ring-2 focus:ring-seal disabled:opacity-60 ${
            ORDER_STATUS[order.status]?.className ?? "bg-white text-navy"
          }`}
        >
          {Object.entries(ORDER_STATUS).map(([value, { label }]) => (
            <option key={value} value={value} className="bg-white text-ink">
              {label}
            </option>
          ))}
        </select>
      </div>

      {message && !open && (
        <div className="px-4 pb-3">
          <FormMessage kind={message.kind}>{message.text}</FormMessage>
        </div>
      )}

      {open && (
        <div className="grid gap-5 border-t border-mist bg-paper-dim/30 px-4 py-4 lg:grid-cols-2">
          <div className="min-w-0">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">Produse</h3>
            <ul className="flex flex-col divide-y divide-mist rounded-lg border border-mist bg-white px-3">
              {order.items.map((i) => (
                <li key={i.productId} className="flex items-center gap-3 py-2">
                  <Thumb src={i.image} />
                  <Link href={`/product/${i.productId}`} className="min-w-0 flex-1 truncate text-sm text-ink hover:text-crimson">
                    {i.title}
                  </Link>
                  <span className="shrink-0 text-xs text-ink-soft">
                    {i.quantity} × {fmtLei(i.price)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <dt className="text-ink-soft">Livrare</dt>
              <dd className="text-right text-ink">
                {DELIVERY_LABEL[order.deliveryMethod ?? ""] ?? "—"} · {order.shippingCost > 0 ? fmtLei(order.shippingCost) : "gratuită"}
              </dd>
              <dt className="text-ink-soft">Plată</dt>
              <dd className="text-right text-ink">{PAYMENT_LABEL[order.paymentMethod ?? ""] ?? "—"}</dd>
              <dt className="text-ink-soft">Plasată pe</dt>
              <dd className="text-right text-ink">{date}</dd>
              <dt className="font-semibold text-navy">Total</dt>
              <dd className="text-right font-price font-semibold text-navy">{fmtLei(order.total)}</dd>
            </dl>
          </div>

          <form
            className="flex min-w-0 flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              save(form, "Datele de livrare au fost salvate.");
            }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Date de livrare</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nume" htmlFor={`n-${order.id}`}>
                <input id={`n-${order.id}`} required value={form.shippingName} onChange={(e) => setForm({ ...form, shippingName: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Telefon" htmlFor={`p-${order.id}`}>
                <input id={`p-${order.id}`} required value={form.shippingPhone} onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <Field label="Adresă" htmlFor={`a-${order.id}`}>
              <input id={`a-${order.id}`} required value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Observații" htmlFor={`o-${order.id}`}>
              <textarea id={`o-${order.id}`} rows={2} maxLength={500} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${inputClass} resize-y`} />
            </Field>
            {message && <FormMessage kind={message.kind}>{message.text}</FormMessage>}
            <button
              type="submit"
              disabled={busy}
              className="self-end rounded-lg bg-crimson px-5 py-2.5 text-sm font-semibold text-white hover:bg-crimson-deep disabled:opacity-60"
            >
              {busy ? "Se salvează..." : "Salvează"}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
