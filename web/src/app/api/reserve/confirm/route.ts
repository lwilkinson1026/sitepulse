import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Reservation numbers are derived from the Stripe session id so the same
 * checkout always shows the same number, with no extra store to keep in sync.
 */
function reservationNumber(sessionId: string): string {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = (hash * 31 + sessionId.charCodeAt(i)) % 10000;
  }
  return String(hash).padStart(4, "0");
}

/** Verifies a returning checkout session before the page shows "deposit received". */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";

    return NextResponse.json({
      paid,
      reservationNumber: paid ? reservationNumber(session.id) : null,
      email: session.customer_details?.email ?? null,
      value: (session.amount_total ?? 0) / 100,
      currency: (session.currency ?? "usd").toUpperCase(),
      conversionId: session.id,
    });
  } catch (err) {
    console.error("[reserve/confirm] lookup failed:", err);
    return NextResponse.json({ error: "Could not verify session" }, { status: 502 });
  }
}
