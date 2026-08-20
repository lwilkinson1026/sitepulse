"use client";

import { useEffect, useState } from "react";
import { fmt } from "@/lib/site-power";
import TwitterPurchaseEvent from "../TwitterPurchaseEvent";
import { useSizing } from "./SizingContext";

const STEP_HEADERS = [
  "CONTACT + SITE",
  "OPS DETAILS",
  "DEPOSIT · $250",
  "CONFIRMED",
] as const;

const FLOW = ["CONFIGURE", "QUOTE", "$250 DEPOSIT", "SITE CALL", "DELIVERY"] as const;

const CALL_TOPICS = [
  "Site access — road, gate, terrain",
  "Who refuels, and how often you're on-site",
  "Whether you're on a GC-controlled worksite (flags NRTL early)",
  "Your COI / additional-insured requirements",
  "Target start date and expected duration",
];

type Confirmed = {
  reservationNumber: string;
  email: string | null;
  conversionId: string;
  value: number;
  currency: string;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      {children}
    </div>
  );
}

export function ReserveForm() {
  const { result } = useSizing();

  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [start, setStart] = useState("");
  const [refuel, setRefuel] = useState("");
  const [gc, setGc] = useState("");
  const [coi, setCoi] = useState("");

  // Returning from Stripe Checkout: ?reserved=<session_id>. Verified server-side
  // before the confirmation step is shown. Read from location rather than
  // useSearchParams so the landing page stays statically rendered.
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("reserved");
    if (!sessionId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/reserve/confirm?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = await res.json();
        if (cancelled || !data.paid) return;
        setConfirmed({
          reservationNumber: data.reservationNumber,
          email: data.email,
          conversionId: data.conversionId,
          value: data.value,
          currency: data.currency,
        });
        setStep(4);
      } catch {
        // Stay on the form; the receipt email is still the source of truth.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function scrollToSection() {
    document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" });
  }

  function next() {
    setError(null);
    if (step === 1) {
      if (!name.trim() || !email.trim() || !site.trim()) {
        setError("Name, email, and a site location are needed before we can quote.");
        return;
      }
      setStep(2);
      scrollToSection();
      return;
    }
    if (step === 2) {
      setStep(3);
      scrollToSection();
      return;
    }
    void payDeposit();
  }

  async function payDeposit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          name,
          email,
          site,
          start,
          refuel,
          gc,
          coi,
          units: result.units,
          monthly: result.monthly,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout. Please try again.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  const nextLabel =
    step === 3 ? (submitting ? "Redirecting…" : "Pay $250") : step === 2 ? "Continue to deposit" : "Continue";

  return (
    <section
      className="section"
      id="reserve"
      style={{
        background: "linear-gradient(180deg, transparent, rgba(255,255,255,.03))",
      }}
    >
      <div className="wrap">
        <div className="section-hd">
          <span className="idx">08 / RESERVE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
          <div>
            <h2 className="section-h2 mb-6" style={{ fontSize: "clamp(34px, 5vw, 56px)" }}>
              $250 holds
              <br />
              your unit.
            </h2>
            <p className="text-[var(--mute)] text-[17px] leading-[1.55] m-0 mb-8 max-w-[500px]">
              Credited fully to your first month. Every deployment needs a site
              conversation — access, siting, refuel plan, safety briefing — so the last step
              is a call, not a checkout.
            </p>

            <div className="flex items-center gap-2 flex-wrap mb-10">
              {FLOW.map((label, i) => (
                <span key={label} className="flex items-center gap-2">
                  <span
                    className="mono px-3 py-2 border text-[11px] tracking-[.1em]"
                    style={
                      label === "$250 DEPOSIT"
                        ? {
                            borderColor: "var(--paper)",
                            background: "var(--paper)",
                            color: "var(--ink)",
                            fontWeight: 600,
                          }
                        : { borderColor: "var(--line-strong)" }
                    }
                  >
                    {label}
                  </span>
                  {i < FLOW.length - 1 && (
                    <span style={{ color: "var(--mute)" }} aria-hidden>
                      →
                    </span>
                  )}
                </span>
              ))}
            </div>

            <div className="border-t pt-6" style={{ borderColor: "var(--line)" }}>
              <div className="eyebrow mb-4">WHAT WE&apos;LL ASK ON THE CALL</div>
              <ul className="list-none p-0 m-0 text-[var(--mute)] text-[14px] leading-[1.8]">
                {CALL_TOPICS.map((t) => (
                  <li key={t}>· {t}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------------- multi-step form ---------------- */}
          <div
            className="border p-6 sm:p-8"
            style={{
              borderColor: "var(--line-strong)",
              background: "rgba(255,255,255,.02)",
            }}
          >
            <div className="flex items-center justify-between mb-7 gap-4">
              <div className="flex gap-2.5 items-center">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="step-dot"
                    data-on={step === n}
                    data-done={step > n}
                  >
                    {String(n).padStart(2, "0")}
                  </div>
                ))}
              </div>
              <div className="mono text-[10.5px] tracking-[.18em] text-[var(--mute)]">
                {STEP_HEADERS[step - 1]}
              </div>
            </div>

            {step === 1 && (
              <div>
                <h3 className="text-[22px] m-0 mb-2 font-bold tracking-[-.01em]">
                  Who and where.
                </h3>
                <p className="text-[var(--mute)] text-[13px] m-0 mb-6">
                  Company + site location. This is what we quote against.
                </p>
                <div className="grid gap-4">
                  <Field label="COMPANY">
                    <input
                      type="text"
                      className="input"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Silver Valley Environmental"
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="YOUR NAME">
                      <input
                        type="text"
                        className="input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="First Last"
                        autoComplete="name"
                      />
                    </Field>
                    <Field label="EMAIL">
                      <input
                        type="email"
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        autoComplete="email"
                      />
                    </Field>
                  </div>
                  <Field label="SITE LOCATION / ACCESS NOTES">
                    <textarea
                      className="input min-h-[90px]"
                      style={{ fontFamily: "var(--font-inter)", fontSize: 14 }}
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                      placeholder="Nearest town, coordinates or pin, road/gate conditions"
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-[22px] m-0 mb-2 font-bold tracking-[-.01em]">
                  Ops details.
                </h3>
                <p className="text-[var(--mute)] text-[13px] m-0 mb-6">
                  Refuel plan and site-safety context.
                </p>
                <div className="grid gap-5">
                  <Field label="TARGET START DATE">
                    <input
                      type="date"
                      className="input"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                    />
                  </Field>

                  <div>
                    <div className="eyebrow mb-2.5">WHO REFUELS?</div>
                    <div className="flex gap-2">
                      {(
                        [
                          ["sp", "Sitepulse"],
                          ["us", "Our crew"],
                          ["tbd", "Undecided"],
                        ] as const
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          className="chip-btn flex-1 justify-center"
                          data-on={refuel === key}
                          aria-pressed={refuel === key}
                          onClick={() => setRefuel(key)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="eyebrow mb-2.5">GC-CONTROLLED WORKSITE?</div>
                    <div className="flex gap-2">
                      {(
                        [
                          ["yes", "Yes"],
                          ["no", "No"],
                        ] as const
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          className="chip-btn flex-1 justify-center"
                          data-on={gc === key}
                          aria-pressed={gc === key}
                          onClick={() => setGc(key)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    {gc === "yes" && (
                      <p className="mono text-[10.5px] text-[var(--mute)] mt-2.5 tracking-[.1em] leading-[1.5]">
                        → FLAGS EARLY NRTL CONVERSATION. WE&apos;LL BRING THE FIELD-EVAL
                        PACKAGE TO THE SITE CALL.
                      </p>
                    )}
                  </div>

                  <Field label="COI / ADDITIONAL INSURED REQUIREMENTS">
                    <textarea
                      className="input min-h-[70px]"
                      style={{ fontFamily: "var(--font-inter)", fontSize: 14 }}
                      value={coi}
                      onChange={(e) => setCoi(e.target.value)}
                      placeholder="Anything unusual — limits, wording, named parties"
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-[22px] m-0 mb-2 font-bold tracking-[-.01em]">
                  Deposit.
                </h3>
                <p className="text-[var(--mute)] text-[13px] m-0 mb-6">
                  $250 holds inventory + secures your delivery window. Credited to your
                  first month, fully refundable if we can&apos;t fit your site.
                </p>

                <div className="border p-5 mb-6" style={{ borderColor: "var(--line)" }}>
                  <div className="eyebrow mb-3.5">YOU&apos;RE RESERVING</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="mono text-[10px] text-[var(--mute)] tracking-[.14em]">
                        UNITS
                      </div>
                      <div className="num text-[18px] font-semibold mt-1">
                        {result.units} × box
                      </div>
                    </div>
                    <div>
                      <div className="mono text-[10px] text-[var(--mute)] tracking-[.14em]">
                        MONTHLY
                      </div>
                      <div className="num text-[18px] font-semibold mt-1">
                        ${fmt(result.monthly, 0)}/mo
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mono text-[10.5px] text-[var(--mute)] tracking-[.1em] leading-[1.6] m-0">
                  → CARD DETAILS ARE COLLECTED ON STRIPE&apos;S HOSTED CHECKOUT. WE NEVER
                  SEE OR STORE YOUR CARD NUMBER.
                </p>

                <div
                  className="flex justify-between items-center mt-7 pt-5 border-t"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div>
                    <div className="mono text-[10px] text-[var(--mute)] tracking-[.14em]">
                      TODAY
                    </div>
                    <div className="num text-[32px] font-bold mt-1">$250.00</div>
                  </div>
                  <div className="text-right">
                    <div className="mono text-[10px] text-[var(--mute)] tracking-[.14em]">
                      CREDITED TO MONTH 1
                    </div>
                    <div className="num text-[14px] mt-1">−$250.00</div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && confirmed && (
              <div className="text-center py-5">
                <TwitterPurchaseEvent
                  conversionId={confirmed.conversionId}
                  value={confirmed.value}
                  currency={confirmed.currency}
                />
                <div
                  className="w-14 h-14 border rounded-full inline-flex items-center justify-center mb-5"
                  style={{ borderColor: "var(--paper)", borderWidth: 1.5 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 12l5 5L20 7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="text-[26px] m-0 mb-3 font-bold tracking-[-.01em]">
                  Deposit received.
                </h3>
                <p className="text-[var(--mute)] text-[15px] m-0 mb-6 leading-[1.5]">
                  Confirmation is on its way to{" "}
                  {confirmed.email ?? "your inbox"}. I&apos;ll call within one business day
                  to schedule the site call.
                </p>
                <div className="mono text-[11px] tracking-[.18em]">
                  RESERVATION · SP-{new Date().getFullYear()}-{confirmed.reservationNumber}
                </div>
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="mono text-[11px] tracking-[.08em] mt-5 leading-[1.6]"
                style={{ color: "#f87171" }}
              >
                {error}
              </p>
            )}

            {step < 4 && (
              <div
                className="flex justify-between mt-8 pt-5 border-t"
                style={{ borderColor: "var(--line)" }}
              >
                <button
                  type="button"
                  className="btn btn-ghost h-auto px-[18px] py-3 text-[13px]"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1 || submitting}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn btn-cy h-auto px-[22px] py-3 text-[13px]"
                  onClick={next}
                  disabled={submitting}
                >
                  {nextLabel} →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
