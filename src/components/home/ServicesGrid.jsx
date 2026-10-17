"use client";

import { Link } from "../../utils/navigation";
import { motion } from "framer-motion";
import {
  Building2, FlaskConical, HousePlus, Pill, Ambulance, HeartHandshake, ShieldCheck, ArrowUpRight, ArrowRight,
} from "lucide-react";
import { services } from "../../data/services";
import SectionHeading from "../ui/SectionHeading";

const iconMap = { Building2, FlaskConical, HousePlus, Pill, Ambulance, HeartHandshake, ShieldCheck };

export function ServiceCard({ service, index }) {
  const Icon = iconMap[service.icon] || Building2;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: "easeOut" }}
      className="img-zoom group relative flex flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <Link to={`/services/${service.slug}`} className="block" aria-label={`Explore ${service.title}`}>
        <div className="relative h-[190px] overflow-hidden bg-navy-50">
          <img src={service.image} alt={service.title} loading="lazy" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = "/illustrations/care-pattern.svg"; }} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(11,37,69,0.55)_100%)]" />
          <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-navy shadow-md backdrop-blur transition group-hover:bg-teal-brand group-hover:text-white">
            <Icon className="h-5 w-5" />
          </span>
          <span className="absolute bottom-3 left-4 rounded-full bg-navy/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur">
            {service.category}
          </span>
          <span className="absolute bottom-3 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy opacity-0 shadow transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight className="h-4.5 w-4.5" />
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-[17px] font-extrabold text-navy transition group-hover:text-teal-dark">
            {service.title}
          </h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted clamp-2">{service.short}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-teal-dark">
            Explore service
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function ServicesGrid() {
  return (
    <section aria-labelledby="services-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div id="services-heading">
        <SectionHeading
          eyebrow="Our Services"
          title="Everyday care, organized in one place"
          description="Eight connected categories — from hospitals and labs to home care and emergency support. Select any card to preview the demonstration detail page."
        />
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <ServiceCard key={s.slug} service={s} index={i} />
        ))}
      </div>
    </section>
  );
}
