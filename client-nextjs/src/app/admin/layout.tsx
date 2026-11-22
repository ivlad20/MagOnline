"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarChart3, Database, Package, ShieldAlert, Sparkles, Tags } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/admin", label: "Vânzări", icon: BarChart3 },
  { href: "/admin/comenzi", label: "Comenzi", icon: Package },
  { href: "/admin/produse", label: "Produse", icon: Tags },
  { href: "/admin/oferte", label: "Ofertele săptămânii", icon: Sparkles },
  { href: "/admin/baza-de-date", label: "Bază de date", icon: Database },
];

/** Shell for every /admin page: login + admin guard, then a sidebar (tabs on phones). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [isLoading, user, router, pathname]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-paper">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mist border-t-crimson" aria-label="Se încarcă" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-paper px-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-crimson-soft text-crimson">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <h1 className="mt-4 font-display text-xl font-semibold text-navy">Acces restricționat</h1>
        <p className="mt-1 max-w-sm text-sm text-ink-soft">Panoul de administrare este disponibil doar conturilor de administrator.</p>
        <Link href="/" className="mt-6 rounded-lg bg-crimson px-6 py-3 text-sm font-semibold text-white hover:bg-crimson-deep">
          Înapoi la magazin
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-paper">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 px-4 py-6 sm:px-8 sm:py-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="h-fit min-w-0 rounded-2xl bg-navy p-3 text-white lg:sticky lg:top-24">
          <p className="hidden px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-white/50 lg:block">Administrare</p>
          <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] lg:flex-col" aria-label="Administrare">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active ? "bg-white font-semibold text-navy" : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-crimson" : ""}`} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
