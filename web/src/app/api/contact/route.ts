import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  // Fallback: if the email provider isn't configured, log so nothing is lost.
  if (!apiKey || !to || !from) {
    console.warn(
      "[contact] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not set — logging submission instead of sending",
    );
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

  const subject = `Sitepulse contact — ${topic || "General"} — ${name}`;
  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "(none)"}`,
    `Topic: ${topic || "(none)"}`,
    "",
    message,
  ];
  const html = `
    <table style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.5">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
      <tr><td><strong>Company</strong></td><td>${escapeHtml(company || "(none)")}</td></tr>
      <tr><td><strong>Topic</strong></td><td>${escapeHtml(topic || "(none)")}</td></tr>
    </table>
    <p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text: lines.join("\n"),
      html,
    });
    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { error: "Could not send your message. Please try again." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
