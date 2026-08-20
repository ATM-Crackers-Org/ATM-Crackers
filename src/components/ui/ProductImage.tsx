import React from "react";

// Category-type linear gradient colors
const categoryLinearGradients: Record<string, { linear: string; emoji: string }> = {
  bomb:     { linear: "linear-gradient(135deg, #B91C1C 0%, #7F1D1D 100%)", emoji: "💥" },
  rocket:   { linear: "linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)", emoji: "🚀" },
  sparkler: { linear: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", emoji: "✨" },
  fountain: { linear: "linear-gradient(135deg, #0F766E 0%, #0284C7 100%)", emoji: "⛲" },
  chakkar:  { linear: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)", emoji: "🌀" },
  fancy:    { linear: "linear-gradient(135deg, #DB2777 0%, #9D174D 100%)", emoji: "🎆" },
  kids:     { linear: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)", emoji: "🎉" },
  pot:      { linear: "linear-gradient(135deg, #E11D48 0%, #BE123C 100%)", emoji: "🌺" },
  varnam:   { linear: "linear-gradient(135deg, #B91C1C 0%, #450A0A 100%)", emoji: "🔥" },
  pencil:   { linear: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)", emoji: "🖊️" },
  bijili:   { linear: "linear-gradient(135deg, #D97706 0%, #92400E 100%)", emoji: "⚡" },
  match:    { linear: "linear-gradient(135deg, #0369A1 0%, #1E40AF 100%)", emoji: "🔥" },
  default:  { linear: "linear-gradient(135deg, #27272A 0%, #18181B 100%)", emoji: "🎇" },
};

function getGradientKey(categoryName: string): string {
  const n = (categoryName || "").toLowerCase();
  if (n.includes("bomb") || n.includes("sonic")) return "bomb";
  if (n.includes("rocket") || n.includes("sky")) return "rocket";
  if (n.includes("sparkler")) return "sparkler";
  if (n.includes("fountain") || n.includes("tin")) return "fountain";
  if (n.includes("chakkar") || n.includes("wheel") || n.includes("spinner")) return "chakkar";
  if (n.includes("fancy") || n.includes("shot") || n.includes("celebration")) return "fancy";
  if (n.includes("kids") || n.includes("happy")) return "kids";
  if (n.includes("pot") || n.includes("flower")) return "pot";
  if (n.includes("varnam") || n.includes("grand") || n.includes("deluxe")) return "varnam";
  if (n.includes("pencil") || n.includes("delight")) return "pencil";
  if (n.includes("bijili") || n.includes("sound") || n.includes("gun")) return "bijili";
  if (n.includes("match")) return "match";
  return "default";
}

interface ProductImageProps {
  productName: string;
  categoryName?: string;
  sku?: string;
  className?: string;
  showLabel?: boolean;
  size?: "card" | "detail" | "thumb";
  aspectRatio?: string;
}

export function ProductImage({
  productName,
  categoryName = "",
  sku = "",
  className = "",
  showLabel = true,
  size = "card",
}: ProductImageProps) {
  const key = getGradientKey(categoryName);
  const g = categoryLinearGradients[key] ?? categoryLinearGradients.default;

  const heightClass =
    size === "detail"
      ? "h-64 sm:h-80 md:h-96"
      : size === "thumb"
      ? "h-16 w-16"
      : "h-36 sm:h-44";

  return (
    <div
      className={`relative w-full ${heightClass} rounded-inherit overflow-hidden flex flex-col items-center justify-center p-3 select-none ${className}`}
      style={{
        background: g.linear,
      }}
    >
      {/* Decorative sparkle corner */}
      <div className="absolute top-2 right-2 text-white/20 text-xs select-none">✦</div>
      <div className="absolute bottom-2 left-2 text-white/15 text-[9px] select-none">✦</div>

      {/* Center Emoji */}
      <span className={`${size === "detail" ? "text-5xl mb-3" : size === "thumb" ? "text-xl" : "text-3xl mb-1.5"} drop-shadow-md`}>
        {g.emoji}
      </span>

      {/* Product Name Title if card/detail */}
      {showLabel && size !== "thumb" && (
        <p className="text-[11px] sm:text-xs font-semibold text-white/90 text-center line-clamp-2 px-2 leading-tight drop-shadow">
          {productName}
        </p>
      )}

      {sku && size === "detail" && (
        <span className="text-[10px] text-white/60 mt-1 uppercase tracking-widest">
          {sku}
        </span>
      )}
    </div>
  );
}

// Compact Category Image Component
export function CategoryImage({
  categoryName,
  className = "",
}: {
  categoryName: string;
  className?: string;
}) {
  const key = getGradientKey(categoryName);
  const g = categoryLinearGradients[key] ?? categoryLinearGradients.default;

  return (
    <div
      className={`relative w-full h-28 sm:h-32 overflow-hidden flex items-center justify-center ${className}`}
      style={{
        background: g.linear,
      }}
    >
      <div className="text-3xl sm:text-4xl drop-shadow-md">
        {g.emoji}
      </div>
      <div className="absolute top-2 right-2 text-white/20 text-xs">✦</div>
    </div>
  );
}
