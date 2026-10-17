"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, FlaskConical } from "lucide-react";

export default function DemoModal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-[22px] bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-line p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <FlaskConical className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-[16px] font-extrabold text-navy">{title}</h3>
                  <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-amber-600">Demo · No real action</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-navy transition hover:bg-navy hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
