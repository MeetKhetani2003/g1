"use client";

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "../../utils/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  FlaskConical,
  HousePlus,
  Pill,
  Ambulance,
  HeartHandshake,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Search,
  User,
  ArrowRight,
  LogOut,
  IdCard,
  Phone,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { services } from "../../data/services";
import { useAuth } from "../../context/AuthContext";
import { GoogleIcon } from "../auth/GoogleLoginModal";

const iconMap = {
  Building2,
  FlaskConical,
  HousePlus,
  Pill,
  Ambulance,
  HeartHandshake,
  ShieldCheck,
};

const NAV = [
  { label: "Home", to: "/" },
  { label: "Doctors", to: "/doctors" },
  { label: "Explore Care", to: "/explore" },
  { label: "Lab Tests", to: "/lab-tests" },
  { label: "Health Card", to: "/profile" },
  { label: "How It Works", to: "/how-it-works" },
];

export default function Header() {
  const { user, openLoginModal, loginWithGoogle, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const closeTimer = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        setMobileOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const openDropdown = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 140);
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden bg-navy text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[13px]">
          <p className="flex items-center gap-2 text-white/80">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-brand" />
            Phase 1 — Premium UI Foundation · All listings are demonstration data
          </p>
          <div className="flex items-center gap-5 text-white/80">
            <Link to="/contact" className="transition hover:text-white">Contact</Link>
            <Link to="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link to="/terms" className="transition hover:text-white">Terms</Link>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-all duration-300",
          scrolled ? "border-line shadow-[0_6px_24px_-8px_rgba(11,37,69,0.18)]" : "border-transparent"
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="G1 Healthcare Aggregator home">
            <img
              src="/logo.png"
              alt="G1 Healthcare Aggregator"
              className="h-12 w-auto sm:h-14"
              width="240"
              height="68"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <span style={{ display: "none" }} className="items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy font-display text-lg font-extrabold text-white">
                G1
              </span>
              <span className="leading-tight">
                <span className="block font-display text-lg font-extrabold text-navy">G1 Healthcare</span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#02C39A" }}>Aggregator</span>
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-[14.5px] font-semibold transition",
                  isActive ? "bg-navy-50 text-navy" : "text-ink hover:bg-slate-100 hover:text-navy"
                )
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/doctors"
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-[14.5px] font-semibold transition",
                  isActive ? "bg-navy-50 text-navy" : "text-ink hover:bg-slate-100 hover:text-navy"
                )
              }
            >
              Doctors
            </NavLink>

            {/* Services dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-[14.5px] font-semibold transition",
                  servicesOpen || location.pathname.startsWith("/services")
                    ? "bg-navy-50 text-navy"
                    : "text-ink hover:bg-slate-100 hover:text-navy"
                )}
              >
                Services
                <ChevronDown className={cn("h-4 w-4 transition-transform", servicesOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-1/2 top-full mt-3 w-[640px] -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-12px_rgba(11,37,69,0.25)]"
                    role="menu"
                  >
                    <div className="grid grid-cols-2 gap-1 p-3">
                      {services.map((s) => {
                        const Icon = iconMap[s.icon] || Building2;
                        return (
                          <Link
                            key={s.slug}
                            to={`/services/${s.slug}`}
                            className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-cream"
                            role="menuitem"
                          >
                            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-dark transition group-hover:bg-navy group-hover:text-white">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span>
                              <span className="block font-display text-[14px] font-bold text-navy">{s.title}</span>
                              <span className="mt-0.5 block text-[13px] leading-snug text-muted clamp-2">{s.short}</span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between border-t border-line bg-cream px-5 py-3">
                      <p className="text-[13px] text-muted">Not sure where to start? Browse everything.</p>
                      <Link to="/explore" className="inline-flex items-center gap-1 text-[13.5px] font-bold text-teal-dark hover:text-navy">
                        View all care <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {NAV.slice(2).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-2 text-[14.5px] font-semibold transition",
                    isActive ? "bg-navy-50 text-navy" : "text-ink hover:bg-slate-100 hover:text-navy"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden items-center gap-2.5 lg:flex">
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-2 pr-3.5 shadow-sm transition hover:border-teal-brand/40 hover:shadow"
                >
                  <img
                    src={user.picture || "/brand/g1-icon.svg"}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-teal-brand/30"
                  />
                  <div className="text-left">
                    <p className="font-display text-[13px] font-bold text-navy leading-tight line-clamp-1 max-w-[100px]">
                      {user.name.split(" ")[0]}
                    </p>
                    <p className="text-[10px] font-semibold text-teal-dark tracking-wide">
                      {user.healthId || "Active"}
                    </p>
                  </div>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-muted transition-transform", userMenuOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-xl"
                    >
                      <div className="border-b border-line px-3 py-2.5">
                        <p className="font-display text-[14px] font-bold text-navy">{user.name}</p>
                        <p className="text-[12px] text-muted truncate">{user.email}</p>
                        {user.phone ? (
                          <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] font-medium text-slate-600">
                            <Phone className="h-3 w-3 text-teal-brand" /> {user.phone}
                          </p>
                        ) : null}
                        <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-dark">
                          ID: {user.healthId || "Connected"}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] font-semibold text-navy hover:bg-cream"
                        >
                          <IdCard className="h-4 w-4 text-teal-brand" />
                          My Profile & Health Card
                        </Link>
                      </div>
                      <div className="border-t border-line pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] font-semibold text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={loginWithGoogle}
                className="inline-flex h-11 items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 text-[14px] font-bold text-navy shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] cursor-pointer"
              >
                <GoogleIcon className="h-4 w-4" />
                <span>Sign in with Google</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate("/explore")}
              className="inline-flex h-11 items-center gap-2 rounded-full px-6 font-display text-[14.5px] font-bold text-white transition hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #02C39A 0%, #00A896 100%)", boxShadow: "0 8px 22px -6px rgba(2,195,154,0.55)" }}
            >
              <Search className="h-[18px] w-[18px]" />
              Find Care
            </button>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <Link
                to="/profile"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-500/40 ring-2 ring-teal-brand/20 overflow-hidden shrink-0 shadow-xs"
                aria-label="My Profile"
              >
                <img
                  src={user.picture || "/brand/g1-icon.svg"}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-navy"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-navy/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-[380px] flex-col bg-white shadow-2xl lg:hidden"
              role="dialog"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <span className="flex items-center gap-2">
                  <img src="/logo.png" alt="G1 Healthcare" className="h-10 w-auto" />
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-navy"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <nav className="space-y-1" aria-label="Mobile">
                  <Link to="/" className="block rounded-xl px-3 py-3 font-display font-bold text-navy hover:bg-cream">Home</Link>
                  <Link to="/doctors" className="block rounded-xl px-3 py-3 font-display font-bold text-navy hover:bg-cream">Doctors</Link>
                  <Link to="/explore" className="block rounded-xl px-3 py-3 font-display font-bold text-navy hover:bg-cream">Explore Care</Link>

                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    aria-expanded={mobileServicesOpen}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 font-display font-bold text-navy hover:bg-cream"
                  >
                    Services
                    <ChevronDown className={cn("h-4 w-4 transition-transform", mobileServicesOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pb-2 pl-2">
                          {services.map((s) => {
                            const Icon = iconMap[s.icon] || Building2;
                            return (
                              <Link
                                key={s.slug}
                                to={`/services/${s.slug}`}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-ink hover:bg-cream"
                              >
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-dark">
                                  <Icon className="h-4 w-4" />
                                </span>
                                {s.title}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Link to="/lab-tests" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-3 font-display font-bold text-navy hover:bg-cream">Lab Tests & Checkups</Link>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-3 font-display font-bold text-navy hover:bg-cream">
                    <User className="h-4 w-4 text-teal-dark" /> My Profile
                  </Link>
                  <Link to="/health-card" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-3 font-display font-bold text-navy hover:bg-cream">
                    <IdCard className="h-4 w-4 text-teal-dark" /> G1 Health Card
                  </Link>
                  <Link to="/how-it-works" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-3 font-display font-bold text-navy hover:bg-cream">How It Works</Link>
                  <Link to="/partner" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-3 font-display font-bold text-navy hover:bg-cream">Partner With Us</Link>
                  <Link to="/contact" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-3 font-display font-bold text-navy hover:bg-cream">Contact</Link>
                </nav>
              </div>

              <div className="space-y-2.5 border-t border-line p-5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/explore");
                  }}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full font-display font-bold text-white shadow-sm"
                  style={{ background: "linear-gradient(135deg, #02C39A 0%, #00A896 100%)" }}
                >
                  <Search className="h-5 w-5" /> Find Care
                </button>
                {user ? (
                  <div className="rounded-2xl border border-line bg-cream p-4">
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 group"
                    >
                      <img
                        src={user.picture || "/brand/g1-icon.svg"}
                        alt={user.name}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-teal-brand/30 group-hover:ring-teal-brand transition shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-[14px] font-bold text-navy truncate group-hover:text-teal-dark transition">
                          {user.name}
                        </p>
                        <p className="text-[12px] text-muted truncate">{user.email}</p>
                        {user.phone ? (
                          <p className="text-[11.5px] font-medium text-slate-600 truncate">{user.phone}</p>
                        ) : null}
                      </div>
                    </Link>

                    {/* Profile & Health Card Actions Grid */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link
                        to="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-teal-500/30 bg-white py-2 px-1 text-[13px] font-bold text-navy shadow-2xs hover:bg-teal-50 transition"
                      >
                        <User className="h-4 w-4 text-teal-brand" /> My Profile
                      </Link>
                      <Link
                        to="/health-card"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white py-2 px-1 text-[13px] font-bold text-navy shadow-2xs hover:bg-slate-50 transition"
                      >
                        <IdCard className="h-4 w-4 text-teal-brand" /> Health Card
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2 text-[12.5px] font-bold text-red-600 hover:bg-red-100 transition"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      loginWithGoogle();
                    }}
                    className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white font-display font-bold text-navy shadow-sm transition hover:bg-slate-50 cursor-pointer"
                  >
                    <GoogleIcon className="h-5 w-5" /> Sign in with Google
                  </button>
                )}
                <p className="pt-1 text-center text-[12px] text-muted">Phase 1 demo · No real bookings</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
