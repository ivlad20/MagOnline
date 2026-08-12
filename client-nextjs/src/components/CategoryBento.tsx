import Link from "next/link";

const TILES = [
  { label: "Laptopuri & PC", slug: "laptop-pc", size: "lg" as const },
  { label: "Smartphone-uri", slug: "smartphone", size: "lg" as const },
  { label: "Periferice", slug: "periferice", size: "sm" as const },
  { label: "Tablete", slug: "tablete", size: "sm" as const },
  { label: "Console", slug: "console", size: "sm" as const },
];

export default function CategoryBento() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8">
      <h2 className="mb-4 font-display text-xl font-semibold text-ink sm:text-2xl">
        Categorii populare
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {TILES.map((tile) => (
          <Link
            key={tile.slug}
            href={`/category/${tile.slug}`}
            className={`group flex items-end rounded-lg border border-mist bg-white p-4 transition-colors hover:border-voltaic ${
              tile.size === "lg" ? "col-span-2 min-h-[140px] sm:col-span-1" : "min-h-[110px]"
            }`}
          >
            <span className="font-display text-sm font-medium text-ink group-hover:text-voltaic sm:text-base">
              {tile.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
