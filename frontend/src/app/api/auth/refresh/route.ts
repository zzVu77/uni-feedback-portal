import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  // Get 'returnTo' from query parameters, default to "/"
  const returnTo = req.nextUrl.searchParams.get("returnTo") || "/";

  // 1. Validation: If no refresh token is present, redirect to login immediately
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // 2. Call the backend endpoint to refresh the access token
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      },
    );

    // 3. Handle Failure (Early Return Pattern)
    // If the backend refuses to refresh (e.g., token expired/invalid/revoked)
    if (!backendResponse.ok) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("returnTo", returnTo);

      const failureResponse = NextResponse.redirect(loginUrl);

      // Clear invalid cookies to prevent infinite loops
      failureResponse.cookies.delete("accessToken");
      failureResponse.cookies.delete("refreshToken");

      return failureResponse;
    }

    // 4. Handle Success (Happy Path)
    // Create a new response to redirect the user back to their intended destination
    const successResponse = NextResponse.redirect(new URL(returnTo, req.url));

    // Copy 'Set-Cookie' headers from the backend response to the Next.js response
    // This ensures the new Access Token is set in the browser
    backendResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        successResponse.headers.append("Set-Cookie", value);
      }
    });

    return successResponse;
  } catch (error) {
    // 5. Handle Network/Unexpected Errors
    console.error("Error proxying refresh token request:", error);

    const errorResponse = NextResponse.redirect(new URL("/login", req.url));
    errorResponse.cookies.delete("accessToken");
    errorResponse.cookies.delete("refreshToken");

    return errorResponse;
  }
}
