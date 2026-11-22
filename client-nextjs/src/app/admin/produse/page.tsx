"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { ExternalLink, Pencil, Search, Sparkles, Trash2, X } from "lucide-react";
import { AdminHeader, SkeletonRows, Thumb } from "@/components/admin/AdminUi";
import { Field, FormMessage, inputClass } from "@/components/account/FormField";
import { friendlyError } from "@/lib/account";
import { type AdminProduct, deleteAdminProduct, fmtLei, getAdminProducts, updateAdminProduct } from "@/lib/admin";
import { CATEGORIES } from "@/lib/categories";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<SkeletonRows />}>
      <AdminProducts />
    </Suspense>
  );
}

function AdminProducts() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [debounced, setDebounced] = useState(query);
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminProduct | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(
    () =>
      getAdminProducts(debounced)
        .then((p) => {
          setProducts(p);
          setError(null);
        })
        .catch((e) => setError(friendlyError(e))),
    [debounced],
  );

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (p: AdminProduct) => {
    if (!window.confirm(`Ștergi definitiv „${p.title}”? Acțiunea nu poate fi anulată.`)) return;
    setNotice(null);
    try {
      await deleteAdminProduct(p.id);
      setNotice(`„${p.title}” a fost șters.`);
      load();
    } catch (e) {
      setError(friendlyError(e));
    }
  };

  return (
    <>
      <AdminHeader
        title="Produse"
        subtitle="Toate listările din magazin, de la toți vânzătorii."
        actions={
          <label className="relative block w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Titlu, brand, categorie sau ID"
              className={`${inputClass} pl-9`}
              aria-label="Caută produse"
            />
          </label>
        }
      />

      {error && (
        <div className="mb-3">
          <FormMessage kind="error">{error}</FormMessage>
        </div>
      )}
      {notice && (
        <div className="mb-3">
          <FormMessage kind="success">{notice}</FormMessage>
        </div>
      )}
      {!products && !error && <SkeletonRows rows={6} />}
      {products && products.length === 0 && (
        <p className="rounded-2xl border border-mist bg-white px-6 py-10 text-center text-sm text-ink-soft">Niciun produs găsit.</p>
      )}

      {products && products.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-mist bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-mist bg-paper-dim/50 text-left text-xs text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Produs</th>
                <th className="px-3 py-3 font-medium">Categorie</th>
                <th className="px-3 py-3 text-right font-medium">Preț</th>
                <th className="px-3 py-3 text-right font-medium">Stoc</th>
                <th className="px-3 py-3 text-right font-medium">Vândute</th>
                <th className="relative px-4 py-3 text-right font-medium">
                  <span className="sr-only">Acțiuni</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-paper-dim/40">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <Thumb src={p.mainImage} />
                      <div className="min-w-0 max-w-[340px]">
                        <p className="truncate text-ink" title={p.title}>
                          {p.title}
                        </p>
                        <p className="flex items-center gap-2 text-xs text-ink-soft">
                          #{p.id} · {p.brand || "fără brand"}
                          {p.offer && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-crimson-soft px-2 py-0.5 text-[11px] font-semibold text-crimson-deep">
                              <Sparkles className="h-3 w-3" /> Ofertă
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-ink-soft">
                    <span className="block text-ink">{p.category || "—"}</span>
                    {p.subcategory}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right font-price font-semibold text-navy">{fmtLei(p.price)}</td>
                  <td className={`px-3 py-2.5 text-right font-semibold ${p.stock === 0 ? "text-crimson" : p.stock <= 3 ? "text-amber-600" : "text-ink"}`}>
                    {p.stock}
                  </td>
                  <td className="px-3 py-2.5 text-right text-ink">{p.sold}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-1">
                      <Link href={`/product/${p.id}`} className="rounded-lg p-2 text-ink-soft hover:bg-paper-dim hover:text-navy" aria-label="Vezi în magazin" title="Vezi în magazin">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button type="button" onClick={() => setEditing(p)} className="rounded-lg p-2 text-ink-soft hover:bg-paper-dim hover:text-navy" aria-label={`Editează ${p.title}`} title="Editează">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => remove(p)} className="rounded-lg p-2 text-ink-soft hover:bg-crimson-soft hover:text-crimson" aria-label={`Șterge ${p.title}`} title="Șterge">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditProductDialog
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setNotice(`„${editing.title}” a fost actualizat.`);
            setEditing(null);
            load();
          }}
        />
      )}
    </>
  );
}

