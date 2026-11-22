import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductShowcase from "@/components/ProductShowcase";
import ProductInfoTabs from "@/components/ProductInfoTabs";
import RecordProductView from "@/components/RecordProductView";
import { getProductById } from "@/lib/products";
import { CATEGORIES, categoryHref } from "@/lib/categories";

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

  const categoryLabel = CATEGORIES.find((c) => c.value === product.category)?.label ?? product.category;

  return (
    <div className="bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-6 sm:px-8">
        <RecordProductView productId={product.id} />

        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-ink-soft">
          <Link href="/" className="hover:text-crimson">
            Acasă
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <Link href={categoryHref(product.category)} className="hover:text-crimson">
            {categoryLabel}
          </Link>
          {product.subcategory && (
            <>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              <Link href={categoryHref(product.category, product.subcategory)} className="hover:text-crimson">
                {product.subcategory}
              </Link>
            </>
          )}
        </nav>

        <ProductShowcase product={product} />

        <div className="mt-12">
          <ProductInfoTabs product={product} />
        </div>
      </div>
    </div>
  );
}
