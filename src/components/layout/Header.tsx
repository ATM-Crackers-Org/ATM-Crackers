"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { searchProducts } from "@/lib/products";
import type { Product } from "@/lib/products";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Offers", href: "/shop?filter=deals" },
  { label: "Combos", href: "/shop?filter=combos" },
  { label: "Best Sellers", href: "/shop?filter=bestsellers" },
  { label: "Track Order", href: "/track-order" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setSearchResults(searchProducts(searchQuery).slice(0, 6));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white"
      } border-b border-zinc-200`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Left: Mobile hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className="text-xl">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              {/* Official Logo Image */}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-black flex items-center justify-center p-0.5 border border-zinc-800 shadow-md">
                <img
                  src="/images/logo.png"
                  alt="ATM Crackers Sivakasi"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-display font-black text-zinc-900 leading-none tracking-tight block">
                  ATM
                </span>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.25em] leading-none block">
                  CRACKERS
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3.5 py-2 text-xs lg:text-sm font-semibold text-zinc-700 hover:text-crimson hover:bg-zinc-50 rounded-xl transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-zinc-600 hover:text-crimson hover:bg-zinc-50 rounded-xl transition-colors"
                aria-label="Search"
              >
                <span className="text-base">🔍</span>
              </button>

              {/* Search dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-12 w-[300px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50 animate-slide-down">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100">
                    <span className="text-zinc-400 text-sm">🔍</span>
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search 191+ fireworks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-sm outline-none text-zinc-800 placeholder-zinc-400"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="text-zinc-400 hover:text-zinc-600 text-xs">✕</button>
                    )}
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto divide-y divide-zinc-50">
                      {searchResults.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/product/${p.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-linear-crimson flex items-center justify-center text-sm shrink-0">
                            🎇
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-zinc-800 line-clamp-1">{p.name}</p>
                            <p className="text-[10px] text-zinc-400">{p.category_name}</p>
                          </div>
                          <p className="text-xs font-bold text-crimson shrink-0">₹{p.price}</p>
                        </Link>
                      ))}
                    </div>
                  ) : searchQuery.length >= 2 ? (
                    <p className="px-4 py-6 text-center text-xs text-zinc-400">No results found</p>
                  ) : (
                    <div className="p-3">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2">Popular Searches</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Sparklers", "Flower Pots", "Rockets", "Bombs", "Fancy Shots"].map((s) => (
                          <button
                            key={s}
                            onClick={() => setSearchQuery(s)}
                            className="px-2.5 py-1 text-xs bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-zinc-600 hover:text-pink-600 hover:bg-zinc-50 rounded-xl transition-colors"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <span className="text-base">🤍</span>
              {wishlistCount > 0 && (
                <span className="absolute 0 top-1 right-1 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 bg-linear-crimson text-white px-3 sm:px-4 py-2 rounded-xl hover:opacity-95 transition-all shadow-md"
              aria-label={`Cart (${cartCount} items)`}
            >
              <span className="text-sm">🛒</span>
              <span className="text-xs sm:text-sm font-bold hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 sm:w-5 sm:h-5 bg-white text-crimson text-[10px] font-bold rounded-full flex items-center justify-center ml-0.5">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-zinc-800 hover:text-crimson hover:bg-zinc-50 rounded-xl transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      {/* Backdrop for open search */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10"
          onClick={() => setSearchOpen(false)}
        />
      )}
    </header>
  );
}
