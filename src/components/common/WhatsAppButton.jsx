"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X } from "lucide-react";

export function WhatsAppIcon({ className = "h-7 w-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.89 12.04 8.01 12.21C8.14 12.37 9.73 14.83 12.16 15.88C12.74 16.13 13.19 16.28 13.54 16.39C14.12 16.57 14.65 16.55 15.07 16.49C15.54 16.42 16.51 15.9 16.71 15.33C16.92 14.76 16.92 14.27 16.86 14.17C16.79 14.07 16.63 14.01 16.39 13.89C16.14 13.77 14.91 13.16 14.68 13.08C14.45 13 14.29 12.96 14.12 13.2C13.96 13.45 13.49 14.01 13.35 14.17C13.21 14.33 13.07 14.35 12.83 14.23C12.58 14.11 11.79 13.85 10.85 13.01C10.12 12.36 9.63 11.55 9.49 11.31C9.35 11.07 9.47 10.93 9.6 10.81C9.71 10.7 9.85 10.51 9.97 10.37C10.09 10.23 10.13 10.13 10.21 9.97C10.29 9.81 10.25 9.66 10.19 9.54C10.13 9.42 9.66 8.27 9.47 7.79C9.28 7.33 9.09 7.39 8.94 7.38C8.8 7.38 8.64 7.38 8.53 7.38L8.53 7.33Z" />
    </svg>
  );
}

export default function WhatsAppFloatingButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [hasDismissedPrompt, setHasDismissedPrompt] = useState(false);

  // Phone number without spaces or plus sign for wa.me API
  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
  const defaultMessage =
    "Hello G1 Healthcare, I would like to enquire about doctor OPD appointments and health card support.";

  const whatsappUrl = `https://wa.me/${rawPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
    defaultMessage
  )}`;

  return (
    <div
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 print:hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Speech bubble / Tooltip */}
      <AnimatePresence>
        {!hasDismissedPrompt && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="hidden sm:flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur-md"
          >
            <div className="flex flex-col text-left">
              <span className="flex items-center gap-1.5 text-[12px] font-extrabold text-navy">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Chat on WhatsApp
              </span>
              <span className="text-[10.5px] text-muted">Instant OPD & Care Support</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHasDismissedPrompt(true);
              }}
              className="ml-1 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              aria-label="Dismiss WhatsApp tooltip"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with G1 Healthcare on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
      >
        {/* Animated pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 blur-sm group-hover:opacity-55 transition" />

        {/* WhatsApp Icon */}
        <span className="relative z-10">
          <WhatsAppIcon className="h-8 w-8 text-white transition-transform duration-200 group-hover:rotate-6" />
        </span>

        {/* Online Status Dot (Mobile & Desktop) */}
        <span className="absolute right-0 top-0 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
        </span>
      </motion.a>
    </div>
  );
}
