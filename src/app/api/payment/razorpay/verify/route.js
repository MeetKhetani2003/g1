// src/app/api/payment/razorpay/verify/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isSimulated } =
      await request.json();

    if (isSimulated) {
      return NextResponse.json({
        verified: true,
        paymentId: razorpay_payment_id || `pay_sim_${Date.now()}`,
        orderId: razorpay_order_id,
        simulated: true,
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { verified: false, error: "Missing secret key" },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret.trim())
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isMatch = generatedSignature === razorpay_signature;

    if (isMatch) {
      return NextResponse.json({
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      return NextResponse.json(
        { verified: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { verified: false, error: err.message || "Verification failed" },
      { status: 500 }
    );
  }
}
