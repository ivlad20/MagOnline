import Footer from "@/components/Footer";
import { getRandomProducts } from "@/lib/products";
import ProductCarousel from "@/components/ProductCarousel";
import CategoryShowcase from "@/components/CategoryShowcase";
import RecentlyViewed from "@/components/RecentlyViewed";
import NewsletterSignup from "@/components/NewsletterSignup";
import HeroSection from "@/components/HeroSection";

export default async function Home() {
  const [weeklyDeals, recommended, moreProducts] = await Promise.all([
    getRandomProducts(12),
    getRandomProducts(12),
    getRandomProducts(12),
  ]);

  return (
    <div>
      <HeroSection />

      <div className="bg-white">
        <ProductCarousel
          eyebrow="Oferte"
          title="Ofertele săptămânii"
          products={weeklyDeals}
          href="/oferte"
        />

        <CategoryShowcase />

        <ProductCarousel
          eyebrow="Pentru tine"
          title="Recomandate pentru tine"
          products={recommended}
        />

        <RecentlyViewed />

        <ProductCarousel title="S-ar putea să-ți placă" products={moreProducts} />
      </div>

      <NewsletterSignup />

      <Footer />
    </div>
  );
}