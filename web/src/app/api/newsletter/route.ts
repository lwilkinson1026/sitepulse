import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { formatAttributionLines } from "@/lib/attribution";
import {
  attributionFromRequest,
  clickIdsFromRequest,
  clientIpFromRequest,
  clientUserAgentFromRequest,
  sendMetaCapiEvent,
} from "@/lib/meta-capi";
import {
  isHoneypot,
  newsletterOffer,
  parseNewsletterInput,
  welcomeEmail,
} from "@/lib/newsletter";
import { notifyTeam } from "@/lib/notify";
import { PRODUCT } from "@/lib/tracking";

export const runtime = "nodejs";

type ContactLookup = { id: string } | null;

function resendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

function isNotFound(error: { statusCode?: number | null; message?: string } | null) {
  if (!error) return false;
  if (error.statusCode === 404) return true;
  return /not found/i.test(error.message ?? "");
}

/**
 * Resend Contacts is the retrievable list (dashboard → Contacts → Export).
 * Lookup-before-create so a repeat email is a no-op instead of a second welcome.
 */
async function findContact(
  resend: Resend,
  email: string,
): Promise<ContactLookup | "unavailable"> {
  try {
    const { data, error } = await resend.contacts.get({ email });
    if (data?.id) return { id: data.id };
    if (isNotFound(error)) return null;
    if (error) {
      console.warn("[newsletter] contacts.get failed:", error);
      return "unavailable";
    }
    return null;
  } catch (err) {
    console.warn("[newsletter] contacts.get threw:", err);
    return "unavailable";
  }
}

async function createContact(
  resend: Resend,
  opts: { email: string; firstName: string },
): Promise<boolean> {
  const segmentId = (process.env.RESEND_NEWSLETTER_SEGMENT_ID ?? "").trim();
  try {
    const { error } = await resend.contacts.create({
      email: opts.email,
      firstName: opts.firstName || undefined,
      unsubscribed: false,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    });
    if (error) {
      console.error("[newsletter] contacts.create failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[newsletter] contacts.create threw:", err);
    return false;
  }
}

async function sendWelcome(
  resend: Resend,
  opts: {
    email: string;
    firstName: string;
    origin: string;
  },
): Promise<{ ok: boolean; error?: string }> {
  const from = process.env.CONTACT_FROM_EMAIL;
  const replyTo = process.env.CONTACT_TO_EMAIL;
  if (!from) {
    console.warn(
      "[newsletter] CONTACT_FROM_EMAIL not set — logging welcome instead of sending",
    );
    console.log("[newsletter] welcome", {
      email: opts.email,
      firstName: opts.firstName,
      offer: newsletterOffer(),
      at: new Date().toISOString(),
    });
    return { ok: true };
  }

  const mail = welcomeEmail(newsletterOffer(), {
    firstName: opts.firstName,
    origin: opts.origin,
  });

  try {
    const { error } = await resend.emails.send({
      from,
      to: opts.email,
      replyTo: replyTo || undefined,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (error) {
      console.error("[newsletter] welcome Resend error:", error);
      return { ok: false, error: "Could not send the welcome email. Please try again." };
    }
    return { ok: true };
  } catch (err) {
    console.error("[newsletter] welcome send failed:", err);
    return { ok: false, error: "Could not send the welcome email. Please try again." };
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseNewsletterInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { email, firstName, website, eventId, source } = parsed.value;

  // Silently accept-and-drop bot submissions so they don't learn anything.
  if (isHoneypot(website)) {
    return NextResponse.json({ ok: true });
  }

  const origin =
    req.headers.get("origin") ?? req.nextUrl.origin ?? "https://www.sitepulse.space";
  const attr = attributionFromRequest(req);
  const clickIds = clickIdsFromRequest(
    req,
    body as { fbp?: unknown; fbc?: unknown },
  );
  const attrLines = formatAttributionLines(attr);
  const offer = newsletterOffer();
  const resend = resendClient();

  if (resend) {
    const existing = await findContact(resend, email);
    if (existing && existing !== "unavailable") {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const welcome = await sendWelcome(resend, { email, firstName, origin });
    if (!welcome.ok) {
      return NextResponse.json(
        { error: welcome.error ?? "Could not send the welcome email. Please try again." },
        { status: 502 },
      );
    }

    if (existing !== "unavailable") {
      await createContact(resend, { email, firstName });
    }
  } else {
    console.warn(
      "[newsletter] RESEND_API_KEY not set — logging signup instead of storing / emailing",
    );
    console.log("[newsletter] signup", {
      email,
      firstName: firstName || "(none)",
      source: source || "(none)",
      offer,
      attribution: Object.fromEntries(attrLines),
      at: new Date().toISOString(),
    });
  }

  await notifyTeam(
    "newsletter",
    `Sitepulse newsletter signup — ${firstName || email}`,
    [
      ["Email", email],
      ["First name", firstName || "(none)"],
      ["Source", source || "(none)"],
      ["Offer", `${offer.code} · $${offer.amountUsd} off delivery`],
      ...attrLines,
    ],
    email,
  );

  if (eventId) {
    void sendMetaCapiEvent({
      eventName: "Lead",
      eventId,
      eventSourceUrl: `${origin}${source === "homepage" ? "/#updates" : "/"}`,
      user: {
        email,
        firstName: firstName || undefined,
        fbp: clickIds.fbp,
        fbc: clickIds.fbc,
        clientIp: clientIpFromRequest(req),
        clientUserAgent: clientUserAgentFromRequest(req),
      },
      custom: {
        content_name: "SitePulse newsletter",
        content_ids: PRODUCT.content_ids,
        content_category: "newsletter",
        value: offer.amountUsd,
        currency: PRODUCT.currency,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
