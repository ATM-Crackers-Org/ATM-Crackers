import React from "react";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

const sizes = {
  sm: { star: "text-xs", count: "text-[10px]" },
  md: { star: "text-sm", count: "text-xs" },
  lg: { star: "text-base", count: "text-sm" },
};

export function StarRating({
  rating,
  count,
  size = "sm",
  showCount = true,
  className = "",
}: StarRatingProps) {
  const s = sizes[size];
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className={`flex items-center ${s.star}`}>
        {Array.from({ length: full }).map((_, i) => (
          <span key={`f-${i}`} className="text-amber-400">★</span>
        ))}
        {half && <span className="text-amber-400">⯨</span>}
        {Array.from({ length: empty }).map((_, i) => (
          <span key={`e-${i}`} className="text-zinc-300">★</span>
        ))}
      </div>
      {showCount && (
        <span className={`${s.count} text-zinc-500 font-medium`}>
          {rating.toFixed(1)}
          {count !== undefined && ` (${count.toLocaleString()})`}
        </span>
      )}
    </div>
  );
}
