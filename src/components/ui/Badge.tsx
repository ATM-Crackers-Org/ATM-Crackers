import React from "react";
import { FaFire, FaStar } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";

type BadgeVariant = "discount" | "new" | "hot" | "trending" | "bestseller" | "outofstock";

interface BadgeProps {
  variant?: BadgeVariant;
  label?: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "new", label, className = "" }: BadgeProps) {
  let content: React.ReactNode = label;
  let bgClass = "bg-emerald-500 text-white";

  if (!label) {
    switch (variant) {
      case "hot":
        bgClass = "bg-amber-500 text-white";
        content = (
          <>
            <FaFire className="text-[10px] mr-1" /> HOT
          </>
        );
        break;
      case "trending":
        bgClass = "bg-indigo-500 text-white";
        content = (
          <>
            <FaArrowTrendUp className="text-[10px] mr-1" /> TRENDING
          </>
        );
        break;
      case "bestseller":
        bgClass = "bg-[#FFD166] text-[#18181B]";
        content = (
          <>
            <FaStar className="text-[10px] mr-1" /> BEST SELLER
          </>
        );
        break;
      case "outofstock":
        bgClass = "bg-zinc-400 text-white";
        content = "OUT OF STOCK";
        break;
      case "new":
      default:
        bgClass = "bg-emerald-500 text-white";
        content = (
          <>
            <LuSparkles className="text-[10px] mr-1" /> NEW
          </>
        );
        break;
    }
  } else {
    // If label is passed, pick colors by variant
    if (variant === "hot") bgClass = "bg-amber-500 text-white";
    else if (variant === "trending") bgClass = "bg-indigo-500 text-white";
    else if (variant === "bestseller") bgClass = "bg-[#FFD166] text-[#18181B]";
    else if (variant === "outofstock") bgClass = "bg-zinc-400 text-white";
    else if (variant === "new") bgClass = "bg-emerald-500 text-white";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase leading-none ${bgClass} ${className}`}
    >
      {content}
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
      className={`inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-bold text-white bg-crimson leading-none ${className}`}
    >
      -{percent}%
    </span>
  );
}
