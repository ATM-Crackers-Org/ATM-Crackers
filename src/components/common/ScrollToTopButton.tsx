"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { useCart } from "@/context/CartContext";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    function toggleVisibility() {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Back to Top"
      className={`fixed z-40 p-3 rounded-full bg-zinc-900/90 text-white shadow-xl backdrop-blur-md border border-white/20 hover:bg-crimson hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center group ${
        count > 0 ? "bottom-36 right-4 md:bottom-8 md:right-8" : "bottom-20 right-4 md:bottom-8 md:right-8"
      }`}
    >
      <FaArrowUp className="text-sm transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}