function EditProductDialog({ product, onClose, onSaved }: { product: AdminProduct; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: product.title,
    brand: product.brand ?? "",
    category: product.category ?? "",
    subcategory: product.subcategory ?? "",
    description: product.description ?? "",
    price: String(product.price),
    stock: String(product.stock),
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subcategories = CATEGORIES.find((c) => c.value === form.category)?.subcategories ?? [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price.replace(",", "."));
    const stock = Number(form.stock);
    if (!Number.isFinite(price) || price <= 0) return setError("Prețul trebuie să fie un număr pozitiv.");
    if (!Number.isInteger(stock) || stock < 0) return setError("Stocul trebuie să fie un număr întreg, minim 0.");
    setBusy(true);
    setError(null);
    try {
      await updateAdminProduct(product.id, { ...form, price, stock });
      onSaved();
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-navy-deep/50 p-0 sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-mist px-6 py-4">
          <h2 id="edit-title" className="font-display text-lg font-semibold text-navy">
            Editează produsul #{product.id}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-ink-soft hover:bg-paper-dim" aria-label="Închide">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5">
          <Field label="Titlu" htmlFor="ep-title">
            <input id="ep-title" required maxLength={255} value={form.title} onChange={set("title")} className={inputClass} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Brand" htmlFor="ep-brand">
              <input id="ep-brand" maxLength={100} value={form.brand} onChange={set("brand")} className={inputClass} />
            </Field>
            <Field label="Categorie" htmlFor="ep-cat">
              <input id="ep-cat" list="ep-cat-list" maxLength={100} value={form.category} onChange={set("category")} className={inputClass} />
              <datalist id="ep-cat-list">
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value} />
                ))}
              </datalist>
            </Field>
            <Field label="Subcategorie" htmlFor="ep-sub">
              <input id="ep-sub" list="ep-sub-list" maxLength={100} value={form.subcategory} onChange={set("subcategory")} className={inputClass} />
              <datalist id="ep-sub-list">
                {subcategories.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Preț (lei)" htmlFor="ep-price">
              <input id="ep-price" required inputMode="decimal" value={form.price} onChange={set("price")} className={inputClass} />
            </Field>
            <Field label="Stoc" htmlFor="ep-stock" hint={product.sold > 0 ? `${product.sold} vândute până acum` : undefined}>
              <input id="ep-stock" required type="number" min={0} step={1} value={form.stock} onChange={set("stock")} className={inputClass} />
            </Field>
          </div>
          <Field label="Descriere" htmlFor="ep-desc">
            <textarea id="ep-desc" rows={6} value={form.description} onChange={set("description")} className={`${inputClass} resize-y`} />
          </Field>
          <p className="text-xs text-ink-soft">Vânzător: {product.sellerEmail ?? `#${product.sellerId}`}</p>
          {error && <FormMessage kind="error">{error}</FormMessage>}
        </div>

        <div className="flex justify-end gap-2 border-t border-mist px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper-dim">
            Renunță
          </button>
          <button type="submit" disabled={busy} className="rounded-lg bg-crimson px-5 py-2.5 text-sm font-semibold text-white hover:bg-crimson-deep disabled:opacity-60">
            {busy ? "Se salvează..." : "Salvează modificările"}
          </button>
        </div>
      </form>
    </div>
  );
}
