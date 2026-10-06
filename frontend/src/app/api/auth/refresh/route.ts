import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const returnTo = req.nextUrl.searchParams.get("returnTo") || "/";

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Đồng bộ cấu hình domain chính xác với logic của NestJS Backend
  const cookieDomain =
    process.env.NODE_ENV === "production"
      ? ".giahuynguyen28.id.vn"
      : "localhost";

  try {
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: { Cookie: `refreshToken=${refreshToken}` },
      },
    );

    // XỬ LÝ KHI REFRESH THẤT BẠI (Token hết hạn/bị thu hồi)
    if (!backendResponse.ok) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("returnTo", returnTo);
      const failureResponse = NextResponse.redirect(loginUrl);

      // Ép buộc xóa cookie bằng cách truyền đúng domain
      failureResponse.cookies.set({
        name: "accessToken",
        value: "",
        maxAge: 0,
        path: "/",
        domain: cookieDomain,
      });
      failureResponse.cookies.set({
        name: "refreshToken",
        value: "",
        maxAge: 0,
        path: "/",
        domain: cookieDomain,
      });

      return failureResponse;
    }

    // XỬ LÝ KHI REFRESH THÀNH CÔNG
    const finalDestination = returnTo === "/login" ? "/" : returnTo;
    const successResponse = NextResponse.redirect(
      new URL(finalDestination, req.url),
    );

    // Pass toàn bộ chuỗi Set-Cookie từ backend (đã chứa sẵn cấu hình Domain chuẩn) sang client
    const setCookies = backendResponse.headers.getSetCookie();
    setCookies.forEach((cookieString) => {
      successResponse.headers.append("Set-Cookie", cookieString);
    });

    return successResponse;
  } catch {
    const errorResponse = NextResponse.redirect(new URL("/login", req.url));
    // Ép buộc xóa cookie cả khi có lỗi network
    errorResponse.cookies.set({
      name: "accessToken",
      value: "",
      maxAge: 0,
      path: "/",
      domain: cookieDomain,
    });
    errorResponse.cookies.set({
      name: "refreshToken",
      value: "",
      maxAge: 0,
      path: "/",
      domain: cookieDomain,
    });

    return errorResponse;
  }
}
