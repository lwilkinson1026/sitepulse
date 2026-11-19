"use client";

import {
  ATTR_COOKIE,
  ATTR_MAX_AGE_SEC,
  ATTR_STORAGE_KEY,
  buildFbp,
  mergeAttribution,
  parseAttribution,
  resolveMetaClickIds,
  sanitizeFbp,
  sanitizeFbc,
  serializeAttribution,
  touchFromSearch,
  type Attribution,
} from "./attribution";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq) === name) {
      return decodeURIComponent(part.slice(eq + 1));
    }
  }
  return undefined;
}

function writeCookie(name: string, value: string, maxAgeSec: number) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${secure}`;
}

function readStorage(key: string): string | undefined {
  try {
    return localStorage.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private mode / quota — cookie still holds the data.
  }
}

export function readStoredAttribution(): Attribution | null {
  return (
    parseAttribution(readCookie(ATTR_COOKIE)) ??
    parseAttribution(readStorage(ATTR_STORAGE_KEY))
  );
}

export function persistAttribution(attr: Attribution) {
  const raw = serializeAttribution(attr);
  writeCookie(ATTR_COOKIE, raw, ATTR_MAX_AGE_SEC);
  writeStorage(ATTR_STORAGE_KEY, raw);
}

/**
 * Call on every client-side landing. Captures UTMs / click IDs from the URL
 * into a first-touch + last-touch snapshot stored in a cookie and localStorage.
 */
export function captureAttributionFromLocation(
  loc: Pick<Location, "search" | "pathname"> = window.location,
  now: number = Date.now(),
): Attribution {
  const existing = readStoredAttribution();
  const incoming = touchFromSearch(loc.search, loc.pathname, now);
  const merged = mergeAttribution(existing, incoming, loc.pathname, now);
  persistAttribution(merged);
  return merged;
}

export function readMetaBrowserCookies(): { fbp?: string; fbc?: string } {
  return {
    fbp: sanitizeFbp(readCookie("_fbp")),
    fbc: sanitizeFbc(readCookie("_fbc")),
  };
}

/**
 * Session cache so a cookie-write failure still lets this page's CAPI events
 * share one browser ID with the Pixel (`event_id` dedupe + fbp match).
 */
let cachedFbp: string | undefined;
let cachedFbc: string | undefined;

/**
 * Make sure `_fbp` exists before the Pixel or CAPI fire. If Meta's script
 * hasn't set the cookie yet (typical on first PageView), mint one in the
 * documented format so CAPI isn't missing `user_data.fbp`. Also write `_fbc`
 * from the landing `fbclid` when the Pixel cookie is absent.
 */
export function ensureMetaClickIds(
  attr: Attribution | null = readStoredAttribution(),
  now: number = Date.now(),
): { fbp: string; fbc?: string } {
  const cookieFbp = readCookie("_fbp");
  const cookieFbc = readCookie("_fbc");
  // Prefer the Pixel cookie once it exists so CAPI and the browser share IDs.
  const fbp = sanitizeFbp(cookieFbp) || sanitizeFbp(cachedFbp) || buildFbp(now);
  cachedFbp = fbp;
  if (!sanitizeFbp(cookieFbp)) {
    writeCookie("_fbp", fbp, ATTR_MAX_AGE_SEC);
  }

  const fbc = resolveMetaClickIds({
    cookieFbc,
    storedFbc: cachedFbc || attr?.last.fbc,
    fbclid: attr?.last.fbclid,
    now,
  }).fbc;
  if (fbc) {
    cachedFbc = fbc;
    if (!sanitizeFbc(cookieFbc)) writeCookie("_fbc", fbc, ATTR_MAX_AGE_SEC);
  }

  return { fbp, fbc };
}

/** Values to attach to conversion API POSTs so the server doesn't rely on cookies. */
export function metaIdsForRequest(): { fbp: string; fbc?: string } {
  return ensureMetaClickIds();
}

export { readCookie };
