import React from "react";
import { FaIndustry, FaWhatsapp } from "react-icons/fa";
import { FaCircleCheck, FaBoxOpen } from "react-icons/fa6";

const WHY_ITEMS = [
  {
    icon: FaIndustry,
    title: "Factory Direct Pricing",
    desc: "Direct supply from Sivakasi manufacturing hubs, ensuring genuine wholesale prices without middlemen markups.",
  },
  {
    icon: FaCircleCheck,
    title: "100% Tested Safety",
    desc: "Strict quality adherence and certified chemical formulations ensuring vibrant, safe, and reliable bursts.",
  },
  {
    icon: FaBoxOpen,
    title: "Triple-Layer Packaging",
    desc: "Shock-proof, moisture-sealed packaging protecting every fragile shot and sparkler during road transit.",
  },
  {
    icon: FaWhatsapp,
    title: "Dedicated WhatsApp Support",
    desc: "Real staff standing by to help with order tracking, custom quotation lists, and delivery updates.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-14 sm:py-16 bg-midnight text-white border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-bold text-gold uppercase tracking-widest mb-1.5">
            OUR SIVAKASI HERITAGE
          </p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold">
            Why Choose ATM Crackers?
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Over a decade of trusted fireworks delivery for Tamil Nadu families and events
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                className="bg-surface border border-zinc-800/80 rounded-2xl p-5 hover:border-gold/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-crimson/20 flex items-center justify-center text-lg text-gold mb-3.5">
                  <IconComponent />
                </div>
                <h3 className="text-sm font-bold text-zinc-100 mb-1.5">{item.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
