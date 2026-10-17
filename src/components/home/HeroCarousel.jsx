"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "../../utils/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
  Building2,
  FlaskConical,
  HousePlus,
  Pill,
  Ambulance,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import { services } from "../../data/services";
import { cn } from "../../utils/cn";

const AUTOPLAY_MS = 5000;

const iconMap = {
  Building2,
  FlaskConical,
  HousePlus,
  Pill,
  Ambulance,
  HeartHandshake,
  ShieldCheck,
};

// Map each service to a hero slide
const heroSlides = services.map((s) => ({
  id: s.slug,
  eyebrow: s.category,
  headline: s.title,
  description: s.short,
  primaryCta: { label: "Explore Service", href: `/services/${s.slug}` },
  secondaryCta: { label: "Find Care", href: "/explore" },
  image: s.image,
  alt: s.title,
  icon: s.icon,
  features: s.features,
}));

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const timer = useRef(null);
  const reduceMotion = useReducedMotion();
  const touchX = useRef(null);

  const goTo = useCallback(
    (i, dir) => {
      setDirection(dir ?? (i > index ? 1 : -1));
      setIndex((i + heroSlides.length) % heroSlides.length);
    },
    [index]
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    if (paused || reduceMotion) return;
    timer.current = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(timer.current);
  }, [index, paused, next, reduceMotion]);

  const slide = heroSlides[index];
  const Icon = iconMap[slide.icon] || Building2;

  return (
    <section
      aria-label="Healthcare Services"
      className="relative min-h-[520px] h-[72vh] md:h-[68vh] lg:h-[75vh] max-h-[720px] overflow-hidden"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 48) { if (dx < 0) next(); else prev(); }
        touchX.current = null;
      }}
    >
      {/* BACKGROUND IMAGES */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id + "-bg"}
          className="absolute inset-0"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="h-full w-full object-cover object-center"
            loading={index === 0 ? "eager" : "lazy"}
            onError={(e) => { e.currentTarget.src = "/illustrations/care-pattern.svg"; }}
          />
        </motion.div>
      </AnimatePresence>

      {/* GRADIENT OVERLAYS — layered for strong text contrast */}
      {/* Base dark wash over entire image */}
      <div className="absolute inset-0 bg-[#0B2545]/55" />
      {/* Strong left-to-right gradient — full opaque on left, fades right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545] via-[#0B2545]/85 to-[#0B2545]/30" />
      {/* Top-to-bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B2545]/40 via-transparent to-[#0B2545]/70" />
      {/* Teal accent glow top-left */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#02C39A]/15 blur-[140px]" />

      {/* DOT GRID */}
      <div className="dot-grid absolute inset-0 opacity-15" aria-hidden="true" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Frosted dark panel behind text — guarantees readability on any image */}
            <div className="max-w-2xl rounded-3xl bg-[#0B2545]/40 p-6 backdrop-blur-sm sm:p-8 lg:max-w-3xl lg:p-10">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.id}
                  custom={direction}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  {/* Eyebrow badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#02C39A]/20 text-[#02C39A] ring-1 ring-[#02C39A]/40 backdrop-blur-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#02C39A]" />
                      <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#02C39A]">
                        {slide.eyebrow}
                      </span>
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="font-display text-[38px] font-extrabold leading-[1.06] tracking-tight sm:text-[52px] lg:text-[58px]"
                    style={{ color: "#ffffff", textShadow: "0 2px 20px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.8)" }}
                  >
                    {slide.headline}
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="max-w-xl text-[16px] font-medium leading-relaxed sm:text-[17px]"
                    style={{ color: "#ffffff", textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
                  >
                    {slide.description}
                  </motion.p>

                  {/* Feature pills */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="flex flex-wrap gap-2"
                  >
                    {slide.features.map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[12.5px] font-semibold text-white backdrop-blur-sm"
                      >
                        {f}
                      </span>
                    ))}
                  </motion.div>

                  {/* CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-wrap items-center gap-3 pt-1"
                  >
                    <Link
                      to={slide.primaryCta.href}
                      className="inline-flex h-[52px] items-center gap-2 rounded-full bg-[#02C39A] px-8 font-display text-[15px] font-bold text-white shadow-[0_12px_30px_-8px_rgba(2,195,154,0.65)] transition-all hover:bg-[#00A896] hover:scale-[1.03] active:scale-[0.98]"
                    >
                      {slide.primaryCta.label}
                      <ArrowUpRight className="h-5 w-5" />
                    </Link>
                    <Link
                      to={slide.secondaryCta.href}
                      className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 font-display text-[15px] font-bold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#0B2545] hover:border-white"
                    >
                      {slide.secondaryCta.label}
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* BOTTOM CONTROLS BAR */}
        <div className="relative z-10 border-t border-white/10 bg-[#0B2545]/60 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

            {/* Counter + dots */}
            <div className="flex items-center gap-4">
              <span className="hidden font-display text-[13px] font-bold tabular-nums text-white/50 sm:block" aria-live="polite">
                {String(index + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2" role="tablist" aria-label="Select service slide">
                {heroSlides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Slide ${i + 1}: ${s.headline}`}
                    onClick={() => goTo(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === index ? "w-8 bg-[#02C39A]" : "w-1.5 bg-white/30 hover:bg-white/60"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Service thumbnails — visible md+ */}
            <div className="hidden items-center gap-2 overflow-hidden md:flex" style={{ maxWidth: "55%" }}>
              {heroSlides.map((s, i) => {
                const SIcon = iconMap[s.icon] || Building2;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-pressed={i === index}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12px] font-bold transition-all duration-300 whitespace-nowrap",
                      i === index
                        ? "bg-[#02C39A] text-white shadow-[0_4px_12px_-4px_rgba(2,195,154,0.6)]"
                        : "border border-white/15 bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"
                    )}
                  >
                    <SIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="hidden xl:inline">{s.headline}</span>
                  </button>
                );
              })}
            </div>

            {/* Nav controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/15"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Resume auto-slide" : "Pause auto-slide"}
                aria-pressed={paused}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/15"
              >
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/15"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Autoplay progress bar */}
          {!paused && !reduceMotion && (
            <div className="h-0.5 overflow-hidden bg-white/10" aria-hidden="true">
              <motion.div
                key={index}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                className="h-full bg-gradient-to-r from-[#02C39A] to-[#00A896]"
              />
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE VERTICAL INDICATOR */}
      <div
        className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
        aria-hidden="true"
      >
        {heroSlides.map((_, i) => (
          <span
            key={i}
            className={cn(
              "block rounded-full transition-all duration-300",
              i === index ? "h-10 w-1 bg-[#02C39A]" : "h-4 w-0.5 bg-white/25"
            )}
          />
        ))}
      </div>
    </section>
  );
}
