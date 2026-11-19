import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { formatAttributionLines } from "@/lib/attribution";
import {
  GUIDE_COOKIE,
  GUIDE_MAX_AGE,
  issueAccessToken,
} from "@/lib/field-guide";
import {
  attributionFromRequest,
  clientIpFromRequest,
  metaCookiesFromRequest,
  sendMetaCapiEvent,
} from "@/lib/meta-capi";
import { PRODUCT } from "@/lib/tracking";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

type Body = {
  email?: unknown;
  company?: unknown;
  /** Honeypot — real people leave this empty. */
  website?: unknown;
  event_id?: unknown;
};

/** Record the lead: email it if Resend is configured, otherwise log it. */
async function captureLead(
  email: string,
  company: string,
  attrLines: ReadonlyArray<readonly [string, string]>,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.warn(
      "[field-guide] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not set — logging lead instead of sending",
    );
    console.log("[field-guide] lead", {
      email,
      company: company || "(none)",
      attribution: Object.fromEntries(attrLines),
      at: new Date().toISOString(),
    });
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Sitepulse field guide download — ${email}`,
      text: [
        `Email: ${email}`,
        `Company: ${company || "(none)"}`,
        `At: ${new Date().toISOString()}`,
        ...attrLines.map(([k, v]) => `${k}: ${v}`),
      ].join("\n"),
      html: `
        <table style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.5">
          <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><strong>Company</strong></td><td>${escapeHtml(company || "(none)")}</td></tr>
          <tr><td><strong>At</strong></td><td>${new Date().toISOString()}</td></tr>
          ${attrLines
            .map(
              ([k, v]) =>
                `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`,
            )
            .join("")}
        </table>
      `,
    });
    if (error) console.error("[field-guide] Resend error:", error);
  } catch (err) {
    console.error("[field-guide] lead notification failed:", err);
  }
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Silently accept-and-drop bot submissions so they don't learn anything.
  if (str(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const email = str(body.email);
  const company = str(body.company);
  const eventId = str(body.event_id);
  const attr = attributionFromRequest(req);
  const metaCookies = metaCookiesFromRequest(req);
  const attrLines = formatAttributionLines(attr);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  // Never block the download on the notification path.
  await captureLead(email, company, attrLines);

  if (eventId) {
    void sendMetaCapiEvent({
      eventName: "Lead",
      eventId,
      eventSourceUrl: `${req.headers.get("origin") ?? req.nextUrl.origin}/field-guide`,
      user: {
        email,
        fbp: metaCookies.fbp,
        fbc: metaCookies.fbc || attr?.last.fbc,
        clientIp: clientIpFromRequest(req),
        clientUserAgent: req.headers.get("user-agent") || undefined,
      },
      custom: {
        content_name: "Sitepulse field guide",
        content_ids: PRODUCT.content_ids,
        content_category: "field_guide",
      },
    });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(GUIDE_COOKIE, issueAccessToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GUIDE_MAX_AGE,
  });
  return res;
}
