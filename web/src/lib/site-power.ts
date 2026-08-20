/**
 * Site power model behind the landing-page calculator.
 *
 * Ported verbatim from the `Sitepulse Landing.dc.html` design prototype — the
 * constants and thresholds below are the product's published envelope, so
 * change them here and the calculator, verdict copy, and reserve summary all
 * move together.
 */

export type CatalogLoad = {
  id: string;
  name: string;
  /** Steady-state draw of a single unit, in watts. */
  w: number;
  note: string;
  /** Duty-cycled loads expose an hours/day slider; everything else runs 24/7. */
  hasHours?: boolean;
  defaultHours?: number;
};

export const LOAD_CATALOG: ReadonlyArray<CatalogLoad> = [
  { id: "datalogger", name: "Datalogger (Campbell CR1000X class)", w: 1, note: "" },
  { id: "sonde", name: "Water quality sonde (YSI EXO2 class)", w: 2, note: "" },
  { id: "sampler", name: "Automated water sampler (ISCO 6712)", w: 1, note: "" },
  { id: "rtk", name: "RTK GPS base station (Trimble R750)", w: 6, note: "continuous" },
  { id: "weather", name: "Weather station", w: 5, note: "" },
  { id: "gateway", name: "Cellular / LoRa gateway", w: 8, note: "" },
  { id: "ebam", name: "Portable dust monitor (Met One E-BAM)", w: 50, note: "continuous" },
  { id: "starlink-mini", name: "Starlink Mini", w: 30, note: "" },
  { id: "starlink-std", name: "Starlink Standard", w: 65, note: "" },
  { id: "camera", name: "IP security camera", w: 25, note: "each" },
  { id: "plc", name: "PLC / control cabinet", w: 40, note: "" },
  { id: "repeater", name: "Radio repeater", w: 60, note: "" },
  {
    id: "bam1022",
    name: "Continuous BAM w/ inlet heater (BAM 1022)",
    w: 299,
    note: "⚠ heavy",
  },
  { id: "light", name: "LED work light", w: 100, note: "", hasHours: true, defaultHours: 4 },
  { id: "charger", name: "Tool / battery charging", w: 200, note: "", hasHours: true, defaultHours: 2 },
  { id: "pump", name: "Transfer pump", w: 400, note: "", hasHours: true, defaultHours: 0.5 },
];

export type Season = "summer" | "winter";

export type LoadState = { on: boolean; qty: number; hoursPerDay: number };

export type CustomLoad = {
  id: string;
  name: string;
  w: number;
  hoursPerDay: number;
  qty: number;
};

export type SitePowerInputs = {
  loads: Record<string, LoadState>;
  customLoads: ReadonlyArray<CustomLoad>;
  season: Season;
  /** Gallons of on-board fuel. */
  tank: number;
};

export type VerdictKey = "g" | "b" | "y" | "r";

export type SitePowerResult = {
  avgW: number;
  peakW: number;
  units: number;
  silentHours: number;
  engineHrsDay: number;
  fuelGalMonth: number;
  airFilterDays: number;
  tankDays: number;
  verdict: VerdictKey;
  monthly: number;
};

/** Telemetry, BMS and inverter overhead — present on every site. */
const IDLE_W = 20;
/** Usable pack energy, kWh: 1.545 kWh nameplate at 90 % depth of discharge. */
const USABLE_KWH = 1.545 * 0.9;
/** Engine charge output, kW. */
const GEN_KW = 1.6;
/** Charge-path efficiency. */
const CHARGE_EFF = 0.9;
/** Usable kWh recovered per gallon of gasoline through the charge path. */
const KWH_PER_GAL = 5.0;
/** Harvest from the trickle panel, kWh/day. Winter is the North Idaho number. */
const SOLAR_KWH: Record<Season, number> = { summer: 0.32, winter: 0.1 };
/** Continuous inverter rating per box, watts. */
const INVERTER_W = 2000;
/** Silent-stretch target used to size the number of boxes, hours. */
const DESIRED_SILENT_H = 8;
/** Engine hours between air-filter services. */
const FILTER_INTERVAL_H = 50;
const DAYS_PER_MONTH = 30.4;
/** Monthly service price per box, and per custom load line. */
const BASE_MONTHLY = 900;
const CUSTOM_LOAD_MONTHLY = 200;

export const UNIT_ENVELOPE = {
  surgeKw: 4,
  sustainedKw: 2,
  sustainedMinutes: 42,
  indefiniteKw: 1.6,
} as const;

