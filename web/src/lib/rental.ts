/**
 * The rental offer. Prices, service area and the delivery promise live here so
 * the marketing copy, the /rent flow and the checkout API can't drift apart.
 */

export const RENT_MONTHLY_USD = 299;
export const DELIVERY_FEE_USD = 150;
export const DUE_TODAY_USD = RENT_MONTHLY_USD + DELIVERY_FEE_USD;

/** A unit is delivered, set up and online this many hours after payment. */
export const ONLINE_MIN_HOURS = 48;
export const ONLINE_MAX_HOURS = 72;
export const ONLINE_WINDOW_LABEL = `${ONLINE_MIN_HOURS}–${ONLINE_MAX_HOURS} hours`;

export const SERVICE_STATES = [
  { code: "ID", name: "Idaho" },
  { code: "OR", name: "Oregon" },
  { code: "WA", name: "Washington" },
  { code: "MT", name: "Montana" },
] as const;

export const SERVICE_AREA_LABEL = SERVICE_STATES.map((s) => s.name).join(" · ");
export const SERVICE_AREA_CODES = SERVICE_STATES.map((s) => s.code).join(" · ");

/** Where the map opens: roughly the middle of the four states. */
export const SERVICE_AREA_CENTER = { lat: 45.9, lng: -115.2 } as const;

/** Outer box around ID + OR + WA + MT: [south, west, north, east]. */
export const SERVICE_AREA_BOUNDS = {
  south: 41.98,
  west: -124.85,
  north: 49.01,
  east: -104.03,
} as const;

export type LatLng = { lat: number; lng: number };

/**
 * Coarse, offline service-area test. The four states almost fill their bounding
 * box; the one large piece that isn't ours is Wyoming's north-west corner
 * (south of 45° N, east of Idaho's border at 111.05° W). Borders are otherwise
 * straight lines of latitude/longitude or coastline, so this is good enough to
 * stop an obviously wrong pin — the team still confirms every site.
 */
export function inServiceArea({ lat, lng }: LatLng): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  const b = SERVICE_AREA_BOUNDS;
  if (lat < b.south || lat > b.north || lng < b.west || lng > b.east) return false;
  if (lat < 45 && lng > -111.05) return false;
  return true;
}

/** True when a geocoder's state name is one we deliver to. */
export function isServiceState(stateName: string): boolean {
  const n = stateName.trim().toLowerCase();
  return SERVICE_STATES.some((s) => s.name.toLowerCase() === n);
}

export function formatCoords({ lat, lng }: LatLng): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(5)}° ${ns}, ${Math.abs(lng).toFixed(5)}° ${ew}`;
}

export function mapsLink({ lat, lng }: LatLng): string {
  return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
}

/**
 * Order numbers are derived from the Stripe session id, so the same checkout
 * always shows the same number with no extra store to keep in sync.
 */
export function orderNumber(sessionId: string, year: number): string {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = (hash * 31 + sessionId.charCodeAt(i)) % 10000;
  }
  return `SP-${year}-${String(hash).padStart(4, "0")}`;
}
