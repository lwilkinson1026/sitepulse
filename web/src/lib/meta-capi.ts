import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import {
  ATTR_COOKIE,
  parseAttribution,
  resolveMetaClickIds,
  type Attribution,
} from "./attribution";
import { normalizePhone } from "./phone";
import { META_EVENT_ALLOWLIST } from "./tracking";

const GRAPH_VERSION = "v21.0";

export type MetaUserData = {
  email?: string;
  phone?: string;
  firstName?: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  clientUserAgent?: string;
};

export type MetaCustomData = {
  value?: number;
  currency?: string;
  content_name?: string;
  content_ids?: readonly string[];
  content_type?: string;
  content_category?: string;
  num_items?: number;
  order_id?: string;
};

export type MetaCapiEvent = {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  eventTime?: number;
  user?: MetaUserData;
  custom?: MetaCustomData;
};

function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function hashEmail(email: string): string {
  return sha256Hex(email.trim().toLowerCase());
}

function hashPhone(phone: string): string | undefined {
  const normalized = normalizePhone(phone);
  if (!normalized) return undefined;
  return sha256Hex(normalized);
}

function hashName(name: string): string | undefined {
  const normalized = name.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (!normalized) return undefined;
  return sha256Hex(normalized);
}

function pixelId(): string {
  return (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").trim();
}

function accessToken(): string {
  return (process.env.META_CAPI_ACCESS_TOKEN ?? "").trim();
}

function testEventCode(): string {
  return (process.env.META_CAPI_TEST_EVENT_CODE ?? "").trim();
}

export function metaCapiConfigured(): boolean {
  return Boolean(pixelId() && accessToken());
}

export function clientIpFromRequest(req: NextRequest): string | undefined {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || undefined;
}

export function attributionFromRequest(req: NextRequest): Attribution | null {
  return parseAttribution(req.cookies.get(ATTR_COOKIE)?.value);
}

export function metaCookiesFromRequest(req: NextRequest): {
  fbp?: string;
  fbc?: string;
} {
  return {
    fbp: req.cookies.get("_fbp")?.value || undefined,
    fbc: req.cookies.get("_fbc")?.value || undefined,
  };
}

export function clickIdsFromRequest(
  req: NextRequest,
  body: { fbp?: unknown; fbc?: unknown } = {},
): { fbp?: string; fbc?: string } {
  const cookies = metaCookiesFromRequest(req);
  const attr = attributionFromRequest(req);
  return resolveMetaClickIds({
    bodyFbp: typeof body.fbp === "string" ? body.fbp : undefined,
    bodyFbc: typeof body.fbc === "string" ? body.fbc : undefined,
    cookieFbp: cookies.fbp,
    cookieFbc: cookies.fbc,
    storedFbc: attr?.last.fbc,
    fbclid: attr?.last.fbclid,
  });
}

export function clientUserAgentFromRequest(req: NextRequest): string | undefined {
  return req.headers.get("user-agent")?.trim() || undefined;
}

/** Hashed PII + raw fbp/fbc/IP/UA for the Graph API `user_data` object. */
export function userDataPayload(user: MetaUserData | undefined) {
  if (!user) return {};
  const out: Record<string, unknown> = {};
  if (user.email) out.em = [hashEmail(user.email)];
  const ph = user.phone ? hashPhone(user.phone) : undefined;
  if (ph) out.ph = [ph];
  if (user.firstName) {
    const hashed = hashName(user.firstName);
    if (hashed) out.fn = [hashed];
  }
  const ids = resolveMetaClickIds({ bodyFbp: user.fbp, bodyFbc: user.fbc });
  if (ids.fbp) out.fbp = ids.fbp;
  if (ids.fbc) out.fbc = ids.fbc;
  if (user.clientIp) out.client_ip_address = user.clientIp;
  if (user.clientUserAgent) out.client_user_agent = user.clientUserAgent;
  // Service area is the US; this is a cheap Event Match Quality lift.
  out.country = [sha256Hex("us")];
  return out;
}

function customDataPayload(custom: MetaCustomData | undefined) {
  if (!custom) return undefined;
  const out: Record<string, unknown> = {};
  if (typeof custom.value === "number" && Number.isFinite(custom.value)) {
    out.value = custom.value;
  }
  if (custom.currency) out.currency = custom.currency;
  if (custom.content_name) out.content_name = custom.content_name;
  if (custom.content_ids?.length) out.content_ids = [...custom.content_ids];
  if (custom.content_type) out.content_type = custom.content_type;
  if (custom.content_category) out.content_category = custom.content_category;
  if (typeof custom.num_items === "number") out.num_items = custom.num_items;
  if (custom.order_id) out.order_id = custom.order_id;
  return Object.keys(out).length ? out : undefined;
}

/**
 * Send one website event to Meta CAPI. No-ops (and never throws) when the
 * pixel id or access token isn't configured, so callers can fire-and-forget.
 */
export async function sendMetaCapiEvent(
  event: MetaCapiEvent,
): Promise<{ sent: boolean; skipped?: string }> {
  const id = pixelId();
  const token = accessToken();
  if (!id || !token) {
    return { sent: false, skipped: "not_configured" };
  }
  if (!META_EVENT_ALLOWLIST.has(event.eventName)) {
    return { sent: false, skipped: "unknown_event" };
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl,
        action_source: "website",
        user_data: userDataPayload(event.user),
        custom_data: customDataPayload(event.custom),
      },
    ],
    access_token: token,
  };

  const testCode = testEventCode();
  if (testCode) payload.test_event_code = testCode;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(id)}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(
        `[meta-capi] Graph API ${res.status} for ${event.eventName}/${event.eventId}: ${detail.slice(0, 400)}`,
      );
      return { sent: false, skipped: `http_${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error(
      `[meta-capi] failed for ${event.eventName}/${event.eventId}:`,
      err,
    );
    return { sent: false, skipped: "network" };
  }
}

export function requestUrlFrom(req: NextRequest, fallbackPath: string): string {
  const origin =
    req.headers.get("origin") ?? req.nextUrl.origin ?? "https://www.sitepulse.space";
  return `${origin}${fallbackPath}`;
}
