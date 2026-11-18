"use client";

import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
import { useEffect, useRef, useState } from "react";
import { searchPlace } from "@/lib/geocode";
import { SERVICE_AREA_CENTER, type LatLng } from "@/lib/rental";

type Basemap = "map" | "satellite";

const TILES = {
  map: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    maxNativeZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics",
    maxNativeZoom: 18,
  },
  /** Place names and roads drawn over the imagery so it stays navigable. */
  labels: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    attribution: "",
    maxNativeZoom: 18,
  },
} as const;

const PIN_HTML = `<svg width="34" height="44" viewBox="0 0 34 44" fill="none" aria-hidden="true">
  <path d="M17 43C17 43 32 27.5 32 16.5C32 8 25.3 1.5 17 1.5C8.7 1.5 2 8 2 16.5C2 27.5 17 43 17 43Z" fill="#fff" stroke="#000" stroke-width="1.5"/>
  <circle cx="17" cy="16.5" r="5.5" fill="#000"/>
</svg>`;

/**
 * Click-to-drop, drag-to-adjust site pin. The pin itself is controlled by the
 * parent (`pin` / `onPin`), so a restored draft or a search result places it
 * the same way a click does.
 */
export function SitePinMap({
  pin,
  onPin,
}: {
  pin: LatLng | null;
  onPin: (p: LatLng) => void;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const L = useRef<typeof Leaflet | null>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const marker = useRef<Leaflet.Marker | null>(null);
  const layers = useRef<Leaflet.Layer[]>([]);
  const onPinRef = useRef(onPin);
  const [ready, setReady] = useState(false);
  const [basemap, setBasemap] = useState<Basemap>("map");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<"search" | "locate" | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    onPinRef.current = onPin;
  }, [onPin]);

  // Leaflet touches `window` at import time, so it loads in the browser only.
  useEffect(() => {
    let cancelled = false;
    void import("leaflet").then((mod) => {
      if (cancelled || !holder.current || map.current) return;
      L.current = mod;
      const m = mod.map(holder.current, {
        center: [SERVICE_AREA_CENTER.lat, SERVICE_AREA_CENTER.lng],
        zoom: 6,
        minZoom: 4,
        maxZoom: 20,
        // Page scroll shouldn't get trapped by the map on the way past it.
        scrollWheelZoom: false,
      });
      m.on("click", (e) => {
        m.scrollWheelZoom.enable();
        onPinRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
      m.on("focus", () => m.scrollWheelZoom.enable());
      map.current = m;
      setReady(true);
    });
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      marker.current = null;
      layers.current = [];
    };
  }, []);

  // Basemap swap.
  useEffect(() => {
    const m = map.current;
    const lf = L.current;
    if (!ready || !m || !lf) return;
    layers.current.forEach((l) => m.removeLayer(l));
    const make = (t: (typeof TILES)[keyof typeof TILES]) =>
      lf.tileLayer(t.url, {
        attribution: t.attribution,
        maxNativeZoom: t.maxNativeZoom,
        maxZoom: 20,
      });
    layers.current =
      basemap === "map" ? [make(TILES.map)] : [make(TILES.satellite), make(TILES.labels)];
    layers.current.forEach((l) => l.addTo(m));
  }, [basemap, ready]);

  // Keep the marker on the controlled pin.
  useEffect(() => {
    const m = map.current;
    const lf = L.current;
    if (!ready || !m || !lf) return;
    if (!pin) {
      marker.current?.remove();
      marker.current = null;
      return;
    }
    if (marker.current) {
      marker.current.setLatLng([pin.lat, pin.lng]);
      return;
    }
    const mk = lf.marker([pin.lat, pin.lng], {
      draggable: true,
      keyboard: false,
      icon: lf.divIcon({
        className: "sp-pin",
        html: PIN_HTML,
        iconSize: [34, 44],
        iconAnchor: [17, 43],
      }),
    });
    mk.on("dragend", () => {
      const p = mk.getLatLng();
      onPinRef.current({ lat: p.lat, lng: p.lng });
    });
    mk.addTo(m);
    marker.current = mk;
    // A restored draft should open on its pin, not on the whole region.
    if (m.getZoom() <= 6) m.setView([pin.lat, pin.lng], 14);
  }, [pin, ready]);

  function goTo(p: LatLng, zoom: number) {
    map.current?.setView([p.lat, p.lng], Math.max(map.current.getZoom(), zoom));
    onPin(p);
  }

  async function search() {
    const q = query.trim();
    if (!q || busy) return;
    setBusy("search");
    setNote(null);
    const hit = await searchPlace(q);
    setBusy(null);
    if (!hit) {
      setNote("Couldn't find that in Idaho, Oregon, Washington or Montana — try the nearest town, or just zoom in on the map.");
      return;
    }
    goTo(hit, 14);
    setNote("Pin dropped on the search result — drag it to the exact spot.");
  }

  function locate() {
    if (!navigator.geolocation || busy) {
      setNote("Your browser can't share a location — click the map instead.");
      return;
    }
    setBusy("locate");
    setNote(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(null);
        goTo({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 17);
        setNote("Pin dropped where you're standing — drag it to the exact spot.");
      },
      () => {
        setBusy(null);
        setNote("Couldn't read your location — click the map instead.");
      },
      { enableHighAccuracy: true, timeout: 12_000 },
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="search"
          className="input flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void search();
            }
          }}
          placeholder="Search a town, address or road"
          aria-label="Search for a place"
          enterKeyHint="search"
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="chip-btn flex-1 justify-center whitespace-nowrap"
            onClick={() => void search()}
            disabled={busy !== null}
          >
            {busy === "search" ? "Searching…" : "Search"}
          </button>
          <button
            type="button"
            className="chip-btn flex-1 justify-center whitespace-nowrap"
            onClick={locate}
            disabled={busy !== null}
          >
            {busy === "locate" ? "Locating…" : "Use my location"}
          </button>
        </div>
      </div>

      <div
        className="relative border"
        style={{ borderColor: "var(--line-strong)", isolation: "isolate" }}
      >
        <div
          ref={holder}
          className="sp-map h-[340px] sm:h-[460px] w-full"
          role="application"
          aria-label="Map — click to drop a pin where the unit should go"
        />
        <div className="absolute top-3 right-3 z-[1000] flex">
          {(
            [
              ["map", "Map"],
              ["satellite", "Satellite"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className="chip-btn"
              style={{ background: basemap === key ? undefined : "rgba(0,0,0,.8)" }}
              data-on={basemap === key}
              aria-pressed={basemap === key}
              onClick={() => setBasemap(key)}
            >
              {label}
            </button>
          ))}
        </div>
        {ready && !pin && (
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] mono text-[11px] tracking-[.12em] uppercase px-3 py-2 pointer-events-none whitespace-nowrap"
            style={{ background: "rgba(0,0,0,.85)", border: "1px solid var(--line-strong)" }}
          >
            Click the map to drop your pin
          </div>
        )}
      </div>

      {note && (
        <p className="mono text-[11px] tracking-[.06em] text-[var(--mute)] mt-2 m-0 leading-[1.6]">
          {note}
        </p>
      )}
    </div>
  );
}
