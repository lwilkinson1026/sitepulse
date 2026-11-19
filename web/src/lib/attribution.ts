/**
 * First- and last-touch ad attribution.
 *
 * Pure helpers — safe to import from client or server. Persistence lives in
 * `attribution-browser.ts`; API routes read the same cookie off the request.
 */

export const ATTR_COOKIE = "sp_attr";
export const ATTR_STORAGE_KEY = "sp_attr";
export const ATTR_MAX_AGE_SEC = 60 * 60 * 24 * 90; // 90 days

const MAX_VAL = 200;

export const TRACKING_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "twclid",
] as const;

export type TrackingParamKey = (typeof TRACKING_PARAM_KEYS)[number];

export type Touch = {
  ts: number;
  landing: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  twclid?: string;
  /** Meta click identifier cookie value (`fb.1.<ts>.<fbclid>`). */
  fbc?: string;
};

export type Attribution = {
  first: Touch;
  last: Touch;
};

function clip(value: string): string {
  return value.trim().slice(0, MAX_VAL);
}

export function hasAdSource(touch: Touch | null | undefined): boolean {
  if (!touch) return false;
  return TRACKING_PARAM_KEYS.some((key) => Boolean(touch[key]));
}

export function buildFbc(fbclid: string, ts: number = Date.now()): string {
  return `fb.1.${ts}.${fbclid}`;
}

/** Pull UTM / click-ID params out of a query string. Null when none are present. */
export function touchFromSearch(
  search: string,
  landing: string,
  now: number = Date.now(),
): Touch | null {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(raw);
  const touch: Touch = { ts: now, landing: clip(landing) || "/" };
  let hit = false;

  for (const key of TRACKING_PARAM_KEYS) {
    const value = params.get(key);
    if (value && value.trim()) {
      touch[key] = clip(value);
      hit = true;
    }
  }

  if (touch.fbclid) {
    touch.fbc = buildFbc(touch.fbclid, now);
  }

  return hit ? touch : null;
}

/**
 * First-touch keeps the first ad-tagged visit (or the very first visit if we
 * have nothing else). Last-touch updates whenever a new tagged visit arrives.
 */
export function mergeAttribution(
  existing: Attribution | null,
  incoming: Touch | null,
  landing: string,
  now: number = Date.now(),
): Attribution {
  if (!existing) {
    const seed = incoming ?? { ts: now, landing: clip(landing) || "/" };
    return { first: seed, last: seed };
  }
  if (!incoming) return existing;
  const first = hasAdSource(existing.first) ? existing.first : incoming;
  return { first, last: incoming };
}

export function parseAttribution(raw: string | null | undefined): Attribution | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const rec = parsed as { first?: unknown; last?: unknown };
    if (!isTouch(rec.first) || !isTouch(rec.last)) return null;
    return { first: rec.first, last: rec.last };
  } catch {
    return null;
  }
}

function isTouch(value: unknown): value is Touch {
  if (!value || typeof value !== "object") return false;
  const rec = value as Record<string, unknown>;
  return typeof rec.ts === "number" && typeof rec.landing === "string";
}

export function serializeAttribution(attr: Attribution): string {
  return JSON.stringify(attr);
}

function pick(
  touch: Touch | undefined,
  key: keyof Touch,
): string | undefined {
  const value = touch?.[key];
  return typeof value === "string" && value ? value.slice(0, 500) : undefined;
}

/**
 * Flat string map for Stripe Checkout `metadata` (values cap at 500 chars).
 * Last-touch is the default; first-touch is prefixed with `first_`.
 */
export function toStripeMetadata(
  attr: Attribution | null,
  extra: { fbp?: string; fbc?: string } = {},
): Record<string, string> {
  const out: Record<string, string> = {};
  const last = attr?.last;
  const first = attr?.first;

  const lastKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
    "twclid",
  ] as const;

  for (const key of lastKeys) {
    const value = pick(last, key);
    if (value) out[key] = value;
  }

  const firstKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ] as const;
  for (const key of firstKeys) {
    const value = pick(first, key);
    if (value) out[`first_${key}`] = value;
  }

  const fbc = extra.fbc || pick(last, "fbc");
  const fbp = extra.fbp;
  if (fbp) out.fbp = fbp.slice(0, 500);
  if (fbc) out.fbc = fbc.slice(0, 500);

  return out;
}

export function formatAttributionLines(
  attr: Attribution | null,
): ReadonlyArray<readonly [string, string]> {
  if (!attr) return [["Ad attribution", "(none captured)"]];

  const describe = (touch: Touch) => {
    const parts = [
      touch.utm_source,
      touch.utm_medium,
      touch.utm_campaign,
      touch.utm_content,
      touch.utm_term,
    ].filter(Boolean);
    const clicks = [
      touch.fbclid ? `fbclid=${touch.fbclid}` : "",
      touch.gclid ? `gclid=${touch.gclid}` : "",
      touch.twclid ? `twclid=${touch.twclid}` : "",
    ].filter(Boolean);
    const label = parts.length ? parts.join(" / ") : "direct / unknown";
    return clicks.length ? `${label} · ${clicks.join(" ")}` : label;
  };

  return [
    ["Last touch", describe(attr.last)],
    ["First touch", describe(attr.first)],
  ];
}

/** Super-properties bag for PostHog (and any other analytics). */
export function toAnalyticsProps(attr: Attribution | null): Record<string, string> {
  if (!attr) return {};
  const props: Record<string, string> = {};
  const assign = (touch: Touch, prefix: string) => {
    for (const key of TRACKING_PARAM_KEYS) {
      const value = touch[key];
      if (value) props[`${prefix}${key}`] = value;
    }
  };
  assign(attr.last, "");
  assign(attr.first, "initial_");
  return props;
}
