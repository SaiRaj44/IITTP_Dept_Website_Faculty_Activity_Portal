import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define basePath constant
const basePath = "";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow all auth-related paths and callback to bypass this middleware
  if (path.includes("/api/auth/") || path.includes("/callback/google")) {
    return NextResponse.next();
  }

  // Get auth token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("Token:", !!token, "Path:", path);

  // Remove basePath from path for easier path matching
  const pathWithoutBase = path.startsWith(basePath)
    ? path.slice(basePath.length)
    : path;

  // Root path handling - redirect to dashboard if authenticated
  if (pathWithoutBase === " " || pathWithoutBase === "/") {
    if (token) {
      const dashboardUrl = new URL(`${basePath}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    // If not authenticated, allow access to root page
    return NextResponse.next();
  }

  // Auth handling for specific paths
  if (!token) {
    // Allow access to signin page
    if (pathWithoutBase === "/signin") {
      return NextResponse.next();
    }

    // Redirect other requests to signin
    const signinUrl = new URL(`${basePath}/signin`, request.url);
    return NextResponse.redirect(signinUrl);
  }

  // Redirect authenticated users away from signin
  if (pathWithoutBase === "/signin") {
    const dashboardUrl = new URL(`${basePath}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Protect activity-portal routes for admin and faculty only
  if (pathWithoutBase.startsWith("/activity-portal")) {
    if (!["admin", "faculty"].includes(token.role as string)) {
      const notFoundUrl = new URL(`${basePath}/not-found`, request.url);
      return NextResponse.redirect(notFoundUrl);
    }
  }

  if (pathWithoutBase.startsWith("/website-updates")) {
    if (!["admin", "faculty", "staff"].includes(token.role as string)) {
      const notFoundUrl = new URL(`${basePath}/not-found`, request.url);
      return NextResponse.redirect(notFoundUrl);
    }
  }

  if (pathWithoutBase.startsWith("/asset-management")) {
    if (!["admin", "faculty", "staff"].includes(token.role as string)) {
      const notFoundUrl = new URL(`${basePath}/not-found`, request.url);
      return NextResponse.redirect(notFoundUrl);
    }
  }

  if (pathWithoutBase.startsWith("/reports")) {
    if (!["admin", "faculty", "staff"].includes(token.role as string)) {
      const notFoundUrl = new URL(`${basePath}/not-found`, request.url);
      return NextResponse.redirect(notFoundUrl);
    }
  }

  // Bypass middleware for static files in /public
  if (
    pathWithoutBase.startsWith("/asset-management") &&
    pathWithoutBase.split("/").length > 2
  ) {
    return NextResponse.next();
  }

  // Add headers to disable caching for static files
  const response = NextResponse.next();
  if (pathWithoutBase.startsWith("/asset-management")) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }
  return response;
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/dashboard/:path*",
    "/settings/:path*",
    "/activity-portal/:path*",
    "/asset-management/:path*",
    "/reports/:path*",
    "/website-updates/:path*", // Add this line to protect website-updates
    "/callback/google",
    "/api/auth/callback/:provider*",
  ],
};
