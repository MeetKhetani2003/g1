"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ShieldCheck,
  HeartPulse,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  UserCheck,
  Key,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function GoogleIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function GoogleLoginModal() {
  const {
    isLoginModalOpen,
    closeLoginModal,
    loginWithGoogle,
    loginAsDemo,
    loginError,
    loginNotice,
    clearNotice,
  } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [customClientId, setCustomClientId] = useState("");
  const [showConfigHelper, setShowConfigHelper] = useState(false);
  const [hasClientId, setHasClientId] = useState(false);

  useEffect(() => {
    const envId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const savedId = typeof window !== "undefined" ? localStorage.getItem("g1_google_client_id") : "";
    const activeId = envId || savedId;
    const isValid = !!activeId && activeId.trim().length > 10 && !activeId.includes("your-google-client-id");
    setHasClientId(isValid);
    if (savedId) setCustomClientId(savedId);
  }, [isLoginModalOpen]);

  useEffect(() => {
    if (!isLoginModalOpen) {
      setIsRedirecting(false);
      return;
    }
    const onKey = (e) => {
      if (e.key === "Escape") closeLoginModal();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isLoginModalOpen, closeLoginModal]);

  const handleOAuthClick = () => {
    setIsRedirecting(true);
    loginWithGoogle(customClientId);
  };

  const saveCustomClientId = (e) => {
    e.preventDefault();
    if (!customClientId.trim()) return;
    try {
      localStorage.setItem("g1_google_client_id", customClientId.trim());
      setHasClientId(true);
      clearNotice();
      handleOAuthClick();
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLoginModal}
            className="fixed inset-0 bg-navy/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-[26px] border border-line bg-white shadow-2xl"
          >
            {/* Top decorative header */}
            <div className="relative bg-gradient-to-br from-navy via-navy-800 to-navy-700 px-6 pb-7 pt-7 text-white">
              {/* Close button */}
              <button
                type="button"
                onClick={closeLoginModal}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-brand/20 border border-teal-brand/30">
                  <HeartPulse className="h-5 w-5 text-teal-brand" />
                </div>
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-teal-brand">
                    G1 Healthcare
                  </span>
                  <p className="font-display text-sm font-semibold text-white/90">
                    Patient & Provider Portal
                  </p>
                </div>
              </div>

              <h2 className="mt-4 font-display text-2xl font-extrabold text-white">
                Sign in with Google
              </h2>
              <p className="mt-1 text-[13.5px] leading-relaxed text-white/75">
                Authenticate securely with your Google Account to connect your name, verified email, and phone number.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7">
              {/* Notice Banner */}
              {loginNotice && (
                <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50/90 p-3.5 text-[12.5px] text-amber-900">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <div>
                      <p className="font-bold">OAuth Credentials Notice</p>
                      <p className="mt-0.5 text-amber-800 leading-relaxed">{loginNotice}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {loginError && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-[12.5px] text-red-900">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <div>
                      <p className="font-bold">Google Sign-In Error</p>
                      <p className="mt-0.5 text-red-800 leading-relaxed">{loginError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Google Sign In Action */}
              <button
                type="button"
                onClick={handleOAuthClick}
                disabled={isRedirecting}
                className="group relative flex w-full items-center justify-center gap-3.5 rounded-full border border-slate-200 bg-white px-6 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200 hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-md active:scale-[0.99] disabled:opacity-75 cursor-pointer"
              >
                <GoogleIcon className="h-5 w-5 shrink-0" />
                <span className="font-display text-[15px] font-bold text-slate-800">
                  {isRedirecting ? "Connecting to Google..." : "Continue with Google"}
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Real profile indicators */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2 text-[11px] font-semibold text-slate-700">
                  <UserCheck className="mx-auto mb-1 h-3.5 w-3.5 text-teal-brand" />
                  Full Name
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2 text-[11px] font-semibold text-slate-700">
                  <Mail className="mx-auto mb-1 h-3.5 w-3.5 text-teal-brand" />
                  Verified Email
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2 text-[11px] font-semibold text-slate-700">
                  <Phone className="mx-auto mb-1 h-3.5 w-3.5 text-teal-brand" />
                  Phone Number
                </div>
              </div>

              {/* Quick Client ID Setup Helper (if user wants to paste their OAuth Client ID) */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowConfigHelper((v) => !v)}
                  className="flex items-center gap-1.5 text-[11.5px] font-semibold text-teal-dark hover:underline cursor-pointer"
                >
                  <Key className="h-3.5 w-3.5" />
                  {showConfigHelper ? "Hide Client ID input" : "Have your Google Client ID ready? Paste it here"}
                </button>

                {showConfigHelper && (
                  <form onSubmit={saveCustomClientId} className="mt-2.5 space-y-2 rounded-2xl border border-line bg-cream p-3 text-[12px]">
                    <label className="block text-[11.5px] font-semibold text-navy">
                      Google OAuth Client ID:
                      <input
                        type="text"
                        value={customClientId}
                        onChange={(e) => setCustomClientId(e.target.value)}
                        placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                        className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 font-mono text-[11px] text-ink outline-none focus:border-teal-brand"
                      />
                    </label>
                    <button
                      type="submit"
                      className="w-full rounded-full bg-navy py-1.5 font-display text-[12px] font-bold text-white transition hover:bg-navy-800 cursor-pointer"
                    >
                      Save & Sign in with Google
                    </button>
                    <p className="text-[10.5px] text-muted">
                      Or save it in <code className="font-mono text-navy">.env.local</code> as <code className="font-mono text-navy">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>
                    </p>
                  </form>
                )}
              </div>

              {/* Instant 1-Click Demo Login */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => loginAsDemo()}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-teal-100 bg-teal-50/70 px-5 py-2.5 text-[13.5px] font-bold text-teal-dark transition hover:bg-teal-100/80 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-teal-brand" />
                  Try 1-Click Instant Demo Login
                </button>
              </div>

              {/* Security info */}
              <div className="mt-4 space-y-1.5 rounded-2xl bg-cream p-3.5 text-[11.5px] text-muted">
                <div className="flex items-center gap-1.5 font-medium text-navy">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-brand" />
                  <span>Privacy-led healthcare authorization</span>
                </div>
                <p className="leading-relaxed">
                  Data is fetched directly from Google's secure APIs. No medical records or personal details are shared without your consent.
                </p>
              </div>

              {/* OAuth configuration info banner */}
              <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>
                  Authorized Callback: <code className="font-mono text-navy font-semibold">/api/auth/google/callback</code>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
