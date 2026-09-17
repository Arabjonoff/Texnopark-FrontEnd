import { NextResponse, type NextRequest } from "next/server";

// Tez himoya: token cookie'si bo'lmasa dashboard sahifalari umuman render qilinmaydi.
// Tokenning haqiqiyligi (muddati, staff huquqi) har so'rovda backend tomonidan tekshiriladi.
const TOKEN_COOKIE = "tp_dashboard_token";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLogin = pathname === "/dashboard/login";
  const hasToken = request.cookies.has(TOKEN_COOKIE);

  if (!isLogin && !hasToken) {
    const url = new URL("/dashboard/login", request.url);
    if (pathname !== "/dashboard") url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
