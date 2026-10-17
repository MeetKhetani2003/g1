"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "../utils/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, RotateCcw, Star, Clock, Loader2 } from "lucide-react";
import { providers, cities } from "../data/providers";
import { serviceCategories } from "../data/services";
import DemoBadge from "../components/ui/DemoBadge";
import DemoModal from "../components/ui/DemoModal";
import DoctorBookingModal from "../components/booking/DoctorBookingModal";
import FacilityServiceBookingModal from "../components/booking/FacilityServiceBookingModal";
import { cn } from "../utils/cn";

export default function ExplorePage() {
  const [params, setParams] = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "All");
  const [city, setCity] = useState(params.get("city") || "All Cities");
  const [query, setQuery] = useState(params.get("q") || "");
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState("rating");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: "details", provider: null });
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [selectedFacilityForBooking, setSelectedFacilityForBooking] = useState(null);

  const handleOpenBooking = (p) => {
    if (p.category === "Doctor" || p.type === "Doctor") {
      setSelectedDoctorForBooking(p);
    } else {
      setSelectedFacilityForBooking(p);
    }
  };

  // Simulate initial load
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Sync URL when filters change (debounced for query via effect)
  useEffect(() => {
    const next = new URLSearchParams();
    if (category !== "All") next.set("category", category);
    if (city !== "All Cities") next.set("city", city);
    if (query.trim()) next.set("q", query.trim());
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, city, query]);

  const filtered = useMemo(() => {
    let list = providers.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchCity = city === "All Cities" || p.city === city;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q);
      const matchOpen = !openOnly || p.openNow;
      return matchCat && matchCity && matchQ && matchOpen;
    });
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "reviews") list = [...list].sort((a, b) => b.reviews - a.reviews);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [category, city, query, openOnly, sort]);

  const reset = () => {
    setCategory("All");
    setCity("All Cities");
    setQuery("");
    setOpenOnly(false);
    setSort("rating");
  };

  const hasFilters = category !== "All" || city !== "All Cities" || query.trim() || openOnly;

  return (
    <div className="bg-cream">
      {/* Page hero */}
      <div className="border-b border-line bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-brand">
                Explore Care
              </p>
              <h1 className="mt-3 font-display text-[30px] font-extrabold text-white sm:text-[40px]">
                Discover healthcare providers
              </h1>
              <p className="mt-2 max-w-xl text-[15px] text-white/70">
                Filter the demonstration directory by category, city, and specialty. All results are sample data.
              </p>
            </div>
            <DemoBadge label="Demonstration directory" className="border-white/20 bg-white/10 text-white" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Filter bar */}
        <div className="rounded-[20px] border border-line bg-white p-4 shadow-soft sm:p-5">
          <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, specialty, or type…"
                className="h-[52px] w-full rounded-xl border border-line bg-cream/50 pl-11 pr-4 text-[15px] font-medium text-navy placeholder:font-normal placeholder:text-muted/70 focus:border-teal-brand focus:bg-white"
                aria-label="Search providers"
              />
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-[52px] rounded-xl border border-line bg-cream/50 px-4 text-[14.5px] font-semibold text-navy focus:border-teal-brand focus:bg-white"
              aria-label="Filter by category"
            >
              {serviceCategories.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>
              ))}
            </select>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-[52px] rounded-xl border border-line bg-cream/50 px-4 text-[14.5px] font-semibold text-navy focus:border-teal-brand focus:bg-white"
              aria-label="Filter by city"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-line pt-3.5">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-[13.5px] font-semibold text-navy">
              <button
                type="button"
                role="switch"
                aria-checked={openOnly}
                onClick={() => setOpenOnly((v) => !v)}
                className={cn(
                  "relative h-6 w-11 rounded-full transition",
                  openOnly ? "bg-teal-brand" : "bg-slate-200"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                  openOnly ? "left-[22px]" : "left-0.5"
                )} />
              </button>
              Open now only
            </label>
            <label className="ml-auto flex items-center gap-2 text-[13.5px] font-semibold text-navy">
              <SlidersHorizontal className="h-4 w-4 text-muted" />
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 rounded-lg border border-line bg-white px-3 text-[13.5px]"
                aria-label="Sort providers"
              >
                <option value="rating">Highest rated</option>
                <option value="reviews">Most reviewed</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
            {hasFilters && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-navy-50 px-4 text-[13px] font-bold text-navy transition hover:bg-navy hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Quick category filter">
          {serviceCategories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "h-10 shrink-0 rounded-full border px-5 text-[13.5px] font-bold transition",
                category === c
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-white text-ink hover:border-teal-brand hover:text-teal-dark"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[14.5px] font-semibold text-navy" role="status" aria-live="polite">
            {loading ? "Loading demonstration providers…" : (
              <>{filtered.length} demonstration result{filtered.length !== 1 ? "s" : ""}{hasFilters ? " for current filters" : ""}</>
            )}
          </p>
          <DemoBadge />
        </div>

        {/* Results */}
        {loading ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse overflow-hidden rounded-[20px] border border-line bg-white">
                <div className="h-[170px] bg-slate-200" />
                <div className="space-y-2.5 p-5">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                  <div className="h-8 w-full rounded-lg bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div layout className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <motion.article
                  layout
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="img-zoom group flex flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-soft transition hover:shadow-lift"
                >
                  <div className="relative h-[170px] overflow-hidden">
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(11,37,69,0.6)_100%)]" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-navy">
                      {p.type}
                    </span>
                    <span className={cn(
                      "absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
                      p.openNow ? "bg-emerald-brand/90 text-white" : "bg-white/90 text-muted"
                    )}>
                      <Clock className="h-3 w-3" /> {p.openNow ? "Open" : "Closed"}
                    </span>
                    <p className="absolute bottom-3 left-4 flex items-center gap-1 text-[12.5px] font-semibold text-white">
                      <MapPin className="h-3.5 w-3.5" /> {p.address}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="font-display text-[16px] font-extrabold text-navy">{p.name}</h2>
                    <p className="mt-1 text-[13px] text-muted">{p.specialty}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-[13px] font-bold text-navy">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {p.rating}
                      <span className="font-medium text-muted">({p.reviews} demo reviews) · {p.city} · {p.distance}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full bg-cream px-2.5 py-1 text-[11.5px] font-semibold text-navy">{t}</span>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2 border-t border-line pt-4">
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(p)}
                        className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-navy text-[13.5px] font-bold text-white transition hover:bg-navy-800 shadow-xs"
                      >
                        {p.category === "Doctor" || p.type === "Doctor" ? "Book Doctor" : "Book Facility"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ open: true, mode: "details", provider: p })}
                        className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-line text-[13.5px] font-bold text-navy transition hover:border-teal-brand hover:text-teal-dark"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-5 rounded-[20px] border border-dashed border-line bg-white p-10 text-center sm:p-14">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-muted">
              <Search className="h-7 w-7" />
            </span>
            <h2 className="mt-4 font-display text-xl font-extrabold text-navy">No demonstration matches</h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] text-muted">
              Nothing in the sample dataset matches these filters. Try a different category, city, or keyword — or reset to browse everything.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-navy px-6 font-display text-[14px] font-bold text-white transition hover:bg-navy-800"
            >
              <RotateCcw className="h-4 w-4" /> Reset all filters
            </button>
          </div>
        )}

        {/* Error-state demo note */}
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 text-[13px] text-muted">
          <Loader2 className="h-4 w-4 shrink-0" />
          <p>
            <span className="font-bold text-navy">Demo states included:</span> loading skeletons, result counts,
            empty results, and reset actions. Request buttons open demo dialogs — no backend is connected in Phase 1.
          </p>
        </div>
      </div>

      <DemoModal
        open={modal.open}
        onClose={() => setModal({ open: false, mode: "request", provider: null })}
        title={modal.mode === "request" ? "Request service — Demo" : "Provider details — Demo"}
      >
        {modal.provider && (
          <div>
            <div className="flex items-center gap-3 rounded-2xl bg-cream p-3">
              <img src={modal.provider.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="truncate font-display text-[15px] font-extrabold text-navy">{modal.provider.name}</p>
                <p className="truncate text-[12.5px] text-muted">{modal.provider.specialty}</p>
                <p className="mt-0.5 text-[12px] font-bold text-teal-dark">★ {modal.provider.rating} · {modal.provider.city} · Sample</p>
              </div>
            </div>
            {modal.mode === "request" ? (
              <div className="mt-4">
                <p className="text-[14px] leading-relaxed text-muted">
                  In the live product, a service request to <span className="font-bold text-navy">{modal.provider.name}</span> would
                  be created here with slot selection and confirmation. In Phase 1, no booking is made.
                </p>
                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    onClick={() => setModal({ open: false, mode: "request", provider: null })}
                    className="flex h-12 items-center justify-center rounded-full bg-navy font-display text-[14px] font-bold text-white"
                  >
                    Got it — close demo
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-[14px]">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-cream p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Type</p>
                    <p className="font-bold text-navy">{modal.provider.type}</p>
                  </div>
                  <div className="rounded-xl bg-cream p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted">City</p>
                    <p className="font-bold text-navy">{modal.provider.city}</p>
                  </div>
                </div>
                <p className="text-muted"><span className="font-bold text-navy">Address (sample):</span> {modal.provider.address}</p>
                <p className="text-muted"><span className="font-bold text-navy">Reviews (sample):</span> {modal.provider.reviews} · {modal.provider.rating}/5</p>
                <div className="flex flex-wrap gap-1.5">
                  {modal.provider.tags.map((t) => (
                    <span key={t} className="rounded-full bg-teal-50 px-3 py-1 text-[12px] font-bold text-teal-dark">{t}</span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const prov = modal.provider;
                    setModal({ open: false, mode: "details", provider: null });
                    handleOpenBooking(prov);
                  }}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-teal-brand font-display text-[14px] font-bold text-white transition hover:bg-teal-dark shadow-sm"
                >
                  {modal.provider.category === "Doctor" || modal.provider.type === "Doctor"
                    ? "Book Doctor Consultation"
                    : "Book Facility / Care Service"}
                </button>
              </div>
            )}
          </div>
        )}
      </DemoModal>

      {/* Doctor Consultation Booking Modal */}
      <DoctorBookingModal
        doctor={selectedDoctorForBooking}
        isOpen={!!selectedDoctorForBooking}
        onClose={() => setSelectedDoctorForBooking(null)}
      />

      {/* Facility & Service Booking Modal */}
      <FacilityServiceBookingModal
        facility={selectedFacilityForBooking}
        isOpen={!!selectedFacilityForBooking}
        onClose={() => setSelectedFacilityForBooking(null)}
      />
    </div>
  );
}
