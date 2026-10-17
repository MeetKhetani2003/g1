import { NextResponse } from "next/server";

function getBaseUrl(request) {
  // If explicitly configured in env and not localhost, use it
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  }
  // Otherwise detect from request headers
  const proto = request.headers.get("x-forwarded-proto") || (request.url.startsWith("https") ? "https" : "http");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
    return `${proto}://${host}`;
  }
  if (host) {
    return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}

function getRedirectUri(request) {
  if (process.env.GOOGLE_REDIRECT_URI && !process.env.GOOGLE_REDIRECT_URI.includes("localhost")) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  const base = getBaseUrl(request);
  return `${base}/api/auth/google/callback`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const paramClientId = searchParams.get("client_id");
  const clientId =
    paramClientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const redirectUri = getRedirectUri(request);
  const baseUrl = getBaseUrl(request);

  if (!clientId || clientId.trim().length < 10 || clientId.includes("your-google-client-id")) {
    return NextResponse.redirect(
      new URL(
        "/?login_demo=true&msg=Missing+Google+Client+ID.+Add+NEXT_PUBLIC_GOOGLE_CLIENT_ID+in+.env.local",
        baseUrl
      )
    );
  }

  // Standard non-sensitive scopes: does not trigger Google verification blocking
  // Fetches real Name, Email, Profile Picture, and Google ID
  const scopes = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: redirectUri,
    client_id: clientId.trim(),
    access_type: "offline",
    response_type: "code",
    prompt: "consent select_account",
    include_granted_scopes: "true",
    scope: scopes.join(" "),
  };

  const qs = new URLSearchParams(options).toString();
  return NextResponse.redirect(`${rootUrl}?${qs}`);
}
