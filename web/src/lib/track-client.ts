"use client";

import {
  captureAttributionFromLocation,
  ensureMetaClickIds,
  metaIdsForRequest,
} from "./attribution-browser";
import { toAnalyticsProps, type Attribution } from "./attribution";
import {
  isTrackingDebug,
  PRODUCT,
  publicMetaPixelId,
  publicPosthogHost,
  publicPosthogKey,
  type TrackEventName,
} from "./tracking";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: Window["fbq"];
  }
}

export type TrackOptions = {
  event_id?: string;
  value?: number;
  currency?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  content_name?: string;
  extra?: Record<string, unknown>;
  /** When false, skip the CAPI beacon (the matching API route will send it). */
  capi?: boolean;
};

let posthogReady: Promise<typeof import("posthog-js").default | null> | null =
  null;
let posthogInited = false;
let pixelInjected = false;

function debug(...args: unknown[]) {
  if (isTrackingDebug()) console.info("[tracking]", ...args);
}

export function ensureMetaPixel() {
  const id = publicMetaPixelId();
  if (!id || typeof document === "undefined") return;
  if (pixelInjected || window.fbq) {
    pixelInjected = true;
    return;
  }
  pixelInjected = true;

  const fbq: NonNullable<Window["fbq"]> = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else (fbq.queue = fbq.queue || []).push(args);
  };
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const first = document.getElementsByTagName("script")[0];
  first?.parentNode?.insertBefore(script, first);

  window.fbq("init", id);
  debug("meta pixel init", id);
}

async function posthog() {
  const key = publicPosthogKey();
  if (!key) return null;
  if (!posthogReady) {
    posthogReady = import("posthog-js")
      .then(({ default: ph }) => {
        if (!posthogInited) {
          ph.init(key, {
            api_host: publicPosthogHost(),
            autocapture: false,
            capture_pageview: false,
            capture_pageleave: true,
            persistence: "localStorage+cookie",
            person_profiles: "identified_only",
          });
          posthogInited = true;
        }
        return ph;
      })
      .catch((err) => {
        console.error("[tracking] posthog failed to load", err);
        return null;
      });
  }
  return posthogReady;
}

export async function registerAttribution(attr: Attribution | null) {
  const props = toAnalyticsProps(attr);
  if (!Object.keys(props).length) return;
  const ph = await posthog();
  ph?.register(props);
  debug("posthog register", props);
}

export async function identifyPerson(
  email: string,
  traits: Record<string, string> = {},
) {
  const ph = await posthog();
  if (!ph || !email) return;
  ph.identify(email.toLowerCase(), { email: email.toLowerCase(), ...traits });
  debug("posthog identify", email);
}

/** Custom PostHog events that are not Meta pixel conversion names. */
export async function captureEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
) {
  const ph = await posthog();
  if (!ph) return;
  ph.capture(eventName, properties);
  debug("posthog", eventName, properties);
}

function pixelParams(name: TrackEventName, opts: TrackOptions) {
  const params: Record<string, unknown> = {
    content_name: opts.content_name ?? PRODUCT.content_name,
    content_ids: [...PRODUCT.content_ids],
    content_type: PRODUCT.content_type,
    content_category: PRODUCT.content_category,
    ...opts.extra,
  };
  if (typeof opts.value === "number") params.value = opts.value;
  if (opts.currency || typeof opts.value === "number") {
    params.currency = opts.currency ?? PRODUCT.currency;
  }
  if (name === "PageView") return {};
  return params;
}

function firePixel(name: TrackEventName, eventId: string, opts: TrackOptions) {
  if (!publicMetaPixelId()) return;
  ensureMetaPixel();
  const params = pixelParams(name, opts);
  window.fbq?.("track", name, params, { eventID: eventId });
  debug("pixel", name, eventId, params);
}

async function firePosthog(
  name: TrackEventName,
  eventId: string,
  opts: TrackOptions,
) {
  const ph = await posthog();
  if (!ph) return;
  const eventName = name === "PageView" ? "$pageview" : name;
  ph.capture(eventName, {
    event_id: eventId,
    ...pixelParams(name, opts),
    $current_url:
      typeof window !== "undefined" ? window.location.href : undefined,
  });
  debug("posthog", eventName, eventId);
}

function fireCapi(name: TrackEventName, eventId: string, opts: TrackOptions) {
  if (opts.capi === false) return;
  if (typeof window === "undefined") return;
  // Pixel ID is public; CAPI still no-ops server-side without the token.
  if (!publicMetaPixelId()) return;

  const ids = metaIdsForRequest();
  const body = JSON.stringify({
    event_name: name,
    event_id: eventId,
    event_source_url: window.location.href,
    email: opts.email,
    phone: opts.phone,
    first_name: opts.firstName,
    fbp: ids.fbp,
    fbc: ids.fbc,
    custom_data: pixelParams(name, opts),
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/track/meta", blob)) {
        debug("capi beacon", name, eventId);
        return;
      }
    }
  } catch {
    // Fall through to fetch.
  }

  void fetch("/api/track/meta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => {
    // Never surface tracking failures to the visitor.
  });
  debug("capi fetch", name, eventId);
}

export function track(name: TrackEventName, opts: TrackOptions = {}) {
  const eventId = opts.event_id ?? `${name}:${crypto.randomUUID()}`;
  firePixel(name, eventId, opts);
  void firePosthog(name, eventId, opts);
  fireCapi(name, eventId, opts);
  return eventId;
}

/**
 * First thing the bootstrap calls: persist UTMs, init pixel/PostHog, register
 * super properties. Safe to call more than once.
 */
export function bootstrapTracking() {
  if (typeof window === "undefined") return null;
  const attr = captureAttributionFromLocation();
  // Mint _fbp/_fbc before Pixel init so the browser cookie and CAPI match.
  ensureMetaClickIds(attr);
  if (publicMetaPixelId()) ensureMetaPixel();
  void registerAttribution(attr);
  return attr;
}
