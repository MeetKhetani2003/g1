"use client";

import { useState } from "react";
import { Link } from "../../utils/navigation";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight, Clock } from "lucide-react";
import { providers } from "../../data/providers";
import SectionHeading from "../ui/SectionHeading";
import DemoBadge from "../ui/DemoBadge";
import DoctorBookingModal from "../booking/DoctorBookingModal";
import FacilityServiceBookingModal from "../booking/FacilityServiceBookingModal";

export function ProviderCard({ provider, index = 0, onBook }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="img-zoom group flex flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative h-[180px] overflow-hidden bg-navy-50">
        <img src={provider.image} alt={provider.name} loading="lazy" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = "/illustrations/care-pattern.svg"; }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(11,37,69,0.6)_100%)]" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-navy backdrop-blur">
            {provider.type}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur ${provider.openNow ? "bg-emerald-brand/90 text-white" : "bg-white/90 text-muted"}`}>
            <Clock className="h-3 w-3" /> {provider.openNow ? "Open now" : "Closed"}
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
          <p className="flex items-center gap-1 text-[12.5px] font-semibold text-white">
            <MapPin className="h-3.5 w-3.5" /> {provider.city} · {provider.distance}
          </p>
          <p className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-extrabold text-navy">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {provider.rating}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[16.5px] font-extrabold leading-snug text-navy clamp-2">{provider.name}</h3>
        <p className="mt-1 text-[13px] text-muted clamp-2">{provider.specialty}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {provider.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-cream px-2.5 py-1 text-[11.5px] font-semibold text-navy">{t}</span>
          ))}
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11.5px] font-semibold text-amber-700">Sample</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4 gap-2">
          <p className="text-[12px] text-muted">{provider.reviews} reviews</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onBook && onBook(provider)}
              className="inline-flex items-center gap-1 rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-navy-800 transition"
            >
              {provider.category === "Doctor" || provider.type === "Doctor" ? "Book Dr." : "Book"}
            </button>
            <Link
              to={`/explore?q=${encodeURIComponent(provider.name.split("—")[0].trim().split(" ").slice(0, 2).join(" "))}`}
              className="inline-flex items-center gap-1 text-[13px] font-bold text-teal-dark transition hover:text-navy"
            >
              View <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function FeaturedProviders() {
  const featured = providers.filter((p) => p.featured).slice(0, 6);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const handleBook = (p) => {
    if (p.category === "Doctor" || p.type === "Doctor") {
      setSelectedDoctor(p);
    } else {
      setSelectedFacility(p);
    }
  };

  return (
    <section aria-labelledby="featured-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div id="featured-heading" className="flex flex-col items-center gap-4">
        <SectionHeading
          eyebrow="Featured Providers"
          title="Sample providers across the network"
          description="A preview of the directory experience. Every card below is clearly labelled demonstration data — not verified or partnered."
        />
        <DemoBadge label="All listings are sample data" />
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p, i) => (
          <ProviderCard key={p.id} provider={p} index={i} onBook={handleBook} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          to="/explore"
          className="inline-flex h-[52px] items-center gap-2 rounded-full border-2 border-navy px-8 font-display text-[15px] font-bold text-navy transition hover:bg-navy hover:text-white"
        >
          Browse all demo providers <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Booking Modals */}
      <DoctorBookingModal
        doctor={selectedDoctor}
        isOpen={!!selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
      />

      <FacilityServiceBookingModal
        facility={selectedFacility}
        isOpen={!!selectedFacility}
        onClose={() => setSelectedFacility(null)}
      />
    </section>
  );
}
