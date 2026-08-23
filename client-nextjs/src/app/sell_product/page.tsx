"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { registerAsSeller } from "@/lib/sellers";
import { uploadProduct } from "@/lib/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MoltenMetalBG from "@/components/MoltenMetalBG";

export default function SellerPage() {
  const { user, isSeller, isLoading, refreshSellerStatus } = useAuth();
  const router = useRouter();

  if (isLoading) return null;
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#111111]">
      <MoltenMetalBG
        color1="#2749ff"
        color2="#dfc7de"
        color3="#FFFFFF"
        speed={0.35}
        scale={5}
        detail={3}
        glow={2}
        coreSize={0.2}
        blackPoint={0}
        grainIntensity={0}
        brightness={1.2}
        mouseInteraction
        className="fixed inset-0 h-screen w-screen"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-4 py-16">
          {isSeller ? <AddProductForm /> : <BecomeSellerForm onSuccess={refreshSellerStatus} />}
        </main>

        <Footer />
      </div>
    </div>
  );
}

function BecomeSellerForm({ onSuccess }: { onSuccess: () => Promise<void> }) {
  const [form, setForm] = useState({ companyName: "", cui: "", address: "", phone: "", iban: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerAsSeller(form);
      await onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "A apărut o eroare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-white">Devino seller</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required placeholder="Nume firmă" value={form.companyName} onChange={update("companyName")} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-voltaic focus:outline-none" />
        <input required placeholder="CUI" value={form.cui} onChange={update("cui")} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-voltaic focus:outline-none" />
        <input required placeholder="Adresă" value={form.address} onChange={update("address")} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-voltaic focus:outline-none" />
        <input required placeholder="Telefon" value={form.phone} onChange={update("phone")} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-voltaic focus:outline-none" />
        <input required placeholder="IBAN" value={form.iban} onChange={update("iban")} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-voltaic focus:outline-none" />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={loading} className="mt-2 rounded-full bg-voltaic px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-voltaic/90 disabled:opacity-50">
          {loading ? "Se procesează..." : "Trimite"}
        </button>
      </form>
    </div>
  );
}

/** Number input with custom white chevron steppers, no background, native spinners hidden. */
function NumberField({
  placeholder,
  value,
  onChange,
  step,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
}) {
  const bump = (delta: number) => {
    const current = parseFloat(value || "0");
    const stepNum = step ? parseFloat(step) : 1;
    const next = (isNaN(current) ? 0 : current) + delta * stepNum;
    const rounded = step ? Math.round(next * 100) / 100 : next;
    onChange(String(Math.max(0, rounded)));
  };

  return (
    <div className="relative">
      <input
        required
        type="number"
        step={step}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 pr-8 text-sm text-white placeholder:text-white/50 focus:border-voltaic focus:outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <div className="absolute inset-y-0 right-2.5 flex flex-col justify-center gap-1">
        <button
          type="button"
          onClick={() => bump(1)}
          aria-label="Crește"
          className="flex h-3 w-4 items-center justify-center bg-transparent text-white/70 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 10 6" className="h-2.5 w-2.5 fill-none stroke-current" strokeWidth={1.5}>
            <path d="M1 5L5 1L9 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => bump(-1)}
          aria-label="Scade"
          className="flex h-3 w-4 items-center justify-center bg-transparent text-white/70 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 10 6" className="h-2.5 w-2.5 fill-none stroke-current" strokeWidth={1.5}>
            <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function AddProductForm() {
  const [form, setForm] = useState({
    brand: "", category: "", subcategory: "", description: "", price: "", stock: "", title: "",
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [otherImages, setOtherImages] = useState<File[]>([]);
  const [otherImagePreviews, setOtherImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setMainImage(file);
    setMainImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setOtherImages(files);
    setOtherImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return files.map((f) => URL.createObjectURL(f));
    });
  };

  const resetImages = () => {
    if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
    otherImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setMainImage(null);
    setMainImagePreview(null);
    setOtherImages([]);
    setOtherImagePreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!mainImage) {
      setError("Adaugă cel puțin imaginea principală.");
      return;
    }

    setLoading(true);
    try {
      await uploadProduct({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        images: [mainImage, ...otherImages],
      });
      setSuccess(true);
      setForm({ brand: "", category: "", subcategory: "", description: "", price: "", stock: "", title: "" });
      resetImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "A apărut o eroare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-white">Adaugă un produs</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required placeholder="Titlu" value={form.title} onChange={update("title")} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-voltaic focus:outline-none" />
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="Brand" value={form.brand} onChange={update("brand")} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-voltaic focus:outline-none" />
          <input required placeholder="Categorie" value={form.category} onChange={update("category")} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-voltaic focus:outline-none" />
        </div>
        <input required placeholder="Subcategorie" value={form.subcategory} onChange={update("subcategory")} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-voltaic focus:outline-none" />
        <textarea required placeholder="Descriere" value={form.description} onChange={update("description")} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-voltaic focus:outline-none" rows={4} />
        <div className="grid grid-cols-2 gap-3">
          <NumberField placeholder="Preț (lei)" step="0.01" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
          <NumberField placeholder="Stoc" value={form.stock} onChange={(v) => setForm((f) => ({ ...f, stock: v }))} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Imagine principală</label>
            <label className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/10 transition-colors hover:border-voltaic/60">
              {mainImagePreview ? (
                <img src={mainImagePreview} alt="Previzualizare imagine principală" className="h-full w-full object-cover" />
              ) : (
                <span className="px-3 text-center text-xs text-white/50">Adaugă imaginea principală</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Alte imagini</label>
            <label className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/10 transition-colors hover:border-voltaic/60">
              {otherImagePreviews.length > 0 ? (
                <div className="grid h-full w-full grid-cols-2 gap-0.5 p-0.5">
                  {otherImagePreviews.slice(0, 4).map((src, i) => (
                    <div key={i} className="relative overflow-hidden rounded-md bg-black/20">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      {i === 3 && otherImagePreviews.length > 4 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white">
                          +{otherImagePreviews.length - 3}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="px-3 text-center text-xs text-white/50">Adaugă restul imaginilor</span>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleOtherImagesChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-red-300">{error}</p>}
        {success && <p className="text-sm text-emerald-300">Produs adăugat cu succes.</p>}
        <button type="submit" disabled={loading} className="mt-2 rounded-full bg-voltaic px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-voltaic/90 disabled:opacity-50">
          {loading ? "Se încarcă..." : "Adaugă produs"}
        </button>
      </form>
    </div>
  );
}