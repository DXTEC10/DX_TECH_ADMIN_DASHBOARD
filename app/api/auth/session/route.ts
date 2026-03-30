import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("dx_token", token, {
    httpOnly: true, // JS can't read it — more secure
    secure: true, // Always secure on Vercel (HTTPS only)
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return response;
}
