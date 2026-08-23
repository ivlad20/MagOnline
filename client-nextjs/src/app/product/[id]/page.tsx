import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MoltenMetalBG from "@/components/MoltenMetalBG";
import ProductShowcase from "@/components/ProductShowcase";
import ProductInfoTabs from "@/components/ProductInfoTabs";
import RecordProductView from "@/components/RecordProductView";
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
      <div className="relative w-full overflow-hidden bg-[#111111]">
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
          className="absolute inset-0 h-full w-full"
        />

        <div className="relative z-10">
          <Navbar />

          <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8">
            <RecordProductView productId={product.id} />

            <nav className="mb-6 text-sm text-white/60">
              <Link href="/" className="hover:text-voltaic">
                Acasă
              </Link>
              <span className="mx-2">/</span>
              <Link
                href={`/category/${product.category}`}
                className="hover:text-voltaic"
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

      <Footer />
    </div>
  );
}