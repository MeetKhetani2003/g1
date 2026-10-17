// src/app/api/admin/login/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body || {};

    const expectedUsername = process.env.ADMIN_USERNAME || "admin";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin@g1healthcare";
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || "g1_admin_secret_key_2026";

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (trimmedUser !== expectedUsername || trimmedPass !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid admin username or security key" },
        { status: 401 }
      );
    }

    // Create secure signed session token
    const timestamp = Date.now();
    const payload = `${trimmedUser}:${timestamp}`;
    const signature = crypto.createHmac("sha256", sessionSecret).update(payload).digest("hex");
    const token = Buffer.from(`${payload}:${signature}`).toString("base64");

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      user: {
        username: trimmedUser,
        role: "Super Admin",
        authenticatedAt: new Date().toISOString(),
      },
    });

    // Set secure HttpOnly session cookie
    response.cookies.set("g1_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, error: "Server authentication error" },
      { status: 500 }
    );
  }
}
