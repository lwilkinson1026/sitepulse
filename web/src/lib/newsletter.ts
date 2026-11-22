/**
 * Newsletter / “keep up with SitePulse” offer. Amount and code are env-overridable
 * so the marketing copy, welcome email, and /plan checkout stay in lockstep.
 * Checkout applies the code by reducing the delivery line item — no Stripe coupon.
 *
 * Delivery/monthly amounts are duplicated from rental.ts so this file stays
 * importable from the Node test runner (extensionless sibling imports fail
 * there). quoteDelivery tests lock them to rental.ts so they cannot drift.
 */

const RENT_MONTHLY_USD = 299;
const DELIVERY_FEE_USD = 150;
const DUE_TODAY_USD = RENT_MONTHLY_USD + DELIVERY_FEE_USD;

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

export function normalizePromoCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export type DeliveryQuote = {
  entered: string;
  applied: boolean;
  invalid: boolean;
  discountUsd: number;
  deliveryUsd: number;
  dueTodayUsd: number;
  matchedCode: string;
};

/**
 * Server-side source of truth for the delivery discount. An empty code is a
 * no-op; a mismatch is invalid but still checks out at the full delivery fee.
 */
export function quoteDelivery(
  rawCode: string,
  offer: NewsletterOffer = newsletterOffer(),
): DeliveryQuote {
  const entered = normalizePromoCode(rawCode);
  const matchedCode = normalizePromoCode(offer.code);
  if (!entered) {
    return {
      entered: "",
      applied: false,
      invalid: false,
      discountUsd: 0,
      deliveryUsd: DELIVERY_FEE_USD,
      dueTodayUsd: DUE_TODAY_USD,
      matchedCode,
    };
  }
  if (entered === matchedCode) {
    const discountUsd = Math.min(Math.max(0, offer.amountUsd), DELIVERY_FEE_USD);
    const deliveryUsd = DELIVERY_FEE_USD - discountUsd;
    return {
      entered,
      applied: true,
      invalid: false,
      discountUsd,
      deliveryUsd,
      dueTodayUsd: RENT_MONTHLY_USD + deliveryUsd,
      matchedCode,
    };
  }
  return {
    entered,
    applied: false,
    invalid: true,
    discountUsd: 0,
    deliveryUsd: DELIVERY_FEE_USD,
    dueTodayUsd: DUE_TODAY_USD,
    matchedCode,
  };
}

export function promoNotifyLine(quote: DeliveryQuote): string {
  if (quote.applied) {
    return `${quote.entered} (−$${quote.discountUsd} delivery → $${quote.deliveryUsd} due)`;
  }
  if (quote.invalid) {
    return `${quote.entered} (not valid — full $${DELIVERY_FEE_USD} delivery)`;
  }
  return "(none)";
}

export function promoStripeMetadata(quote: DeliveryQuote): Record<string, string> {
  if (!quote.applied) return {};
  return {
    promo_code: quote.entered,
    promo_amount_usd: String(quote.discountUsd),
    delivery_usd: String(quote.deliveryUsd),
  };
}

export function promoPaidEmailLine(meta: {
  promo_code?: string | null;
  promo_amount_usd?: string | null;
  delivery_usd?: string | null;
}): string {
  const code = (meta.promo_code ?? "").trim();
  if (!code) return "(none)";
  const amount = (meta.promo_amount_usd ?? "").trim();
  const delivery = (meta.delivery_usd ?? "").trim();
  if (amount && delivery) {
    return `${code} (−$${amount} delivery, charged $${delivery})`;
  }
  return code;
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
  const deliveryAfter = Math.max(0, DELIVERY_FEE_USD - offer.amountUsd);
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
    `Start a subscription at ${planUrl} and enter ${offer.code} on the review step. Delivery drops from $${DELIVERY_FEE_USD} to $${deliveryAfter}.`,
    "",
    "The discount applies at checkout — no need to email us first.",
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
      <p>Start a subscription at <a href="${escapeHtml(planUrl)}">${escapeHtml(planUrl)}</a> and enter <strong>${escapeHtml(offer.code)}</strong> on the review step. Delivery drops from $${DELIVERY_FEE_USD} to $${deliveryAfter} automatically at checkout.</p>
      <p style="color:#555;font-size:13px">We'll also send occasional shipping and field notes. No spam.</p>
      <p style="color:#555;font-size:13px">— SitePulse · Coeur d'Alene, Idaho</p>
    </div>
  `;

  return { subject, text, html };
}
