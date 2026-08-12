import Link from "next/link";
import { FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";

const CATEGORIES = [
  { label: "Laptopuri & PC", slug: "laptop-pc" },
  { label: "Periferice", slug: "periferice" },
  { label: "Smartphone-uri", slug: "smartphone" },
  { label: "Tablete", slug: "tablete" },
  { label: "Console", slug: "console" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-paper">
      <div className="flex h-16 items-center gap-4 border-b border-mist bg-white px-4 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center bg-voltaic text-paper font-display text-sm font-bold"
            style={{ clipPath: "polygon(0% 50%, 14% 0%, 100% 0%, 100% 100%, 14% 100%)" }}
          >
            M
          </span>
          <span className="font-display text-lg font-semibold text-ink">MagOnline</span>
        </Link>

        <form
          role="search"
          action="/search"
          className="mx-auto hidden w-full max-w-xl items-center gap-2 rounded-full border border-mist bg-paper-dim px-4 py-2 sm:flex"
        >
          <FaSearch className="text-ink-soft" size={14} />
          <input
            type="search"
            name="q"
            placeholder="Caută produse, branduri, categorii…"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-soft focus:outline-none"
          />
        </form>

        <nav className="ml-auto flex items-center gap-5 text-ink">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm transition-colors hover:text-voltaic"
          >
            <FaUser size={16} />
            <span className="hidden sm:inline">Cont</span>
          </Link>
          <Link
            href="/cos"
            className="flex items-center gap-2 text-sm transition-colors hover:text-voltaic"
          >
            <FaShoppingCart size={16} />
            <span className="hidden sm:inline">Coș</span>
          </Link>
        </nav>
      </div>

      <div className="hidden border-b border-mist bg-voltaic sm:block">
        <div className="mx-auto flex max-w-[1400px] items-center gap-1 px-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="px-4 py-3 text-sm font-medium text-paper/90 transition-colors hover:bg-white/10 hover:text-paper"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
