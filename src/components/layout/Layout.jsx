"use client";

import { useEffect } from "react";
import { useLocation } from "../../utils/navigation";
import Header from "./Header";
import Footer from "./Footer";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);
  return null;
}

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream font-body text-ink antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
