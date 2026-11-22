import Link from "next/link";
import ProductCard, { type Product } from "@/components/ProductCard";

interface ListingLayoutProps {
  heading: string;
  resultCount: number;
  products: Product[];
  subcategories?: string[];
  activeSubcategory?: string;
  subcategoryLinkBuilder?: (subcategory: string | null) => string;
}

export default function ListingLayout({
  heading,
  resultCount,
  products,
  subcategories,
  activeSubcategory,
  subcategoryLinkBuilder,
}: ListingLayoutProps) {
  return (
    <>
      <section className="min-h-[60vh] bg-paper">
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h1 className="text-xl font-semibold text-navy sm:text-2xl">{heading}</h1>
            <span className="text-sm text-ink-soft">{resultCount} produse</span>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row">
            {subcategories && subcategories.length > 0 && subcategoryLinkBuilder && (
              <aside className="w-full shrink-0 sm:w-64">
                <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                  <h2 className="mb-3 text-sm font-semibold text-navy">Subcategorie</h2>
                  <ul className="flex flex-col gap-1">
                    <li>
                      <Link
                        href={subcategoryLinkBuilder(null)}
                        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                          !activeSubcategory
                            ? "bg-crimson-soft font-semibold text-crimson"
                            : "text-ink-soft hover:bg-seal-soft"
                        }`}
                      >
                        Toate
                      </Link>
                    </li>
                    {subcategories.map((sub) => (
                      <li key={sub}>
                        <Link
                          href={subcategoryLinkBuilder(sub)}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                            activeSubcategory === sub
                              ? "bg-crimson-soft font-semibold text-crimson"
                              : "text-ink-soft hover:bg-seal-soft"
                          }`}
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}

            <div className="flex-1">
              {products.length === 0 ? (
                <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-mist bg-white text-sm text-ink-soft">
                  Niciun produs găsit.
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,240px)] justify-center gap-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}