import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

const MUTATING_METHODS = new Set(["POST", "PATCH", "DELETE", "PUT"]);

// Exact match, not prefix must work with zero session, and must not
// accidentally widen to match an unrelated future route.
const PUBLIC_API_PATHS = new Set(["/api/auth/login", "/api/auth/logout"]);

// Only mutations require a session.
function isPublicRequest(pathname: string, method: string) {
  if (PUBLIC_API_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/api/") && !MUTATING_METHODS.has(method)) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");

  if (isPublicRequest(pathname, request.method)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let session = null;
  try {
    session = token ? await verifySessionToken(token) : null;
  } catch (error) {
    console.error("Session verification error:", error);
    session = null;
  }

  if (!session) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Defense-in-depth against a forged cross-site request carrying a stolen
  // cookie. SameSite=Lax already blocks the common case, so a missing
  // Origin header (non-browser clients) is allowed through rather than
  // blocked — this only rejects a *present but wrong* origin.
  if (isApiRoute && MUTATING_METHODS.has(request.method)) {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: "Cross-origin request blocked" }, { status: 403 });
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", session.sub);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/write/:path*", "/api/:path*"],
};