"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import MoltenMetalBG from "@/components/MoltenMetalBG";
import HeroHistoryCarousel from "@/components/HeroHistoryCarousel";
import { useAuth } from "@/context/AuthContext";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export default function HeroSection() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { products: recentlyViewed, isLoading: isHistoryLoading } =
    useRecentlyViewed();

  const isLoggedIn = !isAuthLoading && !!user;
  const hasHistory =
    isLoggedIn && !isHistoryLoading && recentlyViewed.length > 0;

  return (
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

        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          {hasHistory ? (
            <>
              <h2 className="font-display px-4 text-2xl font-semibold text-white sm:text-3xl">
                Continuă de unde ai rămas
              </h2>
              <HeroHistoryCarousel products={recentlyViewed} />
            </>
          ) : isLoggedIn ? (
            <h1 className="font-display px-4 text-3xl font-semibold text-white sm:text-5xl">
              Bine ai revenit!
            </h1>
          ) : (
            <>
              <h1 className="font-display px-4 text-3xl font-semibold text-white sm:text-5xl">
                Tehnologia de care ai nevoie, la un click distanță
              </h1>
              <div className="flex items-center gap-4">
                {/* butoanele de login/signup, neschimbate */}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
