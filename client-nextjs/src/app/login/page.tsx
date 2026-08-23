import Navbar from "@/components/Navbar";
import MoltenMetalBG from "@/components/MoltenMetalBG";
import AuthConsole from "@/components/AuthConsole";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#111111]">
      <MoltenMetalBG
        color1="#2749ff"
        color2="#dfc7de"
        color3="#FFFFFF"
        speed={0.35}
        scale={12}
        detail={3}
        glow={2}
        coreSize={0.2}
        blackPoint={0}
        grainIntensity={0}
        brightness={1.2}
        mouseInteraction
        className="absolute inset-0 h-full w-full"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <AuthConsole />
        </div>
      </div>
    </div>
  );
}