"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, CircleCheck, Store, Truck, Wallet } from "lucide-react";
import { FormMessage, inputClass } from "@/components/account/FormField";
import { useAuth } from "@/context/AuthContext";
import { friendlyError } from "@/lib/account";
import { registerAsSeller } from "@/lib/sellers";

const BENEFITS = [
  { icon: Store, text: "Produsele tale, în fața a mii de cumpărători" },
  { icon: Wallet, text: "Fără taxă de înscriere" },
  { icon: Truck, text: "Tu alegi cum livrezi" },
];

/** Same card as the login page. */
const cardClass =
  "w-full max-w-md rounded-2xl border border-mist bg-white p-8 text-ink shadow-[0_8px_30px_rgba(15,32,66,0.08)] sm:p-10";

export default function BecomeSellerPage() {
  const { user, isSeller, isLoading } = useAuth();
  // Kept here: registering flips isSeller, which would otherwise swap in the "already a seller" card.
  const [justRegistered, setJustRegistered] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-white px-4 py-16">
      {isLoading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mist border-t-crimson" aria-label="Se încarcă" />
      ) : !user ? (
        <GuestCard />
      ) : justRegistered || isSeller ? (
        <AlreadySellerCard justRegistered={justRegistered} />
      ) : (
        <SellerForm onRegistered={() => setJustRegistered(true)} />
      )}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-crimson">{children}</p>;
}

function Benefits() {
  return (
    <ul className="mb-6 flex flex-col gap-2.5 rounded-xl bg-seal-soft/60 p-4">
      {BENEFITS.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-3 text-sm text-navy">
          <Icon className="h-4 w-4 shrink-0 text-seal" />
          {text}
        </li>
      ))}
    </ul>
  );
}

function GuestCard() {
  return (
    <div className={cardClass}>
      <Eyebrow>Vânzători</Eyebrow>
      <h1 className="mb-2 font-display text-2xl font-semibold text-navy">Vinde pe MagOnline</h1>
      <p className="mb-6 text-sm text-ink-soft">Ai nevoie de un cont MagOnline ca să te înregistrezi ca vânzător.</p>
      <Benefits />
      <Link
        href="/login?next=/devino-vanzator"
        className="block rounded-lg bg-crimson px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-crimson-deep"
      >
        Intră în cont
      </Link>
      <p className="mt-6 text-center text-sm text-ink-soft">
        Nu ai cont?{" "}
        <Link href="/login?next=/devino-vanzator" className="font-medium text-navy hover:text-crimson">
          Creează unul gratuit
        </Link>
      </p>
    </div>
  );
}

function AlreadySellerCard({ justRegistered = false }: { justRegistered?: boolean }) {
  return (
    <div className={`${cardClass} text-center`}>
      <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        {justRegistered ? <CircleCheck className="h-7 w-7" /> : <BadgeCheck className="h-7 w-7" />}
      </span>
      <h1 className="mb-2 font-display text-2xl font-semibold text-navy">
        {justRegistered ? "Bun venit printre vânzători!" : "Ești deja vânzător"}
      </h1>
      <p className="mb-6 text-sm text-ink-soft">
        {justRegistered
          ? "Contul tău de vânzător a fost creat. Poți publica primul produs chiar acum."
          : "Contul tău de vânzător este activ. Continuă să adaugi produse."}
      </p>
      <Link
        href="/sell_product"
        className="block rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crimson-deep"
      >
        Adaugă un produs
      </Link>
      <Link href="/cont" className="mt-4 inline-block text-sm text-ink-soft hover:text-crimson">
        Înapoi la contul meu
      </Link>
    </div>
  );
}

// Light client-side checks; the backend stays the source of truth.
const CUI_RE = /^(RO)?\d{2,10}$/i;
const IBAN_RE = /^RO\d{2}[A-Z]{4}[A-Z0-9]{16}$/i;
const PHONE_RE = /^\+?\d{9,14}$/;

function SellerForm({ onRegistered }: { onRegistered: () => void }) {
  const { refreshSellerStatus } = useAuth();
  const [form, setForm] = useState({ companyName: "", cui: "", address: "", phone: "", iban: "" });
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      companyName: form.companyName.trim(),
      cui: form.cui.replace(/\s/g, "").toUpperCase(),
      address: form.address.trim(),
      phone: form.phone.replace(/[\s.-]/g, ""),
      iban: form.iban.replace(/\s/g, "").toUpperCase(),
    };
    if (!CUI_RE.test(payload.cui)) return setError("CUI-ul trebuie să conțină între 2 și 10 cifre, opțional cu prefixul RO.");
    if (!PHONE_RE.test(payload.phone)) return setError("Introdu un număr de telefon valid.");
    if (!IBAN_RE.test(payload.iban)) {
      return setError(
        "IBAN invalid. Formatul românesc este RO + 2 cifre + codul băncii (4 litere) + 16 caractere, de ex. RO49 AAAA 1B31 0075 9384 0000.",
      );
    }

    setLoading(true);
    try {
      await registerAsSeller(payload);
      onRegistered();
      await refreshSellerStatus();
    } catch (err) {
      setError(friendlyError(err));
      setLoading(false);
    }
  };

  return (
    <div className={cardClass}>
      <Eyebrow>Vânzători</Eyebrow>
      <h1 className="mb-2 font-display text-2xl font-semibold text-navy">Devino vânzător</h1>
      <p className="mb-6 text-sm text-ink-soft">Completează datele firmei și poți începe să vinzi imediat.</p>
      <Benefits />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required placeholder="Denumirea firmei" autoComplete="organization" value={form.companyName} onChange={update("companyName")} className={inputClass} />
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="CUI" value={form.cui} onChange={update("cui")} className={inputClass} />
          <input required type="tel" placeholder="Telefon" autoComplete="tel" value={form.phone} onChange={update("phone")} className={inputClass} />
        </div>
        <input required placeholder="Sediul social" autoComplete="street-address" value={form.address} onChange={update("address")} className={inputClass} />
        <input required placeholder="IBAN (ex. RO49 AAAA 1B31 0075 9384 0000)" value={form.iban} onChange={update("iban")} className={`${inputClass} uppercase placeholder:normal-case`} />

        <label className="mt-1 flex items-start gap-2.5 text-xs text-ink-soft">
          <input
            type="checkbox"
            required
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-crimson"
          />
          <span>
            Am citit și accept{" "}
            <Link href="/despre#termeni" className="font-medium text-navy underline-offset-2 hover:text-crimson hover:underline">
              termenii pentru vânzători
            </Link>
            .
          </span>
        </label>

        {error && <FormMessage kind="error">{error}</FormMessage>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crimson-deep disabled:opacity-50"
        >
          {loading ? "Se procesează..." : "Creează contul de vânzător"}
        </button>
      </form>

      <Link href="/cont" className="mt-6 block text-center text-sm text-ink-soft hover:text-crimson">
        Poate mai târziu
      </Link>
    </div>
  );
}
