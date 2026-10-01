"use client";

import React, { useState, useEffect } from "react";
import { FaShieldHalved, FaTruckFast, FaLeaf, FaArrowRight } from "react-icons/fa6";
import { LuFileText } from "react-icons/lu";

const STORAGE_KEY = "atm_legal_notice_acknowledged";

export function LegalNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const acknowledged = localStorage.getItem(STORAGE_KEY);
      if (!acknowledged) {
        setIsOpen(true);
      }
    } catch {
      // In case localStorage is blocked in private browsing
      setIsOpen(true);
    }
  }, []);

  function handleAgree() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-notice-title"
    >
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-100 flex flex-col max-h-[92vh]">
        {/* Sleek Minimal Header */}
        <div className="p-6 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-crimson flex items-center justify-center text-lg shrink-0 border border-red-100">
              <FaShieldHalved />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-crimson">
                Statutory Compliance
              </span>
              <h2
                id="legal-notice-title"
                className="text-base sm:text-lg font-bold text-zinc-900 leading-tight"
              >
                Welcome to ATM Crackers
              </h2>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-3 leading-relaxed">
            To ensure safe, legal, and hassle-free festive celebrations, please take a moment to review our standard booking terms.
          </p>
        </div>

        {/* Minimalist Key Points */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Point 1 */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-200/70 text-zinc-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
              <LuFileText className="text-sm text-crimson" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-zinc-900">
                Enquiry &amp; Booking System
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                In compliance with the 2018 Supreme Court directives, this portal serves as a digital catalog and order estimation system. Orders submitted are confirmed via official enquiry followup.
              </p>
            </div>
          </div>

          {/* Point 2 */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-200/70 text-zinc-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
              <FaTruckFast className="text-xs text-amber-600" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-zinc-900">
                Safe Transport Logistics
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                All consignments are packed according to explosive safety guidelines and dispatched through registered transport carriers to your nearest delivery hub.
              </p>
            </div>
          </div>

          {/* Point 3 */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-200/70 text-zinc-700 flex items-center justify-center text-xs shrink-0 mt-0.5">
              <FaLeaf className="text-xs text-emerald-600" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-zinc-900">
                100% Genuine Green Fireworks
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                We supply authentic Sivakasi manufactured crackers adhering to statutory emission, decibel, and quality norms for eco-friendly celebrations.
              </p>
            </div>
          </div>
        </div>

        {/* Minimal Actions Footer */}
        <div className="p-6 pt-3 bg-zinc-50/60 border-t border-zinc-100 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleAgree}
            className="w-full py-3 px-4 bg-crimson hover:bg-[#991B1B] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>I Understand &amp; Continue</span>
            <FaArrowRight className="text-xs" />
          </button>
          <p className="text-[10px] text-zinc-400 text-center tracking-wide">
            ATM Crackers • Sivakasi, Tamil Nadu
          </p>
        </div>
      </div>
    </div>
  );
}

