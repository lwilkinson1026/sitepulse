export type PrimaryAppliances = "propane" | "electric";
export type SpaceHeating = "wood" | "propane-furnace" | "heat-pump" | "resistance";
export type LocationKey = "north-idaho" | "custom";
export type FuelKey = "gasoline" | "propane";

export type SizingInputs = {
  people: number;
  primaryAppliances: PrimaryAppliances;
  spaceHeating: SpaceHeating;
  location: LocationKey;
  peakSunHours: number; // used when location === "custom"
  starlink: boolean;
  wellPump: boolean;
  solarCoverage: number; // 0.60 – 0.90
  fuel: FuelKey;
};

// Every number here is editable via the tool's Advanced settings so the
// model can be retuned without code changes.
export type SizingParams = {
  baseTwoPerson: number;
  perAdditionalPerson: number;
  electricCooking: number;
  electricWater: number;
  electricDryer: number;
  heatPumpHeat: number;
  resistanceHeat: number;
  propaneFurnaceBlower: number;
  starlink: number;
  wellPump: number;
  minDaily: number;
  maxDaily: number;
  northIdahoProdPerKw: number; // annual kWh produced per kW installed
  derate: number; // system derate applied to custom peak-sun estimates
  panelWatts: number;
  panelCost: number;
  unitCost: number;
  unitSolarInput: number; // max solar watts a single unit accepts via the DC solar port
  unitAcCharge: number; // additional watts a unit can absorb via the AC charging port
  gasolineKwhPerGal: number;
  gasolinePricePerGal: number;
  propaneKwhPerGal: number;
  propanePricePerGal: number;
};

export const DEFAULT_PARAMS: SizingParams = {
  baseTwoPerson: 6.5,
  perAdditionalPerson: 1.8,
  electricCooking: 4.75,
  electricWater: 6.0,
  electricDryer: 2.5,
  heatPumpHeat: 11.5,
  resistanceHeat: 20,
  propaneFurnaceBlower: 0.4,
  starlink: 1.0,
  wellPump: 1.2,
  minDaily: 4,
  maxDaily: 25,
  northIdahoProdPerKw: 1350,
  derate: 0.85,
  panelWatts: 500,
  panelCost: 135,
  unitCost: 3995,
  unitSolarInput: 800,
  unitAcCharge: 800,
  gasolineKwhPerGal: 2.0,
  gasolinePricePerGal: 3.75,
  propaneKwhPerGal: 1.7,
  propanePricePerGal: 2.6,
};

export const DEFAULT_INPUTS: SizingInputs = {
  people: 3,
  primaryAppliances: "propane",
  spaceHeating: "wood",
  location: "north-idaho",
  peakSunHours: 4.5,
  starlink: true,
  wellPump: false,
  solarCoverage: 0.75,
  fuel: "gasoline",
};

export type LoadLine = { label: string; kwh: number };

