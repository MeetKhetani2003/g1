"use client";

import { useState } from "react";
import { Link } from "../../utils/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, MessageCircle } from "lucide-react";
import { faqs } from "../../data/faqs";
import SectionHeading from "../ui/SectionHeading";
import { cn } from "../../utils/cn";

export function AccordionItem({ faq, open, onToggle, index }) {
  const panelId = `faq-panel-${faq.id}`;
  const buttonId = `faq-button-${faq.id}`;
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[18px] border transition-all duration-300",
        open ? "border-teal-brand/40 bg-white shadow-card" : "border-line bg-white hover:border-teal-brand/30"
      )}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
      >
        <span className="flex items-start gap-3.5">
          <span className={cn(
            "mt-0.5 hidden font-display text-[13px] font-extrabold tabular-nums sm:block",
            open ? "text-teal-brand" : "text-muted/60"
          )}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-[15px] font-bold text-navy sm:text-[16px]">{faq.question}</span>
        </span>
        <span className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300",
          open ? "rotate-45 bg-teal-brand text-white" : "bg-cream text-navy"
        )}>
          <Plus className="h-5 w-5" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-[14px] leading-relaxed text-muted sm:px-6 sm:pl-[52px]">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqAccordion({ limit = 8 }) {
  const [openId, setOpenId] = useState(faqs[0]?.id);
  const visible = faqs.slice(0, limit);

  return (
    <section aria-labelledby="faq-heading" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div id="faq-heading">
          <SectionHeading
            eyebrow="FAQs"
            title="Questions, answered clearly"
            description="Everything about the demo experience, Health Card preview, sample providers, and partner registration."
          />
        </div>

        <div className="mt-10 space-y-3">
          {visible.map((faq, i) => (
            <AccordionItem
              key={faq.id}
              faq={faq}
              index={i}
              open={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[20px] bg-cream p-6 sm:flex-row">
          <p className="flex items-center gap-2.5 text-[14px] font-semibold text-navy">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white">
              <MessageCircle className="h-5 w-5" />
            </span>
            Still curious? Send us a demo message.
          </p>
          <Link
            to="/contact"
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-navy px-6 font-display text-[14px] font-bold text-white transition hover:bg-navy-800"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
