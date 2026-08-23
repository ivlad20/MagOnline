import Link from "next/link";
import {
  Laptop,
  Headphones,
  Smartphone,
  Tablet,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import SectionHeader from "./SectionHeader";

interface Category {
  label: string;
  href: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  { label: "Laptopuri & PC", href: "/categorii/laptopuri-pc", icon: Laptop },
  { label: "Periferice", href: "/categorii/periferice", icon: Headphones },
  { label: "Smartphone-uri", href: "/categorii/smartphone-uri", icon: Smartphone },
  { label: "Tablete", href: "/categorii/tablete", icon: Tablet },
  { label: "Console", href: "/categorii/console", icon: Gamepad2 },
];

export default function CategoryShowcase() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-[1800px] px-4 py-12 sm:px-6 lg:px-10">
        <SectionHeader eyebrow="Cumpără după categorie" title="Ce cauți azi?" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-voltaic/10 text-voltaic transition-colors group-hover:bg-voltaic group-hover:text-paper">
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-medium text-[#111111]">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}