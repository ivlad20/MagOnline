"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, CircleCheck, ImagePlus, Star, X } from "lucide-react";
import { Field, FormMessage, inputClass } from "@/components/account/FormField";
import { useAuth } from "@/context/AuthContext";
import { friendlyError } from "@/lib/account";
import { CATEGORIES } from "@/lib/categories";
import { uploadProduct } from "@/lib/products";

const MAX_IMAGES = 8;
const MAX_IMAGE_MB = 5;
const MAX_DESCRIPTION = 3000;

/** Same card as the login and "Devino vânzător" pages, just wider. */
const cardClass =
  "w-full max-w-2xl rounded-2xl border border-mist bg-white p-6 text-ink shadow-[0_8px_30px_rgba(15,32,66,0.08)] sm:p-10";

export default function SellProductPage() {
  const { user, isSeller, isLoading } = useAuth();
  const router = useRouter();

  // Guests log in first; logged-in non-sellers register on /devino-vanzator.
  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/login?next=/sell_product");
    else if (!isSeller) router.replace("/devino-vanzator");
  }, [isLoading, user, isSeller, router]);

  return (
    <div className="flex min-h-[calc(100vh-200px)] justify-center bg-white px-4 py-12 sm:py-16">
      {isLoading || !user || !isSeller ? (
        <div className="mt-24 h-8 w-8 animate-spin rounded-full border-2 border-mist border-t-crimson" aria-label="Se încarcă" />
      ) : (
        <AddProductForm />
      )}
    </div>
  );
}

interface PickedImage {
  file: File;
  url: string;
}

const EMPTY_FORM = { title: "", brand: "", category: "", subcategory: "", description: "", price: "", stock: "1" };

function AddProductForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState<PickedImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Revoke preview URLs when the form unmounts.
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(() => () => imagesRef.current.forEach((i) => URL.revokeObjectURL(i.url)), []);

  const category = CATEGORIES.find((c) => c.value === form.category);

  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const addFiles = (files: FileList | File[]) => {
    setError(null);
    const list = Array.from(files);
    const valid = list.filter((f) => f.type.startsWith("image/") && f.size <= MAX_IMAGE_MB * 1024 * 1024);
    if (valid.length < list.length) {
      setError(`Am ignorat fișierele care nu sunt imagini sau depășesc ${MAX_IMAGE_MB} MB.`);
    }
    setImages((prev) => {
      const room = MAX_IMAGES - prev.length;
      if (valid.length > room) setError(`Poți adăuga cel mult ${MAX_IMAGES} imagini.`);
      return [...prev, ...valid.slice(0, Math.max(0, room)).map((file) => ({ file, url: URL.createObjectURL(file) }))];
    });
  };

  const removeImage = (index: number) =>
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });

  const makeMain = (index: number) =>
    setImages((prev) => [prev[index], ...prev.filter((_, i) => i !== index)]);

  const reset = () => {
    images.forEach((i) => URL.revokeObjectURL(i.url));
    setImages([]);
    setForm(EMPTY_FORM);
    setCreatedId(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const price = parseFloat(form.price.replace(",", "."));
    const stock = parseInt(form.stock, 10);
    if (!(price > 0)) return setError("Introdu un preț mai mare decât 0.");
    if (!(stock >= 0)) return setError("Stocul nu poate fi negativ.");
    if (images.length === 0) return setError("Adaugă cel puțin o imagine. Prima va fi imaginea principală.");

    setLoading(true);
    try {
      const id = await uploadProduct({
        title: form.title.trim(),
        brand: form.brand.trim(),
        category: form.category,
        subcategory: form.subcategory,
        description: form.description.trim(),
        price: Math.round(price * 100) / 100,
        stock,
        images: images.map((i) => i.file),
      });
      setCreatedId(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  if (createdId !== null) {
    return (
      <div className={`${cardClass} mt-8 h-fit max-w-md text-center`}>
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CircleCheck className="h-7 w-7" />
        </span>
        <h1 className="mb-2 font-display text-2xl font-semibold text-navy">Produs publicat</h1>
        <p className="mb-6 text-sm text-ink-soft">„{form.title}” este acum vizibil pentru cumpărători.</p>
        <Link
          href={`/product/${createdId}`}
          className="block rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-crimson-deep"
        >
          Vezi pagina produsului
        </Link>
        <button type="button" onClick={reset} className="mt-4 text-sm text-ink-soft hover:text-crimson">
          Adaugă alt produs
        </button>
      </div>
    );
  }

  return (
    <div className={`${cardClass} h-fit`}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-crimson">Vânzători</p>
      <h1 className="mb-2 font-display text-2xl font-semibold text-navy">Adaugă un produs</h1>
      <p className="mb-8 text-sm text-ink-soft">Completează detaliile și adaugă câteva fotografii clare. Produsul apare imediat pe site.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-navy">Detalii</h2>
          <Field label="Titlu" htmlFor="pr-title">
            <input id="pr-title" required maxLength={255} placeholder="ex. Laptop ASUS Vivobook 15, 16GB RAM, 512GB SSD" value={form.title} onChange={update("title")} className={inputClass} />
          </Field>
          <Field label="Brand" htmlFor="pr-brand">
            <input id="pr-brand" required maxLength={100} placeholder="ex. ASUS" value={form.brand} onChange={update("brand")} className={inputClass} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Categorie" htmlFor="pr-category">
              <Select
                id="pr-category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value, subcategory: "" }))}
              >
                <option value="" disabled>Alege categoria</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Subcategorie" htmlFor="pr-subcategory">
              <Select id="pr-subcategory" value={form.subcategory} onChange={update("subcategory")} disabled={!category}>
                <option value="" disabled>{category ? "Alege subcategoria" : "Alege întâi categoria"}</option>
                {category?.subcategories.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Descriere" htmlFor="pr-description" hint={`${form.description.length}/${MAX_DESCRIPTION} caractere`}>
            <textarea
              id="pr-description"
              required
              rows={6}
              maxLength={MAX_DESCRIPTION}
              placeholder="Caracteristici, starea produsului, ce conține pachetul..."
              value={form.description}
              onChange={update("description")}
              className={`${inputClass} resize-y`}
            />
          </Field>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-navy">Preț și stoc</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Preț" htmlFor="pr-price">
              <div className="relative">
                <input id="pr-price" required inputMode="decimal" placeholder="0,00" value={form.price} onChange={update("price")} className={`${inputClass} pr-12`} />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-soft">lei</span>
              </div>
            </Field>
            <Field label="Bucăți în stoc" htmlFor="pr-stock">
              <input id="pr-stock" required type="number" min={0} step={1} value={form.stock} onChange={update("stock")} className={inputClass} />
            </Field>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-navy">Fotografii</h2>
            <span className="text-xs text-ink-soft">{images.length}/{MAX_IMAGES}</span>
          </div>

          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
                dragOver ? "border-crimson bg-crimson-soft/40" : "border-mist hover:border-seal-light hover:bg-paper"
              }`}
            >
              <ImagePlus className="h-7 w-7 text-seal" />
              <span className="text-sm font-medium text-navy">Trage imaginile aici sau alege-le din calculator</span>
              <span className="text-xs text-ink-soft">JPG, PNG sau WEBP, maximum {MAX_IMAGE_MB} MB fiecare</span>
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />

          {images.length > 0 && (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((img, i) => (
                <li key={img.url} className="group relative aspect-square overflow-hidden rounded-xl border border-mist bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={`Imaginea ${i + 1}`} className="h-full w-full object-contain p-1" />
                  {i === 0 ? (
                    <span className="absolute bottom-1.5 left-1.5 rounded-md bg-navy px-2 py-0.5 text-[10px] font-semibold text-white">
                      Principală
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makeMain(i)}
                      title="Setează ca imagine principală"
                      aria-label={`Setează imaginea ${i + 1} ca principală`}
                      className="absolute bottom-1.5 left-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-ink-soft shadow-sm transition-colors hover:text-crimson"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label={`Elimină imaginea ${i + 1}`}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-ink-soft shadow-sm transition-colors hover:text-crimson"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {error && <FormMessage kind="error">{error}</FormMessage>}

        <div className="flex flex-col-reverse items-center gap-3 border-t border-mist pt-6 sm:flex-row sm:justify-between">
          <Link href="/cont" className="text-sm text-ink-soft hover:text-crimson">
            Renunță
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-crimson px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-crimson-deep disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Se publică..." : "Publică produsul"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select required {...props} className={`${inputClass} appearance-none pr-10`}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
    </div>
  );
}
