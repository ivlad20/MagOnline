"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CircleCheck, ImageOff, Lock, ShoppingCart } from "lucide-react";
import { Field, FormMessage, inputClass } from "@/components/account/FormField";
import { useAuth } from "@/context/AuthContext";
import { type LiveProduct, friendlyError, getLiveProducts, getMyProfile, placeOrder } from "@/lib/account";
import {
  DELIVERY_OPTIONS,
  FREE_SHIPPING_FROM,
  PAYMENT_OPTIONS,
  type DeliveryMethod,
  type PaymentMethod,
  shippingCost,
} from "@/lib/shipping";
import { type CartItem, shop, useShop } from "@/lib/shopStore";
import { useHydrated } from "@/lib/useHydrated";

const fmt = (n: number) => n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const PHONE_RE = /^\+?\d{9,14}$/;

export default function CheckoutPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const hydrated = useHydrated();
  const { cart } = useShop();
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !user && placedOrderId === null) router.replace("/login?next=/checkout");
  }, [isLoading, user, router, placedOrderId]);

  if (placedOrderId !== null) return <OrderPlaced orderId={placedOrderId} />;

  if (isLoading || !user || !hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-paper">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mist border-t-crimson" aria-label="Se încarcă" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-paper px-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-seal-soft text-seal">
          <ShoppingCart className="h-7 w-7" />
        </span>
        <h1 className="mt-4 font-display text-xl font-semibold text-navy">Coșul tău este gol</h1>
        <p className="mt-1 text-sm text-ink-soft">Adaugă produse în coș ca să poți finaliza o comandă.</p>
        <Link href="/" className="mt-6 rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white hover:bg-crimson-deep">
          Înapoi la produse
        </Link>
      </div>
    );
  }

  return <CheckoutForm cart={cart} onPlaced={setPlacedOrderId} />;
}

/** A cart line enriched with what the backend says right now. */
interface CheckoutLine {
  item: CartItem;
  live: LiveProduct | null | undefined; // undefined = still loading, null = product gone
  price: number;
  problem: "gone" | "stock" | null;
}

