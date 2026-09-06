import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/session";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username: parsed.data.username } });

  // Always run compare() even when the user doesn't exist, against a dummy
  // hash. Otherwise a missing-user request returns instantly while a
  // wrong-password request takes ~100ms doing the real bcrypt compare — an
  // attacker can use that timing gap to enumerate valid usernames.
  const hashToCompare = user?.passwordHash ?? "$2a$12$invalidsaltinvalidsaltinvalidsaltO";
  const isValid = await compare(parsed.data.password, hashToCompare);

  if (!user || !isValid) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const token = await createSessionToken({ sub: user.id, username: user.username });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,                              // JS on the page can't read it — blocks XSS token theft
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}