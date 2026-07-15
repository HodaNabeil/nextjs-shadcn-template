import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "@/lib/auth/auth.config";
import { safeCallbackUrl } from "@/lib/http/safe-callback-url";

const { auth } = NextAuth(authConfig);

const protectedRoutes = ["/cart", "/checkout"];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  if (request.auth) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.nextUrl.origin);
  loginUrl.searchParams.set("callbackUrl", safeCallbackUrl(pathname));

  return NextResponse.redirect(loginUrl);
});

export const config = {
  matcher: ["/cart", "/cart/:path*", "/checkout", "/checkout/:path*"],
};
