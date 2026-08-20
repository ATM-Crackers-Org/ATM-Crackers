const TRUST_ITEMS = [
  { icon: "🏭", label: "Factory Direct", desc: "Wholesale Sivakasi rates" },
  { icon: "✅", label: "Quality Checked", desc: "100% Tested for safety" },
  { icon: "📦", label: "Secure Packaging", desc: "Triple-layer insulated" },
  { icon: "🚚", label: "Fast Delivery", desc: "Doorstep tracking" },
  { icon: "💬", label: "WhatsApp Support", desc: "Staff assistance 24/7" },
];

export function TrustBar() {
  return (
    <section className="bg-white border-b border-zinc-200 py-4">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
            >
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs font-bold text-zinc-900 leading-tight">
                  {item.label}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
