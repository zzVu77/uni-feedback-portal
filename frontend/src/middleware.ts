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

// Helper function to get the dashboard URL based on the user's role

async function verifyToken(token: string): Promise<JwtPayloadCustom | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayloadCustom;
  } catch {
    console.log("Access token is expired or invalid");
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  // Define route types
  const isPublicRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentRoute = pathname.startsWith("/student");
  const isStaffRoute = pathname.startsWith("/staff");

  // If no access token and no refresh token are present
  if (!accessToken && !refreshToken) {
    if (isPublicRoute) {
      return NextResponse.next();
    } else {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If access token is present
  if (accessToken) {
    // Verify the access token
    const validPayload = await verifyToken(accessToken);

    // If the token is invalid and there's a refresh token, attempt to refresh
    if (!validPayload && refreshToken) {
      const refreshUrl = new URL("/api/auth/refresh", req.url);
      refreshUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(refreshUrl);
    }

    // If the token is valid
    if (validPayload) {
      const userRole = validPayload.role;
      const dashboardUrl = getUrlByRole(userRole);

      // If the user is authenticated and trying to access a public route, redirect to their dashboard
      if (isPublicRoute) {
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }

      // Role-Based Access Control (RBAC) Logic

      // 1. If trying to access Admin routes but role is not ADMIN
      if (isAdminRoute && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }

      // 2. If trying to access Student routes but role is not STUDENT
      if (isStudentRoute && userRole !== "STUDENT") {
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }

      // 3. If trying to access Staff routes but role is not DEPARTMENT_STAFF
      if (isStaffRoute && userRole !== "DEPARTMENT_STAFF") {
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }

      // If everything matches (e.g., Admin accessing /admin), allow the request
      return NextResponse.next();
    }
  }

  // If no access token but there's a refresh token (Fallback case)
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
  ],
};
