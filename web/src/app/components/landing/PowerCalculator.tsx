"use client";

import { useState } from "react";
import {
  fmt,
  LOAD_CATALOG,
  TANK_OPTIONS,
  VISIT_OPTIONS,
  verdictFor,
} from "@/lib/site-power";
import { useSizing } from "./SizingContext";

function StepHeading({
  n,
  children,
}: {
  n: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="step-dot" data-done="true">
        {n}
      </div>
      <div className="mono text-[11px] tracking-[.16em] uppercase">{children}</div>
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
  note,
  className = "",
}: {
  label: string;
  value: string | number;
  unit?: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={`px-5 py-[18px] border-b ${className}`}
      style={{ borderColor: "var(--line)" }}
    >
      <div className="mono text-[10px] tracking-[.16em] text-[var(--mute)] uppercase">
        {label}
      </div>
      <div className="num text-[26px] font-semibold mt-1.5">
        {value}
        {unit && (
          <span className="text-[var(--mute)] text-[13px] ml-1 font-normal">{unit}</span>
        )}
      </div>
      {note && (
        <div className="mono text-[9.5px] text-[var(--mute)] mt-1 tracking-[.1em]">
          {note}
        </div>
      )}
    </div>
  );
}

export function PowerCalculator() {
  const {
    loads,
    customLoads,
    season,
    zip,
    tank,
    visitDays,
    result,
    toggleLoad,
    setQty,
    setHoursFor,
    addCustomLoad,
    setSeason,
    setZip,
    setTank,
    setVisitDays,
  } = useSizing();

  const [customName, setCustomName] = useState("");
  const [customWatts, setCustomWatts] = useState("");
  const [customHours, setCustomHours] = useState("");

  const verdict = verdictFor(result);

  function submitCustom() {
    const ok = addCustomLoad(
      customName,
      parseFloat(customWatts),
      parseFloat(customHours),
    );
    if (!ok) return;
    setCustomName("");
    setCustomWatts("");
    setCustomHours("");
  }

  return (
    <section
      className="section"
      id="calc"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,.02), transparent 30%)",
      }}
    >
      <div className="wrap">
        <div className="section-hd">
          <span className="idx">03 / SIZE YOUR SITE</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-10">
          <div>
            <h2
              className="section-h2 mb-5 max-w-[720px]"
              style={{ fontSize: "clamp(34px, 5vw, 56px)" }}
            >
              The two numbers
              <br />
              that sort you in ten seconds.
            </h2>
            <p className="max-w-[620px] text-[var(--mute)] text-[17px] leading-[1.55] m-0">
              Watts and days. Pick what you&apos;re running, tell me how long between
              visits, and I&apos;ll tell you honestly whether this is the right tool — or
              whether you want a towable genset.
            </p>
          </div>
          <div className="lg:text-right shrink-0">
            <div className="mono text-[10.5px] tracking-[.18em] text-[var(--mute)]">
              STEP 03 OF 3
            </div>
            <div className="flex gap-1.5 mt-3 lg:justify-end">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-7 h-[3px] bg-[var(--paper)]" />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          {/* ---------------- inputs ---------------- */}
          <div className="border p-6 sm:p-8" style={{ borderColor: "var(--line-strong)" }}>
            {/* STEP 1 — loads */}
            <div>
              <StepHeading n="01">What are you running?</StepHeading>

              <div className="max-h-[480px] overflow-y-auto -mx-2 px-2">
                {LOAD_CATALOG.map((l) => {
                  const s = loads[l.id];
                  const on = !!s?.on;
                  const qty = s?.qty ?? 0;
                  const hours = s?.hoursPerDay || l.defaultHours || 4;
                  return (
                    <div key={l.id} className={on ? "load-row on" : "load-row"}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        aria-label={l.name}
                        className="check"
                        data-on={on}
                        onClick={() => toggleLoad(l.id)}
                      />
                      <div>
                        <div className="text-[14px] font-medium">{l.name}</div>
                        {l.note && (
                          <div className="mono text-[10.5px] text-[var(--mute)] mt-0.5 tracking-[.06em]">
                            {l.note}
                          </div>
                        )}
                      </div>
                      <div className="num text-[13px] text-[var(--mute)] text-right">
                        {l.w} W
                      </div>
                      <div>
                        {l.hasHours && (
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0.5"
                              max="24"
                              step="0.5"
                              value={hours}
                              aria-label={`${l.name} hours per day`}
                              onChange={(e) =>
                                setHoursFor(l.id, parseFloat(e.target.value))
                              }
                              className="slider flex-1"
                            />
                            <span className="num text-[11px] text-[var(--mute)] min-w-[42px] text-right">
                              {hours} h/d
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          type="button"
                          className="step-btn"
                          aria-label={`Remove one ${l.name}`}
                          onClick={() => setQty(l.id, -1)}
                          disabled={qty === 0}
                        >
                          −
                        </button>
                        <span className="num min-w-5 text-center text-[13px]">{qty}</span>
                        <button
                          type="button"
                          className="step-btn"
                          aria-label={`Add one ${l.name}`}
                          onClick={() => setQty(l.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}

                {customLoads.map((c) => (
                  <div key={c.id} className="load-row on">
                    <span className="check" data-on="true" aria-hidden />
                    <div>
                      <div className="text-[14px] font-medium">{c.name}</div>
                      <div className="mono text-[10.5px] text-[var(--mute)] mt-0.5 tracking-[.06em]">
                        custom
                      </div>
                    </div>
                    <div className="num text-[13px] text-[var(--mute)] text-right">
                      {c.w} W
                    </div>
                    <div className="num text-[11px] text-[var(--mute)] text-right">
                      {c.hoursPerDay} h/d
                    </div>
                    <div className="num text-[13px] text-right">{c.qty}</div>
                  </div>
                ))}
              </div>

              {/* custom load */}
              <div
                className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-[1fr_120px_140px_90px] gap-3 items-end"
                style={{ borderColor: "var(--line-strong)" }}
              >
                <div>
                  <div className="eyebrow mb-1.5">CUSTOM LOAD</div>
                  <input
                    type="text"
                    className="input"
                    placeholder="Name (e.g. PLC panel)"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                  />
                </div>
                <div>
                  <div className="eyebrow mb-1.5">WATTS</div>
                  <input
                    type="number"
                    className="input"
                    placeholder="0"
                    value={customWatts}
                    onChange={(e) => setCustomWatts(e.target.value)}
                  />
                </div>
                <div>
                  <div className="eyebrow mb-1.5">HOURS / DAY</div>
                  <input
                    type="number"
                    className="input"
                    placeholder="24"
                    min="0.5"
                    max="24"
                    step="0.5"
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-ghost h-auto px-3 py-2.5 text-[12px]"
                  onClick={submitCustom}
                >
                  + ADD
                </button>
              </div>
            </div>

            {/* STEP 2 — duration */}
            <div className="mt-10 pt-8 border-t" style={{ borderColor: "var(--line)" }}>
              <StepHeading n="02">How long between site visits?</StepHeading>
              <div className="flex gap-2 flex-wrap">
                {VISIT_OPTIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className="chip-btn"
                    data-on={visitDays === d}
                    aria-pressed={visitDays === d}
                    onClick={() => setVisitDays(d)}
                  >
                    <span className="num text-[15px] font-semibold">{d}</span>
                    <span className="opacity-70">days</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3 — season, zip, tank */}
            <div className="mt-10 pt-8 border-t" style={{ borderColor: "var(--line)" }}>
              <StepHeading n="03">When, where, and how big a tank?</StepHeading>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <div className="eyebrow mb-2.5">SEASON</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="chip-btn flex-1 justify-center"
                      data-on={season === "summer"}
                      aria-pressed={season === "summer"}
                      onClick={() => setSeason("summer")}
                    >
                      ☀ Summer
                    </button>
                    <button
                      type="button"
                      className="chip-btn flex-1 justify-center"
                      data-on={season === "winter"}
                      aria-pressed={season === "winter"}
                      onClick={() => setSeason("winter")}
                    >
                      ❄ Winter
                    </button>
                  </div>
                </div>
                <div>
                  <div className="eyebrow mb-2.5">ZIP / SITE</div>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. 83814"
                    aria-label="ZIP or site"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="eyebrow mb-2.5">FUEL TANK</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TANK_OPTIONS.map((t) => (
                    <button
                      key={t.gal}
                      type="button"
                      className="chip-btn justify-between px-4 py-3.5"
                      data-on={tank === t.gal}
                      aria-pressed={tank === t.gal}
                      onClick={() => setTank(t.gal)}
                    >
                      <span>
                        <span className="num text-[16px] font-semibold">{t.gal}</span>
                        <span className="opacity-70 ml-1">gal</span>
                      </span>
                      <span className="mono text-[10px] opacity-70 tracking-[.12em]">
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- result ---------------- */}
          <div className="lg:sticky lg:top-[100px]">
            <div className="verdict" style={{ borderColor: verdict.color }}>
              <div className={`verdict-dot ${verdict.className}`} />
              <div>
                <div className="mono text-[10.5px] tracking-[.18em] text-[var(--mute)] uppercase">
                  VERDICT
                </div>
                <div className="text-[18px] font-semibold mt-1">{verdict.label}</div>
              </div>
            </div>

            <p className="text-[var(--mute)] text-[14px] leading-[1.55] mt-5 mb-7">
              {verdict.copy}
            </p>

            <div
              className="grid grid-cols-2 border"
              style={{ borderColor: "var(--line)" }}
            >
              <Metric
                label="UNITS"
                value={result.units}
                unit="× box"
                className="border-r"
              />
              <Metric label="SILENT STRETCH" value={fmt(result.silentHours)} unit="h" />
              <Metric
                label="ENGINE / DAY"
                value={fmt(result.engineHrsDay)}
                unit="h"
                className="border-r"
              />
              <Metric label="FUEL / MONTH" value={fmt(result.fuelGalMonth, 0)} unit="gal" />
              <Metric
                label="AIR FILTER"
                value={fmt(result.airFilterDays, 0)}
                unit="d"
                note="BINDING CONSTRAINT"
                className="border-r"
              />
              <Metric label="TANK LASTS" value={fmt(result.tankDays, 0)} unit="d" />

              <div
                className="px-5 py-[18px] col-span-2 border-b"
                style={{
                  borderColor: "var(--line)",
                  background: "rgba(255,255,255,.04)",
                }}
              >
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <div className="mono text-[10px] tracking-[.16em] text-[var(--mute)] uppercase">
                      AVG LOAD · PEAK · TOTAL
                    </div>
                    <div className="num mt-1.5 text-[14px]">
                      <span className="font-semibold">{fmt(result.avgW, 0)}</span>
                      <span className="text-[var(--mute)]"> W avg · </span>
                      <span className="font-semibold">{fmt(result.peakW, 0)}</span>
                      <span className="text-[var(--mute)]"> W peak</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mono text-[10px] tracking-[.16em] text-[var(--mute)] uppercase">
                      MONTHLY
                    </div>
                    <div className="num text-[28px] font-bold mt-1">
                      ${fmt(result.monthly, 0)}
                      <span className="text-[var(--mute)] text-[13px] font-normal">
                        /mo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="mt-5 px-[18px] py-3.5 border border-dashed"
              style={{ borderColor: "var(--line-strong)" }}
            >
              <div className="mono text-[10px] tracking-[.16em] text-[var(--mute)] uppercase mb-1.5">
                UNIT ENVELOPE (PER BOX)
              </div>
              <div className="num text-[13px]">
                <span className="font-semibold">4 kW</span>
                <span className="text-[var(--mute)]"> surge · </span>
                <span className="font-semibold">2 kW</span>
                <span className="text-[var(--mute)]"> ~42 min · </span>
                <span className="font-semibold">1.6 kW</span>
                <span className="text-[var(--mute)]"> indef.</span>
              </div>
            </div>

            <a
              href="#reserve"
              className="btn btn-cy w-full mt-5 justify-center h-auto py-4 text-[14px] text-center"
            >
              Reserve this configuration →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
