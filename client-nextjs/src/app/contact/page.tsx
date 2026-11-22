"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, CircleCheck, Clock, Mail, MapPin, Phone, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Field, FormMessage, inputClass } from "@/components/account/FormField";
import { useAuth } from "@/context/AuthContext";
import { friendlyError, getMyProfile, sendContactMessage } from "@/lib/account";

const CHANNELS = [
  { icon: Phone, title: "Telefon", value: "0700 000 000", href: "tel:+40700000000", note: "Luni – Vineri, 09:00 – 18:00" },
  { icon: Mail, title: "Email", value: "suport@magonline.ro", href: "mailto:suport@magonline.ro", note: "Răspundem în maximum 24 de ore" },
  { icon: MapPin, title: "Sediu", value: "București, România", href: null, note: "Fără showroom; doar comenzi online" },
];

const SUBJECTS = [
  "Status comandă",
  "Retur sau anulare",
  "Garanție și service",
  "Plăți și facturare",
  "Vânzători MagOnline",
  "Altceva",
];

const QUICK_LINKS = [
  { icon: Truck, label: "Unde este comanda mea?", href: "/comenzi" },
  { icon: RotateCcw, label: "Cum returnez un produs?", href: "/livrare#retur" },
  { icon: ShieldCheck, label: "Garanție și service", href: "/livrare#garantie" },
];

const EMPTY = { name: "", email: "", subject: SUBJECTS[0], orderNumber: "", message: "" };
const MAX_MESSAGE = 2000;

export default function ContactPage() {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8 sm:py-14">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-crimson">Contact</p>
          <h1 className="font-display text-3xl font-semibold text-navy sm:text-4xl">Cum te putem ajuta?</h1>
          <p className="mt-3 text-sm text-ink-soft sm:text-base">
            Scrie-ne despre o comandă, un retur sau orice altă întrebare. Echipa de suport îți răspunde de obicei în aceeași zi lucrătoare.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-4">
            {CHANNELS.map(({ icon: Icon, title, value, href, note }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl border border-mist bg-white p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-seal-soft text-seal">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-ink-soft">{title}</p>
                  {href ? (
                    <a href={href} className="text-base font-semibold text-navy hover:text-crimson">
                      {value}
                    </a>
                  ) : (
                    <p className="text-base font-semibold text-navy">{value}</p>
                  )}
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft">
                    <Clock className="h-3 w-3" /> {note}
                  </p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-mist bg-white p-5">
              <p className="mb-3 text-sm font-semibold text-navy">Răspunsuri rapide</p>
              <ul className="flex flex-col">
                {QUICK_LINKS.map(({ icon: Icon, label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-ink transition-colors hover:bg-paper-dim hover:text-navy"
                    >
                      <Icon className="h-4 w-4 text-seal" />
                      <span className="flex-1">{label}</span>
                      <ChevronRight className="h-4 w-4 text-ink-soft/60 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  // Prefill name and email for logged-in users (only fields the user hasn't typed in yet).
  useEffect(() => {
    if (!user) return;
    getMyProfile()
      .then((p) =>
        setForm((f) => ({
          ...f,
          name: f.name || `${p.name} ${p.surname}`.trim(),
          email: f.email || p.email,
        })),
      )
      .catch(() => {});
  }, [user]);

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendContactMessage(form);
      setSent(true);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-mist bg-white p-10 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CircleCheck className="h-7 w-7" />
        </span>
        <h2 className="font-display text-2xl font-semibold text-navy">Mesaj trimis</h2>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          Mulțumim, {form.name.split(" ")[0]}! Îți răspundem la <span className="font-medium text-ink">{form.email}</span> cât de curând.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm((f) => ({ ...EMPTY, name: f.name, email: f.email }));
            setSent(false);
          }}
          className="mt-6 rounded-lg border border-mist px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:border-crimson hover:text-crimson"
        >
          Trimite alt mesaj
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-mist bg-white p-6 shadow-[0_8px_30px_rgba(15,32,66,0.06)] sm:p-8"
    >
      <h2 className="font-display text-xl font-semibold text-navy">Trimite-ne un mesaj</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nume" htmlFor="ct-name">
          <input id="ct-name" required maxLength={100} autoComplete="name" value={form.name} onChange={update("name")} className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="ct-email">
          <input id="ct-email" required type="email" maxLength={150} autoComplete="email" value={form.email} onChange={update("email")} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Subiect" htmlFor="ct-subject">
          <div className="relative">
            <select id="ct-subject" value={form.subject} onChange={update("subject")} className={`${inputClass} appearance-none pr-10`}>
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          </div>
        </Field>
        <Field label="Număr comandă (opțional)" htmlFor="ct-order">
          <input id="ct-order" maxLength={30} placeholder="ex. 1024" value={form.orderNumber} onChange={update("orderNumber")} className={inputClass} />
        </Field>
      </div>

      <Field label="Mesaj" htmlFor="ct-message" hint={`${form.message.length}/${MAX_MESSAGE} caractere`}>
        <textarea
          id="ct-message"
          required
          rows={6}
          maxLength={MAX_MESSAGE}
          placeholder="Descrie pe scurt cum te putem ajuta."
          value={form.message}
          onChange={update("message")}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {error && <FormMessage kind="error">{error}</FormMessage>}

      <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-xs text-ink-soft">
          Folosim datele doar ca să-ți răspundem.{" "}
          <Link href="/despre#confidentialitate" className="font-medium text-navy hover:text-crimson">
            Confidențialitate
          </Link>
        </p>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crimson-deep disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Se trimite..." : "Trimite mesajul"}
        </button>
      </div>
    </form>
  );
}
