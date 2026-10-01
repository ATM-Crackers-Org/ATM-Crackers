"use client";

import React from "react";

interface CrackersLoaderProps {
  /** Optional loading message */
  text?: string;
  /** Sub-text under main message */
  subtext?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Optional extra classes */
  className?: string;
  /** If true, fills viewport height */
  fullHeight?: boolean;
}

export function CrackersLoader({
  text = "Igniting Sivakasi Crackers...",
  subtext = "Fetching freshest festival fireworks",
  size = "md",
  className = "",
  fullHeight = false,
}: CrackersLoaderProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const dimension = isSm ? "w-14 h-14" : isLg ? "w-32 h-32" : "w-24 h-24";
  const iconSize = isSm ? 24 : isLg ? 48 : 36;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-6 select-none ${
        fullHeight ? "min-h-[60vh]" : "py-12"
      } ${className}`}
      role="status"
      aria-label="Loading crackers"
    >
      {/* Animated Crackers & Chakkar Graphic */}
      <div className={`relative ${dimension} flex items-center justify-center mb-4`}>
        {/* Outer Glowing Pulsing Aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-red-500/20 to-yellow-400/20 blur-xl animate-pulse" />

        {/* Outer Catherine Wheel / Chakkar Ring */}
        <svg
          className="absolute inset-0 w-full h-full animate-cracker-spin"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Dashed Golden Spark Outer Ring */}
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="url(#goldGrad)"
            strokeWidth="2.5"
            strokeDasharray="6 8"
            strokeLinecap="round"
          />
          {/* Crimson Accents */}
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="#DC2626"
            strokeWidth="1.5"
            strokeDasharray="3 14"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD166" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
        </svg>

        {/* Counter-rotating Inner Spark Ring */}
        <svg
          className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-cracker-spin-reverse"
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle
            cx="40"
            cy="40"
            r="32"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeDasharray="4 6"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Radiating Spark Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="40"
              y1="12"
              x2="40"
              y2="17"
              stroke={i % 2 === 0 ? "#FFD166" : "#DC2626"}
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${angle} 40 40)`}
            />
          ))}
        </svg>

        {/* Floating Flying Sparks (CSS simulated fireworks particles) */}
        <div className="absolute inset-0 pointer-events-none">
          <span
            className="absolute top-1 left-2 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"
            style={{ animationDuration: "1s" }}
          />
          <span
            className="absolute top-2 right-3 w-2 h-2 rounded-full bg-red-500 animate-ping"
            style={{ animationDuration: "1.4s", animationDelay: "0.2s" }}
          />
          <span
            className="absolute bottom-2 left-4 w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping"
            style={{ animationDuration: "1.2s", animationDelay: "0.4s" }}
          />
          <span
            className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"
            style={{ animationDuration: "1.6s", animationDelay: "0.1s" }}
          />
        </div>

        {/* Center Festive Rocket & Spark Icon */}
        <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-crimson to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30 animate-fuse-burn">
          {/* Rocket / Fireworks SVG */}
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            className="text-white drop-shadow-md"
          >
            {/* Rocket Tip */}
            <path
              d="M12 2.5C12 2.5 16 6 16 11C16 13 15 15 15 15H9C9 15 8 13 8 11C8 6 12 2.5 12 2.5Z"
              fill="#FFFFFF"
            />
            {/* Rocket Fins */}
            <path d="M7 12L5 15H9L8 12H7Z" fill="#FFD166" />
            <path d="M17 12L19 15H15L16 12H17Z" fill="#FFD166" />
            {/* Rocket Stripe */}
            <rect x="9" y="8" width="6" height="2" rx="0.5" fill="#DC2626" />
            {/* Rocket Fuse Stick */}
            <line
              x1="12"
              y1="15"
              y2="21"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Sparkling Flame at Fuse Tip */}
            <circle cx="12" cy="21.5" r="1.5" fill="#FFE066" className="animate-ping" />
          </svg>
        </div>
      </div>

      {/* Sparkling Text */}
      <div className="space-y-1 max-w-xs">
        <div className="inline-flex items-center gap-1.5 text-zinc-900 font-bold text-sm sm:text-base">
          <span className="text-amber-500 text-sm animate-bounce">✨</span>
          <span>{text}</span>
          <span className="text-amber-500 text-sm animate-bounce delay-150">✨</span>
        </div>
        {subtext && (
          <p className="text-xs text-zinc-500 font-medium">{subtext}</p>
        )}
      </div>

      {/* Subtle festive progress line */}
      <div className="w-28 h-1 bg-zinc-200 rounded-full mt-3 overflow-hidden relative">
        <div className="absolute inset-y-0 bg-gradient-to-r from-amber-400 via-crimson to-yellow-400 w-1/2 rounded-full animate-[progress_1.2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

/**
 * Grid-level cracker loader to show during product sorting or filtering transitions
 */
export function CrackersGridLoader({ text }: { text?: string }) {
  return (
    <div className="w-full bg-white/70 backdrop-blur-xs rounded-3xl border border-amber-200/60 p-8 shadow-sm flex items-center justify-center my-6">
      <CrackersLoader
        size="md"
        text={text || "Loading Sivakasi Crackers..."}
        subtext="Fetching festival fireworks catalog"
      />
    </div>
  );
}
