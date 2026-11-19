import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { sendMetaCapiEvent } from "@/lib/meta-capi";
import { notifyTeam } from "@/lib/notify";
import { ONLINE_MAX_HOURS, ONLINE_MIN_HOURS, ONLINE_WINDOW_LABEL } from "@/lib/rental";
import { getStripe } from "@/lib/stripe";
import { PRODUCT, purchaseEventId } from "@/lib/tracking";
import { hashEmail, sendTwitterConversions } from "@/lib/twitter";
import { PURCHASE_EVENT_ID } from "@/lib/twitter-events";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe signature verification failed:", message);
    return NextResponse.json({ error: `Invalid signature: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      if (session.metadata?.kind === "rental") await notifyRentalPaid(session);
      await fireTwitterConversion(session, req.nextUrl.origin);
      await fireMetaPurchase(session, req.nextUrl.origin);
    }
  }

  return NextResponse.json({ received: true });
}

async function fireTwitterConversion(
  session: Stripe.Checkout.Session,
  origin: string,
) {
  const email = session.customer_details?.email;
  const twclid =
    typeof session.metadata?.twclid === "string" ? session.metadata.twclid : undefined;

  const identifier: Record<string, string> = {};
  if (email) identifier.hashed_email = hashEmail(email);
  if (twclid) identifier.twclid = twclid;

  if (Object.keys(identifier).length === 0) {
    console.error(
      `No usable identifier for session ${session.id}; skipping conversion`,
    );
    return;
  }

  try {
    await sendTwitterConversions([
      {
        event_id: PURCHASE_EVENT_ID,
        conversion_id: session.id,
        conversion_time: new Date().toISOString(),
        event_source_url: `${origin}/plan/confirmed`,
        identifiers: [identifier],
      },
    ]);
  } catch (err) {
    // Don't fail the webhook — Stripe would retry and could double-count.
    console.error(`Twitter conversion failed for ${session.id}:`, err);
  }
}

async function fireMetaPurchase(
  session: Stripe.Checkout.Session,
  origin: string,
) {
  const email = session.customer_details?.email ?? undefined;
  const m = session.metadata ?? {};
  const value = (session.amount_total ?? 0) / 100;
  const currency = (session.currency ?? "usd").toUpperCase();

  // Don't send the webhook caller's IP — that's Stripe, not the customer.
  await sendMetaCapiEvent({
    eventName: "Purchase",
    eventId: purchaseEventId(session.id),
    eventSourceUrl: `${origin}/plan/confirmed`,
    eventTime: session.created,
    user: {
      email,
      phone: typeof m.phone === "string" ? m.phone : undefined,
      firstName:
        typeof m.contact_name === "string"
          ? m.contact_name.split(/\s+/)[0]
          : undefined,
      fbp: typeof m.fbp === "string" ? m.fbp : undefined,
      fbc: typeof m.fbc === "string" ? m.fbc : undefined,
    },
    custom: {
      value,
      currency,
      content_name: PRODUCT.content_name,
      content_ids: PRODUCT.content_ids,
      content_type: PRODUCT.content_type,
      content_category: PRODUCT.content_category,
      num_items: 1,
      order_id: session.id,
    },
  });
}

/** The delivery clock starts at payment, so the team hears about it right away. */
async function notifyRentalPaid(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {};
  const paidAt = session.created * 1000;
  const at = (hours: number) =>
    new Date(paidAt + hours * 3_600_000).toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      dateStyle: "medium",
      timeStyle: "short",
    }) + " PT";
  const email = session.customer_details?.email ?? "";

  await notifyTeam(
    "rent",
    `PAID — Sitepulse subscription, online due in ${ONLINE_WINDOW_LABEL} — ${m.contact_name ?? email}`,
    [
      ["Online window", `${at(ONLINE_MIN_HOURS)} → ${at(ONLINE_MAX_HOURS)}`],
      ["Name", m.contact_name ?? "(unknown)"],
      ["Company", m.company ?? "(none)"],
      ["Email", email || "(unknown)"],
      ["Phone", m.phone ?? "(unknown)"],
      ["Site pin", `${m.site_lat}, ${m.site_lng} — near ${m.site_place ?? "(unknown)"}`],
      ["Map", `https://www.google.com/maps?q=${m.site_lat},${m.site_lng}`],
      ["Access notes", m.site_access ?? "(none)"],
      ["Powering", m.loads ?? "(none)"],
      [
        "Fuel",
        m.fuel_service === "quote_requested"
          ? "WANTS FUEL SERVICE QUOTE (per gallon)"
          : "Self-refuel",
      ],
      ["Paid", `$${((session.amount_total ?? 0) / 100).toFixed(2)}`],
      ["Stripe session", session.id],
      [
        "Last touch",
        [m.utm_source, m.utm_medium, m.utm_campaign, m.utm_content, m.utm_term]
          .filter(Boolean)
          .join(" / ") || "(none)",
      ],
      [
        "First touch",
        [
          m.first_utm_source,
          m.first_utm_medium,
          m.first_utm_campaign,
          m.first_utm_content,
          m.first_utm_term,
        ]
          .filter(Boolean)
          .join(" / ") || "(none)",
      ],
      [
        "Click IDs",
        [
          m.fbclid ? `fbclid=${m.fbclid}` : "",
          m.gclid ? `gclid=${m.gclid}` : "",
          m.twclid ? `twclid=${m.twclid}` : "",
        ]
          .filter(Boolean)
          .join(" ") || "(none)",
      ],
    ],
    email || undefined,
  );
}
