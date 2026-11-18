"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { reverseGeocode, type PlaceInfo } from "@/lib/geocode";
import {
  DELIVERY_FEE_USD,
  DUE_TODAY_USD,
  formatCoords,
  inServiceArea,
  isServiceState,
  ONLINE_WINDOW_LABEL,
  RENT_MONTHLY_USD,
  SERVICE_AREA_LABEL,
  type LatLng,
} from "@/lib/rental";
import { OnlineWindow } from "./OnlineWindow";
import { SitePinMap } from "./SitePinMap";

const STEP_HEADERS = ["SERVICE LOCATION", "YOUR DETAILS", "REVIEW + PAY"] as const;
const DRAFT_KEY = "sp-rent-draft";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Draft = {
  step: number;
  pin: LatLng | null;
  access: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  loads: string;
  fuelService: boolean;
};

const EMPTY: Draft = {
  step: 1,
  pin: null,
  access: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  loads: "",
  fuelService: false,
};

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2">
        {label}
        {optional && <span className="opacity-60"> · optional</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div
      className="flex justify-between gap-6 py-3 border-b text-[14px]"
      style={{ borderColor: "var(--line)" }}
    >
      <span className="text-[var(--mute)] flex-none">{k}</span>
      <span className="text-right min-w-0 break-words">{children}</span>
    </div>
  );
}

