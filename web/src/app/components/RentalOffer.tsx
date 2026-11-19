import Link from "next/link";
import {
  DELIVERY_FEE_USD,
  DUE_TODAY_USD,
  ONLINE_WINDOW_LABEL,
  RENT_MONTHLY_USD,
  SERVICE_AREA_LABEL,
} from "@/lib/rental";
import { Eyebrow } from "./Eyebrow";

const PLAN = [
  "Sitepulse V1 hybrid unit — battery, inverter and top-up generator",
  "Starlink Wi-Fi + power, $299/mo",
  `Delivered and set up on your pin (one-time $${DELIVERY_FEE_USD})`,
  `Online within ${ONLINE_WINDOW_LABEL} of payment`,
  "You keep the tank topped up",
];

const MANAGED = [
  "Everything in the subscription",
  "We set up fuel on site and keep it topped up",
  "We monitor and manage the unit for you",
  "Billed by the gallon delivered — it tracks your usage",
];

function Check() {
  return (
    <span className="mono text-[var(--hi)] flex-none" aria-hidden>
      +
    </span>
  );
}

export function RentalOffer() {
  return (
    <section
      id="plan"
      className="relative py-32 border-b overflow-hidden"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div
        className="nebula"
        style={{ width: 520, height: 520, right: "-150px", top: "10%", opacity: 0.25 }}
      />
      <div className="relative max-w-[1440px] mx-auto px-8">
        <Eyebrow num="07" label="GET ONE" />
        <h2
          className="display-x mt-6 leading-[.95] tracking-[-.045em]"
          style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
        >
          ${RENT_MONTHLY_USD} a month.
          <br />
          Starlink Wi-Fi + power.
        </h2>
        <p className="mt-8 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
          We&apos;re shipping the first five V1 units across {SERVICE_AREA_LABEL}. Drop a
          pin, start your subscription, and it&apos;s on your site and online within{" "}
          {ONLINE_WINDOW_LABEL}.
        </p>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* the plan we sell online */}
          <div
            className="lg:col-span-7 border p-8 sm:p-10 bg-black/60 backdrop-blur"
            style={{ borderColor: "var(--hi)" }}
          >
            <div className="mono text-[11px] tracking-[.18em] uppercase text-[var(--hi)]">
              SUBSCRIPTION · YOU REFUEL
            </div>
            <div className="mt-5 flex items-end gap-3">
              <div className="display-x text-[72px] sm:text-[96px] tracking-[-.05em] leading-[.85]">
                ${RENT_MONTHLY_USD}
              </div>
              <div className="mono text-[12px] tracking-[.16em] uppercase text-zinc-500 pb-2">
                / month
              </div>
            </div>
            <ul className="mt-8 space-y-3 text-[15px] text-zinc-300">
              {PLAN.map((line) => (
                <li key={line} className="flex gap-4">
                  <Check />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link href="/plan" className="btn btn-cy">
                START YOUR SUBSCRIPTION <span>→</span>
              </Link>
              <span className="mono text-[11px] uppercase tracking-[.16em] text-zinc-500">
                ${RENT_MONTHLY_USD}/mo + ${DELIVERY_FEE_USD} one-time setup · $
                {DUE_TODAY_USD} due today
              </span>
            </div>
          </div>

          {/* by arrangement */}
          <div
            className="lg:col-span-5 border p-8 sm:p-10 flex flex-col"
            style={{ borderColor: "var(--line-strong)" }}
          >
            <div className="mono text-[11px] tracking-[.18em] uppercase text-zinc-500">
              FUEL SERVICE · WE REFUEL
            </div>
            <div className="display mt-5 text-[34px] tracking-[-.03em] leading-[1.05]">
              Per gallon delivered.
            </div>
            <ul className="mt-8 space-y-3 text-[15px] text-zinc-400">
              {MANAGED.map((line) => (
                <li key={line} className="flex gap-4">
                  <Check />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 lg:mt-auto lg:pt-10">
              <Link href="/contact" className="btn btn-ghost">
                CONTACT US FOR A QUOTE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
