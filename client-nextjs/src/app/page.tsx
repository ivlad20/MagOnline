import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategoryBento from "@/components/CategoryBento";
import ProductRail from "@/components/ProductRail";
import TrustStrip from "@/components/TrustStrip";
import { getRandomProducts } from "@/lib/api";

export default async function Home() {
  const [weeklyDeals, moreProducts] = await Promise.all([
    getRandomProducts(12),
    getRandomProducts(12),
  ]);

  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <CategoryBento />
        <ProductRail
          title="Oferta săptămânii"
          subtitle="Produse selectate pentru tine"
          products={weeklyDeals}
        />
        <TrustStrip />
        <ProductRail title="S-ar putea să-ți placă" products={moreProducts} />
      </main>
      <Footer />
    </div>
  );
}
