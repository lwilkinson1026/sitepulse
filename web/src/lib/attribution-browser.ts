"use client";

import {
  ATTR_COOKIE,
  ATTR_MAX_AGE_SEC,
  ATTR_STORAGE_KEY,
  mergeAttribution,
  parseAttribution,
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
  const fbp = readCookie("_fbp");
  const fbc = readCookie("_fbc");
  return {
    fbp: fbp || undefined,
    fbc: fbc || undefined,
  };
}

export { readCookie };
