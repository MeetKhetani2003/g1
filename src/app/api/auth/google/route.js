import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const paramClientId = searchParams.get("client_id");
  const clientId =
    paramClientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";

  if (!clientId || clientId.trim().length < 10 || clientId.includes("your-google-client-id")) {
    return NextResponse.redirect(
      new URL(
        "/?login_demo=true&msg=Missing+Google+Client+ID.+Add+NEXT_PUBLIC_GOOGLE_CLIENT_ID+in+.env.local",
        request.url
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
