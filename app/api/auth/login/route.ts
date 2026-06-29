import { NextRequest, NextResponse } from "next/server";
import { authCookieName, createAuthCookie, validateCredentials } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (!body.username || !body.password || !validateCredentials(body.username, body.password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: authCookieName(),
    value: await createAuthCookie(body.username),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}
