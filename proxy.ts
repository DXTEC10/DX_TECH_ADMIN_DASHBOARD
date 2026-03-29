import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("dx_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname === "/https://dx-tech-admin-dashboard.vercel.app" ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/admin");

  const isAuthRoute = pathname === "/login" || pathname === "/sign-up";

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
