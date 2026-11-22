import { ORDER_STATUS } from "@/lib/account";

/** Colored pill with the Romanian label of an order status. */
export default function StatusBadge({ status }: { status: string }) {
  const s = ORDER_STATUS[status] ?? { label: status, className: "bg-paper-dim text-ink-soft" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.className}`}>{s.label}</span>;
}
