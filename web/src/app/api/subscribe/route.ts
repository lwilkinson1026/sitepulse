import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSubscribersTable } from "@/lib/db";

export const runtime = "nodejs";

type SubscribeBody = {
  email?: unknown;
  consent?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: NextRequest) {
  let body: SubscribeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = str(body.email).toLowerCase();
  const consent = body.consent === true;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Please check the box to opt in to email updates" },
      { status: 400 },
    );
  }

  // Fallback: if the database isn't configured (e.g. local dev), log so
  // nothing is lost.
  if (!sql) {
    console.warn(
      "[subscribe] DATABASE_URL not set — logging subscription instead of storing",
    );
    console.log("[subscribe] opt-in", { email, at: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  }

  try {
    await ensureSubscribersTable(sql);
    await sql`
      INSERT INTO subscribers (email) VALUES (${email})
      ON CONFLICT (email) DO NOTHING
    `;
  } catch (err) {
    console.error("[subscribe] db insert failed:", err);
    return NextResponse.json(
      { error: "Could not add you to the list. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
