import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for the token in cookies
  const token = request.cookies.get("dx_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Define routes that require a login
  const isProtectedRoute =
    pathname.startsWith("/products/") || pathname === "/";

  // 2. Define auth routes (don't show login if already logged in)
  const isAuthRoute = pathname === "/login" || pathname === "/sign-up";

  // Redirect to login if no token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if already logged in
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // This matcher ensures the middleware runs on all pages except static files/images
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
