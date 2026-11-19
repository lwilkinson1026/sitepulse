import { DUE_TODAY_USD, RENT_MONTHLY_USD } from "./rental";

/** Meta / PostHog conversion names. Keep these identical across pixel, CAPI, PostHog. */
export const TRACK_EVENTS = {
  PageView: "PageView",
  ViewContent: "ViewContent",
  Lead: "Lead",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "Purchase",
} as const;

export type TrackEventName = (typeof TRACK_EVENTS)[keyof typeof TRACK_EVENTS];

export const META_EVENT_ALLOWLIST: ReadonlySet<string> = new Set(
  Object.values(TRACK_EVENTS),
);

/** Pages that are the product, so they also fire ViewContent. */
export const VIEW_CONTENT_PATHS: ReadonlySet<string> = new Set([
  "/",
  "/field-unit",
  "/rent",
  "/off-grid",
  "/dji-dock",
]);

export const PRODUCT = {
  content_ids: ["sitepulse-v1-rental"],
  content_name: "Sitepulse V1 rental",
  content_type: "product",
  content_category: "hybrid_power",
  currency: "USD",
  value_monthly: RENT_MONTHLY_USD,
  value_due_today: DUE_TODAY_USD,
} as const;

export function purchaseEventId(stripeSessionId: string): string {
  return `purchase:${stripeSessionId}`;
}

export function newEventId(prefix: string): string {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}:${id}`;
}

export function isTrackingDebug(): boolean {
  return process.env.NEXT_PUBLIC_TRACKING_DEBUG === "1";
}

export function publicMetaPixelId(): string {
  return (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").trim();
}

export function publicPosthogKey(): string {
  return (process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "").trim();
}

export function publicPosthogHost(): string {
  return (
    (process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "").trim() ||
    "https://us.i.posthog.com"
  );
}
