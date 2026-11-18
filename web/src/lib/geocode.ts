import { SERVICE_AREA_BOUNDS, type LatLng } from "./rental";

/**
 * Browser-side lookups against OpenStreetMap's Nominatim. Used only to make the
 * pin friendlier ("Near Sandpoint, Idaho") and to jump the map to a town — the
 * service-area decision never depends on it, so a failed lookup is harmless.
 * Nominatim's usage policy allows light, user-triggered use (no autocomplete).
 */
const NOMINATIM = "https://nominatim.openstreetmap.org";

export type PlaceInfo = {
  /** e.g. "Sandpoint, Idaho" — empty if nothing nearby is named. */
  label: string;
  /** Full state name, or "" when the point isn't in a US state. */
  state: string;
};

type NominatimAddress = Partial<
  Record<
    "city" | "town" | "village" | "hamlet" | "municipality" | "county" | "state" | "country_code",
    string
  >
>;

export async function reverseGeocode(
  { lat, lng }: LatLng,
  signal?: AbortSignal,
): Promise<PlaceInfo | null> {
  try {
    const res = await fetch(
      `${NOMINATIM}/reverse?format=jsonv2&zoom=12&lat=${lat}&lon=${lng}`,
      { signal, headers: { Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const data: { address?: NominatimAddress } = await res.json();
    const a = data.address;
    if (!a) return { label: "", state: "" };
    const state = a.country_code === "us" ? (a.state ?? "") : "";
    const locality =
      a.city ?? a.town ?? a.village ?? a.hamlet ?? a.municipality ?? a.county ?? "";
    return { label: [locality, state].filter(Boolean).join(", "), state };
  } catch {
    return null;
  }
}

export async function searchPlace(query: string): Promise<LatLng | null> {
  const b = SERVICE_AREA_BOUNDS;
  const params = new URLSearchParams({
    format: "jsonv2",
    limit: "1",
    countrycodes: "us",
    viewbox: `${b.west},${b.north},${b.east},${b.south}`,
    bounded: "1",
    q: query,
  });
  try {
    const res = await fetch(`${NOMINATIM}/search?${params}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const hits: Array<{ lat: string; lon: string }> = await res.json();
    if (!hits.length) return null;
    const lat = Number(hits[0].lat);
    const lng = Number(hits[0].lon);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  } catch {
    return null;
  }
}
