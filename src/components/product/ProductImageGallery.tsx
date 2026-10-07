"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { DiscountBadge, Badge } from "@/components/ui/Badge";

interface ProductImageGalleryProps {
  images?: string[];
  productName: string;
  categoryName?: string;
  sku?: string;
  discountPercent?: number;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
}

export function ProductImageGallery({
  images = [],
  productName,
  discountPercent,
  isNewArrival,
  isTrending,
  isBestSeller,
}: ProductImageGalleryProps) {
  // Filter out empty or placeholder URLs
  const validImages = (images || []).filter(
    (img) => Boolean(img) && !img.includes("placehold.co")
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hasMultipleImages = validImages.length > 1;

  // Auto carousel: switch image every 3 seconds if multiple images exist
  useEffect(() => {
    if (!hasMultipleImages || isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % validImages.length);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasMultipleImages, isPaused, validImages.length]);

  function handlePrev() {
    setActiveIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  }

  function handleNext() {
    setActiveIndex((prev) => (prev + 1) % validImages.length);
  }

  const currentImage = validImages[activeIndex];
  const isCurrentFailed = failedImages[activeIndex] || !currentImage;

  return (
    <div className="flex flex-col gap-3.5">
      {/* Main Image Container */}
      <div
        className="relative w-full aspect-square bg-linear-to-b from-zinc-50/70 to-white rounded-3xl overflow-hidden border border-zinc-200/80 shadow-xs flex items-center justify-center group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Floating Badges */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
          {typeof discountPercent === "number" && discountPercent > 0 && (
            <DiscountBadge percent={discountPercent} />
          )}
          {isBestSeller && <Badge variant="bestseller" />}
          {isNewArrival && <Badge variant="new" />}
          {isTrending && !isBestSeller && <Badge variant="hot" />}
        </div>

        {/* Current Image */}
        {!isCurrentFailed ? (
          <div className="relative w-full h-full p-6 sm:p-8 flex items-center justify-center">
            <Image
              key={currentImage}
              src={currentImage}
              alt={`${productName} - Image ${activeIndex + 1}`}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
              onError={() =>
                setFailedImages((prev) => ({ ...prev, [activeIndex]: true }))
              }
              className="object-contain p-4 sm:p-6 transition-all duration-500 ease-out drop-shadow-sm select-none"
            />
          </div>
        ) : (
          /* Fallback when image fails or no image is available */
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-6 select-none">
            <Image
              src="/images/logo.png"
              alt={productName || "ATM Crackers"}
              width={180}
              height={180}
              style={{ width: "auto", height: "auto" }}
              className="max-w-[70%] max-h-[70%] object-contain drop-shadow-md"
            />
          </div>
        )}

        {/* Next / Previous Arrow Controls (Only when multiple images) */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-zinc-800 hover:text-crimson shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-10 border border-zinc-200/60"
              aria-label="Previous image"
              title="Previous image"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-zinc-800 hover:text-crimson shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-10 border border-zinc-200/60"
              aria-label="Next image"
              title="Next image"
            >
              <FaChevronRight className="text-xs" />
            </button>

            {/* Slide Index Badge */}
            <div className="absolute bottom-3 right-3 bg-zinc-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
              {activeIndex + 1} / {validImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails Row (Only when multiple images) */}
      {hasMultipleImages && (
        <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 no-scrollbar">
          {validImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 bg-white transition-all duration-200 shrink-0 cursor-pointer p-1 ${
                  isActive
                    ? "border-crimson ring-2 ring-crimson/30 shadow-md scale-102"
                    : "border-zinc-200 hover:border-zinc-400 opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