export function computeSitePower(inputs: SitePowerInputs): SitePowerResult {
  let avgW = IDLE_W;
  let peakW = 0;

  for (const l of LOAD_CATALOG) {
    const s = inputs.loads[l.id];
    if (!s || !s.on || !s.qty) continue;
    const hours = l.hasHours ? s.hoursPerDay || l.defaultHours || 4 : 24;
    const totalW = l.w * s.qty;
    avgW += (totalW * hours) / 24;
    peakW += totalW;
  }

  for (const c of inputs.customLoads) {
    const totalW = c.w * (c.qty || 1);
    avgW += (totalW * (c.hoursPerDay || 24)) / 24;
    peakW += totalW;
  }

  if (peakW === 0) peakW = IDLE_W;

  const dailyKWh = (avgW * 24) / 1000;
  const netKWh = Math.max(0, dailyKWh - SOLAR_KWH[inputs.season]);

  const unitsForPower = Math.ceil(peakW / INVERTER_W);
  const unitsForRuntime = Math.ceil((DESIRED_SILENT_H * avgW) / (USABLE_KWH * 1000));
  const units = Math.max(1, unitsForPower, unitsForRuntime);

  const silentHours = (USABLE_KWH * units * 1000) / avgW;
  const engineHrsDay = netKWh / (GEN_KW * units * CHARGE_EFF);
  const fuelGalMonth = (netKWh * DAYS_PER_MONTH) / KWH_PER_GAL;
  const airFilterDays = engineHrsDay > 0 ? FILTER_INTERVAL_H / engineHrsDay : 999;
  const tankDays =
    fuelGalMonth > 0 ? inputs.tank / (fuelGalMonth / DAYS_PER_MONTH) : 999;

  let verdict: VerdictKey = "g";
  if (avgW > 600 || peakW > 4000) verdict = "r";
  else if (avgW > 200 || peakW > 2000) verdict = "y";
  else if (avgW > 75) verdict = "b";

  const monthly = BASE_MONTHLY * units + CUSTOM_LOAD_MONTHLY * inputs.customLoads.length;

  return {
    avgW,
    peakW,
    units,
    silentHours,
    engineHrsDay,
    fuelGalMonth,
    airFilterDays,
    tankDays,
    verdict,
    monthly,
  };
}

export type Verdict = {
  color: string;
  className: string;
  label: string;
  copy: string;
};

export function verdictFor(r: SitePowerResult): Verdict {
  switch (r.verdict) {
    case "g":
      return {
        color: "#34d399",
        className: "verdict-g",
        label: "Ideal fit",
        copy: "This is what the unit was built for. Months unattended on a 15-gallon tank, silent almost all day.",
      };
    case "b":
      return {
        color: "#60a5fa",
        className: "verdict-b",
        label: "Good fit",
        copy: `Comfortable. Expect a service visit about every ${Math.round(
          Math.min(r.airFilterDays, r.tankDays),
        )} days — whichever hits first.`,
      };
    case "y":
      return {
        color: "#fbbf24",
        className: "verdict-y",
        label: "Works, with caveats",
        copy: "This runs, but it's a service-visit conversation, not set-and-forget. Read the schedule below carefully.",
      };
    case "r":
      return {
        color: "#f87171",
        className: "verdict-r",
        label: "Not a fit",
        copy: "Straight answer: this isn't the right tool. You want a towable genset or a line extension. If part of your load is small and continuous, we can cover that piece — tell me what it is.",
      };
  }
}

/** Significance-aware number formatting used across the result panel. */
export function fmt(n: number, decimals = 1): string {
  if (!Number.isFinite(n)) return "—";
  if (n >= 100) return n.toFixed(0);
  if (n >= 10) return n.toFixed(1);
  return n.toFixed(decimals);
}

export const DEFAULT_LOADS: Record<string, LoadState> = {
  ebam: { on: true, qty: 1, hoursPerDay: 24 },
  "starlink-mini": { on: true, qty: 1, hoursPerDay: 24 },
  camera: { on: true, qty: 1, hoursPerDay: 24 },
};

export const VISIT_OPTIONS = [3, 7, 14, 30, 60] as const;

export const TANK_OPTIONS = [
  { gal: 5, label: "JERRY CAN" },
  { gal: 15, label: "BUILT-IN" },
  { gal: 55, label: "DRUM" },
] as const;
