import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. MUST be named 'middleware' - Next.js/Vercel won't recognize 'proxy'
export function middleware(request: NextRequest) {
  // Use .get() and check for the .value specifically
  const token = request.cookies.get("dx_token")?.value;
  const { pathname } = request.nextUrl;

  // Define your route logic
  const isProtectedRoute =
    pathname === "/" ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/admin");

  const isAuthRoute = pathname === "/login" || pathname === "/sign-up";

  // 2. Redirect to Login if no token is found on a protected route
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    // Optional: add a 'callback' or 'from' query param to redirect back after login
    // loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Redirect to Home if token exists and user tries to access login/signup
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 4. Matcher configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (svg, png, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)",
  ],
};