export type SizingResult = {
  loadLines: LoadLine[];
  rawDailyKwh: number;
  dailyKwh: number;
  clampedHigh: boolean;
  clampedLow: boolean;
  annualKwh: number;
  targetSolarKwh: number;
  generatorKwh: number;
  coverage: number;
  prodPerKw: number;
  kwSolar: number;
  panels: number;
  solarWatts: number;
  solarCost: number;
  units: 1 | 2;
  unitsDrivenBySolar: boolean;
  unitsCost: number;
  totalUpfront: number;
  fuelKey: FuelKey;
  fuelKwhPerGal: number;
  fuelPricePerGal: number;
  fuelGallonsYear: number;
  fuelCostYear: number;
  tenYearLoaded: number;
  warnings: string[];
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function computeSizing(
  inputs: SizingInputs,
  params: SizingParams = DEFAULT_PARAMS,
): SizingResult {
  const loadLines: LoadLine[] = [];

  const base =
    params.baseTwoPerson +
    Math.max(0, inputs.people - 2) * params.perAdditionalPerson -
    Math.max(0, 2 - inputs.people) * params.perAdditionalPerson;
  loadLines.push({
    label: `Base home load · ${inputs.people} ${inputs.people === 1 ? "person" : "people"}`,
    kwh: base,
  });

  if (inputs.primaryAppliances === "electric") {
    loadLines.push({ label: "Electric cooking (range / oven)", kwh: params.electricCooking });
    loadLines.push({ label: "Electric water heating", kwh: params.electricWater });
    loadLines.push({ label: "Electric dryer", kwh: params.electricDryer });
  }

  if (inputs.spaceHeating === "heat-pump") {
    loadLines.push({ label: "Electric heat pump (space heat)", kwh: params.heatPumpHeat });
  } else if (inputs.spaceHeating === "resistance") {
    loadLines.push({ label: "Electric resistance heat", kwh: params.resistanceHeat });
  } else if (inputs.spaceHeating === "propane-furnace") {
    loadLines.push({ label: "Propane furnace blower", kwh: params.propaneFurnaceBlower });
  }

  if (inputs.starlink) {
    loadLines.push({ label: "Starlink + router + electronics", kwh: params.starlink });
  }
  if (inputs.wellPump) {
    loadLines.push({ label: "Well pump / pressure system", kwh: params.wellPump });
  }

  const rawDailyKwh = loadLines.reduce((sum, l) => sum + l.kwh, 0);
  const clampedHigh = rawDailyKwh > params.maxDaily;
  const clampedLow = rawDailyKwh < params.minDaily;
  const dailyKwh = Math.min(params.maxDaily, Math.max(params.minDaily, rawDailyKwh));

  const annualKwh = dailyKwh * 365;
  const coverage = inputs.solarCoverage;
  const targetSolarKwh = annualKwh * coverage;
  const generatorKwh = annualKwh - targetSolarKwh;

  const prodPerKw =
    inputs.location === "custom"
      ? Math.max(1, inputs.peakSunHours) * 365 * params.derate
      : params.northIdahoProdPerKw;

  const kwSolar = targetSolarKwh / prodPerKw;
  const panels = Math.max(1, Math.ceil((kwSolar * 1000) / params.panelWatts));
  const solarWatts = panels * params.panelWatts;
  const solarCost = panels * params.panelCost;

  const unitsForLoad = dailyKwh >= 8 ? 2 : 1;
  const unitsForSolar = Math.min(2, Math.ceil(solarWatts / params.unitSolarInput));
  const units = (Math.min(2, Math.max(1, unitsForLoad, unitsForSolar)) as 1 | 2);
  const unitsDrivenBySolar = unitsForSolar > unitsForLoad;

  const unitsCost = units * params.unitCost;
  const totalUpfront = unitsCost + solarCost;

  const fuelKwhPerGal =
    inputs.fuel === "propane" ? params.propaneKwhPerGal : params.gasolineKwhPerGal;
  const fuelPricePerGal =
    inputs.fuel === "propane" ? params.propanePricePerGal : params.gasolinePricePerGal;
  const fuelGallonsYear = generatorKwh / fuelKwhPerGal;
  const fuelCostYear = fuelGallonsYear * fuelPricePerGal;
  const tenYearLoaded = totalUpfront + fuelCostYear * 10;

  const warnings: string[] = [];
  if (inputs.spaceHeating === "heat-pump") {
    warnings.push(
      "Electric heat pumps draw an estimated 8–15 kWh/day — heavy for an off-grid build. Wood or propane heat keeps the system far smaller and cheaper.",
    );
  }
  if (inputs.spaceHeating === "resistance") {
    warnings.push(
      "Electric resistance heat (15–25+ kWh/day) is impractical and very expensive off-grid. Strongly consider a wood stove or propane furnace instead.",
    );
  }
  if (clampedHigh) {
    warnings.push(
      "Estimated load exceeds the typical off-grid range, so results are capped at 25 kWh/day. A build this size needs a custom design — talk to our team.",
    );
  }
  const combinedChargeCapacity = units * (params.unitSolarInput + params.unitAcCharge);
  if (solarWatts > combinedChargeCapacity) {
    warnings.push(
      `Your recommended array (${solarWatts.toLocaleString()} W) is larger than what ${units} unit${units > 1 ? "s" : ""} can take in through their combined solar and AC charging ports (${combinedChargeCapacity.toLocaleString()} W). An array this size needs a custom charging plan — talk to our team.`,
    );
  }

  return {
    loadLines: loadLines.map((l) => ({ label: l.label, kwh: round1(l.kwh) })),
    rawDailyKwh: round1(rawDailyKwh),
    dailyKwh: round1(dailyKwh),
    clampedHigh,
    clampedLow,
    annualKwh: Math.round(annualKwh),
    targetSolarKwh: Math.round(targetSolarKwh),
    generatorKwh: Math.round(generatorKwh),
    coverage,
    prodPerKw: Math.round(prodPerKw),
    kwSolar: round1(kwSolar),
    panels,
    solarWatts,
    solarCost,
    units,
    unitsDrivenBySolar,
    unitsCost,
    totalUpfront,
    fuelKey: inputs.fuel,
    fuelKwhPerGal,
    fuelPricePerGal,
    fuelGallonsYear: Math.round(fuelGallonsYear),
    fuelCostYear: Math.round(fuelCostYear),
    tenYearLoaded: Math.round(tenYearLoaded),
    warnings,
  };
}
