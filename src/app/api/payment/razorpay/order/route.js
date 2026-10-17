// src/app/api/payment/razorpay/order/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, receipt, notes } = body;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured in .env.local" },
        { status: 500 }
      );
    }

    // Convert amount to paise (e.g. ₹1499 -> 149900 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    const authHeader = `Basic ${Buffer.from(`${keyId.trim()}:${keySecret.trim()}`).toString("base64")}`;

    const orderPayload = {
      amount: amountInPaise,
      currency: "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    };

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.warn("Razorpay API order error, falling back to simulated order for testing:", data);
      // Fallback in case test key is not yet activated on dashboard
      return NextResponse.json({
        id: `order_sim_${Date.now()}`,
        amount: amountInPaise,
        currency: "INR",
        keyId,
        isSimulated: true,
      });
    }

    return NextResponse.json({
      ...data,
      keyId,
      isSimulated: false,
    });
  } catch (err) {
    console.error("Order creation exception:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
