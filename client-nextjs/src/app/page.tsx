import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MoltenMetalBG from "@/components/MoltenMetalBG";
import Link from "next/link";
import { getRandomProducts } from "@/lib/api";
import ProductCarousel from "@/components/ProductCarousel";
import CategoryShowcase from "@/components/CategoryShowcase";
import RecentlyViewed from "@/components/RecentlyViewed";
import NewsletterSignup from "@/components/NewsletterSignup";

export default async function Home() {
  const [weeklyDeals, recommended, moreProducts] = await Promise.all([
    getRandomProducts(12),
    getRandomProducts(12),
    getRandomProducts(12),
  ]);

  return (
    <div>
      {/* HERO */}
      <div className="relative h-[50vh] w-full overflow-hidden bg-[#111111]">
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

        <div className="relative z-10 flex h-full flex-col">
          <Navbar />

          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
            <h1 className="font-display text-3xl font-semibold text-white sm:text-5xl">
              Tehnologia de care ai nevoie, la un click distanță
            </h1>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Autentificare
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Creează cont
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CONȚINUT PE FUNDAL ALB */}
      <div className="bg-white">
        <ProductCarousel
          eyebrow="Oferte"
          title="Ofertele săptămânii"
          products={weeklyDeals}
          href="/oferte"
        />

        <CategoryShowcase />

        {/* <ProductCardBig
          image="https://s13emagst.akamaized.net/products/77726/77725972/images/res_d150ced567f166d6bcfc737e9f427abb.png?width=300&height=300&hash=00FAE28A8301E442B5FE757311F99018"
          title="Aparat formare bilute"
          category="Ustensile"
          price={1031}
        /> */}

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
