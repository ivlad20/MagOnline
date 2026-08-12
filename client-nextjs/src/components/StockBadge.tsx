type StockBadgeProps = {
  stock: number;
};

/** Only ever reflects real stock numbers from the API — never a fabricated urgency claim. */
export default function StockBadge({ stock }: StockBadgeProps) {
  if (stock <= 0) {
    return (
      <span className="inline-flex w-fit items-center rounded-sm bg-ink/5 px-2 py-0.5 text-xs font-medium text-ink-soft">
        Stoc epuizat
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex w-fit items-center rounded-sm bg-ember-soft px-2 py-0.5 text-xs font-medium text-ember-deep">
        Ultimele {stock} bucăți
      </span>
    );
  }

  return (
    <span className="inline-flex w-fit items-center rounded-sm bg-signal-soft px-2 py-0.5 text-xs font-medium text-signal">
      În stoc
    </span>
  );
}
