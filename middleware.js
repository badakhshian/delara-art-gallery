import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (isAdminPage || isAdminApi) {
    const session = request.cookies.get("admin_session")?.value;
    const authorized = !!session && session === process.env.ADMIN_PASSWORD;

    if (!authorized) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
