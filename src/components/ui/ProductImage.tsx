"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  productName: string;
  categoryName?: string;
  sku?: string;
  className?: string;
  showLabel?: boolean;
  size?: "card" | "detail" | "thumb";
  aspectRatio?: string;
  imageUrl?: string;
}

export function ProductImage({
  productName,
  className = "",
  size = "card",
  imageUrl,
}: ProductImageProps) {
  const [imgError, setImgError] = useState(false);

  const heightClass =
    size === "detail"
      ? "h-64 sm:h-80 md:h-96"
      : size === "thumb"
      ? "h-16 w-16"
      : "h-36 sm:h-44";

  const hasValidImage = Boolean(
    imageUrl && !imgError && !imageUrl.includes("placehold.co")
  );

  if (hasValidImage && imageUrl) {
    return (
      <div
        className={`relative w-full ${heightClass} rounded-inherit overflow-hidden flex items-center justify-center bg-zinc-50 ${className}`}
      >
        <Image
          src={imageUrl}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
          unoptimized
        />
      </div>
    );
  }

  // Fallback: Show official ATM Crackers logo
  return (
    <div
      className={`relative w-full ${heightClass} rounded-inherit overflow-hidden flex flex-col items-center justify-center bg-zinc-950 p-3 select-none ${className}`}
    >
      <Image
        src="/images/logo.png"
        alt={productName || "ATM Crackers"}
        width={160}
        height={160}
        className="max-w-full max-h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}

// Compact Category Image Component
export function CategoryImage({
  categoryName,
  imageUrl,
  className = "",
}: {
  categoryName: string;
  imageUrl?: string;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (imageUrl && !imgError && !imageUrl.includes("placehold.co")) {
    return (
      <div
        className={`relative w-full h-28 sm:h-32 overflow-hidden flex items-center justify-center bg-zinc-50 ${className}`}
      >
        <Image
          src={imageUrl}
          alt={categoryName}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
          unoptimized
        />
      </div>
    );
  }

  // Fallback: Show official ATM Crackers logo
  return (
    <div
      className={`relative w-full h-28 sm:h-32 overflow-hidden flex items-center justify-center bg-zinc-950 p-2.5 ${className}`}
    >
      <Image
        src="/images/logo.png"
        alt={categoryName || "ATM Crackers"}
        width={120}
        height={120}
        className="max-w-full max-h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}
