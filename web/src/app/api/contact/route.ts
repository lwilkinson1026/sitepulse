import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  topic?: unknown;
  message?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: NextRequest) {
  let body: ContactBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = str(body.name);
  const email = str(body.email);
  const company = str(body.company);
  const topic = str(body.topic);
  const message = str(body.message);

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: "Please include a little more detail in your message" },
      { status: 400 },
    );
  }

  // Email delivery is not wired up yet. Until a provider (e.g. Resend) and a
  // destination inbox are configured, submissions are logged server-side so
  // nothing is lost. Replace this with the real send once those are set.
  console.log("[contact] submission", {
    name,
    email,
    company: company || "(none)",
    topic: topic || "(none)",
    message,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
