import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PriceTag from "@/components/PriceTag";
import StockBadge from "@/components/StockBadge";
import { getProductById } from "@/lib/api";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <Navbar />
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8">
        <nav className="mb-6 text-sm text-ink-soft">
          <Link href="/" className="hover:text-voltaic">
            Acasă
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${product.category}`} className="hover:text-voltaic">
            {product.category}
          </Link>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="relative flex aspect-square items-center justify-center rounded-xl border border-mist bg-paper-dim">
            <span className="font-display text-sm text-ink-soft">
              Imaginea produsului urmează
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {product.brand} · {product.subcategory}
            </span>
            <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              {product.description}
            </h1>

            <StockBadge stock={product.stock} />

            <div className="pt-2">
              <PriceTag price={product.price} size="lg" />
            </div>

            <button
              disabled
              title="Coșul urmează într-un pas viitor"
              className="mt-4 w-full max-w-xs cursor-not-allowed bg-ember px-6 py-3 text-sm font-semibold text-paper opacity-50 sm:w-fit"
            >
              Adaugă în coș
            </button>

            <div className="mt-6 flex flex-col gap-3 border-t border-mist pt-6 text-sm text-ink-soft">
              <p>Livrare estimată în 24–48h.</p>
              <p>Plată securizată — card, transfer sau ramburs.</p>
              <p>Retur în 30 de zile.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
