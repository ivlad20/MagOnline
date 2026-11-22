"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Heart, LayoutDashboard, LogOut, Package, ShoppingCart, Store, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/cont", label: "Contul meu", icon: User },
  { href: "/comenzi", label: "Comenzile mele", icon: Package },
  { href: "/favorite", label: "Favorite", icon: Heart },
  { href: "/cos", label: "Coșul meu", icon: ShoppingCart },
];

/** Page frame for the logged-in account area: sidebar navigation + content. Redirects guests to login. */
export default function AccountShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { user, isSeller, isAdmin, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [isLoading, user, pathname, router]);

  if (isLoading || !user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[1400px] items-center justify-center px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mist border-t-crimson" aria-label="Se încarcă" />
      </div>
    );
  }

  const initials = user.username.slice(0, 2).toUpperCase();
  const sellerLink = isSeller
    ? { href: "/sell_product", label: "Adaugă produse", icon: Store }
    : { href: "/devino-vanzator", label: "Devino vânzător", icon: Store };

  return (
    <div className="bg-paper">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-8 sm:px-8 sm:py-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit min-w-0 rounded-2xl border border-mist bg-white p-4 lg:sticky lg:top-24">
          <div className="flex items-center gap-3 border-b border-mist px-2 pb-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-navy">{user.username}</p>
              <p className="truncate text-xs text-ink-soft">{user.email}</p>
            </div>
          </div>

          <nav className="-mx-1 mt-3 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] lg:flex-col" aria-label="Contul meu">
            {[...NAV, sellerLink, ...(isAdmin ? [{ href: "/admin", label: "Panou admin", icon: LayoutDashboard }] : [])].map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active ? "bg-seal-soft font-semibold text-navy" : "text-ink-soft hover:bg-paper-dim hover:text-navy"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-crimson" : "text-seal"}`} />
                  {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-crimson transition-colors hover:bg-crimson-soft lg:mt-2 lg:border-t lg:border-mist lg:pt-3"
            >
              <LogOut className="h-4 w-4" />
              Deconectare
            </button>
          </nav>
        </aside>

        <main className="min-w-0">
          <header className="mb-6">
            <h1 className="font-display text-2xl font-semibold text-navy sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
