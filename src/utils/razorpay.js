// src/utils/razorpay.js
// Client-side Razorpay integration with automated lead capture on failure/drop-off

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function processRazorpayPayment({
  amount,
  serviceTitle,
  packageTitle,
  patient,
  diagnosticResponses = [],
  onSuccess,
  onFailure,
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Razorpay checkout failed to load. Please check your internet connection.");
    return;
  }

  try {
    // 1. Create order on server
    const orderRes = await fetch("/api/payment/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        receipt: `g1_${Date.now()}`,
        notes: {
          patientName: patient?.name || "Patient",
          serviceTitle,
          packageTitle,
          patientPhone: patient?.phone || "",
        },
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.id) {
      throw new Error(orderData.error || "Could not initialize payment order.");
    }

    let hasHandledResult = false;

    // 2. Configure Razorpay modal options
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: "INR",
      name: "G1 Healthcare Aggregator",
      description: `${serviceTitle} - ${packageTitle}`,
      image: "/brand/g1-icon.svg",
      order_id: orderData.id,
      prefill: {
        name: patient?.name || "",
        email: patient?.email || "",
        contact: patient?.phone || "",
      },
      theme: {
        color: "#0d9488", // Medical teal
      },
      handler: async function (response) {
        hasHandledResult = true;
        // Verify payment signature
        try {
          const verifyRes = await fetch("/api/payment/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id || orderData.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              isSimulated: orderData.isSimulated,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.verified) {
            if (onSuccess) {
              onSuccess({
                paymentId: response.razorpay_payment_id || verifyData.paymentId,
                orderId: orderData.id,
                amount,
                status: "PAID",
                method: "Razorpay",
              });
            }
          } else {
            throw new Error(verifyData.error || "Signature verification failed");
          }
        } catch (vErr) {
          if (onFailure) {
            onFailure({
              reason: vErr.message || "Payment verification failed",
              orderId: orderData.id,
              status: "FAILED_LEAD",
            });
          }
        }
      },
      modal: {
        ondismiss: function () {
          if (!hasHandledResult) {
            hasHandledResult = true;
            // Capture as abandoned lead so tele-caller team can reach out!
            if (onFailure) {
              onFailure({
                reason: "User closed payment window before completing payment",
                orderId: orderData.id,
                status: "FAILED_LEAD",
              });
            }
          }
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      hasHandledResult = true;
      if (onFailure) {
        onFailure({
          reason: response.error?.description || "Transaction failed by bank",
          orderId: orderData.id,
          paymentId: response.error?.metadata?.payment_id,
          status: "FAILED_LEAD",
        });
      }
    });

    rzp.open();
  } catch (err) {
    console.error("Payment trigger error:", err);
    if (onFailure) {
      onFailure({
        reason: err.message || "Payment initialization failed",
        status: "FAILED_LEAD",
      });
    }
  }
}
