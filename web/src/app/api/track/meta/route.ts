import { NextRequest, NextResponse } from "next/server";
import {
  clickIdsFromRequest,
  clientIpFromRequest,
  clientUserAgentFromRequest,
  sendMetaCapiEvent,
} from "@/lib/meta-capi";
import { META_EVENT_ALLOWLIST } from "@/lib/tracking";

export const runtime = "nodejs";

function str(v: unknown, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

type Body = {
  event_name?: unknown;
  event_id?: unknown;
  event_source_url?: unknown;
  email?: unknown;
  phone?: unknown;
  first_name?: unknown;
  fbp?: unknown;
  fbc?: unknown;
  custom_data?: unknown;
};

/**
 * Browser → CAPI proxy. Used for PageView / ViewContent (and as a backup for
 * Purchase on the confirmation page). Conversion actions that already hit an
 * API route send CAPI from there with the same event_id so Meta can dedupe.
 *
 * Always returns 204 — tracking must never break a page.
 */
export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const eventName = str(body.event_name, 64);
  const eventId = str(body.event_id, 200);
  if (!META_EVENT_ALLOWLIST.has(eventName) || !eventId) {
    return new NextResponse(null, { status: 204 });
  }

  const clickIds = clickIdsFromRequest(req, body);
  const custom =
    body.custom_data && typeof body.custom_data === "object"
      ? (body.custom_data as Record<string, unknown>)
      : {};

  const value = typeof custom.value === "number" ? custom.value : undefined;
  const contentIds = Array.isArray(custom.content_ids)
    ? custom.content_ids.filter((v): v is string => typeof v === "string")
    : undefined;

  await sendMetaCapiEvent({
    eventName,
    eventId,
    eventSourceUrl:
      str(body.event_source_url, 2000) || req.headers.get("referer") || undefined,
    user: {
      email: str(body.email, 320) || undefined,
      phone: str(body.phone, 40) || undefined,
      firstName: str(body.first_name, 80) || undefined,
      fbp: clickIds.fbp,
      fbc: clickIds.fbc,
      clientIp: clientIpFromRequest(req),
      clientUserAgent: clientUserAgentFromRequest(req),
    },
    custom: {
      value,
      currency: str(custom.currency, 8) || undefined,
      content_name: str(custom.content_name, 200) || undefined,
      content_ids: contentIds,
      content_type: str(custom.content_type, 40) || undefined,
      content_category: str(custom.content_category, 80) || undefined,
      order_id: str(custom.order_id, 200) || undefined,
    },
  });

  return new NextResponse(null, { status: 204 });
}
