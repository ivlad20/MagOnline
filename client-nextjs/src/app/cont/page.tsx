"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Heart, MapPin, Package, Pencil, ShoppingCart, Store, UserRound } from "lucide-react";
import AccountShell from "@/components/account/AccountShell";
import { Field, FormMessage, inputClass } from "@/components/account/FormField";
import StatusBadge from "@/components/account/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import {
  type Address,
  type Order,
  type UserProfile,
  friendlyError,
  getMyOrders,
  getMyProfile,
  updateMyProfile,
} from "@/lib/account";
import { useCartCount, useShop } from "@/lib/shopStore";
import { useHydrated } from "@/lib/useHydrated";

const fmt = (n: number) => n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AccountPage() {
  return (
    <AccountShell title="Contul meu" subtitle="Datele tale, adresa de livrare și o privire rapidă asupra activității.">
      <AccountOverview />
    </AccountShell>
  );
}

function AccountOverview() {
  const { isSeller } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMyProfile(), getMyOrders()])
      .then(([p, o]) => {
        if (cancelled) return;
        setProfile(p);
        setOrders(o);
      })
      .catch((err) => !cancelled && setLoadError(friendlyError(err)));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loadError) return <FormMessage kind="error">{loadError}</FormMessage>;
  if (!profile) return <OverviewSkeleton />;

  const lastOrder = orders?.[0];

  return (
    <div className="flex flex-col gap-6">
      <StatsRow ordersCount={orders?.length ?? 0} />

      <div className="grid gap-6 xl:grid-cols-2">
        <PersonalDetails profile={profile} onSaved={setProfile} />
        <DeliveryAddress profile={profile} onSaved={setProfile} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-mist bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-navy">Ultima comandă</h2>
            <Link href="/comenzi" className="flex items-center gap-1 text-sm font-medium text-crimson hover:text-crimson-deep">
              Toate comenzile <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {lastOrder ? (
            <Link href="/comenzi" className="block rounded-xl border border-mist p-4 transition-colors hover:border-seal-light">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-navy">Comanda #{lastOrder.id}</p>
                <StatusBadge status={lastOrder.status} />
              </div>
              <p className="mt-1 text-xs text-ink-soft">
                {new Date(lastOrder.orderDate).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })}
                {" · "}
                {lastOrder.items.reduce((n, i) => n + i.quantity, 0)} produse
              </p>
              <p className="mt-3 line-clamp-1 text-sm text-ink">{lastOrder.items.map((i) => i.title).join(", ")}</p>
              <p className="mt-2 font-price text-base font-semibold text-navy">{fmt(lastOrder.total)} lei</p>
            </Link>
          ) : (
            <p className="text-sm text-ink-soft">Nu ai plasat încă nicio comandă.</p>
          )}
        </section>

        <section className="rounded-2xl border border-mist bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-navy">Vânzător pe MagOnline</h2>
          {isSeller ? (
            <>
              <p className="text-sm text-ink-soft">Contul tău de vânzător este activ. Poți publica produse noi oricând.</p>
              <Link
                href="/sell_product"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
              >
                <Store className="h-4 w-4" /> Adaugă un produs
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-ink-soft">
                Ai o firmă și vrei să-ți vinzi produsele aici? Înregistrarea durează două minute.
              </p>
              <Link
                href="/devino-vanzator"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-crimson px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-crimson-deep"
              >
                <Store className="h-4 w-4" /> Devino vânzător
              </Link>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function StatsRow({ ordersCount }: { ordersCount: number }) {
  const { favorites } = useShop();
  const cartCount = useCartCount();
  const hydrated = useHydrated();

  const stats = [
    { href: "/comenzi", label: "Comenzi", value: ordersCount, icon: Package },
    { href: "/favorite", label: "Favorite", value: hydrated ? favorites.length : 0, icon: Heart },
    { href: "/cos", label: "Produse în coș", value: hydrated ? cartCount : 0, icon: ShoppingCart },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map(({ href, label, value, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="group flex flex-col items-start gap-3 rounded-2xl border border-mist bg-white p-4 transition-colors hover:border-seal-light sm:flex-row sm:items-center sm:gap-4 sm:p-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-seal-soft text-seal transition-colors group-hover:bg-crimson-soft group-hover:text-crimson sm:h-11 sm:w-11">
            <Icon className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-2xl font-semibold text-navy">{value}</span>
            <span className="text-xs text-ink-soft">{label}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function CardHeader({
  icon: Icon,
  title,
  editing,
  onEdit,
}: {
  icon: typeof UserRound;
  title: string;
  editing: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
        <Icon className="h-5 w-5 text-seal" /> {title}
      </h2>
      {!editing && (
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-crimson transition-colors hover:bg-crimson-soft"
        >
          <Pencil className="h-3.5 w-3.5" /> Editează
        </button>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-mist py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-xs text-ink-soft">{label}</dt>
      <dd className="text-sm font-medium text-ink">{value || <span className="text-ink-soft/70">Necompletat</span>}</dd>
    </div>
  );
}

function FormActions({ saving, onCancel }: { saving: boolean; onCancel: () => void }) {
  return (
    <div className="flex gap-3 pt-1">
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-crimson px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-crimson-deep disabled:opacity-50"
      >
        {saving ? "Se salvează..." : "Salvează"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-mist px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-seal-light hover:text-navy"
      >
        Renunță
      </button>
    </div>
  );
}

function PersonalDetails({ profile, onSaved }: { profile: UserProfile; onSaved: (p: UserProfile) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: profile.name, surname: profile.surname, phone: profile.phone ?? "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  const startEdit = () => {
    setForm({ name: profile.name, surname: profile.surname, phone: profile.phone ?? "" });
    setMessage(null);
    setEditing(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const saved = await updateMyProfile({ ...form, address: profile.address });
      onSaved(saved);
      setEditing(false);
      setMessage({ kind: "success", text: "Datele au fost actualizate." });
    } catch (err) {
      setMessage({ kind: "error", text: friendlyError(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-mist bg-white p-6">
      <CardHeader icon={UserRound} title="Date personale" editing={editing} onEdit={startEdit} />

      {editing ? (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prenume" htmlFor="pf-name">
              <input id="pf-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Nume" htmlFor="pf-surname">
              <input id="pf-surname" required value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} className={inputClass} />
            </Field>
          </div>
          <Field label="Telefon" htmlFor="pf-phone">
            <input id="pf-phone" type="tel" maxLength={15} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Email" htmlFor="pf-email" hint="Emailul și numele de utilizator nu pot fi schimbate.">
            <input id="pf-email" disabled value={profile.email} className={inputClass} />
          </Field>
          {message && <FormMessage kind={message.kind}>{message.text}</FormMessage>}
          <FormActions saving={saving} onCancel={() => setEditing(false)} />
        </form>
      ) : (
        <>
          <dl>
            <InfoRow label="Nume complet" value={`${profile.name} ${profile.surname}`} />
            <InfoRow label="Nume utilizator" value={profile.username} />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Telefon" value={profile.phone} />
          </dl>
          {message && <div className="mt-4"><FormMessage kind={message.kind}>{message.text}</FormMessage></div>}
        </>
      )}
    </section>
  );
}

const EMPTY_ADDRESS: Address = { street: "", city: "", zipcode: "", apartment: "", floor: "" };

function DeliveryAddress({ profile, onSaved }: { profile: UserProfile; onSaved: (p: UserProfile) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Address>(EMPTY_ADDRESS);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const a = profile.address;

  const startEdit = () => {
    setForm({
      street: a?.street ?? "",
      city: a?.city ?? "",
      zipcode: a?.zipcode ?? "",
      apartment: a?.apartment ?? "",
      floor: a?.floor ?? "",
    });
    setMessage(null);
    setEditing(true);
  };

  const save = async (address: Address | null, successText: string) => {
    setSaving(true);
    setMessage(null);
    try {
      const saved = await updateMyProfile({
        name: profile.name,
        surname: profile.surname,
        phone: profile.phone ?? "",
        address,
      });
      onSaved(saved);
      setEditing(false);
      setMessage({ kind: "success", text: successText });
    } catch (err) {
      setMessage({ kind: "error", text: friendlyError(err) });
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <section className="rounded-2xl border border-mist bg-white p-6">
      <CardHeader icon={MapPin} title="Adresa de livrare" editing={editing} onEdit={startEdit} />

      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save(form, "Adresa a fost salvată.");
          }}
          className="flex flex-col gap-4"
        >
          <Field label="Stradă și număr" htmlFor="ad-street">
            <input id="ad-street" required value={form.street} onChange={set("street")} className={inputClass} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Oraș" htmlFor="ad-city">
              <input id="ad-city" required value={form.city} onChange={set("city")} className={inputClass} />
            </Field>
            <Field label="Cod poștal" htmlFor="ad-zip">
              <input id="ad-zip" required maxLength={10} value={form.zipcode} onChange={set("zipcode")} className={inputClass} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Apartament (opțional)" htmlFor="ad-apt">
              <input id="ad-apt" value={form.apartment ?? ""} onChange={set("apartment")} className={inputClass} />
            </Field>
            <Field label="Etaj (opțional)" htmlFor="ad-floor">
              <input id="ad-floor" maxLength={10} value={form.floor ?? ""} onChange={set("floor")} className={inputClass} />
            </Field>
          </div>
          {message && <FormMessage kind={message.kind}>{message.text}</FormMessage>}
          <FormActions saving={saving} onCancel={() => setEditing(false)} />
        </form>
      ) : a ? (
        <>
          <address className="not-italic">
            <p className="text-sm font-medium text-ink">{a.street}</p>
            <p className="mt-1 text-sm text-ink-soft">
              {[a.apartment && `Ap. ${a.apartment}`, a.floor && `Etaj ${a.floor}`].filter(Boolean).join(", ")}
            </p>
            <p className="text-sm text-ink-soft">
              {a.city}, {a.zipcode}
            </p>
          </address>
          <button
            type="button"
            disabled={saving}
            onClick={() => save(null, "Adresa a fost ștearsă.")}
            className="mt-5 text-sm text-ink-soft underline-offset-2 hover:text-crimson hover:underline disabled:opacity-50"
          >
            Șterge adresa
          </button>
          {message && <div className="mt-4"><FormMessage kind={message.kind}>{message.text}</FormMessage></div>}
        </>
      ) : (
        <>
          <p className="text-sm text-ink-soft">Nu ai salvat nicio adresă. Adaug-o acum ca să comanzi mai repede.</p>
          <button
            type="button"
            onClick={startEdit}
            className="mt-4 rounded-lg border border-mist px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:border-crimson hover:text-crimson"
          >
            Adaugă adresă
          </button>
          {message && <div className="mt-4"><FormMessage kind={message.kind}>{message.text}</FormMessage></div>}
        </>
      )}
    </section>
  );
}

function OverviewSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-label="Se încarcă">
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[86px] rounded-2xl bg-white ring-1 ring-mist" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-72 rounded-2xl bg-white ring-1 ring-mist" />
        <div className="h-72 rounded-2xl bg-white ring-1 ring-mist" />
      </div>
    </div>
  );
}
