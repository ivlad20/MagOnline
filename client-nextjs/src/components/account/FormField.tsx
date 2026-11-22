/** Shared input styling, identical to the login form. */
export const inputClass =
  "w-full rounded-lg border border-mist bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-crimson focus:ring-2 focus:ring-crimson/15 disabled:bg-paper-dim disabled:text-ink-soft";

/** Labelled form field; pass the input/select/textarea as children. */
export function Field({
  label,
  hint,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-ink-soft">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-soft/80">{hint}</p>}
    </div>
  );
}

/** Error / success message box used under forms. */
export function FormMessage({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
  return (
    <p
      role={kind === "error" ? "alert" : "status"}
      className={`rounded-lg px-3 py-2 text-sm ${
        kind === "error" ? "bg-crimson-soft text-crimson-deep" : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {children}
    </p>
  );
}
