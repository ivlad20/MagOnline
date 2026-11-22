"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Search, X } from "lucide-react";
import { AdminHeader, Panel, SkeletonRows, Thumb } from "@/components/admin/AdminUi";
import { FormMessage, inputClass } from "@/components/account/FormField";
import { friendlyError } from "@/lib/account";
import { type AdminProduct, fmtLei, getAdminOffers, getAdminProducts, setAdminOffers } from "@/lib/admin";

const MAX_OFFERS = 12;

export default function AdminOffersPage() {
  const [saved, setSaved] = useState<AdminProduct[] | null>(null);
  const [draft, setDraft] = useState<AdminProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getAdminOffers()
      .then((o) => {
        setSaved(o);
        setDraft(o);
      })
      .catch((e) => setError(friendlyError(e)));
  }, []);

  const dirty = saved !== null && draft.map((p) => p.id).join() !== saved.map((p) => p.id).join();

  const move = (i: number, delta: number) =>
    setDraft((d) => {
      const next = [...d];
      [next[i], next[i + delta]] = [next[i + delta], next[i]];
      return next;
    });

  const save = async () => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const o = await setAdminOffers(draft.map((p) => p.id));
      setSaved(o);
      setDraft(o);
      setNotice("Ofertele au fost salvate și apar acum pe prima pagină.");
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="Ofertele săptămânii"
        subtitle="Produsele din caruselul de pe prima pagină, în ordinea în care apar. Dacă lista e goală, se afișează produse aleatorii."
        actions={
          <div className="flex gap-2">
            {dirty && (
              <button type="button" onClick={() => setDraft(saved ?? [])} className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-white">
                Renunță
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={!dirty || busy}
              className="rounded-lg bg-crimson px-5 py-2.5 text-sm font-semibold text-white hover:bg-crimson-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Se salvează..." : "Salvează ordinea"}
            </button>
          </div>
        }
      />
      {error && (
        <div className="mb-3">
          <FormMessage kind="error">{error}</FormMessage>
        </div>
      )}
      {notice && !dirty && (
        <div className="mb-3">
          <FormMessage kind="success">{notice}</FormMessage>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Panel title={`În carusel (${draft.length}/${MAX_OFFERS})`} aside={dirty ? <span className="text-xs font-semibold text-amber-600">Modificări nesalvate</span> : null}>
          {!saved && !error && <SkeletonRows />}
          {saved && draft.length === 0 && <p className="text-sm text-ink-soft">Nicio ofertă aleasă. Adaugă produse din lista din dreapta.</p>}
          <ol className="flex flex-col gap-2">
            {draft.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl border border-mist px-3 py-2">
                <span className="w-5 text-center text-sm font-semibold text-ink-soft">{i + 1}</span>
                <Thumb src={p.mainImage} size="h-12 w-12" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{p.title}</p>
                  <p className="text-xs text-ink-soft">
                    {fmtLei(p.price)} · {p.stock === 0 ? <span className="text-crimson">stoc epuizat</span> : `stoc ${p.stock}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center">
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded-lg p-2 text-ink-soft hover:bg-paper-dim hover:text-navy disabled:opacity-30" aria-label={`Mută ${p.title} mai sus`}>
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" disabled={i === draft.length - 1} onClick={() => move(i, 1)} className="rounded-lg p-2 text-ink-soft hover:bg-paper-dim hover:text-navy disabled:opacity-30" aria-label={`Mută ${p.title} mai jos`}>
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setDraft((d) => d.filter((x) => x.id !== p.id))} className="rounded-lg p-2 text-ink-soft hover:bg-crimson-soft hover:text-crimson" aria-label={`Scoate ${p.title} din oferte`}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <ProductPicker
          exclude={new Set(draft.map((p) => p.id))}
          full={draft.length >= MAX_OFFERS}
          onAdd={(p) => setDraft((d) => (d.length >= MAX_OFFERS ? d : [...d, p]))}
        />
      </div>
    </>
  );
}

function ProductPicker({ exclude, full, onAdd }: { exclude: Set<number>; full: boolean; onAdd: (p: AdminProduct) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminProduct[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      getAdminProducts(query)
        .then((r) => !cancelled && setResults(r))
        .catch(() => !cancelled && setResults([]));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  const available = (results ?? []).filter((p) => !exclude.has(p.id));

  return (
    <Panel title="Adaugă produse" className="xl:sticky xl:top-24 xl:self-start">
      <label className="relative mb-3 block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Caută produs" className={`${inputClass} pl-9`} aria-label="Caută produs de adăugat" />
      </label>
      {full && <p className="mb-2 text-xs text-amber-700">Ai atins limita de {MAX_OFFERS} oferte. Scoate un produs ca să adaugi altul.</p>}
      {!results ? (
        <SkeletonRows rows={3} />
      ) : (
        <ul className="flex max-h-[460px] flex-col divide-y divide-mist overflow-y-auto">
          {available.length === 0 && <li className="py-4 text-sm text-ink-soft">Niciun produs.</li>}
          {available.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-2">
              <Thumb src={p.mainImage} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">{p.title}</p>
                <p className="text-xs text-ink-soft">{fmtLei(p.price)}</p>
              </div>
              <button
                type="button"
                disabled={full}
                onClick={() => onAdd(p)}
                className="flex shrink-0 items-center gap-1 rounded-lg border border-mist px-2.5 py-1.5 text-xs font-semibold text-navy hover:border-crimson hover:text-crimson disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" /> Adaugă
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
