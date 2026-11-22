"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  User,
  Heart,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Store,
  Truck,
  RotateCcw,
  Headphones,
  Package,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES, categoryHref } from "@/lib/categories";

export default function Navbar() {
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [accountOpen, setAccountOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hoverOpenedAt = useRef(0);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!menuOpen) hoverOpenedAt.current = Date.now();
    setMenuOpen(true);
  };
  // Hover-ul deschide meniul chiar înainte de click; un click imediat după nu trebuie să-l închidă.
  const toggleMenu = () => {
    if (menuOpen && Date.now() - hoverOpenedAt.current < 600) return;
    setMenuOpen((o) => !o);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), 180);
  };
  const closeAll = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setAccountOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeCat = CATEGORIES[active];

  return (
    <>
      {/* Bandă de utilitare */}
      <div className="hidden bg-navy-deep text-xs text-white/70 md:block">
        <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-crimson" />
              Livrare gratuită peste 250 lei
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5 text-crimson" />
              Retur gratuit 30 de zile
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/sell_product" className="hover:text-white">
              {auth.isSeller ? "Vinde produse" : "Devino vânzător"}
            </Link>
            <Link href="/livrare" className="hover:text-white">
              Livrare & retur
            </Link>
            <Link href="/despre#contact" className="flex items-center gap-1.5 hover:text-white">
              <Headphones className="h-3.5 w-3.5" />
              Contact
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-navy text-white shadow-[0_2px_12px_rgba(9,21,48,0.25)]">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:gap-6 sm:px-8">
          {/* Logo */}
          <Link href="/" onClick={closeAll} className="flex shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson font-display text-base font-bold">
              M
            </span>
            <span className="hidden font-display text-xl font-bold tracking-tight sm:inline">
              Mag<span className="text-crimson">Online</span>
            </span>
          </Link>

          {/* Buton mega-meniu */}
          <div onMouseEnter={openMenu} onMouseLeave={scheduleClose} className="relative">
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mega-menu"
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                menuOpen ? "bg-white text-navy" : "bg-white/10 hover:bg-white/15"
              }`}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="hidden lg:inline">Produse</span>
            </button>
          </div>

          {/* Căutare */}
          <form role="search" action="/search" className="hidden flex-1 md:flex">
            <div className="flex w-full overflow-hidden rounded-lg bg-white ring-crimson focus-within:ring-2">
              <input
                type="search"
                name="q"
                placeholder="Ce cauți azi? Ex: placă video, iPhone, PlayStation…"
                className="w-full bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Caută"
                className="flex items-center justify-center bg-crimson px-5 text-white transition-colors hover:bg-crimson-deep"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Acțiuni */}
          <nav className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
            <div
              className="relative"
              onMouseEnter={() => auth.user && setAccountOpen(true)}
              onMouseLeave={() => setAccountOpen(false)}
            >
              <Link
                href={auth.user ? "/cont" : "/login"}
                onClick={closeAll}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-white/10"
              >
                <User className="h-6 w-6" />
                <span className="hidden flex-col leading-tight xl:flex">
                  <span className="text-[11px] text-white/60">
                    {auth.user ? `Salut, ${auth.user.username}` : "Bine ai venit"}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold">
                    {auth.user ? "Contul meu" : "Intră în cont"}
                    {auth.user && <ChevronDown className="h-3.5 w-3.5" />}
                  </span>
                </span>
              </Link>

              {auth.user && accountOpen && (
                <div className="absolute right-0 top-full w-56 pt-2">
                  <div className="overflow-hidden rounded-xl bg-white p-2 text-ink shadow-2xl ring-1 ring-black/5">
                    <Link href="/cont" onClick={closeAll} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-seal-soft">
                      <User className="h-4 w-4 text-seal" /> Profilul meu
                    </Link>
                    <Link href="/orders" onClick={closeAll} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-seal-soft">
                      <Package className="h-4 w-4 text-seal" /> Comenzile mele
                    </Link>
                    <Link href="/sell_product" onClick={closeAll} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-seal-soft">
                      <Store className="h-4 w-4 text-seal" /> {auth.isSeller ? "Vinde produse" : "Devino vânzător"}
                    </Link>
                    <hr className="my-2 border-mist" />
                    <button
                      type="button"
                      onClick={() => {
                        closeAll();
                        auth.logout();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-crimson hover:bg-crimson-soft"
                    >
                      <LogOut className="h-4 w-4" /> Deconectare
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/favorite"
              onClick={closeAll}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-white/10"
            >
              <Heart className="h-6 w-6" />
              <span className="hidden text-sm font-semibold xl:inline">Favorite</span>
            </Link>

            <Link
              href="/cos"
              onClick={closeAll}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-white/10"
            >
              <span className="relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson px-1 text-[10px] font-bold">
                  0
                </span>
              </span>
              <span className="hidden text-sm font-semibold xl:inline">Coșul meu</span>
            </Link>
          </nav>
        </div>

        {/* Căutare pe mobil */}
        <form role="search" action="/search" className="px-4 pb-3 md:hidden">
          <div className="flex overflow-hidden rounded-lg bg-white">
            <input
              type="search"
              name="q"
              placeholder="Ce cauți azi?"
              className="w-full bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none"
            />
            <button type="submit" aria-label="Caută" className="bg-crimson px-4 text-white">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Mega-meniu */}
        {menuOpen && (
          <div
            id="mega-menu"
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
            className="absolute inset-x-0 top-full z-50"
          >
            <div className="mx-auto max-w-[1400px] px-0 sm:px-8">
              <div className="flex max-h-[calc(100vh-140px)] overflow-hidden bg-white text-ink shadow-2xl sm:rounded-b-2xl">
                {/* Categorii principale */}
                <ul className="w-full shrink-0 overflow-y-auto border-r border-mist bg-paper-dim py-2 sm:w-72">
                  {CATEGORIES.map((cat, i) => {
                    const Icon = cat.icon;
                    const isActive = i === active;
                    return (
                      <li key={cat.value}>
                        <Link
                          href={categoryHref(cat.value)}
                          onMouseEnter={() => setActive(i)}
                          onFocus={() => setActive(i)}
                          onClick={closeAll}
                          className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-white text-crimson shadow-[inset_3px_0_0_var(--color-crimson)]"
                              : "text-ink hover:bg-white/70"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isActive ? "text-crimson" : "text-seal"}`} />
                          <span className="flex-1">{cat.label}</span>
                          <ChevronRight className="h-4 w-4 opacity-40" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Subcategorii */}
                <div className="hidden flex-1 gap-8 overflow-y-auto p-8 sm:flex">
                  <div className="flex-1">
                    <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-mist pb-4">
                      <h3 className="font-display text-2xl font-semibold text-navy">{activeCat.label}</h3>
                      <Link
                        href={categoryHref(activeCat.value)}
                        onClick={closeAll}
                        className="flex items-center gap-1 text-sm font-semibold text-crimson hover:text-crimson-deep"
                      >
                        Vezi toate <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <ul className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2 xl:grid-cols-3">
                      {activeCat.subcategories.map((sub) => (
                        <li key={sub}>
                          <Link
                            href={categoryHref(activeCat.value, sub)}
                            onClick={closeAll}
                            className="block rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-seal-soft hover:text-navy"
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/#oferte"
                    onClick={closeAll}
                    className="relative hidden w-64 shrink-0 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy-light to-seal p-6 text-white lg:flex"
                  >
                    <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-crimson/40 blur-2xl" />
                    <span className="relative mb-2 w-fit rounded-full bg-crimson px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      Oferte
                    </span>
                    <span className="relative font-display text-xl font-semibold leading-snug">
                      Ofertele săptămânii
                    </span>
                    <span className="relative mt-1 text-sm text-white/70">Reduceri la produse alese pentru tine</span>
                    <span className="relative mt-4 flex items-center gap-1 text-sm font-semibold">
                      Descoperă <ChevronRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Fundal întunecat cât e deschis meniul */}
      {menuOpen && (
        <div
          aria-hidden
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-navy-deep/50 backdrop-blur-[2px]"
        />
      )}
    </>
  );
}
