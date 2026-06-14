import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "capsule_session";
const PUBLIC_PATHS = ["/login", "/photos"];
const AUTH_PAGES = ["/login"];

function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get(COOKIE_NAME)?.value;

  if (!(session || matchesPath(pathname, PUBLIC_PATHS))) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (session && matchesPath(pathname, AUTH_PAGES)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
