import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (request.nextUrl.pathname.startsWith("/chat") && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register") &&
    sessionCookie
  ) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/login", "/register"],
};
