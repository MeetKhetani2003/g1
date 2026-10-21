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
  Stethoscope,
  Sparkles,
  FileText,
  HelpCircle,
  Mail,
  HeartPulse,
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

// Sleek avatar component with resilient error fallback
function UserAvatar({ user, className = "h-8 w-8", size = 32 }) {
  const [imgError, setImgError] = useState(false);

  const rawName = user?.name || "";
  const isCode = rawName.toLowerCase().startsWith("code");
  const displayName = isCode ? (user?.healthId || "G1 Member") : rawName || "Member";
  const initial = displayName
    .replace(/^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, "")
    .trim()
    .charAt(0)
    .toUpperCase() || "G";

  const photo = user?.picture || user?.photo;

  if (photo && !imgError) {
    return (
      <img
        src={photo}
        alt={displayName}
        onError={() => setImgError(true)}
        className={cn("rounded-full object-cover ring-2 ring-teal-brand/30 shrink-0", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-teal-600 via-teal-500 to-emerald-400 font-bold text-white shadow-2xs ring-2 ring-teal-brand/30",
        className
      )}
      style={{ fontSize: Math.max(11, Math.round(size * 0.42)) }}
      aria-label={displayName}
    >
      {initial}
    </div>
  );
}

// Clean helper for user display name
function getShortDisplayName(user) {
  if (!user?.name) return "Member";
  if (user.name.toLowerCase().startsWith("code")) {
    return user.healthId || "G1 Member";
  }
  return user.name.split(" ")[0];
}

export default function Header() {
  const { user, openLoginModal, loginWithGoogle, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const moreRef = useRef(null);
  const userMenuRef = useRef(null);
  const closeTimer = useRef(null);
  const moreCloseTimer = useRef(null);
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
    setMoreOpen(false);
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
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        setMoreOpen(false);
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

  const openMore = () => {
    if (moreCloseTimer.current) clearTimeout(moreCloseTimer.current);
    setMoreOpen(true);
  };
  const scheduleMoreClose = () => {
    if (moreCloseTimer.current) clearTimeout(moreCloseTimer.current);
    moreCloseTimer.current = setTimeout(() => setMoreOpen(false), 140);
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden bg-navy text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[12.5px]">
          <div className="flex items-center gap-4 text-white/80">
            <p className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-white/95">G1 Healthcare Network</span>
              <span className="text-white/40">·</span>
              <span className="text-white/70">Universal Healthcare Aggregator</span>
            </p>
            <span className="text-white/40">|</span>
            <Link
              to="/ambulance"
              className="inline-flex items-center gap-1.5 font-bold text-rose-300 transition hover:text-white"
            >
              <Ambulance className="h-3.5 w-3.5 text-rose-400" />
              <span>24x7 Emergency: 108 / 102</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-white/80">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 font-semibold text-teal-300 transition hover:bg-white/20 hover:text-white"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Partner With Us / Register</span>
            </Link>
            <span className="text-white/30">|</span>
            <Link to="/how-it-works" className="transition hover:text-white">How It Works</Link>
            <Link to="/contact" className="transition hover:text-white">Contact</Link>
            <Link to="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link to="/terms" className="transition hover:text-white">Terms</Link>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-all duration-300",
          scrolled ? "border-line shadow-[0_6px_24px_-8px_rgba(11,37,69,0.14)]" : "border-slate-100 shadow-2xs"
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-2 px-4 sm:px-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3 transition hover:opacity-95"
            aria-label="G1 Healthcare Aggregator home"
          >
            <img
              src="/logo.png"
              alt="G1 Healthcare Aggregator"
              className="h-11 w-auto sm:h-13 max-w-[210px] sm:max-w-[240px] object-contain"
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
                <span className="block font-display text-base font-extrabold text-navy">G1 Healthcare</span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "#02C39A" }}>Aggregator</span>
              </span>
            </span>
          </Link>

          {/* Desktop Clean Nav */}
          <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex" aria-label="Primary">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-2 text-[14px] font-semibold whitespace-nowrap shrink-0 transition",
                  isActive
                    ? "bg-navy-50 text-navy font-bold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-navy"
                )
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/doctors"
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-2 text-[14px] font-semibold whitespace-nowrap shrink-0 transition",
                  isActive
                    ? "bg-navy-50 text-navy font-bold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-navy"
                )
              }
            >
              Doctors
            </NavLink>

            <NavLink
              to="/bimari-aur-doctor"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px] font-semibold whitespace-nowrap shrink-0 transition",
                  isActive
                    ? "bg-teal-50 text-teal-800 font-bold border border-teal-200/60"
                    : "text-slate-700 hover:bg-teal-50/70 hover:text-teal-900"
                )
              }
            >
              <Stethoscope className="h-4 w-4 text-teal-brand" />
              <span>Disease & Doctor</span>
            </NavLink>

            <NavLink
              to="/laboratories-and-medicals"
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-2 text-[14px] font-semibold whitespace-nowrap shrink-0 transition",
                  isActive
                    ? "bg-navy-50 text-navy font-bold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-navy"
                )
              }
            >
              Labs & Medicals
            </NavLink>

            {/* Services Dropdown */}
            <div
              ref={dropdownRef}
              className="relative shrink-0"
              onMouseEnter={openDropdown}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px] font-semibold whitespace-nowrap transition cursor-pointer",
                  servicesOpen || location.pathname.startsWith("/services")
                    ? "bg-navy-50 text-navy font-bold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-navy"
                )}
              >
                <span>Services</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform text-slate-500", servicesOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute left-1/2 top-full mt-2 w-[660px] -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-12px_rgba(11,37,69,0.22)] z-50"
                    role="menu"
                  >
                    <div className="grid grid-cols-2 gap-1.5 p-3.5 bg-white">
                      {services.map((s) => {
                        const Icon = iconMap[s.icon] || Building2;
                        return (
                          <Link
                            key={s.slug}
                            to={`/services/${s.slug}`}
                            className="group flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-teal-50/50"
                            role="menuitem"
                          >
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-dark transition group-hover:bg-navy group-hover:text-white">
                              <Icon className="h-4.5 w-4.5" />
                            </span>
                            <span className="min-w-0">
                              <span className="block font-display text-[13.5px] font-bold text-navy group-hover:text-teal-900 transition">
                                {s.title}
                              </span>
                              <span className="mt-0.5 block text-[12px] leading-snug text-slate-500 line-clamp-1">
                                {s.short}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between border-t border-line bg-slate-50/80 px-5 py-3">
                      <p className="text-[12.5px] text-slate-600">
                        Explore all <span className="font-bold text-navy">8+ healthcare specialties</span> across the network.
                      </p>
                      <Link
                        to="/explore"
                        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-teal-dark hover:text-navy transition"
                      >
                        Browse All Services <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ambulance Emergency Link */}
            <NavLink
              to="/ambulance"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px] font-semibold whitespace-nowrap shrink-0 transition",
                  isActive
                    ? "bg-rose-50 text-rose-700 font-bold border border-rose-200"
                    : "text-rose-600 hover:bg-rose-50/80 hover:text-rose-700"
                )
              }
            >
              <Ambulance className="h-4 w-4 text-rose-500" />
              <span>Ambulance</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </NavLink>

            {/* More Dropdown */}
            <div
              ref={moreRef}
              className="relative shrink-0"
              onMouseEnter={openMore}
              onMouseLeave={scheduleMoreClose}
            >
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-semibold whitespace-nowrap transition cursor-pointer",
                  moreOpen
                    ? "bg-navy-50 text-navy font-bold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-navy"
                )}
              >
                <span>More</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform text-slate-500", moreOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-xl z-50"
                    role="menu"
                  >
                    <div className="space-y-0.5">
                      <Link
                        to="/health-card"
                        className="flex items-center gap-3 rounded-xl p-2.5 text-navy hover:bg-teal-50/60 transition"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-dark">
                          <IdCard className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-display text-[13px] font-bold text-navy">Digital Health Card</p>
                          <p className="text-[11.5px] text-slate-500">ABHA & Universal Patient ID</p>
                        </div>
                      </Link>

                      <Link
                        to="/lab-tests"
                        className="flex items-center gap-3 rounded-xl p-2.5 text-navy hover:bg-teal-50/60 transition"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-dark">
                          <FlaskConical className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-display text-[13px] font-bold text-navy">Lab Tests & Packages</p>
                          <p className="text-[11.5px] text-slate-500">Pathology & Home Collection</p>
                        </div>
                      </Link>

                      <Link
                        to="/register"
                        className="flex items-center gap-3 rounded-xl p-2.5 text-navy hover:bg-teal-50/60 transition"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-dark">
                          <Building2 className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-display text-[13px] font-bold text-navy">Partner / Provider Portal</p>
                          <p className="text-[11.5px] text-slate-500">Join as Hospital, Lab or Doctor</p>
                        </div>
                      </Link>

                      <div className="my-1 border-t border-slate-100" />

                      <Link
                        to="/how-it-works"
                        className="flex items-center gap-3 rounded-xl p-2 text-navy hover:bg-slate-50 transition"
                      >
                        <HelpCircle className="h-4 w-4 text-slate-400 ml-2" />
                        <span className="text-[13px] font-semibold text-slate-700">How G1 Works</span>
                      </Link>

                      <Link
                        to="/contact"
                        className="flex items-center gap-3 rounded-xl p-2 text-navy hover:bg-slate-50 transition"
                      >
                        <Mail className="h-4 w-4 text-slate-400 ml-2" />
                        <span className="text-[13px] font-semibold text-slate-700">Contact & Support</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action Area */}
          <div className="hidden items-center gap-3 lg:flex shrink-0">
            {user ? (
              <div ref={userMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-3 shadow-2xs transition hover:border-teal-brand/40 hover:shadow-xs cursor-pointer whitespace-nowrap"
                >
                  <UserAvatar user={user} className="h-8 w-8" size={32} />
                  <div className="text-left leading-tight">
                    <p className="font-display text-[13px] font-bold text-navy truncate max-w-[100px]">
                      {getShortDisplayName(user)}
                    </p>
                    <p className="text-[10.5px] font-bold text-teal-dark tracking-tight">
                      {user.healthId || "Active User"}
                    </p>
                  </div>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-slate-400 transition-transform", userMenuOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-xl z-50"
                    >
                      <div className="border-b border-line px-3 py-2.5">
                        <p className="font-display text-[14px] font-bold text-navy">{user.name || "G1 Member"}</p>
                        <p className="text-[12px] text-muted truncate">{user.email || "No email"}</p>
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
                        <Link
                          to={`/medical-history/${user.healthId || "G1-849201"}`}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] font-semibold text-navy hover:bg-cream"
                        >
                          <FileText className="h-4 w-4 text-teal-brand" />
                          Medical Records
                        </Link>
                      </div>
                      <div className="border-t border-line pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
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
                onClick={() => loginWithGoogle()}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 text-[13.5px] font-bold text-navy shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-xs active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0"
              >
                <GoogleIcon className="h-4 w-4 shrink-0" />
                <span>Sign in</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate("/explore")}
              className="inline-flex h-10 items-center gap-2 rounded-full px-5 font-display text-[13.5px] font-bold text-white transition hover:opacity-95 active:scale-[0.98] whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #02C39A 0%, #00A896 100%)",
                boxShadow: "0 6px 18px -4px rgba(2,195,154,0.5)",
              }}
            >
              <Search className="h-4 w-4 shrink-0" />
              <span>Find Care</span>
            </button>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <Link
                to="/profile"
                className="flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="My Profile"
              >
                <UserAvatar user={user} className="h-9 w-9" size={36} />
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-navy hover:bg-slate-50 transition cursor-pointer"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
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
                  <img src="/logo.png" alt="G1 Healthcare" className="h-9 w-auto" />
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream text-navy cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <nav className="space-y-1" aria-label="Mobile">
                  <Link to="/" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 font-display font-bold text-navy hover:bg-cream">
                    Home
                  </Link>
                  <Link to="/doctors" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 font-display font-bold text-navy hover:bg-cream">
                    Find Doctors
                  </Link>

                  <Link to="/bimari-aur-doctor" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-display font-bold text-teal-800 bg-teal-50/60 hover:bg-teal-50">
                    <Stethoscope className="h-4 w-4 text-teal-dark shrink-0" />
                    <span>Disease & Doctor Search</span>
                  </Link>

                  <Link to="/laboratories-and-medicals" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-display font-bold text-navy hover:bg-cream">
                    <FlaskConical className="h-4 w-4 text-teal-dark shrink-0" />
                    <span>Labs & Medical Stores</span>
                  </Link>

                  <Link to="/ambulance" onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-xl px-3 py-2.5 font-display font-bold text-rose-600 bg-rose-50/60 hover:bg-rose-50">
                    <span className="flex items-center gap-2">
                      <Ambulance className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>24x7 Ambulance</span>
                    </span>
                    <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10.5px] font-bold text-white">Emergency</span>
                  </Link>

                  {/* Services accordion */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      aria-expanded={mobileServicesOpen}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 font-display font-bold text-navy hover:bg-cream cursor-pointer"
                    >
                      <span>Healthcare Services</span>
                      <ChevronDown className={cn("h-4 w-4 transition-transform text-slate-500", mobileServicesOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence initial={false}>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 pb-2 pl-2">
                            {services.map((s) => {
                              const Icon = iconMap[s.icon] || Building2;
                              return (
                                <Link
                                  key={s.slug}
                                  to={`/services/${s.slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-semibold text-slate-700 hover:bg-cream"
                                >
                                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-dark shrink-0">
                                    <Icon className="h-3.5 w-3.5" />
                                  </span>
                                  <span className="truncate">{s.title}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="my-2 border-t border-slate-100" />

                  <Link to="/health-card" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-display font-bold text-navy hover:bg-cream">
                    <IdCard className="h-4 w-4 text-teal-brand shrink-0" />
                    <span>Digital Health Card</span>
                  </Link>

                  <Link to="/lab-tests" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-display font-bold text-navy hover:bg-cream">
                    <FlaskConical className="h-4 w-4 text-teal-brand shrink-0" />
                    <span>Lab Tests & Checkups</span>
                  </Link>

                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-display font-bold text-teal-800 bg-teal-50/40 hover:bg-cream">
                    <ShieldCheck className="h-4 w-4 text-teal-dark shrink-0" />
                    <span>Partner & Multi-Role Register</span>
                  </Link>

                  <Link to="/how-it-works" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-[14px] font-semibold text-slate-700 hover:bg-cream">
                    How It Works
                  </Link>
                  <Link to="/contact" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-[14px] font-semibold text-slate-700 hover:bg-cream">
                    Contact & Helpdesk
                  </Link>
                </nav>
              </div>

              <div className="space-y-2.5 border-t border-line p-5 bg-white">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/explore");
                  }}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full font-display font-bold text-white shadow-xs cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #02C39A 0%, #00A896 100%)" }}
                >
                  <Search className="h-4.5 w-4.5" />
                  <span>Find Care Directory</span>
                </button>

                {user ? (
                  <div className="rounded-2xl border border-line bg-cream p-4">
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 group"
                    >
                      <UserAvatar user={user} className="h-10 w-10" size={40} />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-[14px] font-bold text-navy truncate group-hover:text-teal-dark transition">
                          {user.name || "G1 Member"}
                        </p>
                        <p className="text-[11.5px] text-muted truncate">{user.email || user.phone || "Active User"}</p>
                        <span className="mt-1 inline-flex items-center gap-1 rounded bg-teal-100/70 px-1.5 py-0.5 text-[10px] font-bold text-teal-800">
                          {user.healthId || "Connected"}
                        </span>
                      </div>
                    </Link>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link
                        to="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-teal-500/30 bg-white py-2 px-1 text-[12.5px] font-bold text-navy shadow-2xs hover:bg-teal-50 transition"
                      >
                        <User className="h-3.5 w-3.5 text-teal-brand" /> My Profile
                      </Link>
                      <Link
                        to="/health-card"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white py-2 px-1 text-[12.5px] font-bold text-navy shadow-2xs hover:bg-slate-50 transition"
                      >
                        <IdCard className="h-3.5 w-3.5 text-teal-brand" /> Health Card
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2 text-[12px] font-bold text-red-600 hover:bg-red-100 transition cursor-pointer"
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
                    className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white font-display font-bold text-navy shadow-2xs transition hover:bg-slate-50 cursor-pointer"
                  >
                    <GoogleIcon className="h-4.5 w-4.5" />
                    <span>Sign in with Google</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
