"use client";

import { Link } from "../utils/navigation";
import { ShieldCheck, FileText, ArrowLeft } from "lucide-react";

export function PrivacyPage() {
  return (
    <div className="bg-cream">
      <div className="border-b border-line bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-brand">
            <ShieldCheck className="h-4 w-4" /> Legal
          </p>
          <h1 className="mt-3 font-display text-[30px] font-extrabold text-white sm:text-[38px]">Privacy Policy — Demo</h1>
          <p className="mt-2 text-[14.5px] text-white/70">Phase 1 demonstration policy. Effective for this preview website only.</p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link to="/" className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[13.5px] font-bold text-navy">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <article className="prose-sm mt-6 space-y-6 rounded-[20px] border border-line bg-white p-6 shadow-soft sm:p-9">
          {[
            ["1. Demonstration only", "This Phase 1 website is a design and interaction preview. Forms (Health Card, Partner, Contact, Login) validate input in your browser and simulate success states. No data is transmitted to, stored on, or processed by any server."],
            ["2. What we collect (production vision)", "At production launch, G1 would collect only the minimum needed: name, contact details, city, and profile preferences. Medical records would only ever be handled with explicit consent and appropriate safeguards."],
            ["3. What we never do", "G1 does not sell personal information, does not share data with advertisers, and does not claim emergency-response capability. Sample providers shown are fictional and not verified."],
            ["4. Cookies & analytics", "This demo uses no tracking cookies or third-party analytics. Any future analytics would be disclosed here with opt-out controls."],
            ["5. Your control", "Because nothing is stored in Phase 1, there is nothing to export or delete. Clearing your browser or refreshing the page discards all demo entries."],
            ["6. Children & sensitive data", "Do not enter real medical details, government IDs, or children's information into any demo form. All examples should use fictional data."],
            ["7. Contact (demo)", "Questions about this demo policy can be raised through the Contact page form, which itself is a non-transmitting demonstration."],
          ].map(([h, p]) => (
            <section key={h}>
              <h2 className="font-display text-[17px] font-extrabold text-navy">{h}</h2>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{p}</p>
            </section>
          ))}
          <p className="rounded-xl bg-cream p-4 text-[13px] text-muted">
            This is a placeholder policy for client review. A production Privacy Policy with data-retention schedules, grievance contacts, and jurisdictional disclosures will replace it before any real launch.
          </p>
        </article>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="bg-cream">
      <div className="border-b border-line bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-emerald-brand">
            <FileText className="h-4 w-4" /> Legal
          </p>
          <h1 className="mt-3 font-display text-[30px] font-extrabold text-white sm:text-[38px]">Terms of Use — Demo</h1>
          <p className="mt-2 text-[14.5px] text-white/70">Phase 1 demonstration terms. Please read before browsing.</p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link to="/" className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[13.5px] font-bold text-navy">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <article className="mt-6 space-y-6 rounded-[20px] border border-line bg-white p-6 shadow-soft sm:p-9">
          {[
            ["1. Nature of this website", "G1 Healthcare Aggregator Phase 1 is a premium UI foundation. All providers, ratings, reviews, Health IDs, and reference numbers are fictional sample data for demonstration. Nothing here constitutes medical advice, a booking, or a verified listing."],
            ["2. No medical or emergency services", "G1 is a discovery concept in this phase — not a hospital, pharmacy, laboratory, or ambulance dispatcher. In any emergency, call your local emergency number. Do not rely on demo listings for urgent care."],
            ["3. Acceptable use", "Do not enter real personal, medical, or financial information into demo forms. Do not attempt to misrepresent fictional providers as real, verified, or endorsed."],
            ["4. Intellectual property", "The G1 brand, layout, and demo content are presented for client review. Sample photography is credited to its providers and used illustratively."],
            ["5. Limitation of liability", "Because no real services are offered, G1 makes no warranties about availability, accuracy, or fitness for any purpose in this demo. No liability arises from browsing sample content."],
            ["6. Future phases", "Patient portals, partner dashboards, admin tools, payments, and real onboarding are explicitly out of scope for Phase 1 and will be governed by separate terms when introduced."],
          ].map(([h, p]) => (
            <section key={h}>
              <h2 className="font-display text-[17px] font-extrabold text-navy">{h}</h2>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{p}</p>
            </section>
          ))}
          <p className="rounded-xl bg-cream p-4 text-[13px] text-muted">
            Placeholder terms for review. Production Terms with SLAs, partner agreements, and dispute resolution will be published before launch.
          </p>
        </article>
      </div>
    </div>
  );
}
