import { NextResponse } from "next/server";
import { isValidAdminSession } from "@/lib/adminSession";

// Strips a leading /fr from a path: "/fr/timeline" -> "/timeline", "/fr" -> "/".
function stripFr(pathname) {
  if (pathname === "/fr") return "/";
  if (pathname.startsWith("/fr/")) return pathname.slice(3);
  return null;
}

async function requireAdmin(request, pathname) {
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";
  if (!isAdminPage && !isAdminApi) return null;

  const session = request.cookies.get("admin_session")?.value;
  const authorized = !!session && (await isValidAdminSession(session));
  if (authorized) return null;

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

// - Admin pages/APIs require the admin session cookie.
// - French pages live under /fr: /fr/<path> is served by the same page as
//   /<path>, with an x-lang: fr request header the pages read to pick the
//   language. Everything else gets x-lang: en (overwriting anything a
//   client might send).
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const blocked = await requireAdmin(request, pathname);
  if (blocked) return blocked;

  const frPath = stripFr(pathname);
  const headers = new Headers(request.headers);

  if (frPath !== null) {
    // The admin and APIs are English-only; send /fr/admin… etc. to the real
    // URL so they still go through the admin check above.
    if (frPath.startsWith("/admin") || frPath.startsWith("/api")) {
      return NextResponse.redirect(new URL(frPath, request.url));
    }
    const url = request.nextUrl.clone();
    url.pathname = frPath;
    headers.set("x-lang", "fr");
    return NextResponse.rewrite(url, { request: { headers } });
  }

  headers.set("x-lang", "en");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Every page (not static files or Next internals), plus the admin API.
  matcher: ["/((?!_next/|api/|images/|.*\\..*).*)", "/api/admin/:path*"],
};
