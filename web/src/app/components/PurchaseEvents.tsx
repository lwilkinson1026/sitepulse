"use client";

import { useEffect } from "react";
import { identifyPerson, track } from "@/lib/track-client";
import { purchaseEventId } from "@/lib/tracking";
import TwitterPurchaseEvent from "./TwitterPurchaseEvent";

const firedPurchases = new Set<string>();

type Props = {
  conversionId: string;
  value: number;
  currency?: string;
  email?: string | null;
};

/**
 * Fires the paid-rental conversion on the confirmation page: Meta Pixel +
 * CAPI (deduped with the Stripe webhook via event_id), PostHog, and the
 * existing X / Twitter purchase pixel.
 */
export default function PurchaseEvents({
  conversionId,
  value,
  currency = "USD",
  email,
}: Props) {
  useEffect(() => {
    const eventId = purchaseEventId(conversionId);
    if (firedPurchases.has(eventId)) return;
    firedPurchases.add(eventId);
    if (email) void identifyPerson(email);
    track("Purchase", {
      event_id: eventId,
      value,
      currency,
      email: email ?? undefined,
      extra: { order_id: conversionId },
    });
  }, [conversionId, value, currency, email]);

  return (
    <TwitterPurchaseEvent
      conversionId={conversionId}
      value={value}
      currency={currency}
    />
  );
}
