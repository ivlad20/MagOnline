import Link from "next/link";
import SectionHeader from "./SectionHeader";
import { CATEGORIES, categoryHref } from "@/lib/categories";

export default function CategoryShowcase() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8">
      <SectionHeader eyebrow="Cumpără după categorie" title="Ce cauți azi?" />

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
        {CATEGORIES.map(({ value, label, icon: Icon }) => (
          <Link
            key={value}
            href={categoryHref(value)}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-mist bg-white px-2 py-5 text-center transition-all hover:-translate-y-1 hover:border-crimson/30 hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-seal-soft text-seal transition-colors group-hover:bg-crimson group-hover:text-white">
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-xs font-semibold leading-tight text-navy sm:text-sm">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
