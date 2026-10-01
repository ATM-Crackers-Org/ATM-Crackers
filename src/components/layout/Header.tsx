"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useFlyRocket } from "@/context/FlyRocketContext";
import type { Product } from "@/lib/products";
import { getProducts } from "@/services/product.service";
import { adaptApiProducts } from "@/utils/product.adapter";
import { usePopularSearches } from "@/hooks/usePopularSearches";
import { FaSearch, FaBars, FaDownload, FaFilePdf, FaFire } from "react-icons/fa";
import { FaCartShopping, FaRegHeart } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "My Orders", href: "/orders" },
];

function useIsActiveNav() {
  const pathname = usePathname();

  return useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }
      if (href === "/categories") {
        return pathname === "/categories" || pathname.startsWith("/categories/");
      }
      if (href === "/shop") {
        return pathname === "/shop" || pathname.startsWith("/product/");
      }
      if (href === "/orders") {
        return pathname === "/orders" || pathname.startsWith("/orders/");
      }
      return pathname === href;
    },
    [pathname]
  );
}

function DesktopNavLinks() {
  const isActive = useIsActiveNav();

  return (
    <nav className="hidden md:flex items-center gap-2">
      {NAV_LINKS.map((l) => {
        const active = isActive(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3.5 py-2 text-xs lg:text-sm font-semibold rounded-xl transition-all ${active
              ? "text-crimson bg-red-50/90 font-bold border border-red-200/80 shadow-xs"
              : "text-zinc-700 hover:text-crimson hover:bg-zinc-50 font-medium"
              }`}
          >
            {l.label}
          </Link>
        );
      })}

      {/* Download Price List Button */}

    </nav>
  );
}

function MobileNavLinks({ onSelect }: { onSelect: () => void }) {
  const isActive = useIsActiveNav();

  return (
    <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-3 space-y-1.5">
      {NAV_LINKS.map((l) => {
        const active = isActive(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onSelect}
            className={`block px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${active
              ? "text-crimson bg-red-50 font-bold border-l-4 border-crimson"
              : "text-zinc-800 hover:text-crimson hover:bg-zinc-50"
              }`}
          >
            {l.label}
          </Link>
        );
      })}

      {/* Mobile Price List Download Button */}
      <a
        href="/ATM_Crackers_Price_List_2026.pdf"
        download="ATM_Crackers_Price_List_2026.pdf"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onSelect}
        className="flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-white bg-crimson rounded-xl shadow-xs hover:bg-[#991B1B] transition-colors mt-2"
      >
        <span className="flex items-center gap-2">
          <FaFilePdf className="text-base" />
          Price List 2026 (PDF)
        </span>
        <FaDownload className="text-xs" />
      </a>
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isCartBouncing } = useFlyRocket();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCartCount = mounted ? cartCount : 0;
  const displayWishlistCount = mounted ? wishlistCount : 0;

  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const { categories: popularCategories, products: popularProducts } = usePopularSearches();

  useEffect(() => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q.length >= 3) {
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) {
      setSearchResults([]);
      return;
    }

    let active = true;
    const timer = setTimeout(() => {
      getProducts({ search: q })
        .then((data) => {
          if (active && data) {
            setSearchResults(adaptApiProducts(data).slice(0, 6));
          }
        })
        .catch(() => {
          if (active) setSearchResults([]);
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${scrolled
        ? "bg-white/95 backdrop-blur-md shadow-md"
        : "bg-white"
        } border-b border-zinc-200`}
    >
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Left: Mobile hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 rounded-lg cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <IoClose className="text-xl" /> : <FaBars className="text-base" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-black flex items-center justify-center p-0.5 border border-zinc-800 shadow-md">
                <Image
                  src="/images/logo.png"
                  alt="ATM Crackers Sivakasi"
                  fill
                  priority
                  sizes="48px"
                  className="object-contain p-0.5"
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

          {/* Center: Desktop Nav with Price List Button */}
          <Suspense fallback={<nav className="hidden md:flex items-center gap-1 w-48" />}>
            <DesktopNavLinks />
          </Suspense>

          <div className="flex items-center gap-1.5 sm:gap-2">

            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-zinc-600 hover:text-crimson hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer"
                aria-label="Search"
              >
                <FaSearch className="text-sm sm:text-base" />
              </button>

              {searchOpen && (
                <>
                  {/* Backdrop to close when tapping outside */}
                  <div
                    className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs transition-opacity"
                    onClick={() => setSearchOpen(false)}
                  />

                  {/* Responsive Search Dropdown */}
                  <div className="fixed inset-x-3 top-18 sm:top-20 z-50 max-w-lg mx-auto sm:max-w-none sm:w-96 sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden animate-slide-down">
                    <form
                      onSubmit={handleSearchSubmit}
                      className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100"
                    >
                      <FaSearch className="text-zinc-400 text-sm shrink-0" />
                      <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search fireworks..."
                        value={searchQuery}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSearchQuery(val);
                          if (val.trim().length < 2) setSearchResults([]);
                        }}
                        className="flex-1 text-sm outline-none text-zinc-800 placeholder-zinc-400"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                          className="text-zinc-400 hover:text-zinc-600 text-sm cursor-pointer p-0.5"
                          aria-label="Clear query"
                        >
                          <IoClose />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 ml-1 cursor-pointer pl-2 border-l border-zinc-200 sm:hidden"
                      >
                        Cancel
                      </button>
                    </form>

                    {searchResults.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto divide-y divide-zinc-50">
                        {searchResults.map((p) => (
                          <Link
                            key={p.slug}
                            href={`/product/${p.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-50 text-crimson flex items-center justify-center text-xs shrink-0">
                              <FaFire />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-zinc-800 line-clamp-1">{p.name}</p>
                              <p className="text-[10px] text-zinc-400">{p.category_name}</p>
                            </div>
                            <p className="text-xs font-bold text-crimson shrink-0">₹{p.price}</p>
                          </Link>
                        ))}
                      </div>
                    ) : searchQuery.trim().length > 0 && searchQuery.trim().length < 3 ? (
                      <p className="px-4 py-5 text-center text-xs text-amber-600 bg-amber-50/60 font-medium">
                        ✨ Type at least 3 characters to search fireworks...
                      </p>
                    ) : searchQuery.trim().length >= 3 ? (
                      <p className="px-4 py-6 text-center text-xs text-zinc-400">No results found</p>
                    ) : (
                      <div className="p-3 space-y-3">
                        {popularCategories.length > 0 && (
                          <div>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <span>📁 Popular Categories</span>
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {popularCategories.map((c) => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => {
                                    setSearchQuery(c.name);
                                    router.push(`/search?q=${encodeURIComponent(c.name)}`);
                                    setSearchOpen(false);
                                  }}
                                  className="px-2.5 py-1 text-xs bg-red-50 text-red-700 font-semibold rounded-lg hover:bg-crimson hover:text-white transition-colors cursor-pointer border border-red-200"
                                >
                                  {c.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {popularProducts.length > 0 && (
                          <div>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <span>💥 Popular Crackers</span>
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {popularProducts.map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => {
                                    setSearchQuery(p.name);
                                    router.push(`/search?q=${encodeURIComponent(p.name)}`);
                                    setSearchOpen(false);
                                  }}
                                  className="px-2.5 py-1 text-xs bg-zinc-100 text-zinc-700 font-medium rounded-lg hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer border border-zinc-200"
                                >
                                  {p.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-zinc-600 hover:text-pink-600 hover:bg-zinc-50 rounded-xl transition-colors"
              aria-label={`Wishlist (${displayWishlistCount} items)`}
            >
              <FaRegHeart className="text-base sm:text-lg" />
              {displayWishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {displayWishlistCount > 9 ? "9+" : displayWishlistCount}
                </span>
              )}
            </Link>

            <a
              href="/ATM_Crackers_Price_List_2026.pdf"
              download="ATM_Crackers_Price_List_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs lg:text-sm font-bold text-white bg-crimson hover:bg-[#991B1B] rounded-xl shadow-xs hover:shadow transition-all tracking-wide"
              title="Download ATM Crackers Price List 2026 PDF"
            >
              <FaDownload className="text-xs" />
              {(<span className="hidden md:flex ">Price List 2026</span>)}
            </a>

            {/* Cart Button */}
            <Link
              id="navbar-cart-btn"
              href="/cart"
              className={`relative flex items-center gap-2 bg-linear-crimson text-white px-3.5 sm:px-4 py-2 rounded-xl transition-all duration-300 shadow-md ${
                isCartBouncing
                  ? "scale-115 ring-4 ring-amber-400 shadow-xl shadow-amber-500/50"
                  : "hover:opacity-95"
              }`}
              aria-label={`Cart (${displayCartCount} items)`}
            >
              <FaCartShopping
                className={`text-sm transition-transform duration-300 ${
                  isCartBouncing ? "scale-130 -rotate-12 text-amber-300" : ""
                }`}
              />
              <span className="text-xs sm:text-sm font-bold hidden sm:inline">Cart</span>
              {(displayCartCount > 0 || isCartBouncing) && (
                <span
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-[10px] font-bold rounded-full flex items-center justify-center ml-0.5 transition-all duration-300 ${
                    isCartBouncing
                      ? "scale-135 bg-amber-300 text-zinc-950 shadow-md ring-2 ring-white"
                      : "bg-white text-crimson"
                  }`}
                >
                  {displayCartCount === 0 && isCartBouncing ? 1 : displayCartCount > 9 ? "9+" : displayCartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <Suspense fallback={<div className="md:hidden border-t border-zinc-200 bg-white px-4 py-3" />}>
          <MobileNavLinks onSelect={() => setMobileMenuOpen(false)} />
        </Suspense>
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
