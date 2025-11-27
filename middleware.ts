import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth-token")?.value || null;

  let isAuthenticated = false;
  let isSuperAdmin = false;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      isAuthenticated = true;
      isSuperAdmin = !!decoded.isSuperAdmin;
    } catch {
      isAuthenticated = false;
      isSuperAdmin = false;
    }
  }

  const protectedPaths = ["/dashboard", "/admin"];
  const adminPaths = ["/admin"];

  const isProtected = protectedPaths.some((p) =>
    pathname.startsWith(p)
  );
  const isAdminPath = adminPaths.some((p) =>
    pathname.startsWith(p)
  );

  // Belum login tapi akses protected → ke /login
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Sudah login tapi akses /login → lempar ke /dashboard
  if (pathname === "/login" && isAuthenticated) {
    const dashUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashUrl);
  }

  // Bukan super admin tapi akses /admin → balikin ke /dashboard
  if (isAdminPath && isAuthenticated && !isSuperAdmin) {
    const dashUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/admin/:path*"],
};
