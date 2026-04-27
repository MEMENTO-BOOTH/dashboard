import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "capsule_session";

export async function GET(req: NextRequest) {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  return NextResponse.redirect(new URL("/login", req.url));
}
