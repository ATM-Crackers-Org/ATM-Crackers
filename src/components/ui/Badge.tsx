import React from "react";

type BadgeVariant = "discount" | "new" | "hot" | "trending" | "bestseller" | "outofstock";

interface BadgeProps {
  variant?: BadgeVariant;
  label?: string;
  className?: string;
}

const styles: Record<BadgeVariant, { bg: string; text: string; label: string }> = {
  discount: { bg: "bg-[#B91C1C]", text: "text-white", label: "" },
  new:       { bg: "bg-emerald-500", text: "text-white", label: "NEW" },
  hot:       { bg: "bg-amber-500", text: "text-white", label: "🔥 HOT" },
  trending:  { bg: "bg-indigo-500", text: "text-white", label: "📈 TRENDING" },
  bestseller:{ bg: "bg-[#FFD166] text-[#18181B]", text: "text-[#18181B]", label: "⭐ BEST SELLER" },
  outofstock:{ bg: "bg-zinc-400", text: "text-white", label: "OUT OF STOCK" },
};

export function Badge({ variant = "new", label, className = "" }: BadgeProps) {
  const s = styles[variant];
  const displayLabel = label ?? s.label;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase leading-none ${s.bg} ${s.text} ${className}`}
    >
      {displayLabel}
    </span>
  );
}

export function DiscountBadge({
  percent,
  className = "",
}: {
  percent: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-bold text-white bg-[#B91C1C] leading-none ${className}`}
    >
      -{percent}%
    </span>
  );
}
