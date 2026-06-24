"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { type City, cityLabel, searchCities } from "@/lib/cities";
import {
  computeSizing,
  DEFAULT_INPUTS,
  DEFAULT_PARAMS,
  type FuelKey,
  type PrimaryAppliances,
  type SizingInputs,
  type SizingParams,
  type SpaceHeating,
} from "@/lib/sizing";

const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mono text-[11px] tracking-[.18em] uppercase text-zinc-500">{label}</div>
      {children}
      {hint && <div className="mt-2 text-[12px] leading-[1.5] text-zinc-500">{hint}</div>}
    </div>
  );
}

function Seg<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: ReadonlyArray<readonly [T, string]>;
}) {
  return (
    <div className="seg mt-4 flex-wrap">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="seg mt-4">
      <button type="button" aria-pressed={value} onClick={() => onChange(true)}>
        Yes
      </button>
      <button type="button" aria-pressed={!value} onClick={() => onChange(false)}>
        No
      </button>
    </div>
  );
}

function CitySearch({
  selected,
  onPick,
}: {
  selected: string;
  onPick: (city: City) => void;
}) {
  const [query, setQuery] = useState(selected);
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => searchCities(query), [query]);
  const dirty = query.trim() !== selected;

  return (
    <div className="relative mt-4">
      <input
        type="text"
        value={query}
        placeholder="Search your city…"
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Delay so an option click registers before we close & reset.
          setTimeout(() => {
            setOpen(false);
            setQuery(selected);
          }, 140);
        }}
        className="w-full bg-black border px-4 py-3 text-[15px] text-zinc-100 outline-none focus:border-white transition-colors"
        style={{ borderColor: "var(--line-strong)" }}
      />
      {open && (
        <ul
          className="absolute z-30 mt-1 w-full max-h-64 overflow-auto border bg-black/95 backdrop-blur"
          style={{ borderColor: "var(--line-strong)" }}
        >
          {matches.length === 0 && (
            <li className="px-4 py-3 text-[13px] text-zinc-500">
              No match — use “Set manually” below.
            </li>
          )}
          {matches.map((c) => {
            const label = cityLabel(c);
            const isSelected = !dirty && label === selected;
            return (
              <li key={label}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  // Prevent the input's onBlur from firing before the click.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onPick(c);
                    setQuery(label);
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-4 px-4 py-2.5 text-left text-[14px] text-zinc-200 hover:bg-white/10 transition-colors"
                  style={isSelected ? { background: "rgba(255,255,255,.08)" } : undefined}
                >
                  <span>
                    {c.name}
                    <span className="text-zinc-500">, {c.state}</span>
                  </span>
                  <span className="mono text-[11px] tracking-[.1em] text-zinc-500">
                    {c.sun.toFixed(1)} hrs
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Bar({
  value,
  color = "var(--hi)",
}: {
  value: number;
  color?: string;
}) {
  return (
    <div className="mt-2 h-[6px] bg-white/10">
      <div
        className="h-full"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  );
}

function ParamInput({
  label,
  value,
  step = 0.1,
  onChange,
}: {
  label: string;
  value: number;
  step?: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 text-[13px] text-zinc-400">
      <span>{label}</span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(n);
        }}
        className="w-28 bg-black border px-3 py-1.5 mono text-[13px] text-zinc-100 text-right"
        style={{ borderColor: "var(--line-strong)" }}
      />
    </label>
  );
}

export function SizingTool() {
  const [inputs, setInputs] = useState<SizingInputs>(DEFAULT_INPUTS);
  const [params, setParams] = useState<SizingParams>(DEFAULT_PARAMS);
  const [advanced, setAdvanced] = useState(false);
  const [manualSun, setManualSun] = useState(false);

  const set = <K extends keyof SizingInputs>(key: K, val: SizingInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: val }));
  const setParam = <K extends keyof SizingParams>(key: K, val: SizingParams[K]) =>
    setParams((prev) => ({ ...prev, [key]: val }));

  const r = useMemo(() => computeSizing(inputs, params), [inputs, params]);

  const coveragePct = Math.round(inputs.solarCoverage * 100);
  const fuelLabel = r.fuelKey === "propane" ? "Propane" : "Gasoline";

  return (
    <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* INPUTS */}
      <div className="lg:col-span-7 space-y-12">
        <Field label="01 — How many people" hint="The primary driver of daily load.">
          <div className="mt-4 flex items-center gap-5">
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={inputs.people}
              onChange={(e) => set("people", Number(e.target.value))}
              className="flex-1 accent-white"
            />
            <span className="display text-[28px] tracking-[-.03em] w-10 text-right">
              {inputs.people}
            </span>
          </div>
        </Field>

        <Field
          label="02 — Primary appliances"
          hint="Cooking, water heating, and laundry. Propane keeps electric load low."
        >
          <Seg<PrimaryAppliances>
            value={inputs.primaryAppliances}
            onChange={(v) => set("primaryAppliances", v)}
            options={[
              ["propane", "Propane"],
              ["electric", "Electric"],
            ]}
          />
        </Field>

        <Field label="03 — Space heating" hint="The single biggest variable for an off-grid home.">
          <Seg<SpaceHeating>
            value={inputs.spaceHeating}
            onChange={(v) => set("spaceHeating", v)}
            options={[
              ["wood", "Wood stove"],
              ["propane-furnace", "Propane furnace"],
              ["heat-pump", "Heat pump"],
              ["resistance", "Electric resistance"],
            ]}
          />
        </Field>

        <Field
          label="04 — Location / climate"
          hint={
            inputs.cityLabel.startsWith("Custom")
              ? `Manual estimate of ≈ ${inputs.peakSunHours.toFixed(1)} peak sun hours/day. Northern climates run 35–45% of summer in winter.`
              : `${inputs.cityLabel} averages ≈ ${inputs.peakSunHours.toFixed(1)} peak sun hours/day. Northern climates run 35–45% of summer in winter.`
          }
        >
          <CitySearch
            key={inputs.cityLabel}
            selected={inputs.cityLabel}
            onPick={(c) => {
              set("cityLabel", cityLabel(c));
              set("peakSunHours", c.sun);
              setManualSun(false);
            }}
          />
          <button
            type="button"
            onClick={() => setManualSun((m) => !m)}
            className="mt-4 mono text-[11px] tracking-[.16em] uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>{manualSun ? "−" : "+"}</span>
            City not listed? Set peak sun hours manually
          </button>
          {manualSun && (
            <div className="mt-4 flex items-center gap-5">
              <input
                type="range"
                min={2}
                max={7}
                step={0.1}
                value={inputs.peakSunHours}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  set("peakSunHours", v);
                  set("cityLabel", `Custom · ${v.toFixed(1)} hrs/day`);
                }}
                className="flex-1 accent-white"
              />
              <span className="display text-[20px] tracking-[-.02em] w-24 text-right">
                {inputs.peakSunHours.toFixed(1)} hrs
              </span>
            </div>
          )}
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <Field label="05 — Starlink / always-on" hint="~30–40 W average draw.">
            <Toggle value={inputs.starlink} onChange={(v) => set("starlink", v)} />
          </Field>
          <Field label="06 — Well pump / high draw" hint="Adds ~1.2 kWh/day on average.">
            <Toggle value={inputs.wellPump} onChange={(v) => set("wellPump", v)} />
          </Field>
        </div>

        <Field
          label="07 — Desired solar coverage"
          hint="Higher coverage means more panels and less generator runtime."
        >
          <div className="mt-4 flex items-center gap-5">
            <input
              type="range"
              min={60}
              max={90}
              step={5}
              value={coveragePct}
              onChange={(e) => set("solarCoverage", Number(e.target.value) / 100)}
              className="flex-1 accent-white"
            />
            <span className="display text-[28px] tracking-[-.03em] w-16 text-right">
              {coveragePct}%
            </span>
          </div>
        </Field>

        {/* ADVANCED */}
        <div className="border-t pt-8" style={{ borderColor: "var(--line)" }}>
          <button
            type="button"
            onClick={() => setAdvanced((a) => !a)}
            className="mono text-[11px] tracking-[.18em] uppercase text-zinc-400 hover:text-white transition-colors flex items-center gap-3"
          >
            <span>{advanced ? "−" : "+"}</span>
            Advanced settings — tune assumptions &amp; pricing
          </button>

          {advanced && (
            <div className="mt-8 space-y-10">
              <div>
                <div className="mono text-[10px] tracking-[.2em] uppercase text-zinc-500">
                  Generator fuel
                </div>
                <Seg<FuelKey>
                  value={inputs.fuel}
                  onChange={(v) => set("fuel", v)}
                  options={[
                    ["gasoline", "Gasoline"],
                    ["propane", "Propane"],
                  ]}
                />
              </div>

              <div className="space-y-3">
                <div className="mono text-[10px] tracking-[.2em] uppercase text-zinc-500">
                  Load model (kWh/day)
                </div>
                <ParamInput label="Base load · 2 people" value={params.baseTwoPerson} onChange={(n) => setParam("baseTwoPerson", n)} />
                <ParamInput label="Per additional person" value={params.perAdditionalPerson} onChange={(n) => setParam("perAdditionalPerson", n)} />
                <ParamInput label="Electric cooking" value={params.electricCooking} onChange={(n) => setParam("electricCooking", n)} />
                <ParamInput label="Electric water heating" value={params.electricWater} onChange={(n) => setParam("electricWater", n)} />
                <ParamInput label="Electric dryer" value={params.electricDryer} onChange={(n) => setParam("electricDryer", n)} />
                <ParamInput label="Heat pump heat" value={params.heatPumpHeat} onChange={(n) => setParam("heatPumpHeat", n)} />
                <ParamInput label="Resistance heat" value={params.resistanceHeat} onChange={(n) => setParam("resistanceHeat", n)} />
              </div>

              <div className="space-y-3">
                <div className="mono text-[10px] tracking-[.2em] uppercase text-zinc-500">
                  Solar &amp; pricing
                </div>
                <ParamInput label="System derate (0–1)" value={params.derate} step={0.01} onChange={(n) => setParam("derate", n)} />
                <ParamInput label="Panel watts" value={params.panelWatts} step={10} onChange={(n) => setParam("panelWatts", n)} />
                <ParamInput label="Panel cost ($)" value={params.panelCost} step={5} onChange={(n) => setParam("panelCost", n)} />
                <ParamInput label="SitePulse unit cost ($)" value={params.unitCost} step={50} onChange={(n) => setParam("unitCost", n)} />
                <ParamInput label="Solar input per unit (W)" value={params.unitSolarInput} step={50} onChange={(n) => setParam("unitSolarInput", n)} />
                <ParamInput label="AC charging per unit (W)" value={params.unitAcCharge} step={50} onChange={(n) => setParam("unitAcCharge", n)} />
              </div>

              <div className="space-y-3">
                <div className="mono text-[10px] tracking-[.2em] uppercase text-zinc-500">
                  Fuel efficiency &amp; price
                </div>
                <ParamInput label="Gasoline kWh/gal" value={params.gasolineKwhPerGal} onChange={(n) => setParam("gasolineKwhPerGal", n)} />
                <ParamInput label="Gasoline $/gal" value={params.gasolinePricePerGal} onChange={(n) => setParam("gasolinePricePerGal", n)} />
                <ParamInput label="Propane kWh/gal" value={params.propaneKwhPerGal} onChange={(n) => setParam("propaneKwhPerGal", n)} />
                <ParamInput label="Propane $/gal" value={params.propanePricePerGal} onChange={(n) => setParam("propanePricePerGal", n)} />
              </div>

              <button
                type="button"
                onClick={() => setParams(DEFAULT_PARAMS)}
                className="mono text-[10px] tracking-[.16em] uppercase text-zinc-500 hover:text-white transition-colors"
              >
                ↺ Reset to defaults
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RESULTS */}
      <div className="lg:col-span-5">
        <div
          className="border p-8 sticky top-[88px] bg-black/60 backdrop-blur"
          style={{ borderColor: "var(--line-strong)" }}
        >
          <div className="mono text-[11px] tracking-[.18em] uppercase text-zinc-500">
            YOUR ESTIMATE
          </div>

          {/* daily load */}
          <div className="mt-6 flex items-end justify-between">
            <div className="mono text-[11px] tracking-[.16em] uppercase text-zinc-500">
              Estimated daily load
            </div>
            <div className="display-x text-[44px] tracking-[-.04em] leading-none">
              {r.dailyKwh}
              <span className="text-[18px] text-zinc-400"> kWh</span>
            </div>
          </div>
          <div className="mt-2 mono text-[11px] tracking-[.12em] uppercase text-zinc-500 text-right">
            {r.annualKwh.toLocaleString()} kWh / year
          </div>

          {/* config */}
          <div className="mt-8 pt-6 border-t grid grid-cols-2 gap-px" style={{ borderColor: "var(--line)", background: "var(--line)" }}>
            <div className="bg-black p-5">
              <div className="display text-[30px] tracking-[-.03em] leading-none">
                {r.units}×
              </div>
              <div className="mt-2 mono text-[10px] tracking-[.14em] uppercase text-zinc-500">
                SitePulse unit{r.units > 1 ? "s" : ""}
              </div>
            </div>
            <div className="bg-black p-5">
              <div className="display text-[30px] tracking-[-.03em] leading-none">
                {r.panels}
              </div>
              <div className="mt-2 mono text-[10px] tracking-[.14em] uppercase text-zinc-500">
                500 W panels · {(r.solarWatts / 1000).toFixed(1)} kW
              </div>
            </div>
          </div>
          {r.unitsDrivenBySolar && (
            <div className="mt-3 mono text-[10px] tracking-[.12em] uppercase text-[var(--hi)]">
              2nd unit recommended for the {r.solarWatts.toLocaleString()} W array (800 W solar input per unit)
            </div>
          )}

          {/* solar vs generator split */}
          <div className="mt-8">
            <div className="flex justify-between items-baseline mono text-[11px] tracking-[.16em] uppercase">
              <span className="text-zinc-300">Solar</span>
              <span className="text-[var(--hi)]">{coveragePct}%</span>
            </div>
            <Bar value={coveragePct} />
            <div className="mt-4 flex justify-between items-baseline mono text-[11px] tracking-[.16em] uppercase">
              <span className="text-zinc-300">Generator top-up</span>
              <span className="text-zinc-200">{100 - coveragePct}%</span>
            </div>
            <Bar value={100 - coveragePct} color="rgba(255,255,255,.5)" />
            <div className="mt-3 mono text-[10px] tracking-[.14em] uppercase text-zinc-500">
              Generator runs mostly in winter, when production drops to 35–45% of summer.
            </div>
          </div>

          {/* cost breakdown */}
          <ul className="mt-8 pt-6 border-t space-y-3 text-[14px] text-zinc-400 mono" style={{ borderColor: "var(--line-strong)" }}>
            <li className="flex justify-between border-b pb-3" style={{ borderColor: "var(--line)" }}>
              <span>{r.units}× SitePulse</span>
              <span className="text-zinc-200">{usd(r.unitsCost)}</span>
            </li>
            <li className="flex justify-between border-b pb-3" style={{ borderColor: "var(--line)" }}>
              <span>{r.panels}× solar panels</span>
              <span className="text-zinc-200">{usd(r.solarCost)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-zinc-300">Total upfront</span>
              <span className="display text-[20px] tracking-[-.02em] text-[var(--hi)]">{usd(r.totalUpfront)}</span>
            </li>
          </ul>

          {/* fuel + 10yr */}
          <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-px" style={{ borderColor: "var(--line-strong)", background: "var(--line)" }}>
            <div className="bg-black p-5">
              <div className="display text-[24px] tracking-[-.03em] leading-none">{usd(r.fuelCostYear)}</div>
              <div className="mt-2 mono text-[10px] tracking-[.14em] uppercase text-zinc-500">
                {fuelLabel}/yr · ~{r.fuelGallonsYear} gal
              </div>
            </div>
            <div className="bg-black p-5">
              <div className="display text-[24px] tracking-[-.03em] leading-none">{usd(r.tenYearLoaded)}</div>
              <div className="mt-2 mono text-[10px] tracking-[.14em] uppercase text-zinc-500">
                10-yr loaded cost
              </div>
            </div>
          </div>

          {/* warnings */}
          {r.warnings.length > 0 && (
            <div className="mt-6 space-y-3">
              {r.warnings.map((w, i) => (
                <div
                  key={i}
                  className="text-[12px] leading-[1.5] text-zinc-300 border-l-2 pl-3"
                  style={{ borderColor: "var(--hi)" }}
                >
                  {w}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <Link href="/contact" className="btn btn-cy w-full justify-center mt-8">
            TALK TO OUR TEAM <span>→</span>
          </Link>
          <Link href="/#config" className="btn btn-ghost w-full justify-center mt-3">
            RESERVE A SITEPULSE
          </Link>

          <div className="mt-6 text-[11px] leading-[1.55] text-zinc-500">
            Estimate only. Real results depend on your exact appliances, habits,
            panel orientation, shading, and weather. Northern-climate winters
            require more generator runtime than this annual average implies.
          </div>
        </div>
      </div>
    </div>
  );
}
