// src/app/api/admin/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set("g1_admin_session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
