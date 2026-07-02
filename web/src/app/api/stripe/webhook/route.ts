import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { hashEmail, sendTwitterConversions } from "@/lib/twitter";

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
      await fireTwitterConversion(session, req.nextUrl.origin);
    }
  }

  return NextResponse.json({ received: true });
}

async function fireTwitterConversion(
  session: Stripe.Checkout.Session,
  origin: string,
) {
  const eventId = process.env.TWITTER_PURCHASE_EVENT_ID;
  if (!eventId) {
    console.error("TWITTER_PURCHASE_EVENT_ID is not set; skipping conversion");
    return;
  }

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
        event_id: eventId,
        conversion_id: session.id,
        conversion_time: new Date().toISOString(),
        event_source_url: `${origin}/reserve/success`,
        identifiers: [identifier],
      },
    ]);
  } catch (err) {
    // Don't fail the webhook — Stripe would retry and could double-count.
    console.error(`Twitter conversion failed for ${session.id}:`, err);
  }
}