function CheckoutForm({ cart, onPlaced }: { cart: CartItem[]; onPlaced: (id: number) => void }) {
  const [form, setForm] = useState({ name: "", phone: "", street: "", city: "", zipcode: "", apartment: "", floor: "", notes: "" });
  const [delivery, setDelivery] = useState<DeliveryMethod>("courier");
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [saveAddress, setSaveAddress] = useState(true);
  const [hadAddress, setHadAddress] = useState(false);
  const [live, setLive] = useState<Map<number, LiveProduct | null> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ids = useMemo(() => cart.map((i) => Number(i.id)), [cart]);
  const idsKey = ids.join(",");

  // Prefill contact details and address from the profile (only empty fields).
  useEffect(() => {
    getMyProfile()
      .then((p) => {
        setHadAddress(Boolean(p.address));
        setSaveAddress(!p.address);
        setForm((f) => ({
          ...f,
          name: f.name || `${p.name} ${p.surname}`.trim(),
          phone: f.phone || p.phone || "",
          street: f.street || p.address?.street || "",
          city: f.city || p.address?.city || "",
          zipcode: f.zipcode || p.address?.zipcode || "",
          apartment: f.apartment || p.address?.apartment || "",
          floor: f.floor || p.address?.floor || "",
        }));
      })
      .catch(() => {});
  }, []);

  // Re-check prices and stock whenever the set of products changes.
  useEffect(() => {
    let cancelled = false;
    getLiveProducts(idsKey ? idsKey.split(",").map(Number) : [])
      .then((m) => !cancelled && setLive(m))
      .catch((err) => !cancelled && setError(friendlyError(err)));
    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  const lines: CheckoutLine[] = cart.map((item) => {
    const lp = live ? live.get(Number(item.id)) : undefined;
    const problem = lp === null ? "gone" : lp && lp.stock < item.quantity ? "stock" : null;
    return { item, live: lp, price: lp ? lp.price : item.price, problem };
  });

  const subtotal = lines.reduce((s, l) => (l.problem === "gone" ? s : s + l.price * l.item.quantity), 0);
  const shipping = shippingCost(delivery, subtotal);
  const total = subtotal + shipping;
  const hasProblems = lines.some((l) => l.problem);
  const priceChanged = lines.some((l) => l.live && Math.abs(l.live.price - l.item.price) > 0.001);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const phone = form.phone.replace(/[\s.-]/g, "");
    if (!PHONE_RE.test(phone)) return setError("Introdu un număr de telefon valid, de exemplu 0722 123 456.");
    if (hasProblems) return setError("Rezolvă mai întâi problemele marcate la produse.");

    setSubmitting(true);
    try {
      const orderId = await placeOrder({
        items: cart.map((i) => ({ productId: Number(i.id), quantity: i.quantity })),
        name: form.name.trim(),
        phone,
        address: { street: form.street, city: form.city, zipcode: form.zipcode, apartment: form.apartment, floor: form.floor },
        deliveryMethod: delivery,
        paymentMethod: payment,
        notes: form.notes,
        saveAddress,
      });
      shop.clearCart();
      onPlaced(orderId);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(friendlyError(err));
      // Stock may have changed in the meantime: refresh it so the lines show the problem.
      getLiveProducts(ids).then(setLive).catch(() => {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8 sm:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <h1 className="font-display text-2xl font-semibold text-navy sm:text-3xl">Finalizează comanda</h1>
          <Link href="/cos" className="text-sm text-ink-soft hover:text-crimson">
            ← Înapoi la coș
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex min-w-0 flex-col gap-6">
            <Step number={1} title="Date de livrare">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nume și prenume" htmlFor="co-name">
                  <input id="co-name" required maxLength={200} autoComplete="name" value={form.name} onChange={update("name")} className={inputClass} />
                </Field>
                <Field label="Telefon" htmlFor="co-phone" hint="Curierul te sună înainte de livrare.">
                  <input id="co-phone" required type="tel" autoComplete="tel" value={form.phone} onChange={update("phone")} className={inputClass} />
                </Field>
              </div>
              <Field label="Stradă și număr" htmlFor="co-street">
                <input id="co-street" required autoComplete="address-line1" value={form.street} onChange={update("street")} className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Field label="Oraș" htmlFor="co-city" className="col-span-2">
                  <input id="co-city" required autoComplete="address-level2" value={form.city} onChange={update("city")} className={inputClass} />
                </Field>
                <Field label="Cod poștal" htmlFor="co-zip" className="col-span-2">
                  <input id="co-zip" required maxLength={10} autoComplete="postal-code" value={form.zipcode} onChange={update("zipcode")} className={inputClass} />
                </Field>
                <Field label="Apartament" htmlFor="co-apt" className="col-span-1 sm:col-span-2">
                  <input id="co-apt" value={form.apartment} onChange={update("apartment")} className={inputClass} />
                </Field>
                <Field label="Etaj" htmlFor="co-floor" className="col-span-1 sm:col-span-2">
                  <input id="co-floor" maxLength={10} value={form.floor} onChange={update("floor")} className={inputClass} />
                </Field>
              </div>
              <label className="flex items-center gap-2.5 text-sm text-ink-soft">
                <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="h-4 w-4 accent-crimson" />
                {hadAddress ? "Actualizează adresa salvată în cont" : "Salvează adresa în cont pentru comenzile viitoare"}
              </label>
            </Step>

            <Step number={2} title="Metoda de livrare">
              <div className="grid gap-3 sm:grid-cols-2">
                {DELIVERY_OPTIONS.map((o) => (
                  <OptionCard
                    key={o.id}
                    name="delivery"
                    checked={delivery === o.id}
                    onChange={() => setDelivery(o.id)}
                    title={o.label}
                    description={o.description}
                    aside={subtotal >= FREE_SHIPPING_FROM ? "Gratuit" : `${fmt(o.price)} lei`}
                  />
                ))}
              </div>
              {subtotal < FREE_SHIPPING_FROM && (
                <p className="text-xs text-ink-soft">
                  Livrarea devine gratuită de la {FREE_SHIPPING_FROM} lei. Mai ai {fmt(FREE_SHIPPING_FROM - subtotal)} lei.
                </p>
              )}
            </Step>

            <Step number={3} title="Metoda de plată">
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_OPTIONS.map((o) => (
                  <OptionCard
                    key={o.id}
                    name="payment"
                    checked={payment === o.id}
                    onChange={() => setPayment(o.id)}
                    title={o.label}
                    description={o.description}
                  />
                ))}
              </div>
              <p className="flex items-center gap-2 text-xs text-ink-soft">
                <Lock className="h-3.5 w-3.5" /> Plata online cu cardul va fi disponibilă în curând.
              </p>
              <Field label="Observații pentru curier (opțional)" htmlFor="co-notes">
                <textarea id="co-notes" rows={2} maxLength={500} value={form.notes} onChange={update("notes")} className={`${inputClass} resize-y`} placeholder="ex. Interfon 12, sunați înainte" />
              </Field>
            </Step>
          </div>

          <aside className="flex flex-col gap-4 rounded-2xl border border-mist bg-white p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-semibold text-navy">Sumar comandă</h2>

            <ul className="flex max-h-[340px] flex-col divide-y divide-mist overflow-y-auto pr-1">
              {lines.map((l) => (
                <SummaryLine key={l.item.id} line={l} />
              ))}
            </ul>

            {priceChanged && !hasProblems && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Unele prețuri s-au schimbat de când ai pus produsele în coș. Totalul de mai jos folosește prețurile actuale.
              </p>
            )}

            <dl className="flex flex-col gap-2 border-t border-mist pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-medium text-ink">{fmt(subtotal)} lei</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Livrare</dt>
                <dd className="font-medium text-ink">{shipping === 0 ? <span className="text-signal">Gratuită</span> : `${fmt(shipping)} lei`}</dd>
              </div>
              <div className="mt-2 flex items-baseline justify-between border-t border-mist pt-3">
                <dt className="font-semibold text-navy">Total</dt>
                <dd className="font-price text-2xl font-semibold text-navy">{fmt(total)} lei</dd>
              </div>
            </dl>

            {error && <FormMessage kind="error">{error}</FormMessage>}

            <button
              type="submit"
              disabled={submitting || live === null || hasProblems}
              className="w-full rounded-lg bg-crimson px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-crimson-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Se plasează comanda..." : live === null ? "Se verifică stocul..." : "Plasează comanda"}
            </button>
            <p className="text-center text-xs text-ink-soft">
              Plasând comanda, ești de acord cu{" "}
              <Link href="/termeni" className="font-medium text-navy hover:text-crimson">
                termenii și condițiile
              </Link>
              .
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-mist bg-white p-6">
      <h2 className="flex items-center gap-3 font-display text-lg font-semibold text-navy">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">{number}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function OptionCard({
  name,
  checked,
  onChange,
  title,
  description,
  aside,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
  aside?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
        checked ? "border-crimson bg-crimson-soft/40 ring-1 ring-crimson" : "border-mist hover:border-seal-light"
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 accent-crimson" />
      <span className="flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-navy">{title}</span>
          {aside && <span className="shrink-0 text-sm font-semibold text-navy">{aside}</span>}
        </span>
        <span className="mt-0.5 block text-xs text-ink-soft">{description}</span>
      </span>
    </label>
  );
}

function SummaryLine({ line }: { line: CheckoutLine }) {
  const { item, live, price, problem } = line;
  return (
    <li className="flex gap-3 py-3">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-mist bg-white">
        {item.mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.mainImage} alt="" className="h-full w-full object-contain p-1" />
        ) : (
          <ImageOff className="h-4 w-4 text-ink-soft/50" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`line-clamp-2 text-sm ${problem === "gone" ? "text-ink-soft line-through" : "text-ink"}`}>{item.title}</p>
        <p className="mt-0.5 text-xs text-ink-soft">
          {item.quantity} × {fmt(price)} lei
        </p>
        {problem === "gone" && (
          <ProblemNote text="Produsul nu mai este disponibil." action="Elimină" onAction={() => shop.removeFromCart(item.id)} />
        )}
        {problem === "stock" && live && (
          live.stock === 0 ? (
            <ProblemNote text="Nu mai este în stoc." action="Elimină" onAction={() => shop.removeFromCart(item.id)} />
          ) : (
            <ProblemNote
              text={`Mai sunt doar ${live.stock} bucăți.`}
              action={`Comandă ${live.stock}`}
              onAction={() => shop.setQuantity(item.id, live.stock)}
            />
          )
        )}
      </div>
      {problem !== "gone" && <p className="shrink-0 text-sm font-semibold text-navy">{fmt(price * item.quantity)}</p>}
    </li>
  );
}

function ProblemNote({ text, action, onAction }: { text: string; action: string; onAction: () => void }) {
  return (
    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-crimson-deep">
      <AlertTriangle className="h-3.5 w-3.5" /> {text}
      <button type="button" onClick={onAction} className="font-semibold underline underline-offset-2 hover:text-crimson">
        {action}
      </button>
    </p>
  );
}

function OrderPlaced({ orderId }: { orderId: number }) {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-white px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-mist bg-white p-8 text-center shadow-[0_8px_30px_rgba(15,32,66,0.08)] sm:p-10">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CircleCheck className="h-7 w-7" />
        </span>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-crimson">Comanda #{orderId}</p>
        <h1 className="mb-2 font-display text-2xl font-semibold text-navy">Mulțumim pentru comandă!</h1>
        <p className="mb-6 text-sm text-ink-soft">
          Am înregistrat comanda și te anunțăm când pleacă spre tine. O poți urmări oricând din contul tău.
        </p>
        <Link
          href="/comenzi"
          className="block rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crimson-deep"
        >
          Vezi comenzile mele
        </Link>
        <Link href="/" className="mt-4 inline-block text-sm text-ink-soft hover:text-crimson">
          Continuă cumpărăturile
        </Link>
      </div>
    </div>
  );
}
