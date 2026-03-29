import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. MUST be named 'middleware' (case-sensitive)
export function middleware(request: NextRequest) {
  const token = request.cookies.get("dx_token")?.value;
  const { pathname } = request.nextUrl;

  // Define route types
  const isProtectedRoute =
    pathname === "/" ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/admin");

  const isAuthRoute = pathname === "/login" || pathname === "/sign-up";

  // CASE 1: User is NOT logged in and tries to access a protected page
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    // Optional: Store the page they were trying to reach to redirect them back later
    // loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // CASE 2: User IS logged in and tries to access login/signup
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // CASE 3: Everything else (public routes or valid sessions)
  return NextResponse.next();
}

// 2. The matcher defines where the middleware runs.
// This regex excludes internal Next.js files and static assets.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
