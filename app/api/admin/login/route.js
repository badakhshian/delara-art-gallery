import { NextResponse } from "next/server";
import { adminSessionToken, isValidAdminSession } from "@/lib/adminSession";

// Each wrong password waits this long before answering, so guessing
// passwords one after another becomes very slow.
const FAILED_LOGIN_DELAY_MS = 2000;

export async function POST(request) {
  const { password } = await request.json();

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin login isn't configured yet. Add ADMIN_PASSWORD to your environment." },
      { status: 500 }
    );
  }

  const ok =
    typeof password === "string" &&
    password.length <= 200 &&
    (await isValidAdminSession(await adminSessionToken(password)));
  if (!ok) {
    await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY_MS));
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", await adminSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
