import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/?login_error=${encodeURIComponent(error || "No authorization code received")}`, baseUrl)
    );
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";

  if (!clientSecret || clientSecret.trim().length === 0) {
    return NextResponse.redirect(
      new URL(
        `/?login_error=${encodeURIComponent("Missing GOOGLE_CLIENT_SECRET. Please paste your client secret into .env.local.")}`,
        baseUrl
      )
    );
  }

  try {
    // 1. Exchange authorization code for Google access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Google token error:", tokenData);
      return NextResponse.redirect(
        new URL(
          `/?login_error=${encodeURIComponent(tokenData.error_description || tokenData.error || "Failed to exchange token with Google")}`,
          baseUrl
        )
      );
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch basic Google user profile (name, email, picture)
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userinfo = await userinfoResponse.json();

    // 3. Query Google People API for full profile & phone number
    let phone = "";
    let gender = "";
    let birthday = "";
    let address = "";

    try {
      const peopleResponse = await fetch(
        "https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,phoneNumbers,birthdays,genders,addresses,photos",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (peopleResponse.ok) {
        const peopleData = await peopleResponse.json();

        // Extract primary phone number
        if (peopleData.phoneNumbers && peopleData.phoneNumbers.length > 0) {
          const primaryPhone =
            peopleData.phoneNumbers.find((p) => p.metadata?.primary) || peopleData.phoneNumbers[0];
          phone = primaryPhone.value || primaryPhone.canonicalForm || "";
        }

        // Extract birthday
        if (peopleData.birthdays && peopleData.birthdays.length > 0) {
          const b = peopleData.birthdays[0].date;
          if (b && b.year) {
            birthday = `${b.year}-${String(b.month || 1).padStart(2, "0")}-${String(b.day || 1).padStart(2, "0")}`;
          }
        }

        // Extract gender
        if (peopleData.genders && peopleData.genders.length > 0) {
          gender = peopleData.genders[0].formattedValue || peopleData.genders[0].value || "";
        }

        // Extract address
        if (peopleData.addresses && peopleData.addresses.length > 0) {
          address = peopleData.addresses[0].formattedValue || "";
        }
      }
    } catch (peopleErr) {
      console.warn("Google People API fetch skipped or not authorized:", peopleErr);
    }

    // Generate unique healthcare ID based on real Google account ID
    const shortId = (userinfo.id || "").slice(-6) || Math.floor(100000 + Math.random() * 900000);
    const healthId = `G1-${shortId}`;

    // Construct unified user profile with real Google data
    const userProfile = {
      id: userinfo.id,
      name: userinfo.name || `${userinfo.given_name || ""} ${userinfo.family_name || ""}`.trim() || "Google User",
      givenName: userinfo.given_name || "",
      familyName: userinfo.family_name || "",
      email: userinfo.email || "",
      emailVerified: userinfo.verified_email ?? true,
      picture: userinfo.picture || "",
      phone: phone || "",
      gender: gender || "",
      birthday: birthday || "",
      address: address || "",
      healthId,
      provider: "google",
      createdAt: new Date().toISOString(),
    };

    const redirectUrl = new URL("/", baseUrl);
    redirectUrl.searchParams.set("login_success", "1");
    redirectUrl.searchParams.set("user", JSON.stringify(userProfile));

    const response = NextResponse.redirect(redirectUrl);

    // Set auth cookie
    response.cookies.set({
      name: "g1_user",
      value: JSON.stringify(userProfile),
      httpOnly: false, // Accessible to client-side auth state
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    response.cookies.set({
      name: "g1_auth_token",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Google OAuth callback exception:", err);
    return NextResponse.redirect(
      new URL(`/?login_error=${encodeURIComponent(err.message || "Authentication failed")}`, baseUrl)
    );
  }
}
