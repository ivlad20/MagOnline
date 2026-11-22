import Link from "next/link";
import { Cpu, Gamepad2, ChevronRight } from "lucide-react";
import { getRandomProducts, getWeeklyOffers } from "@/lib/products";
import ProductCarousel from "@/components/ProductCarousel";
import CategoryShowcase from "@/components/CategoryShowcase";
import RecentlyViewed from "@/components/RecentlyViewed";
import OffersSpotlight from "@/components/OffersSpotlight";
import { categoryHref } from "@/lib/categories";

const PROMO_TILES = [
  {
    title: "Componente PC",
    copy: "Plăci video, procesoare, memorii",
    href: categoryHref("Componente PC"),
    icon: Cpu,
    className: "bg-seal",
  },
  {
    title: "Console & Gaming",
    copy: "PlayStation, Xbox, accesorii",
    href: categoryHref("Console"),
    icon: Gamepad2,
    className: "bg-crimson",
  },
];

export default async function Home() {
  const [weeklyDeals, recommended, moreProducts] = await Promise.all([
    getWeeklyOffers(8),
    getRandomProducts(12),
    getRandomProducts(12),
  ]);

  return (
    <div className="bg-paper">
      <section className="mx-auto grid max-w-[1400px] gap-4 px-4 pt-6 sm:px-8 lg:grid-cols-[1fr_300px]">
        <OffersSpotlight products={weeklyDeals} />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:grid-rows-2">
          {PROMO_TILES.map(({ title, copy, href, icon: Icon, className }) => (
            <Link
              key={title}
              href={href}
              className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl p-6 text-white ${className}`}
            >
              <Icon className="absolute -right-4 -top-4 h-32 w-32 text-white/10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
              <span className="relative font-display text-xl font-semibold">{title}</span>
              <span className="relative mt-1 text-sm text-white/75">{copy}</span>
              <span className="relative mt-3 flex items-center gap-1 text-sm font-semibold">
                Cumpără acum <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CategoryShowcase />

      <ProductCarousel eyebrow="Pentru tine" title="Recomandate pentru tine" products={recommended} />

      <RecentlyViewed />

      <ProductCarousel eyebrow="Descoperă" title="S-ar putea să-ți placă" products={moreProducts} />
    </div>
  );
}
