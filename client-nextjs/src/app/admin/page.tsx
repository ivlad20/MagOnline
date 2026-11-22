"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Table2 } from "lucide-react";
import { AdminHeader, Panel, SegmentedControl, SkeletonRows, Thumb } from "@/components/admin/AdminUi";
import { FormMessage } from "@/components/account/FormField";
import StatusBadge from "@/components/account/StatusBadge";
import { friendlyError } from "@/lib/account";
import { type SalesStats, fmtLei, getSalesStats } from "@/lib/admin";

const PERIODS = [
  { value: 7, label: "7 zile" },
  { value: 30, label: "30 de zile" },
  { value: 90, label: "90 de zile" },
  { value: 365, label: "12 luni" },
];

export default function AdminSalesPage() {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSalesStats(days)
      .then((s) => {
        if (cancelled) return;
        setStats(s);
        setError(null);
      })
      .catch((e) => !cancelled && setError(friendlyError(e)));
    return () => {
      cancelled = true;
    };
  }, [days]);

  return (
    <>
      <AdminHeader
        title="Vânzări"
        subtitle="Comenzile anulate nu intră în venituri."
        actions={<SegmentedControl label="Perioada" options={PERIODS} value={days} onChange={setDays} />}
      />
      {error && <FormMessage kind="error">{error}</FormMessage>}
      {!stats && !error && <SkeletonRows rows={5} />}
      {stats && <Dashboard stats={stats} />}
    </>
  );
}

