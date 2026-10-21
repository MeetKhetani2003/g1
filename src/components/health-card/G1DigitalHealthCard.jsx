// src/components/health-card/G1DigitalHealthCard.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import {
  ShieldCheck,
  Droplet,
  Phone,
  Sparkles,
  QrCode as QrIcon,
  Download,
  ExternalLink,
  Printer,
  FileDown,
  RotateCw,
  Loader2,
  Check,
  Image as ImageIcon,
  User,
} from "lucide-react";
import { Link } from "../../utils/navigation";

// Helper to convert any image URL to Base64 to bypass CORS in canvas
async function convertUrlToBase64(url) {
  if (!url) return "";
  if (url.startsWith("data:")) return url;

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 300;
        canvas.height = img.naturalHeight || 300;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        resolve(url);
      }
    };
    img.onerror = () => resolve(url);
    img.src = url;
  });
}

export default function G1DigitalHealthCard({ patient, showActions = true }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [safePhotoUrl, setSafePhotoUrl] = useState(
    patient?.photo ||
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
  );
  const [currentSide, setCurrentSide] = useState("front"); // 'front' | 'back'
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Dedicated offscreen container refs that ALWAYS remain visible and rendered at fixed CR80 PVC dimensions (1012px x 638px)
  const exportFrontRef = useRef(null);
  const exportBackRef = useRef(null);

  const healthId = patient?.healthId || "G1-849201";
  const publicHistoryUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/medical-history/${healthId}`
      : `http://localhost:3000/medical-history/${healthId}`;

  // Generate QR Code
  useEffect(() => {
    QRCode.toDataURL(publicHistoryUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: "#0b2545",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [publicHistoryUrl, healthId]);

  // Convert patient photo to base64 for safe canvas rendering
  useEffect(() => {
    if (patient?.photo) {
      convertUrlToBase64(patient.photo).then((base64) => setSafePhotoUrl(base64));
    }
  }, [patient?.photo]);

  // Helper to render high-definition canvases of both card sides
  const renderCardCanvases = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const frontElem = exportFrontRef.current;
    const backElem = exportBackRef.current;

    if (!frontElem || !backElem) {
      throw new Error("Export card templates not ready");
    }

    const frontCanvas = await html2canvas(frontElem, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    const backCanvas = await html2canvas(backElem, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    return {
      frontDataUrl: frontCanvas.toDataURL("image/png"),
      backDataUrl: backCanvas.toDataURL("image/png"),
    };
  };

  // 1. Download Standard Double-Sided PVC PDF (CR80: 85.6mm x 53.98mm)
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      const { jsPDF } = await import("jspdf");
      const { frontDataUrl, backDataUrl } = await renderCardCanvases();

      // Create PDF with exact landscape dimensions: 85.6mm x 53.98mm
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 53.98],
      });

      // Page 1: Front side
      pdf.addImage(frontDataUrl, "PNG", 0, 0, 85.6, 53.98);

      // Page 2: Back side
      pdf.addPage([85.6, 53.98], "landscape");
      pdf.addImage(backDataUrl, "PNG", 0, 0, 85.6, 53.98);

      pdf.save(`G1_HealthCard_${healthId}_PVC.pdf`);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("PDF generation exception:", err);
      // Fallback: trigger print
      alert("Opening print dialog as fallback...");
      handlePrintPvc();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 2. Direct PVC Print Mode (Opens clean dedicated print window with CR80 dimensions)
  const handlePrintPvc = async () => {
    setIsPrinting(true);

    try {
      const { frontDataUrl, backDataUrl } = await renderCardCanvases();

      const printWin = window.open("", "_blank", "width=850,height=600");
      if (!printWin) {
        window.print();
        setIsPrinting(false);
        return;
      }

      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>G1 Health Card - PVC Print (${healthId})</title>
            <style>
              @page {
                size: 85.6mm 53.98mm;
                margin: 0;
              }
              * {
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              body {
                margin: 0;
                padding: 0;
                background: #ffffff;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              .pvc-card-page {
                width: 85.6mm;
                height: 53.98mm;
                page-break-after: always;
                page-break-inside: avoid;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .pvc-card-page:last-child {
                page-break-after: avoid;
              }
              img {
                width: 85.6mm;
                height: 53.98mm;
                display: block;
                object-fit: contain;
              }
            </style>
          </head>
          <body>
            <div class="pvc-card-page"><img src="${frontDataUrl}" alt="Card Front" /></div>
            <div class="pvc-card-page"><img src="${backDataUrl}" alt="Card Back" /></div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.focus();
                  window.print();
                  window.close();
                }, 400);
              };
            </script>
          </body>
        </html>
      `);
      printWin.document.close();
    } catch (err) {
      console.error("Print error:", err);
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  // 3. Download high-res PNG of Front and Back
  const handleDownloadPng = async () => {
    try {
      const { frontDataUrl, backDataUrl } = await renderCardCanvases();

      const linkFront = document.createElement("a");
      linkFront.download = `G1_HealthCard_${healthId}_Front.png`;
      linkFront.href = frontDataUrl;
      linkFront.click();

      setTimeout(() => {
        const linkBack = document.createElement("a");
        linkBack.download = `G1_HealthCard_${healthId}_Back.png`;
        linkBack.href = backDataUrl;
        linkBack.click();
      }, 500);
    } catch (e) {
      console.error("PNG download error:", e);
    }
  };

  return (
    <div className="space-y-4">
      {/* Side Switcher Toggle */}
      <div className="flex items-center justify-center gap-2">
        <div className="inline-flex rounded-full bg-slate-200/80 p-1 text-xs font-bold shadow-inner">
          <button
            type="button"
            onClick={() => setCurrentSide("front")}
            className={`rounded-full px-4 py-1.5 transition ${
              currentSide === "front"
                ? "bg-navy text-white shadow-xs"
                : "text-slate-600 hover:text-navy"
            }`}
          >
            Card Front
          </button>
          <button
            type="button"
            onClick={() => setCurrentSide("back")}
            className={`rounded-full px-4 py-1.5 transition ${
              currentSide === "back"
                ? "bg-navy text-white shadow-xs"
                : "text-slate-600 hover:text-navy"
            }`}
          >
            Card Back (QR & SOS)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setCurrentSide((s) => (s === "front" ? "back" : "front"))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 transition"
          title="Flip Card"
        >
          <RotateCw className="h-3.5 w-3.5 text-teal-600" />
        </button>
      </div>

      {/* INTERACTIVE CARD PREVIEW (In Browser) */}
      <div className="relative mx-auto w-full max-w-[480px]">
        {/* FRONT SIDE PREVIEW */}
        {currentSide === "front" && (
          <div
            className="relative w-full aspect-[1.586/1] overflow-hidden rounded-[20px] p-5 sm:p-6 text-white shadow-[0_20px_50px_-15px_rgba(11,37,69,0.38)]"
            style={{
              background: "linear-gradient(135deg, #0b2545 0%, #134e5e 55%, #059669 110%)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
            }}
          >
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />

            {/* Top Header */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/20">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="G1 Healthcare"
                  className="h-9 w-auto bg-white/95 rounded-lg px-2 py-0.5 shadow-sm"
                />
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-300">
                    National Health Card
                  </span>
                  <span className="block text-[9px] font-semibold text-white/80">
                    Government & Hospital Verified
                  </span>
                </div>
              </div>

              {/* EMV Chip */}
              <div className="h-6.5 w-8.5 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-100 p-1 border border-amber-300 shadow-inner flex flex-col justify-between">
                <div className="h-0.5 w-full bg-amber-600/40 rounded-full" />
                <div className="h-0.5 w-full bg-amber-600/40 rounded-full" />
              </div>
            </div>

            {/* Card Body */}
            <div className="relative z-10 pt-3.5 grid grid-cols-12 gap-3.5 items-center">
              <div className="col-span-4 flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={safePhotoUrl}
                    alt={patient?.name || "Patient"}
                    className="h-20 w-20 rounded-2xl object-cover ring-2 ring-emerald-400/80 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-navy shadow">
                    <ShieldCheck className="h-3 w-3" />
                  </span>
                </div>

                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-black tracking-wide text-white shadow-xs">
                  <Droplet className="h-2.5 w-2.5 fill-current text-white" />
                  {patient?.bloodGroup || "O+ Pos"}
                </div>
              </div>

              <div className="col-span-8 pl-1 space-y-1">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-teal-200">Patient Full Name</p>
                  <h3 className="font-display text-base font-extrabold text-white leading-tight truncate" style={{ color: "#ffffff" }}>
                    {patient?.name || "Dr. Ananya Sharma"}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-teal-200">G1 Health ID</p>
                    <p className="font-mono text-xs font-black text-amber-300 tracking-wider">
                      {healthId}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-teal-200">Age / Gender</p>
                    <p className="font-semibold text-white text-[11px]">
                      {patient?.age || "32"} Yrs · {patient?.gender || "Female"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] uppercase font-bold text-teal-200">Emergency Phone</p>
                  <p className="font-semibold text-[11px] text-white/95 truncate flex items-center gap-1">
                    <Phone className="h-2.5 w-2.5 text-emerald-300 shrink-0" />
                    {patient?.phone || "+91 98765 43210"}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase font-bold text-teal-200">Residential Address</p>
                  <p className="font-medium text-[10px] text-white/80 line-clamp-1 leading-snug">
                    {patient?.address || "42, Green Valley Enclave, Ring Road, Ahmedabad"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Strip */}
            <div className="relative z-10 mt-3.5 pt-2 border-t border-white/15 flex items-center justify-between text-[9px] text-white/70">
              <span className="flex items-center gap-1 font-bold text-emerald-300 uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-emerald-300" /> CR80 PVC Standard · 85.6mm × 53.98mm
              </span>
              <span className="font-mono text-amber-200 font-bold">Lifetime Verified</span>
            </div>
          </div>
        )}

        {/* BACK SIDE PREVIEW */}
        {currentSide === "back" && (
          <div
            className="relative w-full aspect-[1.586/1] overflow-hidden rounded-[20px] p-5 sm:p-6 text-white shadow-[0_20px_50px_-15px_rgba(11,37,69,0.38)]"
            style={{
              background: "linear-gradient(135deg, #091e36 0%, #0b2545 60%, #134e5e 120%)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
            }}
          >
            {/* Top Magnetic Stripe Simulation */}
            <div className="absolute top-4 left-0 right-0 h-9 bg-slate-900 border-y border-black/40 shadow-inner flex items-center px-4">
              <span className="font-mono text-[8px] text-slate-500 tracking-widest">
                G1-ISO-7810-CR80-ID-MAGNETIC-STRIPE-HEALTH-NET
              </span>
            </div>

            <div className="relative z-10 pt-12 grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4 flex flex-col items-center text-center">
                {qrDataUrl ? (
                  <div className="p-1 bg-white rounded-xl shadow-md">
                    <img src={qrDataUrl} alt="Scan Medical Records" className="h-20 w-20 rounded-lg" />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-xl bg-white/20 animate-pulse" />
                )}
                <span className="mt-1 text-[8px] font-black uppercase tracking-wider text-emerald-300">
                  Scan for Medical History
                </span>
              </div>

              <div className="col-span-8 pl-1 space-y-1.5 text-[9px] text-slate-300">
                <div className="rounded-lg bg-navy-800/80 p-2 border border-white/10 space-y-0.5">
                  <span className="font-bold text-amber-300 uppercase block text-[8px]">
                    Emergency Guidelines & SOS Helplines:
                  </span>
                  <p className="text-white text-[9.5px] font-semibold">
                    National Ambulance: <strong className="text-emerald-300">108</strong> · G1 SOS: <strong className="text-emerald-300">1800-419-G1CARE</strong>
                  </p>
                  <p className="text-[8.5px] text-white/70">
                    Hospital staff: Scan the QR code via mobile camera to view verified vitals, active prescriptions, and clinical history.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="space-y-0.5">
                    <div className="h-5 flex items-center gap-[1.5px]">
                      {[4, 2, 5, 2, 7, 3, 2, 6, 3, 5, 2, 8, 3, 4, 2, 6, 4, 3, 7, 2, 5, 3, 6, 2, 4].map((h, i) => (
                        <span key={i} className="w-[2px] bg-white rounded-xs" style={{ height: `${h * 2.2}px` }} />
                      ))}
                    </div>
                    <span className="font-mono text-[8px] text-slate-400 block tracking-widest">{healthId}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-serif italic text-white/80 block text-[10px]">Dr. R. K. Mehta</span>
                    <span className="text-[7.5px] uppercase text-emerald-300 font-bold block">Medical Director Signature</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-2.5 left-5 right-5 flex justify-between text-[7.5px] text-white/50">
              <span>Card Serial: G1-PVC-{healthId.replace(/[^0-9]/g, "")}-IN</span>
              <span>Property of G1 Healthcare Aggregator Network</span>
            </div>
          </div>
        )}
      </div>

      {/* DEDICATED OFFSCREEN HIGH-RES CAPTURE CANVAS (CR80: 85.6mm x 53.98mm @ 300 DPI) */}
      {/* Kept permanently rendered at exact pixel dimensions so html2canvas never encounters display:none */}
      <div
        style={{
          position: "fixed",
          left: "-9999px",
          top: "0",
          width: "1012px",
          zIndex: -999,
          pointerEvents: "none",
        }}
      >
        {/* High-Res Front Template */}
        <div
          ref={exportFrontRef}
          style={{
            width: "1012px",
            height: "638px",
            background: "linear-gradient(135deg, #0b2545 0%, #134e5e 55%, #059669 110%)",
            borderRadius: "38px",
            padding: "44px",
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid rgba(255,255,255,0.25)", paddingBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img src="/logo.png" alt="G1 Healthcare" style={{ height: "64px", background: "#ffffff", borderRadius: "12px", padding: "4px 12px" }} />
              <div>
                <span style={{ display: "block", fontSize: "18px", fontWeight: "900", letterSpacing: "3px", color: "#6ee7b7", textTransform: "uppercase" }}>
                  National Health Card
                </span>
                <span style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "rgba(255,255,255,0.85)" }}>
                  Government & Hospital Verified
                </span>
              </div>
            </div>

            {/* Smart EMV Chip */}
            <div style={{ width: "70px", height: "54px", borderRadius: "10px", background: "linear-gradient(135deg, #fde68a, #f59e0b, #fef3c7)", border: "2px solid #fbbf24", padding: "6px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ height: "4px", background: "rgba(180, 83, 9, 0.5)", borderRadius: "4px" }} />
              <div style={{ height: "4px", background: "rgba(180, 83, 9, 0.5)", borderRadius: "4px" }} />
            </div>
          </div>

          {/* Body */}
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "32px", alignItems: "center", marginTop: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <img
                src={safePhotoUrl}
                alt="Patient"
                style={{ width: "170px", height: "170px", borderRadius: "28px", objectFit: "cover", border: "4px solid #34d399", margin: "0 auto", display: "block" }}
              />
              <span style={{ display: "inline-block", marginTop: "14px", background: "#dc2626", color: "#ffffff", padding: "6px 20px", borderRadius: "20px", fontSize: "18px", fontWeight: "900", letterSpacing: "1px" }}>
                {patient?.bloodGroup || "O+ Pos"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <span style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", color: "#99f6e4", letterSpacing: "1px" }}>Patient Full Name</span>
                <h2 style={{ margin: "2px 0 0 0", fontSize: "32px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.5px" }}>
                  {patient?.name || "Dr. Ananya Sharma"}
                </h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <span style={{ fontSize: "13px", fontWeight: "800", textTransform: "uppercase", color: "#99f6e4" }}>G1 Health ID</span>
                  <p style={{ margin: "2px 0 0 0", fontFamily: "monospace", fontSize: "24px", fontWeight: "900", color: "#fde047", letterSpacing: "1px" }}>
                    {healthId}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: "13px", fontWeight: "800", textTransform: "uppercase", color: "#99f6e4" }}>Age / Gender</span>
                  <p style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "700", color: "#ffffff" }}>
                    {patient?.age || "32"} Yrs · {patient?.gender || "Female"}
                  </p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "13px", fontWeight: "800", textTransform: "uppercase", color: "#99f6e4" }}>Emergency Phone</span>
                <p style={{ margin: "2px 0 0 0", fontSize: "20px", fontWeight: "700", color: "#ffffff" }}>
                  {patient?.phone || "+91 98765 43210"}
                </p>
              </div>

              <div>
                <span style={{ fontSize: "13px", fontWeight: "800", textTransform: "uppercase", color: "#99f6e4" }}>Residential Address</span>
                <p style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "500", color: "rgba(255,255,255,0.85)" }}>
                  {patient?.address || "42, Green Valley Enclave, Ring Road, Ahmedabad"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid rgba(255,255,255,0.2)", paddingTop: "14px", fontSize: "14px", color: "rgba(255,255,255,0.75)" }}>
            <span style={{ fontWeight: "800", color: "#6ee7b7", letterSpacing: "1px" }}>
              ★ CR80 STANDARD PVC CARD · 85.6mm × 53.98mm
            </span>
            <span style={{ fontFamily: "monospace", fontWeight: "800", color: "#fde047" }}>
              LIFETIME VERIFIED
            </span>
          </div>
        </div>

        {/* High-Res Back Template */}
        <div
          ref={exportBackRef}
          style={{
            marginTop: "30px",
            width: "1012px",
            height: "638px",
            background: "linear-gradient(135deg, #091e36 0%, #0b2545 60%, #134e5e 120%)",
            borderRadius: "38px",
            padding: "44px",
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Top Magnetic Stripe */}
          <div style={{ position: "absolute", top: "34px", left: 0, right: 0, height: "72px", background: "#0f172a", borderTop: "2px solid #000", borderBottom: "2px solid #000", display: "flex", alignItems: "center", padding: "0 34px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#64748b", letterSpacing: "4px" }}>
              G1-ISO-7810-CR80-ID-MAGNETIC-STRIPE-HEALTH-NET
            </span>
          </div>

          {/* Back Content */}
          <div style={{ marginTop: "80px", display: "grid", gridTemplateColumns: "240px 1fr", gap: "34px", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              {qrDataUrl && (
                <div style={{ background: "#ffffff", padding: "8px", borderRadius: "20px", display: "inline-block", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}>
                  <img src={qrDataUrl} alt="QR" style={{ width: "170px", height: "170px", display: "block" }} />
                </div>
              )}
              <span style={{ display: "block", marginTop: "10px", fontSize: "14px", fontWeight: "900", color: "#6ee7b7", textTransform: "uppercase", letterSpacing: "1px" }}>
                Scan for Medical History
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "rgba(11, 37, 69, 0.8)", border: "2px solid rgba(255,255,255,0.15)", borderRadius: "18px", padding: "18px", color: "#ffffff" }}>
                <span style={{ display: "block", fontSize: "14px", fontWeight: "800", textTransform: "uppercase", color: "#fde047" }}>
                  Emergency Guidelines & SOS Helplines:
                </span>
                <p style={{ margin: "6px 0 0 0", fontSize: "17px", fontWeight: "700" }}>
                  National Ambulance: <strong style={{ color: "#34d399" }}>108</strong> · G1 SOS: <strong style={{ color: "#34d399" }}>1800-419-G1CARE</strong>
                </p>
                <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: "1.4" }}>
                  Hospital and clinic staff: Scan the QR code using any smartphone camera to inspect verified patient vitals, blood group, drug allergies, and active clinical history.
                </p>
              </div>

              {/* Barcode & Signature */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: "8px" }}>
                <div>
                  <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "42px" }}>
                    {[5, 2, 6, 3, 8, 4, 3, 7, 4, 6, 3, 9, 4, 5, 3, 7, 5, 4, 8, 3, 6, 4, 7, 3, 5].map((h, i) => (
                      <span key={i} style={{ width: "4px", height: `${h * 4.2}px`, background: "#ffffff", borderRadius: "1px", display: "inline-block" }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: "monospace", fontSize: "15px", color: "#cbd5e1", letterSpacing: "3px", marginTop: "4px", display: "block" }}>
                    {healthId}
                  </span>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: "serif", fontStyle: "italic", fontSize: "20px", color: "#ffffff", display: "block" }}>
                    Dr. R. K. Mehta
                  </span>
                  <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#6ee7b7", fontWeight: "800", display: "block" }}>
                    Medical Director Signature
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
            <span>Card Serial: G1-PVC-{healthId.replace(/[^0-9]/g, "")}-IN</span>
            <span>Property of G1 Healthcare Aggregator Network</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          {/* 1. Download Double-Sided PVC PDF */}
          <button
            type="button"
            disabled={isGeneratingPdf}
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating PVC PDF…
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-white" /> Downloaded Successfully!
              </>
            ) : (
              <>
                <FileDown className="h-3.5 w-3.5" /> Download PVC PDF (CR80)
              </>
            )}
          </button>

          {/* 2. Direct Print on PVC Card */}
          <button
            type="button"
            disabled={isPrinting}
            onClick={handlePrintPvc}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-navy shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            {isPrinting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-600" /> Preparing Print…
              </>
            ) : (
              <>
                <Printer className="h-3.5 w-3.5 text-teal-600" /> Print on PVC Card
              </>
            )}
          </button>

          {/* 3. Download High-Res PNG Images */}
          <button
            type="button"
            onClick={handleDownloadPng}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            title="Download Front & Back PNG images"
          >
            <ImageIcon className="h-3.5 w-3.5 text-teal-600" />
            Download PNGs
          </button>

          {/* 4. Open Live Medical Dossier */}
          <Link
            to={`/medical-history/${healthId}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-navy/90 transition"
          >
            <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
            View Live QR Dossier
          </Link>

          {/* 5. View Full Profile & All Details */}
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/40 bg-teal-50/90 px-4 py-2.5 text-xs font-bold text-teal-900 shadow-2xs hover:bg-teal-100 transition cursor-pointer"
          >
            <User className="h-3.5 w-3.5 text-teal-brand" />
            Full Profile Details
          </Link>
        </div>
      )}
    </div>
  );
}
