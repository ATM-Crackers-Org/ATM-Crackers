"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/services/category.service";
import type { Category } from "@/types/category";
import {
  FaIndustry,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaFacebook,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { FaShieldHalved, FaLocationDot, FaFilePdf } from "react-icons/fa6";

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let mounted = true;
    getCategories()
      .then((cats) => {
        if (mounted && cats) {
          setCategories(cats.slice(0, 6));
        }
      })
      .catch(() => { });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer className="bg-midnight text-zinc-300 border-t border-zinc-800">
      {/* Top Red Contact Ribbon from Shop Card */}
      <div className="bg-gradient-to-r from-crimson-dark via-crimson to-crimson-dark text-white border-b border-red-800/50 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs sm:text-sm font-semibold">
          {/* Numbers */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="https://wa.me/918526352935"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-amber transition-colors"
            >
              <FaWhatsapp className="text-base text-emerald-300" />
              <span>+91 85263 52935</span>
            </a>
            <a
              href="https://wa.me/918056566845"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-amber transition-colors"
            >
              <FaWhatsapp className="text-base text-emerald-300" />
              <span>+91 80565 66845</span>
            </a>
          </div>

          {/* Socials & Email */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-amber transition-colors"
            >
              <FaFacebook className="text-base text-blue-300" />
              <span>ATM CRACKERS</span>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-amber transition-colors"
            >
              <FaYoutube className="text-base text-red-300" />
              <span>ATM CRACKERS</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-amber transition-colors"
            >
              <FaInstagram className="text-base text-pink-300" />
              <span>ATM CRACKERS 2.0</span>
            </a>
            <a
              href="mailto:atmcrackers@gmail.com"
              className="flex items-center gap-2 hover:text-amber transition-colors"
            >
              <FaEnvelope className="text-base text-amber" />
              <span>atmcrackers@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center p-0.5 border border-zinc-800 shadow-md">
                <img
                  src="/images/logo.png"
                  alt="ATM Crackers Sivakasi"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-display font-black text-white leading-none tracking-tight block">
                  ATM
                </span>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.25em] leading-none block">
                  CRACKERS
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Wholesale & retail supplier of certified Sivakasi fireworks. 365 Days Shop Available with direct factory dispatch across Tamil Nadu & India.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-zinc-800 text-[10px] font-semibold text-zinc-300 rounded-lg inline-flex items-center gap-1.5">
                <FaIndustry className="text-amber text-xs" /> Sivakasi Hub
              </span>
              <span className="px-2.5 py-1 bg-zinc-800 text-[10px] font-semibold text-zinc-300 rounded-lg inline-flex items-center gap-1.5">
                <FaShieldHalved className="text-amber text-xs" /> Safe Transit
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3.5">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="text-zinc-400 hover:text-gold transition-colors">
                  Shop All Fireworks
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="text-zinc-400 hover:text-gold transition-colors">
                  2026 New Arrivals
                </Link>
              </li>
              <li>
                <a
                  href="/ATM_Crackers_Price_List_2026.pdf"
                  download="ATM_Crackers_Price_List_2026.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber hover:text-gold transition-colors font-semibold flex items-center gap-1.5"
                >
                  <FaFilePdf className="text-xs text-red-400" />
                  <span>Download Price List 2026</span>
                </a>
              </li>
              <li>
                <Link href="/track-order" className="text-zinc-400 hover:text-gold transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-zinc-400 hover:text-gold transition-colors">
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3.5">
              Popular Categories
            </h3>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="text-zinc-400 hover:text-gold transition-colors flex items-center gap-1.5"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Support & Address */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3.5">
              Shop Address & Contact
            </h3>
            <div className="space-y-3 text-xs text-zinc-400 mb-4">
              <div className="flex items-start gap-2.5">
                <FaLocationDot className="text-gold text-sm shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-bold text-white">ATM CRACKERS</p>
                  <p>Kamarajar School Opposite,</p>
                  <p>Sattur Main Road, Meenampatti,</p>
                  <p className="text-amber font-semibold">Sivakasi - 626 128.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <FaPhone className="text-gold text-xs shrink-0 mt-1" />
                <div className="space-y-0.5">
                  <a href="tel:+918526352935" className="hover:text-white block">+91 85263 52935</a>
                  <a href="tel:+918056566845" className="hover:text-white block">+91 80565 66845</a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <FaEnvelope className="text-gold text-xs shrink-0" />
                <a href="mailto:atmcrackers@gmail.com" className="hover:text-white">
                  atmcrackers@gmail.com
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="https://wa.me/918526352935"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl hover:bg-[#1ebd5a] transition-colors"
              >
                <FaWhatsapp className="text-sm" />
                <span>WhatsApp 1</span>
              </a>
              <a
                href="https://wa.me/918056566845"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl hover:bg-[#1ebd5a] transition-colors"
              >
                <FaWhatsapp className="text-sm" />
                <span>WhatsApp 2</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-zinc-800/80 py-4 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
          <p>© 2026 ATM Crackers, Sivakasi. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>365 Days Shop Available</span>
            <span>•</span>
            <span>Safety Certified</span>
            <span>•</span>
            <span>Wholesale & Retail</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
