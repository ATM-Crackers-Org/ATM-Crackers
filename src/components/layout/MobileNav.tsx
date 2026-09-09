"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

const NAV = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Products", href: "/shop", icon: "🎇" },
  { label: "Categories", href: "/categories", icon: "📦" },
  { label: "Combos", href: "/shop?filter=combos", icon: "🎁" },
  { label: "Cart", href: "/cart", icon: "🛒" },
];

function MobileNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams?.get("filter") || "";
  const { count } = useCart();

  function isItemActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/categories") return pathname === "/categories" || pathname.startsWith("/categories/");
    if (href === "/shop?filter=combos") return (pathname === "/shop" && filter === "combos") || pathname.startsWith("/combos");
    if (href === "/shop") return (pathname === "/shop" && filter !== "combos") || pathname.startsWith("/product/");
    if (href === "/cart") return pathname === "/cart";
    return pathname === href;
  }

  return (
    <div className="grid grid-cols-5 h-16">
      {NAV.map((item) => {
        const active = isItemActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative ${active ? "text-crimson font-bold" : "text-zinc-400 hover:text-zinc-700"
              }`}
          >
            <span className="text-xl relative">
              {item.icon}
              {item.label === "Cart" && count > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-crimson text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </span>
            <span className="text-[9px] font-semibold tracking-wide">
              {item.label}
            </span>
            {active && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-crimson rounded-b-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 md:hidden">
      <Suspense fallback={<div className="h-16" />}>
        <MobileNavContent />
      </Suspense>
    </nav>
  );
}
