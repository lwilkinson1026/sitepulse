import { NextRequest, NextResponse } from "next/server";
import {
  attributionFromRequest,
  clickIdsFromRequest,
  clientIpFromRequest,
  clientUserAgentFromRequest,
  sendMetaCapiEvent,
} from "@/lib/meta-capi";
import { formatAttributionLines, toStripeMetadata } from "@/lib/attribution";
import { notifyTeam } from "@/lib/notify";
import {
  DELIVERY_FEE_USD,
  DUE_TODAY_USD,
  formatCoords,
  inServiceArea,
  mapsLink,
  ONLINE_WINDOW_LABEL,
  RENT_MONTHLY_USD,
  SERVICE_AREA_LABEL,
} from "@/lib/rental";
import { getStripe } from "@/lib/stripe";
import { PRODUCT } from "@/lib/tracking";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown, max = 2000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

/**
 * Starts a subscription: records the service location, notifies the team, then
 * hands off to Stripe Checkout for the first month plus the one-time delivery
 * fee. The monthly charge is a Stripe subscription, so later months bill
 * themselves. Card details never touch this app — Stripe's hosted page
 * collects them.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid JSON body");
  }

  const name = str(body.name, 200);
  const company = str(body.company, 200);
  const email = str(body.email, 320);
  const phone = str(body.phone, 40);
  const access = str(body.access);
  const loads = str(body.loads);
  const place = str(body.place, 200);
  const fuelService = body.fuelService === true;
  const eventId = str(body.event_id, 200);
  const pin = { lat: Number(body.lat), lng: Number(body.lng) };
  const attr = attributionFromRequest(req);
  const clickIds = clickIdsFromRequest(req, body);
  const clientIp = clientIpFromRequest(req);
  const clientUserAgent = clientUserAgentFromRequest(req);

  if (body.lat == null || body.lng == null || !Number.isFinite(pin.lat) || !Number.isFinite(pin.lng)) {
    return bad("Drop a pin where you want the unit");
  }
  if (!inServiceArea(pin)) {
    return bad(
      `That location is outside our service area (${SERVICE_AREA_LABEL}). Contact us and we'll see what we can do.`,
    );
  }
  if (!name) return bad("Your name is required");
  if (!EMAIL_RE.test(email)) return bad("A valid email is required");
  if (phone.replace(/\D/g, "").length < 10) {
    return bad("A phone number is required so we can coordinate delivery");
  }

  const coords = formatCoords(pin);
  const fields: ReadonlyArray<readonly [string, string]> = [
    ["Name", name],
    ["Company", company || "(none)"],
    ["Email", email],
    ["Phone", phone],
    ["Site pin", `${coords}${place ? ` — near ${place}` : ""}`],
    ["Map", mapsLink(pin)],
    ["Access notes", access || "(none)"],
    ["Powering", loads || "(not given)"],
    ["Fuel", fuelService ? "WANTS FUEL SERVICE QUOTE (per gallon)" : "Self-refuel"],
    ["Status", "Checkout started — not paid until Stripe confirms"],
    ...formatAttributionLines(attr),
  ];

  await notifyTeam(
    "rent",
    `Sitepulse subscription started — ${company || name}${place ? ` (${place})` : ""}`,
    fields,
    email,
  );

  const origin =
    req.headers.get("origin") ?? req.nextUrl.origin ?? "http://localhost:3000";

  // Stripe metadata values cap at 500 characters.
  const metadata = {
    kind: "rental",
    contact_name: name,
    company: company || "(none)",
    phone,
    site_lat: pin.lat.toFixed(6),
    site_lng: pin.lng.toFixed(6),
    site_place: place || "(none)",
    site_access: access.slice(0, 480) || "(none)",
    loads: loads.slice(0, 480) || "(none)",
    fuel_service: fuelService ? "quote_requested" : "self",
    ...toStripeMetadata(attr, clickIds),
    ...(clientIp ? { client_ip: clientIp.slice(0, 80) } : {}),
    ...(clientUserAgent
      ? { client_user_agent: clientUserAgent.slice(0, 500) }
      : {}),
  };

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: RENT_MONTHLY_USD * 100,
            recurring: { interval: "month" },
            product_data: {
              name: "SitePulse Power + Wi-Fi subscription",
              description:
                "Portable power and Starlink Wi-Fi, anywhere. $299/mo, billed monthly.",
            },
          },
        },
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: DELIVERY_FEE_USD * 100,
            product_data: {
              name: "One-time delivery & setup",
              description: `One-time. Delivered to ${coords} and online within ${ONLINE_WINDOW_LABEL}.`,
            },
          },
        },
      ],
      custom_text: {
        submit: {
          message: `Your unit will be delivered, set up and online within ${ONLINE_WINDOW_LABEL} of payment.`,
        },
      },
      metadata,
      subscription_data: { metadata },
      success_url: `${origin}/plan/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/plan?canceled=1`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a session URL" },
        { status: 502 },
      );
    }

    if (eventId) {
      void sendMetaCapiEvent({
        eventName: "InitiateCheckout",
        eventId,
        eventSourceUrl: `${origin}/plan`,
        user: {
          email,
          phone,
          firstName: name.split(/\s+/)[0],
          fbp: clickIds.fbp,
          fbc: clickIds.fbc,
          clientIp,
          clientUserAgent,
        },
        custom: {
          value: DUE_TODAY_USD,
          currency: PRODUCT.currency,
          content_name: PRODUCT.content_name,
          content_ids: PRODUCT.content_ids,
          content_type: PRODUCT.content_type,
          content_category: PRODUCT.content_category,
          num_items: 1,
        },
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[rent] Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
