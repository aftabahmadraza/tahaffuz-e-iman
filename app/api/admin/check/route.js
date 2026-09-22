import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidSessionCookie, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return NextResponse.json({ loggedIn: isValidSessionCookie(session) });
}
