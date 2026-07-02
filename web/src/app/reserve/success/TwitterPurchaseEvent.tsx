"use client";

import { useEffect } from "react";
import { PURCHASE_EVENT_ID } from "@/lib/twitter-events";

declare global {
  interface Window {
    twq?: (...args: unknown[]) => void;
  }
}

type Props = {
  conversionId: string;
  value: number;
  currency?: string;
};

export default function TwitterPurchaseEvent({
  conversionId,
  value,
  currency = "USD",
}: Props) {
  useEffect(() => {
    window.twq?.("event", PURCHASE_EVENT_ID, {
      conversion_id: conversionId,
      value,
      currency,
    });
  }, [conversionId, value, currency]);

  return null;
}
