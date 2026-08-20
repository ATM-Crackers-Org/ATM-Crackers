const REVIEWS = [
  {
    name: "Priya Sharma",
    location: "Chennai",
    rating: 5,
    review: "Amazing quality crackers! The fancy sky shots were spectacular. Packaging was very secure and delivery was quick. Will definitely order again!",
    verified: true,
    product: "Royal Premium Combo",
  },
  {
    name: "Karthik Rajan",
    location: "Coimbatore",
    rating: 5,
    review: "Best online crackers store I've tried. The 5000 Varnam was incredible — all shots went off continuously and smoothly. Great value for money.",
    verified: true,
    product: "5000 VARNAM Series",
  },
  {
    name: "Anitha Devi",
    location: "Madurai",
    rating: 5,
    review: "Very happy with the kids magical combo. Safe crackers that were a big hit with the children. Sparklers burned long and bright.",
    verified: true,
    product: "Kids Magical Combo",
  },
  {
    name: "Senthil Kumar",
    location: "Trichy",
    rating: 5,
    review: "Ordered for my daughter's wedding. The flower pots and repeating multicolour shots made the evening magical. Staff was very helpful on WhatsApp!",
    verified: true,
    product: "Mega Grand Box",
  },
];

export function CustomerReviews() {
  return (
    <section className="py-14 sm:py-16 bg-white border-b border-zinc-100">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-10">
          <p className="text-xs font-bold text-crimson uppercase tracking-widest mb-1">
            ⭐ REAL EXPERIENCES
          </p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900">
            What Our Customers Say
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            10,000+ satisfied families lighting up festivals with ATM Crackers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="bg-zinc-50 rounded-2xl p-5 border border-zinc-200/80 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber text-xs mb-2.5">
                  {"★".repeat(r.rating)}
                </div>

                <p className="text-xs text-zinc-700 leading-relaxed mb-3 line-clamp-4">
                  &quot;{r.review}&quot;
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-200">
                <p className="text-xs font-bold text-zinc-900">{r.name}</p>
                <p className="text-[10px] text-zinc-500">{r.location} • Verified Buyer</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
