import Link from "next/link";

const COLUMNS = [
  {
    heading: "Cumpărături",
    links: [
      { label: "Toate produsele", href: "/category/toate" },
      { label: "Oferte", href: "/category/oferte" },
      { label: "Cont nou", href: "/login" },
    ],
  },
  {
    heading: "Companie",
    links: [
      { label: "Despre MagOnline", href: "/despre" },
      { label: "Devino furnizor", href: "/furnizor" },
      { label: "Contact", href: "/despre#contact" },
    ],
  },
  {
    heading: "Ajutor",
    links: [
      { label: "Livrare & retur", href: "/livrare" },
      { label: "Modalități de plată", href: "/livrare#plata" },
      { label: "Contul meu", href: "/cont" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-voltaic-deep text-paper">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-4 sm:px-8">
        <div className="col-span-2 sm:col-span-1">
          <span
            className="flex h-8 w-8 items-center justify-center bg-ember text-paper font-display text-sm font-bold"
            style={{ clipPath: "polygon(0% 50%, 14% 0%, 100% 0%, 100% 100%, 14% 100%)" }}
          >
            M
          </span>
          <p className="mt-3 max-w-[220px] text-sm text-paper/70">
            Marketplace românesc de electronice — laptopuri, telefoane, console și periferice.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="font-display text-sm font-semibold text-paper">{col.heading}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-xs text-paper/50 sm:px-8">
        © {new Date().getFullYear()} MagOnline. Toate drepturile rezervate.
      </div>
    </footer>
  );
}
