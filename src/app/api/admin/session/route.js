// src/app/api/admin/session/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req) {
  try {
    const sessionCookie = req.cookies.get("g1_admin_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false });
    }

    const sessionSecret = process.env.ADMIN_SESSION_SECRET || "g1_admin_secret_key_2026";
    const expectedUsername = process.env.ADMIN_USERNAME || "admin";

    const decoded = Buffer.from(sessionCookie, "base64").toString("utf8");
    const parts = decoded.split(":");

    if (parts.length < 3) {
      return NextResponse.json({ authenticated: false });
    }

    const [username, timestamp, signature] = parts;
    const payload = `${username}:${timestamp}`;
    const expectedSignature = crypto.createHmac("sha256", sessionSecret).update(payload).digest("hex");

    if (signature !== expectedSignature || username !== expectedUsername) {
      return NextResponse.json({ authenticated: false });
    }

    // Check expiration (7 days)
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > 1000 * 60 * 60 * 24 * 7) {
      return NextResponse.json({ authenticated: false, expired: true });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        username,
        role: "Super Admin",
      },
    });
  } catch (err) {
    console.error("Admin session check error:", err);
    return NextResponse.json({ authenticated: false });
  }
}
