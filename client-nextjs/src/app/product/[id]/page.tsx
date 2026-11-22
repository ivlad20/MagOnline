import Link from "next/link";
import { notFound } from "next/navigation";
import ProductShowcase from "@/components/ProductShowcase";
import ProductInfoTabs from "@/components/ProductInfoTabs";
import RecordProductView from "@/components/RecordProductView";
import { getProductById } from "@/lib/products";

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
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-navy-deep to-navy">
        <div className="relative z-10">

          <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8">
            <RecordProductView productId={product.id} />

            <nav className="mb-6 text-sm text-white/60">
              <Link href="/" className="hover:text-white">
                Acasă
              </Link>
              <span className="mx-2">/</span>
              <Link
                href={`/category/${product.category}`}
                className="hover:text-white"
              >
                {product.category}
              </Link>
            </nav>

            <ProductShowcase product={product} />

            <div className="mt-10 pb-16">
              <ProductInfoTabs product={product} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}