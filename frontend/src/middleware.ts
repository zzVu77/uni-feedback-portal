/* eslint-disable*/
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWTPayload, jwtVerify } from "jose";
import { getUrlByRole } from "./utils/getUrlByRole";

const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

export interface JwtPayloadCustom extends JWTPayload {
  sub: string;
  role: "DEPARTMENT_STAFF" | "STUDENT" | "ADMIN";
  fullName: string;
  departmentId?: string;
}

async function verifyToken(token: string): Promise<JwtPayloadCustom | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayloadCustom;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  // Define route types
  const isRootRoute = pathname === "/";
  const isPublicRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentRoute = pathname.startsWith("/student");
  const isStaffRoute = pathname.startsWith("/staff");

  // --------------------------------------------------------
  // CASE 1: Not Authenticated (No tokens present)
  // --------------------------------------------------------
  if (!accessToken && !refreshToken) {
    // Allow access to public routes
    if (isPublicRoute) {
      return NextResponse.next();
    }
    // Redirect root or protected routes to Login
    else {
      const loginUrl = new URL("/login", req.url);
      // Set returnTo parameter (skip for root URL)
      if (!isRootRoute) {
        loginUrl.searchParams.set("returnTo", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  // --------------------------------------------------------
  // CASE 2: Access Token present (Verification required)
  // --------------------------------------------------------
  if (accessToken) {
    // Verify token once
    const validPayload = await verifyToken(accessToken);

    // 2.1: Invalid/Expired Access Token but Refresh Token exists -> Attempt Refresh
    if (!validPayload && refreshToken) {
      const refreshUrl = new URL("/api/auth/refresh", req.url);
      refreshUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(refreshUrl);
    }

    // 2.2: Valid Token -> RBAC Authorization
    if (validPayload) {
      const userRole = validPayload.role;
      const dashboardUrl = getUrlByRole(userRole);

      // A. Redirect authenticated users from Public/Root pages to their Dashboard
      if (isPublicRoute || isRootRoute) {
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }

      // B. RBAC - Prevent cross-role access
      if (isAdminRoute && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }
      if (isStudentRoute && userRole !== "STUDENT") {
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }
      if (isStaffRoute && userRole !== "DEPARTMENT_STAFF") {
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }

      // C. Allow access if role matches
      return NextResponse.next();
    }
  }

  // --------------------------------------------------------
  // CASE 3: Only Refresh Token present (Fallback)
  // --------------------------------------------------------
  else if (refreshToken) {
    const refreshUrl = new URL("/api/auth/refresh", req.url);
    refreshUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(refreshUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/test",
    "/login",
    "/signup",
    "/student/:path*",
    "/admin/:path*",
    "/staff/:path*",
    "/forum/:path*",
    "/notifications/:path*",
    "/change-password/:path*",
  ],
};
