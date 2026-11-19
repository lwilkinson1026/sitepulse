import Link from "next/link";
import {
  DELIVERY_FEE_USD,
  DUE_TODAY_USD,
  ONLINE_WINDOW_LABEL,
  RENT_MONTHLY_USD,
} from "@/lib/rental";

const FLOW = ["DROP A PIN", "YOUR DETAILS", `PAY $${DUE_TODAY_USD}`, "ONLINE IN 48–72 H"] as const;

export function RentCta() {
  return (
    <section
      className="section"
      id="plan"
      style={{
        background: "linear-gradient(180deg, transparent, rgba(255,255,255,.03))",
      }}
    >
      <div className="wrap">
        <div className="section-hd">
          <span className="idx">07 / PLAN</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-start">
          <div>
            <h2 className="section-h2 mb-6" style={{ fontSize: "clamp(34px, 5vw, 56px)" }}>
              ${RENT_MONTHLY_USD} a month.
              <br />
              <span style={{ color: "var(--mute)" }}>Online in 48–72 hours.</span>
            </h2>
            <p className="text-[var(--mute)] text-[17px] leading-[1.55] m-0 mb-8 max-w-[520px]">
              Starlink Wi-Fi + power, ${RENT_MONTHLY_USD}/mo. Pay the first month and a
              one-time ${DELIVERY_FEE_USD} setup, and the unit is on your site and
              online within {ONLINE_WINDOW_LABEL}.
            </p>

            <div className="flex items-center gap-2 flex-wrap mb-10">
              {FLOW.map((label, i) => (
                <span key={label} className="flex items-center gap-2">
                  <span
                    className="mono px-3 py-2 border text-[11px] tracking-[.1em]"
                    style={{ borderColor: "var(--line-strong)" }}
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

            <Link href="/plan" className="btn btn-cy px-[22px] text-[14px]">
              Start your subscription →
            </Link>
          </div>

          <div
            className="border p-6 sm:p-8"
            style={{
              borderColor: "var(--line-strong)",
              background: "rgba(255,255,255,.02)",
            }}
          >
            <div className="eyebrow mb-3">RATHER NOT HAUL FUEL?</div>
            <h3 className="text-[22px] m-0 mb-3 font-bold tracking-[-.01em]">
              Fuel service, by the gallon.
            </h3>
            <p className="text-[var(--mute)] text-[14px] leading-[1.6] m-0 mb-6">
              We set up fuel on site, keep the unit topped up, and monitor and manage it
              for you. It&apos;s priced per gallon delivered, so what you pay tracks what
              your site actually burns.
            </p>
            <Link href="/contact" className="btn btn-ghost px-[22px] text-[14px]">
              Ask for a quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
