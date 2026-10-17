"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "../../utils/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, MapPin, LayoutGrid, Stethoscope, Loader2, ArrowRight, RotateCcw } from "lucide-react";
import { providers, cities } from "../../data/providers";
import { serviceCategories } from "../../data/services";
import DemoBadge from "../ui/DemoBadge";

export default function SearchPanel({ compact = false }) {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All Cities");
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const quickChips = ["Cardiologist", "Diagnostics", "Pharmacy", "Specialist Doctors", "Home Care", "Checkup"];

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchCity = city === "All Cities" || p.city === city;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q);
      return matchCat && matchCity && matchQ;
    });
  }, [category, city, query]);

  const handleSearch = (e) => {
    e?.preventDefault();
    setLoading(true);
    setSearched(false);
    // Simulated demo latency with loading state
    setTimeout(() => {
      setResults(filtered.slice(0, 4));
      setLoading(false);
      setSearched(true);
    }, 650);
  };

  const handleReset = () => {
    setCategory("All");
    setCity("All Cities");
    setQuery("");
    setResults([]);
    setSearched(false);
  };

  const viewAll = () => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (city !== "All Cities") params.set("city", city);
    if (query.trim()) params.set("q", query.trim());
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <section aria-label="Search healthcare" className={compact ? "" : "relative z-20 -mt-2 bg-navy pb-10"}>
      <div className={compact ? "" : "mx-auto max-w-7xl px-4 sm:px-6"}>
        <div className="overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_24px_60px_-16px_rgba(11,37,69,0.25)]">
          <div className="border-b border-line bg-cream/60 px-5 py-4 sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-extrabold text-navy sm:text-xl">Find care near you</h2>
                <p className="text-[13.5px] text-muted">Search demonstration providers by category, city, or specialty.</p>
              </div>
              <DemoBadge label="Demonstration results" />
            </div>
          </div>

          <form onSubmit={handleSearch} className="grid gap-3 p-5 sm:px-7 sm:py-6 lg:grid-cols-[1fr_1fr_1.2fr_auto]">
            <label className="group">
              <span className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-muted">
                <LayoutGrid className="h-3.5 w-3.5" /> Service category
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-[52px] w-full appearance-none rounded-xl border border-line bg-white px-4 text-[15px] font-semibold text-navy transition focus:border-teal-brand"
              >
                {serviceCategories.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-muted">
                <MapPin className="h-3.5 w-3.5" /> City or location
              </span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-[52px] w-full appearance-none rounded-xl border border-line bg-white px-4 text-[15px] font-semibold text-navy transition focus:border-teal-brand"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-muted">
                <Stethoscope className="h-3.5 w-3.5" /> Provider or specialty
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Cardiologist, Diagnostics, Pharmacy…"
                className="h-[52px] w-full rounded-xl border border-line bg-white px-4 text-[15px] font-medium text-navy placeholder:font-normal placeholder:text-muted/70 focus:border-teal-brand"
                aria-label="Search provider or specialty"
              />
            </label>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-navy px-7 font-display text-[15px] font-bold text-white transition hover:bg-navy-800 disabled:opacity-70 lg:flex-none"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                {loading ? "Searching…" : "Search"}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-2 px-5 pb-4 sm:px-7">
            <span className="text-[12.5px] font-semibold text-muted">Popular:</span>
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setQuery(chip);
                  setLoading(true);
                  setSearched(false);
                  setTimeout(() => {
                    const q = chip.toLowerCase();
                    const r = providers.filter((p) =>
                      (p.name + " " + p.specialty + " " + p.type).toLowerCase().includes(q.split(" ")[0].toLowerCase())
                    ).slice(0, 4);
                    setResults(r.length ? r : filtered.slice(0, 4));
                    setLoading(false);
                    setSearched(true);
                  }, 500);
                }}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink transition hover:border-teal-brand hover:bg-teal-50 hover:text-teal-dark"
              >
                {chip}
              </button>
            ))}
            {(searched || query || category !== "All" || city !== "All Cities") && (
              <button
                type="button"
                onClick={handleReset}
                className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-bold text-muted transition hover:text-navy"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-3 border-t border-line bg-cream/50 p-5 sm:grid-cols-2 sm:px-7"
                aria-live="polite"
              >
                {[1, 2].map((n) => (
                  <div key={n} className="flex animate-pulse items-center gap-4 rounded-2xl border border-line bg-white p-4">
                    <div className="h-14 w-14 rounded-xl bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-2/3 rounded bg-slate-200" />
                      <div className="h-3 w-1/2 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {!loading && searched && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border-t border-line bg-cream/50 p-5 sm:px-7"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[14px] font-semibold text-navy" role="status">
                    {results.length > 0 ? (
                      <>Showing <span className="font-extrabold">{results.length}</span> of {filtered.length} demonstration matches</>
                    ) : (
                      <>No demonstration matches found</>
                    )}
                  </p>
                  <DemoBadge />
                </div>

                {results.length > 0 ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {results.map((p) => (
                      <li key={p.id} className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-3.5 transition hover:border-teal-brand hover:shadow-soft">
                        <img src={p.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" loading="lazy" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-[14.5px] font-bold text-navy">{p.name}</p>
                          <p className="truncate text-[12.5px] text-muted">{p.specialty} · {p.city}</p>
                          <p className="mt-0.5 text-[12px] font-bold text-teal-dark">★ {p.rating} <span className="font-medium text-muted">({p.reviews})</span></p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
                    <p className="font-display font-bold text-navy">No matches in the demo dataset</p>
                    <p className="mx-auto mt-1 max-w-sm text-[13.5px] text-muted">
                      Try “Diagnostics”, “Pharmacy”, or clear the filters to browse all sample providers.
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-navy-50 px-5 text-[13.5px] font-bold text-navy transition hover:bg-navy hover:text-white"
                    >
                      <RotateCcw className="h-4 w-4" /> Clear filters
                    </button>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[12.5px] text-muted">Sample data for illustration — not verified providers.</p>
                  <button
                    type="button"
                    onClick={viewAll}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-teal-brand px-6 font-display text-[14px] font-bold text-white transition hover:bg-teal-dark"
                  >
                    View all results <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
