export interface RawCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Category extends RawCategory {
  product_count: number;
  icon: string;
  gradient: string;
  accent: string;
}

// Category gradient and accent mapping based on name keywords
export function getCategoryStyle(name: string): {
  icon: string;
  gradient: string;
  accent: string;
} {
  const n = name.toLowerCase();
  if (n.includes("sparkler") || n.includes("matches"))
    return {
      icon: "",
      gradient: "from-amber-500 to-yellow-600",
      accent: "#F59E0B",
    };
  if (n.includes("rocket") || n.includes("sky"))
    return {
      icon: "",
      gradient: "from-indigo-600 to-purple-700",
      accent: "#6366F1",
    };
  if (n.includes("fountain") || n.includes("tin"))
    return {
      icon: "",
      gradient: "from-teal-500 to-cyan-600",
      accent: "#14B8A6",
    };
  if (n.includes("chakkar") || n.includes("wheel") || n.includes("spinner"))
    return {
      icon: "",
      gradient: "from-orange-500 to-red-500",
      accent: "#F97316",
    };
  if (n.includes("bomb") || n.includes("super sonic"))
    return {
      icon: "",
      gradient: "from-red-600 to-rose-700",
      accent: "#DC2626",
    };
  if (
    n.includes("fancy") ||
    n.includes("shot") ||
    n.includes("celebration") ||
    n.includes("mega")
  )
    return {
      icon: "",
      gradient: "from-pink-500 to-fuchsia-600",
      accent: "#EC4899",
    };
  if (n.includes("kids") || n.includes("happy") || n.includes("magic"))
    return {
      icon: "",
      gradient: "from-green-500 to-emerald-600",
      accent: "#22C55E",
    };
  if (n.includes("pot") || n.includes("flower") || n.includes("colour"))
    return {
      icon: "",
      gradient: "from-rose-500 to-pink-600",
      accent: "#F43F5E",
    };
  if (n.includes("varnam") || n.includes("grand"))
    return {
      icon: "",
      gradient: "from-crimson to-red-800",
      accent: "#B91C1C",
    };
  if (n.includes("pencil") || n.includes("delight"))
    return {
      icon: "",
      gradient: "from-violet-500 to-purple-600",
      accent: "#8B5CF6",
    };
  if (n.includes("bijili") || n.includes("sound") || n.includes("gun"))
    return {
      icon: "",
      gradient: "from-yellow-400 to-amber-500",
      accent: "#FBBF24",
    };
  if (n.includes("rope") || n.includes("musical") || n.includes("beat"))
    return {
      icon: "",
      gradient: "from-sky-500 to-blue-600",
      accent: "#0EA5E9",
    };
  if (n.includes("flying") || n.includes("aerial"))
    return {
      icon: "",
      gradient: "from-lime-500 to-green-600",
      accent: "#84CC16",
    };
  // Default
  return {
    icon: "",
    gradient: "from-crimson to-[#7F1D1D]",
    accent: "#B91C1C",
  };
}
