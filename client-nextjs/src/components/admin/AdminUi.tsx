"use client";

/** Small building blocks shared by the /admin pages. */

export function AdminHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-semibold text-navy">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Panel({ title, aside, children, className = "" }: { title?: string; aside?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-mist bg-white p-5 ${className}`}>
      {(title || aside) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="font-display text-base font-semibold text-navy">{title}</h2>}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-full border border-mist bg-white p-1" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          onClick={() => onChange(o.value)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
            o.value === value ? "bg-navy font-semibold text-white" : "text-ink-soft hover:text-navy"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Thumb({ src, size = "h-10 w-10" }: { src: string | null; size?: string }) {
  return (
    <span className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-lg border border-mist bg-white`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-contain p-0.5" />
      ) : (
        <span className="text-[10px] text-ink-soft/60">—</span>
      )}
    </span>
  );
}

export function SkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex animate-pulse flex-col gap-3" aria-label="Se încarcă">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-14 rounded-xl bg-paper-dim" />
      ))}
    </div>
  );
}
