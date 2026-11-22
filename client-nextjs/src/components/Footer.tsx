import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck, Headphones, Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";
import NewsletterSignup from "./NewsletterSignup";
import { CATEGORIES, categoryHref } from "@/lib/categories";

const BENEFITS = [
  { icon: Truck, title: "Livrare rapidă", copy: "24–48h, gratuit peste 250 lei" },
  { icon: RotateCcw, title: "Retur 30 de zile", copy: "Simplu, fără întrebări" },
  { icon: ShieldCheck, title: "Plată securizată", copy: "Card, transfer sau ramburs" },
  { icon: Headphones, title: "Suport dedicat", copy: "Luni–Vineri, 09:00–18:00" },
];

const COLUMNS = [
  {
    heading: "Contul meu",
    links: [
      { label: "Intră în cont", href: "/login" },
      { label: "Comenzile mele", href: "/orders" },
      { label: "Favorite", href: "/favorite" },
      { label: "Coșul meu", href: "/cos" },
    ],
  },
  {
    heading: "Ajutor",
    links: [
      { label: "Livrare & retur", href: "/livrare" },
      { label: "Modalități de plată", href: "/livrare#plata" },
      { label: "Garanție & service", href: "/livrare#garantie" },
      { label: "Contact", href: "/despre#contact" },
    ],
  },
  {
    heading: "MagOnline",
    links: [
      { label: "Despre noi", href: "/despre" },
      { label: "Devino vânzător", href: "/sell_product" },
      { label: "Termeni și condiții", href: "/despre#termeni" },
      { label: "Confidențialitate", href: "/despre#confidentialitate" },
    ],
  },
];

const SOCIALS = [
  { icon: FaFacebookF, label: "Facebook", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaTiktok, label: "TikTok", href: "#" },
  { icon: FaYoutube, label: "YouTube", href: "#" },
];

const PAYMENTS = ["VISA", "Mastercard", "Apple Pay", "Google Pay", "Ramburs"];

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* Beneficii */}
      <section className="border-t border-mist bg-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 px-4 py-8 sm:px-8 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-crimson-soft text-crimson">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">{title}</p>
                <p className="text-xs text-ink-soft">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <NewsletterSignup />

      <div className="bg-navy text-white">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-10 px-4 py-14 sm:px-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand + contact */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson font-display font-bold">
                M
              </span>
              <span className="font-display text-xl font-bold">
                Mag<span className="text-crimson">Online</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Marketplace românesc de electronice și gadgeturi, cu vânzători verificați și prețuri corecte.
            </p>
            <ul className="mt-5 flex flex-col gap-2.5 text-sm text-white/80">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-seal-light" /> 0700 000 000
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-seal-light" /> suport@magonline.ro
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-seal-light" /> București, România
              </li>
            </ul>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-crimson hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categorii */}
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-seal-light">Categorii</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.value}>
                  <Link href={categoryHref(cat.value)} className="text-sm text-white/70 transition-colors hover:text-white">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-seal-light">{col.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-5 text-xs text-white/50 sm:px-8 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} MagOnline. Toate drepturile rezervate.</p>
            <div className="flex flex-wrap items-center gap-2">
              {PAYMENTS.map((p) => (
                <span key={p} className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 font-semibold text-white/70">
                  {p}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              <a href="https://anpc.ro" target="_blank" rel="noreferrer" className="hover:text-white">
                ANPC
              </a>
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="hover:text-white">
                Soluționarea online a litigiilor
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
