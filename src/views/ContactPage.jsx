"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, Loader2, MessageCircle, ShieldCheck, Clock } from "lucide-react";

const topics = ["General enquiry", "Health Card demo", "Partner onboarding", "Feedback", "Privacy question", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: topics[0], message: "", consent: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [refId, setRefId] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (form.phone.trim() && !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit number or leave blank.";
    if (form.message.trim().length < 10) e.message = "Please write at least 10 characters so we understand your enquiry.";
    if (!form.consent) e.consent = "Please accept the demo acknowledgement.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setTimeout(() => {
      setRefId(`G1-C-${Math.floor(10000 + Math.random() * 90000)}`);
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  return (
    <div className="bg-cream">
      <div className="border-b border-line bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-brand">
            <MessageCircle className="h-4 w-4" /> Contact
          </p>
          <h1 className="mt-3 font-display text-[30px] font-extrabold text-white sm:text-[40px]">Talk to the G1 team</h1>
          <p className="mt-2 max-w-xl text-[15px] text-white/70">
            Send a demonstration message with validation and instant on-screen confirmation. No emails are actually sent in Phase 1.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[360px_1fr] lg:py-14">
        <aside className="space-y-5">
          <div className="rounded-[20px] border border-line bg-white p-6 shadow-soft">
            <h2 className="font-display text-[16px] font-extrabold text-navy">Before you write</h2>
            <ul className="mt-4 space-y-3 text-[13.5px]">
              <li className="flex gap-3 rounded-xl bg-cream p-3.5">
                <ShieldCheck className="h-5 w-5 shrink-0 text-teal-dark" />
                <span><span className="font-bold text-navy">Demo only.</span> <span className="text-muted">Messages stay in your browser; no ticket is created.</span></span>
              </li>
              <li className="flex gap-3 rounded-xl bg-cream p-3.5">
                <Clock className="h-5 w-5 shrink-0 text-teal-dark" />
                <span><span className="font-bold text-navy">No live support yet.</span> <span className="text-muted">Production helpdesk hours will be published at launch.</span></span>
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13px] text-red-800">
              <span className="font-bold">Emergency?</span> Call your local emergency number immediately. G1 is not an emergency service.
            </div>
          </div>
          <div className="overflow-hidden rounded-[20px] border border-line shadow-soft">
            <img
              src="https://images.pexels.com/photos/7195319/pexels-photo-7195319.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
              alt="Healthcare medical professional"
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
            />
          </div>
        </aside>

        <div className="rounded-[22px] border border-line bg-white p-6 shadow-card sm:p-8">
          {status === "success" ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="py-6 text-center" role="status">
              <span className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-emerald-brand/15 p-5 text-emerald-brand">
                <Check className="h-9 w-9" />
              </span>
              <h2 className="mt-4 font-display text-2xl font-extrabold text-navy">Demo message received</h2>
              <p className="mx-auto mt-2 max-w-md text-[14.5px] text-muted">
                Thanks, <span className="font-bold text-navy">{form.name.split(" ")[0]}</span>. Your demonstration reference is{" "}
                <span className="font-mono font-bold text-navy">{refId}</span> for topic “{form.topic}”.
              </p>
              <div className="mx-auto mt-4 max-w-md rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-[13px] text-amber-800">
                Nothing was emailed or stored. In production, you would receive an acknowledgement at {form.email}.
              </div>
              <button
                type="button"
                onClick={() => { setForm({ name: "", email: "", phone: "", topic: topics[0], message: "", consent: false }); setStatus("idle"); setErrors({}); }}
                className="mt-6 inline-flex h-12 items-center rounded-full bg-navy px-8 font-display text-[14.5px] font-bold text-white transition hover:bg-navy-800"
              >
                Send another demo message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2 className="font-display text-xl font-extrabold text-navy">Contact form — demo</h2>
              <p className="mt-1 text-[13.5px] text-muted">All fields are validated. Phone is optional.</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">Full name *</span>
                  <input
                    type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name"
                    aria-invalid={!!errors.name}
                    className={`h-[50px] w-full rounded-xl border bg-cream/50 px-4 text-[15px] focus:bg-white ${errors.name ? "border-red-400" : "border-line focus:border-teal-brand"}`}
                  />
                  {errors.name && <span className="mt-1 block text-[12.5px] font-semibold text-red-600">{errors.name}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">Email *</span>
                  <input
                    type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    className={`h-[50px] w-full rounded-xl border bg-cream/50 px-4 text-[15px] focus:bg-white ${errors.email ? "border-red-400" : "border-line focus:border-teal-brand"}`}
                  />
                  {errors.email && <span className="mt-1 block text-[12.5px] font-semibold text-red-600">{errors.email}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">Phone <span className="font-medium text-muted">(optional)</span></span>
                  <input
                    type="tel" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit mobile"
                    aria-invalid={!!errors.phone}
                    className={`h-[50px] w-full rounded-xl border bg-cream/50 px-4 text-[15px] focus:bg-white ${errors.phone ? "border-red-400" : "border-line focus:border-teal-brand"}`}
                  />
                  {errors.phone && <span className="mt-1 block text-[12.5px] font-semibold text-red-600">{errors.phone}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">Topic *</span>
                  <select value={form.topic} onChange={(e) => set("topic", e.target.value)} className="h-[50px] w-full rounded-xl border border-line bg-cream/50 px-4 text-[14.5px] font-semibold focus:border-teal-brand focus:bg-white">
                    {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-[13px] font-bold text-navy">Message * <span className="font-medium text-muted">(min 10 characters)</span></span>
                <textarea
                  value={form.message} onChange={(e) => set("message", e.target.value)} rows={5} maxLength={800}
                  placeholder="How can we help? Describe your question about the demo…"
                  aria-invalid={!!errors.message}
                  className={`w-full rounded-xl border bg-cream/50 px-4 py-3 text-[14.5px] focus:bg-white ${errors.message ? "border-red-400" : "border-line focus:border-teal-brand"}`}
                />
                <span className="mt-1 flex items-center justify-between text-[12px] text-muted">
                  <span>{errors.message ? <span className="font-semibold text-red-600">{errors.message}</span> : "Be specific — it helps our demo review."}</span>
                  <span>{form.message.length}/800</span>
                </span>
              </label>

              <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-cream/50 p-4">
                <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#00A896]" />
                <span className="text-[13px]">I understand this is a <span className="font-bold">demonstration form</span> and no message is actually transmitted or stored.</span>
              </label>
              {errors.consent && <span className="mt-1.5 block text-[12.5px] font-semibold text-red-600">{errors.consent}</span>}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={status === "loading"} className="inline-flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-teal-brand font-display text-[15px] font-bold text-white transition hover:bg-teal-dark disabled:opacity-70">
                  {status === "loading" ? (<><Loader2 className="h-5 w-5 animate-spin" /> Sending demo…</>) : (<><Send className="h-[18px] w-[18px]" /> Send message (Demo)</>)}
                </button>
                <button type="button" onClick={() => { setForm({ name: "", email: "", phone: "", topic: topics[0], message: "", consent: false }); setErrors({}); }} className="inline-flex h-[52px] items-center justify-center rounded-full border border-line px-8 font-display text-[15px] font-bold text-navy transition hover:border-navy">
                  Clear
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
