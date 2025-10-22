import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/admin", "/profile", "/orders"];
const AUTH_PAGES = ["/", "/signin", "/signup"];

function isProtected(pathname: string) {
  return PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function isAuthPage(pathname: string) {
  return AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const authHeader = req.headers.get("authorization") ?? "";

  const cookieToken = req.cookies.get?.("app_token")?.value ?? "";

  const hasToken = Boolean(cookieToken) || /^Bearer\s+.+/i.test(authHeader);

  if (isProtected(pathname)) {
    if (!hasToken) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  if (hasToken && isAuthPage(pathname)) {
    if (!(pathname === "/dashboard" || pathname.startsWith("/dashboard/"))) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/signin",
    "/signup",
    "/",
  ],
};
