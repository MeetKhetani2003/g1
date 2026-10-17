import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { AuthProvider } from "../context/AuthContext";
import GoogleLoginModal from "../components/auth/GoogleLoginModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: "G1 Healthcare Aggregator — Your Healthcare, Connected",
  description:
    "G1 Healthcare Aggregator — Discover hospitals, doctors, diagnostic labs, pharmacies and essential healthcare services through one connected platform.",
  icons: {
    icon: "/brand/g1-icon.svg",
  },
};

export const viewport = {
  themeColor: "#0B2545",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
      <body suppressHydrationWarning className="flex min-h-screen flex-col bg-cream font-body text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <GoogleLoginModal />
        </AuthProvider>
      </body>
    </html>
  );
}
