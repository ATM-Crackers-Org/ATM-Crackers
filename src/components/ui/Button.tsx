import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: "button" | "a";
  href?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[#B91C1C] text-white hover:bg-[#991B1B] active:bg-[#7F1D1D] shadow-[0_4px_14px_rgba(185,28,28,0.4)] hover:shadow-[0_6px_20px_rgba(185,28,28,0.5)]",
  secondary:
    "bg-transparent border-2 border-[#B91C1C] text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white",
  ghost:
    "bg-transparent border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300",
  gold:
    "bg-gradient-to-r from-[#F59E0B] to-[#FFD166] text-[#18181B] hover:from-[#D97706] hover:to-[#F59E0B] shadow-[0_4px_14px_rgba(245,158,11,0.35)]",
  danger:
    "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2",
  xl: "px-8 py-4 text-base rounded-2xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold font-[var(--font-ui)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B91C1C] focus-visible:ring-offset-2 select-none";

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${disabled || loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
