type PriceTagProps = {
  price: number;
  size?: "sm" | "lg";
};

const formatter = new Intl.NumberFormat("ro-RO", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Signature element: renders the price inside a die-cut price-tag shape
 * (angled left edge + punched hole), set in mono type — like a real
 * retail tag rather than a generic rounded pill.
 */
export default function PriceTag({ price, size = "sm" }: PriceTagProps) {
  const isLarge = size === "lg";

  return (
    <div
      className={`relative inline-flex items-center gap-1 bg-voltaic text-paper font-price font-bold ${
        isLarge ? "pl-5 pr-4 py-2 text-2xl" : "pl-4 pr-3 py-1.5 text-sm"
      }`}
      style={{
        clipPath:
          "polygon(0% 50%, 14% 0%, 100% 0%, 100% 100%, 14% 100%)",
      }}
    >
      <span
        className={`absolute rounded-full bg-paper ${
          isLarge ? "left-[9%] h-1.5 w-1.5" : "left-[8%] h-1 w-1"
        }`}
      />
      <span className="pl-1.5">{formatter.format(price)}</span>
      <span className={isLarge ? "text-sm font-body font-normal opacity-80" : "text-[10px] font-body opacity-80"}>
        Lei
      </span>
    </div>
  );
}
