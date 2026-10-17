"use client";

import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.12em]",
            dark ? "bg-white/10 text-emerald-brand" : "bg-teal-50 text-teal-dark"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-emerald-brand" : "bg-teal-brand")} />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "mt-4 font-display text-[28px] font-extrabold leading-[1.15] tracking-tight sm:text-[36px]",
          dark ? "text-white" : "text-navy"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-3 text-[15px] leading-relaxed sm:text-base", dark ? "text-white/70" : "text-muted")}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
