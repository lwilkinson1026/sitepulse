import { NextRequest, NextResponse } from "next/server";
import {
  ADDONS,
  buildSummary,
  computeTotal,
  isMount,
  isTier,
  TIERS,
  type Tier,
  type Mount,
} from "@/lib/build";
import { getStripe, RESERVATION_DEPOSIT_USD } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutBody = {
  tier?: unknown;
  mount?: unknown;
  addonIds?: unknown;
};

const VALID_ADDON_IDS = new Set(ADDONS.map((a) => a.id));

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isTier(body.tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }
  if (!isMount(body.mount)) {
    return NextResponse.json({ error: "Invalid mount" }, { status: 400 });
  }
  if (!Array.isArray(body.addonIds)) {
    return NextResponse.json({ error: "addonIds must be an array" }, { status: 400 });
  }
  const addonIds = body.addonIds.filter(
    (id): id is string => typeof id === "string" && VALID_ADDON_IDS.has(id),
  );

  const tier = body.tier as Tier;
  const mount = body.mount as Mount;
  const buildTotal = computeTotal(tier, addonIds);
  const summary = buildSummary(tier, mount, addonIds);

  const origin =
    req.headers.get("origin") ?? req.nextUrl.origin ?? "http://localhost:3000";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: RESERVATION_DEPOSIT_USD * 100,
            product_data: {
              name: "Sitepulse Reservation Deposit",
              description: `Refundable deposit — ${summary}`,
            },
          },
        },
      ],
      metadata: {
        tier,
        mount,
        addons: addonIds.join(",") || "(none)",
        build_subtotal_usd: String(buildTotal),
        build_label: TIERS[tier].label,
      },
      success_url: `${origin}/reserve/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#config`,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a session URL" },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
