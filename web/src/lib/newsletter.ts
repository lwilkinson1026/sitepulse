/**
 * Newsletter / “keep up with SitePulse” offer. Amount and code are env-overridable
 * so the marketing copy, welcome email, and API stay in lockstep without a
 * Stripe coupon (checkout has no promo-code field today).
 */

export const DEFAULT_NEWSLETTER_DISCOUNT_AMOUNT_USD = 100;
export const DEFAULT_NEWSLETTER_DISCOUNT_CODE = "DELIVERY100";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type NewsletterOffer = {
  amountUsd: number;
  code: string;
};

export type NewsletterInput = {
  email: string;
  firstName: string;
  /** Honeypot — real people leave this empty. */
  website: string;
  eventId: string;
  source: string;
};

export type NewsletterValidation =
  | { ok: true; value: NewsletterInput }
  | { ok: false; error: string };

function envInt(name: string, fallback: number): number {
  const raw = (process.env[name] ?? "").trim();
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : fallback;
}

function envStr(name: string, fallback: string): string {
  const raw = (process.env[name] ?? "").trim();
  return raw || fallback;
}

export function newsletterOffer(): NewsletterOffer {
  return {
    amountUsd: envInt(
      "NEWSLETTER_DISCOUNT_AMOUNT_USD",
      DEFAULT_NEWSLETTER_DISCOUNT_AMOUNT_USD,
    ),
    code: envStr("NEWSLETTER_DISCOUNT_CODE", DEFAULT_NEWSLETTER_DISCOUNT_CODE),
  };
}

export function formatOfferUsd(amountUsd: number): string {
  return `$${Math.round(amountUsd)}`;
}

export function offerHeadline(amountUsd: number): string {
  return `Sign up for updates and get ${formatOfferUsd(amountUsd)} off delivery`;
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function parseNewsletterInput(body: unknown): NewsletterValidation {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON body" };
  }
  const rec = body as Record<string, unknown>;
  const email = str(rec.email, 320).toLowerCase();
  const firstName = str(rec.firstName ?? rec.first_name, 80);
  const website = str(rec.website, 200);
  const eventId = str(rec.event_id, 200);
  const source = str(rec.source, 40);

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  return {
    ok: true,
    value: { email, firstName, website, eventId, source },
  };
}

export function isHoneypot(website: string): boolean {
  return website.length > 0;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function welcomeEmail(
  offer: NewsletterOffer,
  opts: { firstName: string; origin: string },
): { subject: string; text: string; html: string } {
  const dollars = formatOfferUsd(offer.amountUsd);
  const hello = opts.firstName ? `Hi ${opts.firstName},` : "Hi,";
  const planUrl = `${opts.origin.replace(/\/$/, "")}/plan`;
  const subject = `Your ${dollars} off SitePulse delivery`;
  const text = [
    hello,
    "",
    `Thanks for signing up. Here's ${dollars} off delivery on your first SitePulse unit.`,
    "",
    `Code: ${offer.code}`,
    "",
    `Start a subscription at ${planUrl} and mention ${offer.code} in your notes, or reply to this email. We'll take ${dollars} off the one-time delivery fee.`,
    "",
    "Checkout doesn't have a promo-code box yet — a person on the team applies it.",
    "",
    "We'll also send occasional shipping and field notes. No spam.",
    "",
    "— SitePulse",
    "Coeur d'Alene, Idaho",
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111;background:#fff;padding:32px">
      <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#666">SitePulse</div>
      <h1 style="font-size:28px;letter-spacing:-.03em;margin:16px 0 8px;font-weight:800">Your ${escapeHtml(dollars)} off delivery</h1>
      <p>${escapeHtml(hello)}</p>
      <p>Thanks for signing up. Use this code for ${escapeHtml(dollars)} off delivery on your first SitePulse unit.</p>
      <p style="font-family:ui-monospace,monospace;font-size:22px;letter-spacing:.12em;font-weight:700;border:1px solid #111;display:inline-block;padding:12px 20px;margin:8px 0">${escapeHtml(offer.code)}</p>
      <p>Start a subscription at <a href="${escapeHtml(planUrl)}">${escapeHtml(planUrl)}</a> and mention <strong>${escapeHtml(offer.code)}</strong> in your notes, or reply to this email. A person on the team applies it — checkout doesn't have a promo-code box yet.</p>
      <p style="color:#555;font-size:13px">We'll also send occasional shipping and field notes. No spam.</p>
      <p style="color:#555;font-size:13px">— SitePulse · Coeur d'Alene, Idaho</p>
    </div>
  `;

  return { subject, text, html };
}
