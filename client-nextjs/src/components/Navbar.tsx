"use client";

import Link from "next/link";
import { FaUser, FaShoppingCart, FaSearch, FaStore } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
  { label: "Laptopuri & PC", slug: "laptop-pc" },
  { label: "Periferice", slug: "periferice" },
  { label: "Smartphone-uri", slug: "smartphone" },
  { label: "Tablete", slug: "tablete" },
  { label: "Console", slug: "console" },
];

export default function Navbar() {
  const auth = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center bg-voltaic text-paper font-display text-sm font-bold"
            style={{ clipPath: "polygon(0% 50%, 14% 0%, 100% 0%, 100% 100%, 14% 100%)" }}
          >
            M
          </span>
          <span className="font-display text-lg font-semibold text-white">MagOnline</span>
        </Link>

        <form
          role="search"
          action="/search"
          className="mx-auto hidden w-full max-w-xl items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md sm:flex"
        >
          <FaSearch className="text-white/60" size={14} />
          <input
            type="search"
            name="q"
            placeholder="Caută produse, branduri, categorii…"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
          />
        </form>

        <nav className="ml-auto flex items-center gap-5 text-white">
          {auth.user ? (
            <>
              <div className="relative group">
                <button type="button" className="flex items-center gap-2 text-sm transition-colors hover:text-voltaic">
                  <FaUser size={16} />
                  <span>{auth.user.username}</span>
                  <svg className="h-3 w-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="absolute right-0 top-full mt-3 hidden w-48 origin-top-right rounded-xl border border-white/10 bg-black/30 p-2 shadow-xl backdrop-blur-xl group-hover:block">
                  <Link href="/profile" className="block rounded-lg px-4 py-2 text-sm transition-colors hover:bg-white/10">
                    Profil
                  </Link>
                  <Link href="/orders" className="block rounded-lg px-4 py-2 text-sm transition-colors hover:bg-white/10">
                    Comenzi
                  </Link>
                  <hr className="my-2 border-white/10" />
                  <button
                    type="button"
                    onClick={auth.logout}
                    className="block w-full rounded-lg px-4 py-2 text-left text-sm text-red-300 transition-colors hover:bg-white/5 hover:text-red-100"
                  >
                    Deconectare
                  </button>
                </div>
              </div>

              <Link href="/sell_product" className="flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-voltaic">
                <FaStore size={16} />
                <span className="hidden sm:inline">{auth.isSeller ? "Vinde produse" : "Devino Seller"}</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-2 text-sm transition-colors hover:text-voltaic">
                <FaUser size={16} />
                <span className="hidden sm:inline">Cont</span>
              </Link>
              <Link href="/signup" className="rounded-full bg-voltaic px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-voltaic/90">
                Înregistrează-te
              </Link>
            </>
          )}

          <Link
            href="/cos"
            className="flex items-center justify-center rounded-full border border-white/15 p-2 transition-colors hover:border-voltaic hover:text-voltaic"
          >
            <FaShoppingCart size={18} />
          </Link>
        </nav>
      </div>

      <div className="hidden border-t border-white/10 bg-white/5 backdrop-blur-md sm:block">
        <div className="mx-auto flex max-w-[1400px] items-center gap-1 px-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}