"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Lock, Play, Table2 } from "lucide-react";
import { AdminHeader, Panel, SkeletonRows } from "@/components/admin/AdminUi";
import { FormMessage } from "@/components/account/FormField";
import { friendlyError } from "@/lib/account";
import { type QueryResult, type TableInfo, browseTable, getTables, runQuery } from "@/lib/admin";

const PAGE_SIZE = 50;

const EXAMPLES = [
  {
    label: "Venituri pe lună",
    sql: `SELECT DATE_FORMAT(o.order_date, '%Y-%m') AS luna, COUNT(DISTINCT o.id) AS comenzi,
       SUM(oi.quantity * oi.price) AS venituri
FROM orders o JOIN order_items oi ON oi.order_id = o.id
WHERE o.status <> 'cancelled'
GROUP BY luna ORDER BY luna DESC`,
  },
  {
    label: "Cei mai buni clienți",
    sql: `SELECT u.email, COUNT(DISTINCT o.id) AS comenzi, SUM(oi.quantity * oi.price) AS total
FROM users u JOIN orders o ON o.user_id = u.id JOIN order_items oi ON oi.order_id = o.id
WHERE o.status <> 'cancelled'
GROUP BY u.id, u.email ORDER BY total DESC LIMIT 10`,
  },
  {
    label: "Produse fără vânzări",
    sql: `SELECT p.id, p.title, p.stock, p.price
FROM products p LEFT JOIN order_items oi ON oi.product_id = p.id
WHERE oi.id IS NULL ORDER BY p.id`,
  },
  { label: "Mesaje de contact", sql: "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 50" },
  { label: "Structura tabelului orders", sql: "DESCRIBE orders" },
];

export default function AdminDatabasePage() {
  const [tables, setTables] = useState<TableInfo[] | null>(null);
  const [tab, setTab] = useState<"browse" | "sql">("browse");
  const [table, setTable] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTables()
      .then((t) => {
        setTables(t);
        setTable((cur) => cur ?? t.find((x) => x.name === "orders")?.name ?? t[0]?.name ?? null);
      })
      .catch((e) => setError(friendlyError(e)));
  }, []);

  return (
    <>
      <AdminHeader title="Bază de date" subtitle="Răsfoiește tabelele sau rulează interogări SQL de citire." />
      {error && <FormMessage kind="error">{error}</FormMessage>}

      <div className="mb-4 flex gap-1 border-b border-mist" role="tablist">
        {[
          { id: "browse" as const, label: "Tabele", icon: Table2 },
          { id: "sql" as const, label: "Consolă SQL", icon: Play },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm transition-colors ${
              tab === id ? "border-crimson font-semibold text-navy" : "border-transparent text-ink-soft hover:text-navy"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "browse" ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <Panel className="h-fit !p-2">
            {!tables && !error && <SkeletonRows rows={6} />}
            <ul className="flex gap-1 overflow-x-auto lg:flex-col">
              {tables?.map((t) => (
                <li key={t.name}>
                  <button
                    type="button"
                    onClick={() => setTable(t.name)}
                    className={`flex w-full shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left font-mono text-[13px] ${
                      table === t.name ? "bg-seal-soft font-semibold text-navy" : "text-ink-soft hover:bg-paper-dim hover:text-navy"
                    }`}
                  >
                    {t.name}
                    <span className="font-sans text-xs text-ink-soft">{t.rows}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
          {table && <TableBrowser key={table} table={table} />}
        </div>
      ) : (
        <SqlConsole />
      )}
    </>
  );
}

function TableBrowser({ table }: { table: string }) {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    browseTable(table, page, PAGE_SIZE)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(friendlyError(e)));
    return () => {
      cancelled = true;
    };
  }, [table, page]);

  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <Panel
      title={table}
      aside={
        data && (
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <span>
              {data.total} rânduri · pagina {page + 1} din {pages}
            </span>
            <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-mist p-1.5 hover:text-navy disabled:opacity-40" aria-label="Pagina anterioară">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-mist p-1.5 hover:text-navy disabled:opacity-40" aria-label="Pagina următoare">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )
      }
    >
      {error && <FormMessage kind="error">{error}</FormMessage>}
      {!data && !error && <SkeletonRows />}
      {data && <ResultGrid result={data} />}
    </Panel>
  );
}

function SqlConsole() {
  const [sql, setSql] = useState(EXAMPLES[0].sql);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      setResult(await runQuery(sql));
    } catch (e) {
      setResult(null);
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }, [sql]);

  return (
    <div className="flex flex-col gap-4">
      <Panel>
        <div className="mb-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => setSql(ex.sql)}
              className="rounded-full border border-mist px-3 py-1 text-xs text-ink-soft hover:border-seal-light hover:text-navy"
            >
              {ex.label}
            </button>
          ))}
        </div>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              run();
            }
          }}
          rows={7}
          spellCheck={false}
          aria-label="Interogare SQL"
          className="w-full resize-y rounded-xl border border-mist bg-navy-deep px-4 py-3 font-mono text-[13px] leading-relaxed text-white placeholder:text-white/40 focus:border-seal focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-xs text-ink-soft">
            <Lock className="h-3.5 w-3.5" /> Doar citire (SELECT, SHOW, DESCRIBE, EXPLAIN) · maxim 500 de rânduri · Ctrl+Enter
          </p>
          <button
            type="button"
            onClick={run}
            disabled={busy || !sql.trim()}
            className="flex items-center gap-2 rounded-lg bg-crimson px-5 py-2.5 text-sm font-semibold text-white hover:bg-crimson-deep disabled:opacity-60"
          >
            <Play className="h-4 w-4" /> {busy ? "Rulează..." : "Rulează"}
          </button>
        </div>
      </Panel>

      {error && <FormMessage kind="error">{error}</FormMessage>}
      {result && (
        <Panel
          title="Rezultat"
          aside={
            <span className="text-xs text-ink-soft">
              {result.rows.length} rânduri{result.truncated ? " (trunchiat la 500)" : ""} · {result.tookMs} ms
            </span>
          }
        >
          <ResultGrid result={result} />
        </Panel>
      )}
    </div>
  );
}

function ResultGrid({ result }: { result: QueryResult }) {
  if (result.rows.length === 0) return <p className="text-sm text-ink-soft">Niciun rând.</p>;
  return (
    <div className="max-h-[560px] overflow-auto rounded-lg border border-mist">
      <table className="w-full text-left font-mono text-xs">
        <thead className="sticky top-0 bg-paper-dim">
          <tr>
            {result.columns.map((c, i) => (
              <th key={`${c}-${i}`} className="whitespace-nowrap border-b border-mist px-3 py-2 font-semibold text-navy">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-mist">
          {result.rows.map((row, r) => (
            <tr key={r} className="hover:bg-seal-soft/40">
              {row.map((v, c) => (
                <td key={c} className={`max-w-[320px] truncate whitespace-nowrap px-3 py-1.5 ${v === null ? "italic text-ink-soft/60" : typeof v === "number" ? "text-right text-ink" : "text-ink"}`} title={v === null ? "NULL" : String(v)}>
                  {v === null ? "NULL" : String(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
