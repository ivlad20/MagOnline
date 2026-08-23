// @/components/product/StarRating.tsx
export default function StarRating({
  rating,
  reviewCount,
  size = "md",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.min(1, Math.max(0, rating - i));
          return (
            <span key={i} className="relative inline-block">
              <svg viewBox="0 0 20 20" className={`${starSize} fill-white/15`}>
                <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7L10 1.5z" />
              </svg>
              {fill > 0 && (
                <svg
                  viewBox="0 0 20 20"
                  className={`${starSize} absolute inset-0 fill-amber-400`}
                  style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}
                >
                  <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7L10 1.5z" />
                </svg>
              )}
            </span>
          );
        })}
      </div>
      <span className="text-xs text-white/60">
        {rating.toFixed(1)}
        {typeof reviewCount === "number" && ` (${reviewCount})`}
      </span>
    </div>
  );
}