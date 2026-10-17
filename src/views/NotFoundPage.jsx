"use client";

import { Link } from "../utils/navigation";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6">
      <img src="/brand/g1-icon.svg" alt="" className="h-16 w-16" />
      <p className="mt-6 font-display text-[72px] font-extrabold leading-none text-navy/10">404</p>
      <h1 className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-3xl">Page not found</h1>
      <p className="mt-2 max-w-md text-[15px] text-muted">
        The page you requested doesn't exist in this Phase 1 demo. Let's get you back to connected care.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/" className="inline-flex h-12 items-center gap-2 rounded-full bg-navy px-7 font-display text-[14.5px] font-bold text-white transition hover:bg-navy-800">
          <Home className="h-[18px] w-[18px]" /> Go home
        </Link>
        <Link to="/explore" className="inline-flex h-12 items-center gap-2 rounded-full bg-teal-brand px-7 font-display text-[14.5px] font-bold text-white transition hover:bg-teal-dark">
          <Search className="h-[18px] w-[18px]" /> Explore care
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-white px-7 font-display text-[14.5px] font-bold text-navy transition hover:border-navy"
        >
          <ArrowLeft className="h-[18px] w-[18px]" /> Go back
        </button>
      </div>
    </div>
  );
}
