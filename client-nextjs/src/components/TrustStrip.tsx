import { FaTruck, FaShieldHalved, FaRotateLeft } from "react-icons/fa6";

const ITEMS = [
  { icon: FaTruck, title: "Livrare rapidă", copy: "În 24–48h în majoritatea orașelor" },
  { icon: FaShieldHalved, title: "Plată securizată", copy: "Card, transfer sau ramburs" },
  { icon: FaRotateLeft, title: "Retur 30 de zile", copy: "Fără întrebări suplimentare" },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-mist bg-white">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-8">
        {ITEMS.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-voltaic/10 text-voltaic">
              <Icon size={18} />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-ink">{title}</p>
              <p className="text-sm text-ink-soft">{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
