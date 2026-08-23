import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}

export default function SectionHeader({ eyebrow, title, action }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-voltaic">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-2xl font-semibold text-[#111111] sm:text-3xl">
          {title}
        </h2>
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
