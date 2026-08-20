"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const NAV = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Categories", href: "/categories", icon: "📦" },
  { label: "Search", href: "/search", icon: "🔍" },
  { label: "Orders", href: "/track-order", icon: "📋" },
  { label: "Cart", href: "/cart", icon: "🛒" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
                active ? "text-[#B91C1C]" : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              <span className="text-xl relative">
                {item.icon}
                {item.label === "Cart" && count > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#B91C1C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </span>
              <span className="text-[9px] font-semibold tracking-wide">
                {item.label}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#B91C1C] rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
