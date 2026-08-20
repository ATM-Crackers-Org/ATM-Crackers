"use client";

import React from "react";

interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "sm",
  className = "",
}: QuantitySelectorProps) {
  const btnSize = size === "sm" ? "w-7 h-7 text-sm" : "w-9 h-9 text-base";
  const numSize = size === "sm" ? "w-8 text-sm" : "w-10 text-base";

  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={`inline-flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-white ${className}`}
    >
      <button
        onClick={decrement}
        disabled={value <= min}
        className={`${btnSize} flex items-center justify-center text-zinc-500 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        className={`${numSize} text-center font-semibold text-zinc-800 select-none`}
      >
        {value}
      </span>
      <button
        onClick={increment}
        disabled={value >= max}
        className={`${btnSize} flex items-center justify-center text-zinc-500 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
