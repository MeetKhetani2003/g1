"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, FlaskConical, Pill, Stethoscope, Ambulance, HeartHandshake, Check, Loader2, ArrowRight } from "lucide-react";
import DemoBadge from "../components/ui/DemoBadge";
import { cn } from "../utils/cn";

const types = [
  { id: "hospital", icon: Building2, label: "Hospital / Clinic" },
  { id: "lab", icon: FlaskConical, label: "Laboratory" },
  { id: "pharmacy", icon: Pill, label: "Pharmacy" },
  { id: "doctor", icon: Stethoscope, label: "Doctor" },
  { id: "ambulance", icon: Ambulance, label: "Ambulance" },
  { id: "homecare", icon: HeartHandshake, label: "Home Care" },
];

const emptyForm = {
  orgType: "hospital",
  orgName: "",
  contactName: "",
  phone: "",
  email: "",
  city: "",
  services: [],
  message: "",
  agree: false,
};

const serviceOptions = ["OPD / Consultations", "Diagnostics", "Pharmacy", "Home Collection", "Home Care", "Emergency", "Wellness Packages", "Specialist OPD"];

export default function PartnerPage() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [refId, setRefId] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleService = (s) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));
  };

  const validate = () => {
    const e = {};
    if (form.orgName.trim().length < 3) e.orgName = "Enter your organisation / practice name.";
    if (form.contactName.trim().length < 3) e.contactName = "Enter a contact person name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid work email.";
    if (!form.city.trim()) e.city = "Enter your city.";
    if (form.services.length === 0) e.services = "Select at least one service.";
    if (!form.agree) e.agree = "Please accept the demo acknowledgement.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) {
      document.getElementById("partner-form")?.querySelector("[aria-invalid='true']")?.focus();
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setRefId(`G1-P-${Math.floor(10000 + Math.random() * 90000)}`);
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1400);
  };

  return (
    <div className="bg-cream">
      <div className="border-b border-line bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-brand">
                Partner With Us
              </p>
              <h1 className="mt-3 max-w-2xl font-display text-[30px] font-extrabold leading-tight text-white sm:text-[40px]">
                Better connections. Better healthcare access.
              </h1>
              <p className="mt-2 max-w-xl text-[15px] text-white/70">
                Connect your facility with patients looking for care. Submit a demonstration registration of interest — no real onboarding in Phase 1.
              </p>
            </div>
            <DemoBadge label="Demo registration" className="border-white/20 bg-white/10 text-white" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl rounded-[24px] border border-line bg-white p-8 text-center shadow-card sm:p-12"
            role="status"
          >
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-brand/15 text-emerald-brand">
              <Check className="h-10 w-10" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-extrabold text-navy">Demonstration request received</h2>
            <p className="mx-auto mt-2 max-w-md text-[14.5px] text-muted">
              Thank you, <span className="font-bold text-navy">{form.contactName}</span> from{" "}
              <span className="font-bold text-navy">{form.orgName}</span>. Your demo reference ID is:
            </p>
            <p className="mx-auto mt-4 w-fit rounded-2xl bg-cream px-8 py-4 font-mono text-xl font-extrabold tracking-wide text-navy">
              {refId}
            </p>
            <div className="mx-auto mt-4 max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left text-[13px] text-amber-800">
              <span className="font-bold">Demo only:</span> this submission stays in your browser. No email is sent, no
              account is created, and no verification or listing occurs. Our production onboarding will include document
              checks and agreements.
            </div>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => { setForm(emptyForm); setStatus("idle"); setErrors({}); }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-navy px-7 font-display text-[14.5px] font-bold text-white transition hover:bg-navy-800"
              >
                Submit another demo <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            {/* Side info */}
            <aside className="space-y-5">
              <div className="rounded-[20px] border border-line bg-white p-6 shadow-soft">
                <h2 className="font-display text-[17px] font-extrabold text-navy">Who can join?</h2>
                <ul className="mt-4 space-y-3">
                  {[
                    ["Hospitals & Clinics", "In-patient, OPD, day-care"],
                    ["Laboratories", "Pathology & radiology"],
                    ["Pharmacies", "Retail & delivery"],
                    ["Doctors", "Independent practitioners"],
                    ["Ambulance Operators", "Emergency & transfers"],
                    ["Home Care Agencies", "Nursing & support"],
                  ].map(([t, d]) => (
                    <li key={t} className="flex items-center gap-3 rounded-xl bg-cream p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
                        <Check className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block font-display text-[13.5px] font-bold text-navy">{t}</span>
                        <span className="block text-[12px] text-muted">{d}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[20px] bg-navy p-6 text-white">
                <h3 className="font-display text-[16px] font-extrabold">What happens next (production)</h3>
                <ol className="mt-3 space-y-2.5 text-[13.5px] text-white/75">
                  {["Verification call & document check", "Profile creation & service mapping", "Go-live on the directory", "Request inbox & analytics access"].map((s, i) => (
                    <li key={s} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-brand text-[12px] font-extrabold text-white">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            {/* Form */}
            <form
              id="partner-form"
              onSubmit={submit}
              noValidate
              className="rounded-[22px] border border-line bg-white p-6 shadow-card sm:p-8"
            >
              <h2 className="font-display text-xl font-extrabold text-navy">Partner registration — demo</h2>
              <p className="mt-1 text-[13.5px] text-muted">Fields marked * are required. Validated instantly with clear demo feedback.</p>

              {/* Org type */}
              <fieldset className="mt-6">
                <legend className="text-[13px] font-bold text-navy">Organisation type *</legend>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {types.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => set("orgType", t.id)}
                      aria-pressed={form.orgType === t.id}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl border p-3 text-left transition",
                        form.orgType === t.id
                          ? "border-teal-brand bg-teal-50 shadow-sm"
                          : "border-line bg-white hover:border-teal-brand/40"
                      )}
                    >
                      <t.icon className={cn("h-5 w-5 shrink-0", form.orgType === t.id ? "text-teal-dark" : "text-muted")} />
                      <span className={cn("text-[13px] font-bold", form.orgType === t.id ? "text-navy" : "text-ink")}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">Organisation / practice name *</span>
                  <input
                    type="text"
                    value={form.orgName}
                    onChange={(e) => set("orgName", e.target.value)}
                    placeholder="e.g. CityCare Hospital"
                    aria-invalid={!!errors.orgName}
                    className={cn("h-[50px] w-full rounded-xl border bg-cream/50 px-4 text-[15px] font-medium focus:bg-white", errors.orgName ? "border-red-400" : "border-line focus:border-teal-brand")}
                  />
                  {errors.orgName && <span className="mt-1 block text-[12.5px] font-semibold text-red-600">{errors.orgName}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">Contact person *</span>
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => set("contactName", e.target.value)}
                    placeholder="e.g. Dr. Meera Nair"
                    aria-invalid={!!errors.contactName}
                    className={cn("h-[50px] w-full rounded-xl border bg-cream/50 px-4 text-[15px] font-medium focus:bg-white", errors.contactName ? "border-red-400" : "border-line focus:border-teal-brand")}
                  />
                  {errors.contactName && <span className="mt-1 block text-[12.5px] font-semibold text-red-600">{errors.contactName}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">Mobile *</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="10-digit mobile"
                    aria-invalid={!!errors.phone}
                    className={cn("h-[50px] w-full rounded-xl border bg-cream/50 px-4 text-[15px] font-medium focus:bg-white", errors.phone ? "border-red-400" : "border-line focus:border-teal-brand")}
                  />
                  {errors.phone && <span className="mt-1 block text-[12.5px] font-semibold text-red-600">{errors.phone}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">Work email *</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@facility.com"
                    aria-invalid={!!errors.email}
                    className={cn("h-[50px] w-full rounded-xl border bg-cream/50 px-4 text-[15px] font-medium focus:bg-white", errors.email ? "border-red-400" : "border-line focus:border-teal-brand")}
                  />
                  {errors.email && <span className="mt-1 block text-[12.5px] font-semibold text-red-600">{errors.email}</span>}
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[13px] font-bold text-navy">City *</span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="e.g. Bengaluru"
                    aria-invalid={!!errors.city}
                    className={cn("h-[50px] w-full rounded-xl border bg-cream/50 px-4 text-[15px] font-medium focus:bg-white", errors.city ? "border-red-400" : "border-line focus:border-teal-brand")}
                  />
                  {errors.city && <span className="mt-1 block text-[12.5px] font-semibold text-red-600">{errors.city}</span>}
                </label>
              </div>

              <fieldset className="mt-5">
                <legend className="text-[13px] font-bold text-navy">Services offered * <span className="font-medium text-muted">(select all that apply)</span></legend>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {serviceOptions.map((s) => {
                    const active = form.services.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleService(s)}
                        aria-pressed={active}
                        className={cn(
                          "h-10 rounded-full border px-4 text-[13px] font-bold transition",
                          active ? "border-teal-brand bg-teal-brand text-white" : "border-line bg-white text-ink hover:border-teal-brand hover:text-teal-dark"
                        )}
                      >
                        {active ? "✓ " : ""}{s}
                      </button>
                    );
                  })}
                </div>
                {errors.services && <span className="mt-1.5 block text-[12.5px] font-semibold text-red-600">{errors.services}</span>}
              </fieldset>

              <label className="mt-5 block">
                <span className="mb-1.5 block text-[13px] font-bold text-navy">Anything else? <span className="font-medium text-muted">(optional)</span></span>
                <textarea
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Bed strength, specialities, service areas, timings…"
                  className="w-full rounded-xl border border-line bg-cream/50 px-4 py-3 text-[14.5px] focus:border-teal-brand focus:bg-white"
                />
                <span className="mt-1 block text-right text-[11.5px] text-muted">{form.message.length}/500</span>
              </label>

              <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-cream/50 p-4">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => set("agree", e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[#00A896]"
                />
                <span className="text-[13px] leading-relaxed">
                  I understand this is a <span className="font-bold">demonstration form</span>. No real onboarding,
                  verification, listing, or communication will occur, and entered data stays in this browser.
                </span>
              </label>
              {errors.agree && <span className="mt-1.5 block text-[12.5px] font-semibold text-red-600">{errors.agree}</span>}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-teal-brand font-display text-[15px] font-bold text-white transition hover:bg-teal-dark disabled:opacity-70"
                >
                  {status === "loading" ? (<><Loader2 className="h-5 w-5 animate-spin" /> Submitting demo…</>) : (<>Register as a Partner <ArrowRight className="h-5 w-5" /></>)}
                </button>
                <button
                  type="button"
                  onClick={() => { setForm(emptyForm); setErrors({}); }}
                  className="inline-flex h-[52px] items-center justify-center rounded-full border border-line px-8 font-display text-[15px] font-bold text-navy transition hover:border-navy"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
