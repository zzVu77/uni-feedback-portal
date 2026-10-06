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
    if (!backendResponse.ok) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("returnTo", returnTo);

      const failureResponse = NextResponse.redirect(loginUrl);

      // Clear invalid cookies to prevent infinite loops
      failureResponse.cookies.delete("accessToken");
      failureResponse.cookies.delete("refreshToken");

      return failureResponse;
    }

    // 4. Handle Success (Happy Path) - ĐÃ ĐƯỢC CẬP NHẬT
    // Nếu returnTo đang trỏ về /login, ta ép hướng về "/" để tránh kẹt lại ở trang đăng nhập
    const finalDestination = returnTo === "/login" ? "/" : returnTo;
    const successResponse = NextResponse.redirect(
      new URL(finalDestination, req.url),
    );

    // Sử dụng getSetCookie() để lấy mảng các cookie chuẩn thay vì dùng forEach trên Headers
    const setCookies = backendResponse.headers.getSetCookie();

    setCookies.forEach((cookie) => {
      successResponse.headers.append("Set-Cookie", cookie);
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
