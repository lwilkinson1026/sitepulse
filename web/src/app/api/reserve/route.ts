import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getStripe, RESERVATION_DEPOSIT_USD } from "@/lib/stripe";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REFUEL_LABELS: Record<string, string> = {
  sp: "Sitepulse refuels",
  us: "Customer crew refuels",
  tbd: "Undecided",
};

function str(v: unknown, max = 2000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function num(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Records the reservation enquiry, then hands the $250 deposit off to Stripe
 * Checkout. Card details are never posted here — Stripe's hosted page collects
 * them, so this app stays out of PCI scope.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const company = str(body.company, 200);
  const name = str(body.name, 200);
  const email = str(body.email, 320);
  const site = str(body.site);
  const start = str(body.start, 40);
  const refuel = str(body.refuel, 10);
  const gc = str(body.gc, 10);
  const coi = str(body.coi);
  const units = Math.max(1, Math.round(num(body.units)));
  const monthly = Math.max(0, Math.round(num(body.monthly)));

  if (!name) {
    return NextResponse.json({ error: "Your name is required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (!site) {
    return NextResponse.json(
      { error: "Tell us roughly where the site is" },
      { status: 400 },
    );
  }

  const summary = `${units} × Sitepulse field unit · $${monthly.toLocaleString()}/mo`;

  // Notify the team. If Resend isn't configured, log so the lead isn't lost —
  // same fallback the contact route uses.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const fields: ReadonlyArray<readonly [string, string]> = [
    ["Company", company || "(none)"],
    ["Name", name],
    ["Email", email],
    ["Site / access", site],
    ["Target start", start || "(none)"],
    ["Refuel plan", REFUEL_LABELS[refuel] ?? "(none)"],
    ["GC-controlled worksite", gc === "yes" ? "Yes — flag NRTL early" : gc === "no" ? "No" : "(none)"],
    ["COI requirements", coi || "(none)"],
    ["Configuration", summary],
  ];

  if (!apiKey || !to || !from) {
    console.warn(
      "[reserve] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not set — logging reservation instead of sending",
    );
    console.log("[reserve] enquiry", Object.fromEntries(fields), {
      at: new Date().toISOString(),
    });
  } else {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `Sitepulse reservation — ${company || name}`,
        text: fields.map(([k, v]) => `${k}: ${v}`).join("\n"),
        html: `<table style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">${fields
          .map(
            ([k, v]) =>
              `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`,
          )
          .join("")}</table>`,
      });
      if (error) console.error("[reserve] Resend error:", error);
    } catch (err) {
      // A failed notification must not block the deposit.
      console.error("[reserve] send failed:", err);
    }
  }

  const origin =
    req.headers.get("origin") ?? req.nextUrl.origin ?? "http://localhost:3000";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: RESERVATION_DEPOSIT_USD * 100,
            product_data: {
              name: "Sitepulse Reservation Deposit",
              description: `Credited to month one, refundable — ${summary}`,
            },
          },
        },
      ],
      metadata: {
        company: company || "(none)",
        contact_name: name,
        site: site.slice(0, 480),
        target_start: start || "(none)",
        refuel: refuel || "(none)",
        gc_site: gc || "(none)",
        units: String(units),
        monthly_usd: String(monthly),
      },
      success_url: `${origin}/?reserved={CHECKOUT_SESSION_ID}#reserve`,
      cancel_url: `${origin}/#reserve`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a session URL" },
        { status: 502 },
      );
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[reserve] Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
