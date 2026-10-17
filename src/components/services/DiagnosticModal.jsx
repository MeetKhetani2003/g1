// src/components/services/DiagnosticModal.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Phone,
  User,
  Mail,
  AlertCircle,
  CreditCard,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { healthStore } from "../../utils/healthStore";
import { useAuth } from "../../context/AuthContext";
import { processRazorpayPayment } from "../../utils/razorpay";

export default function DiagnosticModal({ service, isOpen, onClose, onComplete }) {
  const { user } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    phone: "",
    email: "",
    healthId: "",
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Initialize patient details
  useEffect(() => {
    if (isOpen) {
      const storedPatient = healthStore.getPatient(user);
      setPatientDetails({
        name: storedPatient.name || user?.name || "",
        phone: storedPatient.phone || user?.phone || "+91 98765 43210",
        email: storedPatient.email || user?.email || "patient@example.com",
        healthId: storedPatient.healthId || user?.healthId || "G1-849201",
      });
      setCurrentStepIndex(0);
      setAnswers({});
      setSelectedPackage(service?.packages?.[1] || service?.packages?.[0] || null);
      setBookingResult(null);
    }
  }, [isOpen, service, user]);

  if (!isOpen || !service) return null;

  const steps = service.diagnosticSteps || [];
  const isFinalPackageStep = currentStepIndex === steps.length;
  const currentStep = steps[currentStepIndex];

  const handleSelectOption = (option) => {
    const isMulti = currentStep.type === "multiselect";
    const current = answers[currentStep.id] || (isMulti ? [] : null);

    if (isMulti) {
      const arr = Array.isArray(current) ? [...current] : [];
      if (arr.includes(option)) {
        setAnswers({ ...answers, [currentStep.id]: arr.filter((x) => x !== option) });
      } else {
        setAnswers({ ...answers, [currentStep.id]: [...arr, option] });
      }
    } else {
      setAnswers({ ...answers, [currentStep.id]: option });
    }
  };

  const isCurrentStepValid = () => {
    if (isFinalPackageStep) return !!selectedPackage && !!patientDetails.phone;
    const ans = answers[currentStep?.id];
    if (!ans) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    return typeof ans === "string" && ans.trim().length > 0;
  };

  // Convert answers dictionary into readable diagnostic questions list
  const getDiagnosticSummary = () => {
    return steps.map((s) => {
      const val = answers[s.id];
      const answerText = Array.isArray(val) ? val.join(", ") : val || "Not specified";
      return { question: s.question, answer: answerText };
    });
  };

  const handleProceedToPayment = async () => {
    if (!selectedPackage) return;
    setIsProcessingPayment(true);

    const diagnosticSummary = getDiagnosticSummary();

    await processRazorpayPayment({
      amount: selectedPackage.price,
      serviceTitle: service.title,
      packageTitle: `${selectedPackage.name} (${selectedPackage.tier})`,
      patient: patientDetails,
      diagnosticResponses: diagnosticSummary,
      onSuccess: (paymentRes) => {
        setIsProcessingPayment(false);
        const newBooking = healthStore.addBooking({
          patientId: patientDetails.healthId,
          patientName: patientDetails.name,
          phone: patientDetails.phone,
          email: patientDetails.email,
          serviceTitle: service.title,
          packageTitle: `${selectedPackage.name} (${selectedPackage.tier})`,
          amount: selectedPackage.price,
          paymentStatus: "PAID",
          paymentMethod: "Razorpay",
          razorpayOrderId: paymentRes.orderId,
          razorpayPaymentId: paymentRes.paymentId,
          diagnosticResponses: diagnosticSummary,
        });

        // Fire celebration confetti
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        setBookingResult({
          status: "SUCCESS",
          booking: newBooking,
          message: "Payment verified successfully! Your appointment & care package are confirmed.",
        });

        if (onComplete) onComplete(newBooking);
      },
      onFailure: (failRes) => {
        setIsProcessingPayment(false);
        // CRITICAL REQUIREMENT: Still record lead in Admin CRM
        const failedLead = healthStore.addBooking({
          patientId: patientDetails.healthId,
          patientName: patientDetails.name,
          phone: patientDetails.phone,
          email: patientDetails.email,
          serviceTitle: service.title,
          packageTitle: `${selectedPackage.name} (${selectedPackage.tier})`,
          amount: selectedPackage.price,
          paymentStatus: "FAILED_LEAD",
          paymentMethod: "Razorpay (Abandoned / Failed)",
          razorpayOrderId: failRes.orderId || null,
          razorpayPaymentId: failRes.paymentId || null,
          diagnosticResponses: diagnosticSummary,
        });

        setBookingResult({
          status: "FAILED_LEAD",
          booking: failedLead,
          message:
            "Payment could not be completed, but we have saved your triage questionnaire! Our medical desk will connect with you via call/WhatsApp.",
        });

        if (onComplete) onComplete(failedLead);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative flex flex-col w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100"
      >
        {/* Top Header */}
        <div className="relative border-b border-slate-100 bg-gradient-to-r from-teal-50/70 via-white to-slate-50 px-6 py-4.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-navy leading-tight">
                  {service.title}
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  {isFinalPackageStep
                    ? "Step Final: Choose Package & Review"
                    : `Clinical Triage Assessment · Step ${currentStepIndex + 1} of ${steps.length}`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full bg-teal-600 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStepIndex + 1) / (steps.length + 1)) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {bookingResult ? (
            // Result View (Success or Saved Lead)
            <div className="py-6 text-center">
              {bookingResult.status === "SUCCESS" ? (
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
              ) : (
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <AlertCircle className="h-10 w-10" />
                </div>
              )}

              <h4 className="font-display text-xl font-bold text-navy">
                {bookingResult.status === "SUCCESS"
                  ? "Booking & Payment Confirmed!"
                  : "Inquiry Recorded as Priority Lead"}
              </h4>
              <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                {bookingResult.message}
              </p>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left max-w-md mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking / Lead ID:</span>
                  <span className="font-bold text-navy">{bookingResult.booking?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Health ID:</span>
                  <span className="font-bold text-teal-700">{bookingResult.booking?.patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-semibold text-navy">{bookingResult.booking?.serviceTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Package Amount:</span>
                  <span className="font-bold text-emerald-700">₹{bookingResult.booking?.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status in Admin:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      bookingResult.booking?.paymentStatus === "PAID"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {bookingResult.booking?.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-7 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-navy px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-navy/90"
                >
                  Done
                </button>
              </div>
            </div>
          ) : !isFinalPackageStep ? (
            // Dynamic Triage Step
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-700">
                  {currentStep.type === "multiselect"
                    ? "Select all that apply"
                    : "Select single best option"}
                </span>
              </div>

              <h4 className="font-display text-lg font-bold text-navy leading-snug">
                {currentStep.question}
              </h4>

              <div className="grid gap-2.5 pt-2">
                {currentStep.options.map((opt) => {
                  const isSelected =
                    currentStep.type === "multiselect"
                      ? (answers[currentStep.id] || []).includes(opt)
                      : answers[currentStep.id] === opt;

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-teal-600 bg-teal-50/60 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-sm font-semibold text-navy pr-4">{opt}</span>
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                          isSelected
                            ? "border-teal-600 bg-teal-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            // Final Step: Choose Package & Review Patient Details
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" /> Tailored For Your Symptoms
                </div>
                <h4 className="font-display text-lg font-bold text-navy">
                  Select Your Consultation & Care Package
                </h4>
              </div>

              {/* Package cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {service.packages?.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative cursor-pointer rounded-2xl border p-4 transition ${
                        isSelected
                          ? "border-teal-600 bg-gradient-to-b from-teal-50/40 to-white ring-2 ring-teal-600/20 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-2.5 right-3 rounded-full bg-navy px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                          Recommended
                        </span>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                          {pkg.tier}
                        </span>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 line-through mr-1.5">
                            ₹{pkg.originalPrice}
                          </span>
                          <span className="text-base font-extrabold text-navy">₹{pkg.price}</span>
                        </div>
                      </div>

                      <h5 className="mt-2 font-display text-sm font-bold text-navy">{pkg.name}</h5>

                      <ul className="mt-2.5 space-y-1 text-xs text-slate-600">
                        {pkg.features?.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Patient review input form */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Patient Contact & Health ID
                  </span>
                  <span className="text-xs font-bold text-teal-700">
                    {patientDetails.healthId || "G1-Active"}
                  </span>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <User className="h-3 w-3" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={patientDetails.name}
                      onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                      placeholder="Patient Name"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> WhatsApp / Phone Number
                    </label>
                    <input
                      type="text"
                      value={patientDetails.phone}
                      onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy focus:border-teal-600 focus:outline-hidden"
                      placeholder="+91 Phone"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Navigation */}
        {!bookingResult && (
          <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 flex items-center justify-between">
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((idx) => Math.max(0, idx - 1))}
              className={`inline-flex items-center gap-1.5 text-xs font-bold transition ${
                currentStepIndex === 0 ? "opacity-0 pointer-events-none" : "text-slate-600 hover:text-navy"
              }`}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {!isFinalPackageStep ? (
              <button
                type="button"
                disabled={!isCurrentStepValid()}
                onClick={() => setCurrentStepIndex((idx) => idx + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isProcessingPayment || !selectedPackage}
                onClick={handleProceedToPayment}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-teal-600/30 transition hover:opacity-95 disabled:opacity-50"
              >
                <Lock className="h-3.5 w-3.5" />
                {isProcessingPayment ? "Opening Razorpay..." : `Pay ₹${selectedPackage?.price} via Razorpay`}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
