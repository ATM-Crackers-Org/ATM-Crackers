"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FaHouse, FaFire, FaLayerGroup, FaFilePdf, FaCartShopping } from "react-icons/fa6";

const NAV = [
  { label: "Home", href: "/", icon: FaHouse, isDownload: false },
  { label: "Products", href: "/shop", icon: FaFire, isDownload: false },
  { label: "Categories", href: "/categories", icon: FaLayerGroup, isDownload: false },
  { label: "Price List", href: "/ATM_Crackers_Price_List_2026.pdf", icon: FaFilePdf, isDownload: true },
  { label: "Cart", href: "/cart", icon: FaCartShopping, isDownload: false },
];

function MobileNavContent() {
  const pathname = usePathname();
  const { count } = useCart();

  function isItemActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/categories") return pathname === "/categories" || pathname.startsWith("/categories/");
    if (href === "/shop") return pathname === "/shop" || pathname.startsWith("/product/");
    if (href === "/cart") return pathname === "/cart";
    return pathname === href;
  }

  return (
    <div className="grid grid-cols-5 h-16">
      {NAV.map((item) => {
        const active = isItemActive(item.href);
        const IconComponent = item.icon;

        if (item.isDownload) {
          return (
            <a
              key={item.href}
              href={item.href}
              download="ATM_Crackers_Price_List_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-0.5 transition-colors relative text-zinc-500 hover:text-crimson"
            >
              <span className="text-lg relative">
                <IconComponent />
              </span>
              <span className="text-[9px] font-semibold tracking-wide">
                {item.label}
              </span>
            </a>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
              active ? "text-crimson font-bold" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <span className="text-lg relative">
              <IconComponent />
              {item.label === "Cart" && count > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-crimson text-white text-[9px] font-bold rounded-full flex items-center justify-center">
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