function Dashboard({ stats }: { stats: SalesStats }) {
  const tiles = [
    { label: "Venituri", value: fmtLei(stats.revenue), strong: true },
    { label: "Comenzi", value: stats.orders.toString() },
    { label: "Valoare medie", value: fmtLei(stats.averageOrder) },
    { label: "Produse vândute", value: stats.itemsSold.toString() },
    { label: "Clienți", value: stats.customers.toString() },
  ];
  const statusTotal = Object.values(stats.byStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-5">
      {stats.pendingOrders > 0 && (
        <Link
          href="/admin/comenzi?status=pending"
          className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900 hover:border-amber-300"
        >
          <span>
            <strong>{stats.pendingOrders}</strong> {stats.pendingOrders === 1 ? "comandă așteaptă" : "comenzi așteaptă"} să fie procesate.
          </span>
          <span className="font-semibold">Vezi comenzile →</span>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {tiles.map((t) => (
          <div key={t.label} className={`rounded-2xl border p-4 ${t.strong ? "border-navy bg-navy text-white" : "border-mist bg-white"}`}>
            <p className={`text-xs ${t.strong ? "text-white/70" : "text-ink-soft"}`}>{t.label}</p>
            <p className={`mt-1 font-price text-xl font-semibold ${t.strong ? "text-white" : "text-navy"}`}>{t.value}</p>
          </div>
        ))}
      </div>

      <RevenueChart stats={stats} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Panel title="Cele mai vândute produse" className="xl:col-span-2">
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-ink-soft">Nicio vânzare în această perioadă.</p>
          ) : (
            <ol className="flex flex-col divide-y divide-mist">
              {stats.topProducts.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3 py-2.5">
                  <span className="w-5 text-sm font-semibold text-ink-soft">{i + 1}</span>
                  <Thumb src={p.image} />
                  <Link href={`/product/${p.id}`} className="min-w-0 flex-1 truncate text-sm text-ink hover:text-crimson">
                    {p.title}
                  </Link>
                  <span className="hidden text-xs text-ink-soft sm:block">{p.quantity} buc.</span>
                  <span className="w-28 text-right font-price text-sm font-semibold text-navy">{fmtLei(p.revenue)}</span>
                </li>
              ))}
            </ol>
          )}
        </Panel>

        <div className="flex flex-col gap-5">
          <Panel title="Comenzi după status">
            <ul className="flex flex-col gap-2.5">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <li key={status} className="flex items-center gap-3">
                  <span className="w-36 shrink-0">
                    <StatusBadge status={status} />
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-dim">
                    <span className="block h-full rounded-full bg-seal" style={{ width: `${statusTotal ? (count / statusTotal) * 100 : 0}%` }} />
                  </span>
                  <span className="w-6 text-right text-sm font-semibold text-navy">{count}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Stoc redus">
            {stats.lowStock.length === 0 ? (
              <p className="text-sm text-ink-soft">Toate produsele au stoc suficient.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {stats.lowStock.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 text-sm">
                    <AlertTriangle className={`h-4 w-4 shrink-0 ${p.stock === 0 ? "text-crimson" : "text-amber-500"}`} aria-hidden />
                    <Link href={`/admin/produse?q=${p.id}`} className="min-w-0 flex-1 truncate text-ink hover:text-crimson">
                      {p.title}
                    </Link>
                    <span className="shrink-0 text-xs font-semibold text-ink-soft">{p.stock === 0 ? "epuizat" : `${p.stock} buc.`}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

interface Bucket {
  key: string;
  label: string;
  revenue: number;
  orders: number;
}

/** Daily buckets for short periods, weekly for 90 days, monthly for a year. */
function bucketize(stats: SalesStats): Bucket[] {
  const dayLabel = (d: Date) => d.toLocaleDateString("ro-RO", { day: "numeric", month: "short" });
  if (stats.days <= 30) {
    return stats.daily.map((d) => ({ key: d.date, label: dayLabel(new Date(d.date)), revenue: d.revenue, orders: d.orders }));
  }
  const map = new Map<string, Bucket>();
  stats.daily.forEach((d, i) => {
    const date = new Date(d.date);
    let key: string;
    let label: string;
    if (stats.days <= 90) {
      const start = new Date(stats.daily[i - (i % 7)].date);
      key = start.toISOString().slice(0, 10);
      label = `săpt. ${dayLabel(start)}`;
    } else {
      key = d.date.slice(0, 7);
      label = date.toLocaleDateString("ro-RO", { month: "short", year: "numeric" });
    }
    const b = map.get(key) ?? { key, label, revenue: 0, orders: 0 };
    b.revenue += d.revenue;
    b.orders += d.orders;
    map.set(key, b);
  });
  return [...map.values()];
}

/** A "nice" axis maximum (1, 2, 2.5 or 5 × 10ⁿ) so gridline labels are round numbers. */
function niceMax(v: number) {
  if (v <= 0) return 100;
  const p = 10 ** Math.floor(Math.log10(v));
  return ([1, 2, 2.5, 5, 10].find((m) => m * p >= v) ?? 10) * p;
}

const compactLei = (n: number) =>
  n >= 1000 ? `${(n / 1000).toLocaleString("ro-RO", { maximumFractionDigits: 1 })}k` : n.toLocaleString("ro-RO");

function RevenueChart({ stats }: { stats: SalesStats }) {
  const buckets = useMemo(() => bucketize(stats), [stats]);
  const [hover, setHover] = useState<number | null>(null);
  const [asTable, setAsTable] = useState(false);
  const max = niceMax(Math.max(...buckets.map((b) => b.revenue)));
  const unit = stats.days <= 30 ? "zi" : stats.days <= 90 ? "săptămână" : "lună";
  // Fewer x-axis labels on phones, more from the sm breakpoint up.
  const labelEveryWide = Math.ceil(buckets.length / 8);
  const labelEveryNarrow = Math.ceil(buckets.length / 4);
  const active = hover !== null ? buckets[hover] : null;

  return (
    <Panel
      title={`Venituri pe ${unit}`}
      aside={
        <button
          type="button"
          onClick={() => setAsTable((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-soft hover:bg-paper-dim hover:text-navy"
          aria-pressed={asTable}
        >
          <Table2 className="h-3.5 w-3.5" /> {asTable ? "Grafic" : "Tabel"}
        </button>
      }
    >
      {asTable ? (
        <div className="max-h-72 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white text-left text-xs text-ink-soft">
              <tr>
                <th className="py-2 font-medium">Perioadă</th>
                <th className="py-2 text-right font-medium">Comenzi</th>
                <th className="py-2 text-right font-medium">Venituri</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist">
              {buckets.map((b) => (
                <tr key={b.key}>
                  <td className="py-1.5 text-ink">{b.label}</td>
                  <td className="py-1.5 text-right text-ink">{b.orders}</td>
                  <td className="py-1.5 text-right font-medium text-navy">{fmtLei(b.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          {/* Tooltip */}
          <div className="pointer-events-none mb-2 h-10 text-sm">
            {active ? (
              <p>
                <span className="font-semibold text-navy">{active.label}</span>
                <span className="text-ink-soft"> · {active.orders} {active.orders === 1 ? "comandă" : "comenzi"} · </span>
                <span className="font-price font-semibold text-navy">{fmtLei(active.revenue)}</span>
              </p>
            ) : (
              <p className="text-xs text-ink-soft">Treci cu mouse-ul sau atinge o bară pentru detalii.</p>
            )}
          </div>

          <div className="flex gap-2">
            {/* Y axis labels */}
            <div className="relative h-52 w-10 shrink-0 text-right text-[11px] text-ink-soft">
              {[1, 0.5, 0].map((f) => (
                <span key={f} className="absolute right-0 -translate-y-1/2" style={{ top: `${(1 - f) * 100}%` }}>
                  {compactLei(max * f)}
                </span>
              ))}
            </div>

            <div className="relative h-52 min-w-0 flex-1">
              {[0, 0.5, 1].map((f) => (
                <span key={f} className="absolute inset-x-0 border-t border-dashed border-mist" style={{ top: `${f * 100}%` }} />
              ))}
              <div className="absolute inset-0 flex items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
                {buckets.map((b, i) => (
                  <button
                    key={b.key}
                    type="button"
                    aria-label={`${b.label}: ${fmtLei(b.revenue)}, ${b.orders} comenzi`}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    className="group flex h-full min-w-0 flex-1 items-end focus:outline-none"
                  >
                    <span
                      className={`block w-full rounded-t-[4px] transition-colors ${
                        hover === i ? "bg-navy" : "bg-seal group-focus-visible:bg-navy"
                      } ${b.revenue === 0 ? "opacity-0" : ""}`}
                      style={{ height: `${Math.max(b.revenue > 0 ? 1.5 : 0, (b.revenue / max) * 100)}%` }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* X axis labels */}
          <div className="ml-12 mt-2 flex gap-[2px] text-[11px] text-ink-soft">
            {buckets.map((b, i) => (
              <span key={b.key} className="min-w-0 flex-1 overflow-visible whitespace-nowrap">
                {i % labelEveryNarrow === 0 ? (
                  b.label.replace("săpt. ", "")
                ) : i % labelEveryWide === 0 ? (
                  <span className="hidden sm:inline">{b.label.replace("săpt. ", "")}</span>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}