export function RentFlow() {
  const [d, setD] = useState<Draft>(EMPTY);
  const [restored, setRestored] = useState(false);
  const [canceled, setCanceled] = useState(false);
  // undefined = looking up, null = lookup failed (fine — bounds check still applies).
  const [place, setPlace] = useState<PlaceInfo | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const card = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setD((prev) => ({ ...prev, [key]: value }));

  // Coming back from a cancelled Stripe checkout (or a reload) shouldn't cost
  // anyone their pin. Read after mount so the server render stays static.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      // One-time hydration from browser storage, which the server can't see.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setD({ ...EMPTY, ...(JSON.parse(raw) as Partial<Draft>) });
    } catch {
      // Storage blocked or corrupt — start clean.
    }
    setCanceled(new URLSearchParams(window.location.search).has("canceled"));
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch {
      // Non-fatal.
    }
  }, [d, restored]);

  const { pin } = d;
  const pinInBounds = pin ? inServiceArea(pin) : false;

  // Name the pin. Debounced so dragging doesn't fire a lookup per pixel.
  useEffect(() => {
    if (!pin || !pinInBounds) return;
    const ctl = new AbortController();
    const id = window.setTimeout(() => {
      void reverseGeocode(pin, ctl.signal).then((info) => {
        if (!ctl.signal.aborted) setPlace(info);
      });
    }, 500);
    return () => {
      window.clearTimeout(id);
      ctl.abort();
    };
  }, [pin, pinInBounds]);

  function dropPin(p: LatLng) {
    setPlace(undefined);
    setError(null);
    set("pin", p);
  }

  // The geocoder can veto a pin the coarse box let through (e.g. just over a
  // state line); it can never approve one the box rejected.
  const outOfArea =
    !!pin && (!pinInBounds || (!!place && !!place.state && !isServiceState(place.state)));
  const placeLabel = place?.label ?? "";

  function validate(step: number): string | null {
    if (step >= 1) {
      if (!pin) return "Drop a pin on the map where you want the unit.";
      if (outOfArea) {
        return `That pin is outside our service area (${SERVICE_AREA_LABEL}).`;
      }
    }
    if (step >= 2) {
      if (!d.name.trim()) return "Add your name.";
      if (!EMAIL_RE.test(d.email.trim())) return "Add a valid email — your receipt goes there.";
      if (d.phone.replace(/\D/g, "").length < 10) {
        return "Add a phone number so we can coordinate the drop-off.";
      }
    }
    return null;
  }

  function goTo(step: number) {
    setError(null);
    set("step", step);
    card.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function next() {
    const problem = validate(d.step);
    if (problem) {
      setError(problem);
      return;
    }
    if (d.step < 3) {
      goTo(d.step + 1);
      return;
    }
    if (!pin) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: pin.lat,
          lng: pin.lng,
          place: placeLabel,
          access: d.access,
          name: d.name,
          company: d.company,
          email: d.email,
          phone: d.phone,
          loads: d.loads,
          fuelService: d.fuelService,
        }),
      });
      const data: { url?: string; error?: string } = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || `Couldn't start checkout (${res.status})`);
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't start checkout");
      setSubmitting(false);
    }
  }

  const nextLabel =
    d.step === 1
      ? "Continue"
      : d.step === 2
        ? "Review order"
        : submitting
          ? "Redirecting to secure checkout…"
          : `Pay $${DUE_TODAY_USD} & start rental`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-8 lg:gap-12 items-start">
      {/* ---------------- steps ---------------- */}
      <div
        ref={card}
        className="border p-5 sm:p-8 scroll-mt-[88px]"
        style={{ borderColor: "var(--line-strong)", background: "rgba(255,255,255,.02)" }}
      >
        <div className="flex items-center justify-between mb-7 gap-4">
          <div className="flex gap-2.5 items-center">
            {[1, 2, 3].map((n) => (
              <div key={n} className="step-dot" data-on={d.step === n} data-done={d.step > n}>
                {String(n).padStart(2, "0")}
              </div>
            ))}
          </div>
          <div className="mono text-[10.5px] tracking-[.18em] text-[var(--mute)]">
            {STEP_HEADERS[d.step - 1]}
          </div>
        </div>

        {canceled && d.step === 3 && (
          <p
            className="text-[13px] leading-[1.5] m-0 mb-6 px-4 py-3 border-l-2"
            style={{ borderColor: "var(--paper)", background: "rgba(255,255,255,.04)" }}
          >
            Checkout wasn&apos;t completed, so nothing was charged. Your details are still
            here whenever you&apos;re ready.
          </p>
        )}

        {d.step === 1 && (
          <div>
            <h2 className="text-[24px] m-0 mb-2 font-bold tracking-[-.01em]">
              Where should it go?
            </h2>
            <p className="text-[var(--mute)] text-[14px] m-0 mb-5 leading-[1.55]">
              Drop a pin on the exact spot you want the unit set down. Switch to satellite
              to line it up with a pad, gate or trailer, then drag the pin to fine-tune.
            </p>

            <SitePinMap pin={pin} onPin={dropPin} />

            <div
              className="mt-3 px-4 py-3 border"
              style={{
                borderColor: outOfArea ? "#f87171" : "var(--line-strong)",
                background: "rgba(255,255,255,.02)",
              }}
              aria-live="polite"
            >
              {!pin ? (
                <span className="mono text-[11px] tracking-[.12em] uppercase text-[var(--mute)]">
                  No pin yet · we deliver across {SERVICE_AREA_LABEL}
                </span>
              ) : outOfArea ? (
                <div className="text-[13px] leading-[1.55]">
                  <span className="font-semibold" style={{ color: "#f87171" }}>
                    That&apos;s outside our service area.
                  </span>{" "}
                  <span className="text-[var(--mute)]">
                    We deliver across {SERVICE_AREA_LABEL} right now. Move the pin, or{" "}
                    <Link href="/contact" className="text-[var(--paper)] underline">
                      tell us about your site
                    </Link>{" "}
                    and we&apos;ll see what we can do.
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <span className="num text-[14px] font-semibold">{formatCoords(pin)}</span>
                  <span className="mono text-[11px] tracking-[.12em] uppercase text-[var(--mute)]">
                    {place === undefined
                      ? "Locating…"
                      : placeLabel
                        ? `Near ${placeLabel} · in service area`
                        : "In service area"}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-5">
              <Field label="ACCESS NOTES" optional>
                <textarea
                  className="input min-h-[84px]"
                  style={{ fontFamily: "var(--font-inter)", fontSize: 14 }}
                  value={d.access}
                  onChange={(e) => set("access", e.target.value)}
                  placeholder="Gate codes, road conditions, 4WD needed, who to ask for on site"
                />
              </Field>
            </div>
          </div>
        )}

        {d.step === 2 && (
          <div>
            <h2 className="text-[24px] m-0 mb-2 font-bold tracking-[-.01em]">
              Who&apos;s it for?
            </h2>
            <p className="text-[var(--mute)] text-[14px] m-0 mb-6 leading-[1.55]">
              We&apos;ll use these to confirm the drop-off time and send your receipt.
            </p>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="YOUR NAME">
                  <input
                    type="text"
                    className="input"
                    value={d.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="First Last"
                    autoComplete="name"
                  />
                </Field>
                <Field label="COMPANY" optional>
                  <input
                    type="text"
                    className="input"
                    value={d.company}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="e.g. Silver Valley Environmental"
                    autoComplete="organization"
                  />
                </Field>
                <Field label="EMAIL">
                  <input
                    type="email"
                    className="input"
                    value={d.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </Field>
                <Field label="MOBILE PHONE">
                  <input
                    type="tel"
                    className="input"
                    value={d.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="(208) 555-0123"
                    autoComplete="tel"
                  />
                </Field>
              </div>

              <Field label="WHAT ARE YOU POWERING?" optional>
                <input
                  type="text"
                  className="input"
                  value={d.loads}
                  onChange={(e) => set("loads", e.target.value)}
                  placeholder="e.g. cameras, a dust monitor, job-trailer Wi-Fi"
                />
              </Field>

              <fieldset className="border-0 p-0 m-0 mt-1">
                <legend className="eyebrow mb-2.5 p-0">WHO KEEPS IT FUELLED?</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(
                    [
                      [false, "I'll refuel it myself", `Included in $${RENT_MONTHLY_USD}/mo`],
                      [true, "Quote me fuel service", "Priced per gallon delivered"],
                    ] as const
                  ).map(([value, title, sub]) => (
                    <button
                      key={title}
                      type="button"
                      className="chip-btn flex-col !items-start !gap-1 text-left py-3"
                      data-on={d.fuelService === value}
                      aria-pressed={d.fuelService === value}
                      onClick={() => set("fuelService", value)}
                    >
                      <span className="text-[13px] font-semibold">{title}</span>
                      <span className="text-[11px] opacity-70">{sub}</span>
                    </button>
                  ))}
                </div>
                {d.fuelService && (
                  <p className="text-[var(--mute)] text-[13px] leading-[1.55] m-0 mt-3">
                    We set up fuel, keep it topped up, and monitor and manage the unit for
                    you. It&apos;s billed by the gallon delivered, so we&apos;ll contact you
                    with a quote for your site — nothing extra is charged today.
                  </p>
                )}
              </fieldset>
            </div>
          </div>
        )}

        {d.step === 3 && pin && (
          <div>
            <h2 className="text-[24px] m-0 mb-2 font-bold tracking-[-.01em]">
              Check it over.
            </h2>
            <p className="text-[var(--mute)] text-[14px] m-0 mb-5 leading-[1.55]">
              The clock starts when you pay: delivered, set up and online within{" "}
              {ONLINE_WINDOW_LABEL}.
            </p>

            <div className="border-t" style={{ borderColor: "var(--line)" }}>
              <Row k="Site">
                <span className="num">{formatCoords(pin)}</span>
                {placeLabel && (
                  <span className="block text-[var(--mute)] text-[13px]">
                    Near {placeLabel}
                  </span>
                )}
                <button
                  type="button"
                  className="ulink mono text-[11px] tracking-[.1em] uppercase text-[var(--mute)] mt-1"
                  onClick={() => goTo(1)}
                >
                  Move pin
                </button>
              </Row>
              {d.access.trim() && <Row k="Access">{d.access.trim()}</Row>}
              <Row k="Contact">
                {d.name.trim()}
                {d.company.trim() && <> · {d.company.trim()}</>}
                <span className="block text-[var(--mute)] text-[13px]">
                  {d.email.trim()} · {d.phone.trim()}
                </span>
              </Row>
              <Row k="Fuel">
                {d.fuelService
                  ? "Fuel service — we'll send a per-gallon quote"
                  : "You refuel it"}
              </Row>
              <Row k="Online by">
                <OnlineWindow />
                <span className="block text-[var(--mute)] text-[13px]">if you pay now</span>
              </Row>
            </div>

            <div className="mt-6 text-[14px]">
              <div className="flex justify-between py-1.5">
                <span className="text-[var(--mute)]">First month&apos;s rental</span>
                <span className="num">${RENT_MONTHLY_USD}.00</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[var(--mute)]">Delivery &amp; setup · one-time</span>
                <span className="num">${DELIVERY_FEE_USD}.00</span>
              </div>
              <div
                className="flex justify-between items-baseline pt-4 mt-2 border-t"
                style={{ borderColor: "var(--line-strong)" }}
              >
                <span className="font-semibold">Due today</span>
                <span className="num text-[30px] font-bold">${DUE_TODAY_USD}.00</span>
              </div>
            </div>

            <p className="text-[var(--mute)] text-[12px] leading-[1.6] m-0 mt-4">
              You&apos;ll pay on Stripe&apos;s secure checkout — we never see your card.
              After today your card is charged ${RENT_MONTHLY_USD} each month for as long
              as you keep the unit.
            </p>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="mono text-[11px] tracking-[.08em] mt-5 m-0 leading-[1.6]"
            style={{ color: "#f87171" }}
          >
            {error}
          </p>
        )}

        <div
          className="flex justify-between gap-3 mt-8 pt-5 border-t"
          style={{ borderColor: "var(--line)" }}
        >
          <button
            type="button"
            className="btn btn-ghost h-auto px-[18px] py-3 text-[13px] disabled:opacity-30"
            onClick={() => goTo(Math.max(1, d.step - 1))}
            disabled={d.step === 1 || submitting}
          >
            ← Back
          </button>
          <button
            type="button"
            className="btn btn-cy h-auto px-[22px] py-3 text-[13px] text-left disabled:opacity-60"
            onClick={() => void next()}
            disabled={submitting}
          >
            {nextLabel} {!submitting && <span>→</span>}
          </button>
        </div>
      </div>

      {/* ---------------- order summary ---------------- */}
      <aside
        className="border p-6 sm:p-7 lg:sticky lg:top-[88px]"
        style={{ borderColor: "var(--line-strong)" }}
      >
        <div className="eyebrow">YOUR RENTAL</div>
        <div className="mt-3 text-[22px] font-bold tracking-[-.01em]">Sitepulse V1</div>
        <ul className="list-none p-0 m-0 mt-4 text-[14px] leading-[1.9] text-[var(--mute)]">
          <li>· Hybrid battery + generator power unit</li>
          <li>· Starlink internet service included</li>
          <li>· Delivered and set up on your pin</li>
          <li>· Online within {ONLINE_WINDOW_LABEL} of payment</li>
        </ul>

        <div className="mt-6 pt-5 border-t text-[14px]" style={{ borderColor: "var(--line)" }}>
          <div className="flex justify-between py-1.5">
            <span className="text-[var(--mute)]">Rental</span>
            <span className="num">${RENT_MONTHLY_USD}/mo</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[var(--mute)]">Delivery &amp; setup</span>
            <span className="num">${DELIVERY_FEE_USD} once</span>
          </div>
          <div
            className="flex justify-between items-baseline pt-4 mt-3 border-t"
            style={{ borderColor: "var(--line-strong)" }}
          >
            <span className="font-semibold">Due today</span>
            <span className="num text-[26px] font-bold">${DUE_TODAY_USD}</span>
          </div>
        </div>

        <div
          className="mt-6 px-4 py-3.5 border border-dashed"
          style={{ borderColor: "var(--line-strong)" }}
        >
          <div className="mono text-[10px] tracking-[.16em] uppercase text-[var(--mute)] mb-1.5">
            Pay now · online between
          </div>
          <div className="text-[13px] leading-[1.5]">
            <OnlineWindow />
          </div>
        </div>

        <p className="text-[var(--mute)] text-[12px] leading-[1.6] m-0 mt-5">
          Rather we handle the fuel, or need more than one unit?{" "}
          <Link href="/contact" className="text-[var(--paper)] underline">
            Contact us
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}
