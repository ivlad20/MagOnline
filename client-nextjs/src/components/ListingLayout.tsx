import Link from "next/link";
import ProductCard, { type Product } from "@/components/ProductCard";
import MoltenMetalBG from "@/components/MoltenMetalBG";

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
      {/* Molten metal doar in spatele navbarului — fixed la viewport, navbar-ul (z-50, sticky) ramane deasupra */}
      <div className="fixed inset-x-0 top-0 z-0 h-16 overflow-hidden sm:h-[108px]">
        <MoltenMetalBG className="h-full w-full" opacity={0.9} />
      </div>

      <main className="relative z-10 min-h-screen bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h1 className="text-xl font-semibold text-[#111111] sm:text-2xl">{heading}</h1>
            <span className="text-sm text-slate-500">{resultCount} produse</span>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row">
            {subcategories && subcategories.length > 0 && subcategoryLinkBuilder && (
              <aside className="w-full shrink-0 sm:w-64">
                <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                  <h2 className="mb-3 text-sm font-semibold text-[#111111]">Subcategorie</h2>
                  <ul className="flex flex-col gap-1">
                    <li>
                      <Link
                        href={subcategoryLinkBuilder(null)}
                        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                          !activeSubcategory
                            ? "bg-voltaic/10 font-medium text-voltaic"
                            : "text-slate-600 hover:bg-slate-50"
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
                              ? "bg-voltaic/10 font-medium text-voltaic"
                              : "text-slate-600 hover:bg-slate-50"
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
                <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400">
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
      </main>
    </>
  );
}