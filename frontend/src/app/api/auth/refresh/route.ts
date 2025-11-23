import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  // Get returnTo from query parameters, default to "/"
  const returnTo = req.nextUrl.searchParams.get("returnTo") || "/";
  // If no refresh token, redirect to login
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // If refresh token exists, call the backend endpoint to refresh the access token
  try {
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      },
    );

    const redirectUrl = backendResponse.ok ? returnTo : "/login";
    // Create a new response to redirect to the appropriate URL
    const response = NextResponse.redirect(new URL(redirectUrl, req.url));
    // Copy Set-Cookie headers from the backend response to the new response
    backendResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        response.headers.append("Set-Cookie", value);
      }
    });
    // If the backend response is not ok, clear cookies and redirect to login. To make sure invalid refresh token is removed.
    if (!backendResponse.ok) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("returnTo", returnTo);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
    // Return the response which redirects to "returnTo" path or /login
    return response;
  } catch (error) {
    console.error("Error proxying refresh token request:", error);
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}
