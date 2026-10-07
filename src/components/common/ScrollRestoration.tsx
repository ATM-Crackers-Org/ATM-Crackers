"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ensures that navigating between pages always scrolls to the top (0, 0)
 * rather than preserving the previous page's scroll position.
 */
export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // Instant scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
