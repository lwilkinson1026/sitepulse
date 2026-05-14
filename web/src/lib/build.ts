export type Tier = "BASE" | "PRO";
export type Mount = "CART" | "TRAILER" | "STATIONARY" | "PELICAN CASE";

export const TIERS: Record<Tier, { price: number; label: string; desc: string }> = {
  BASE: {
    price: 2995,
    label: "Sitepulse — Base",
    desc: "1.54 kWh LFP · Starlink Mini · DLE 170 hybrid",
  },
  PRO: {
    price: 3795,
    label: "Sitepulse — Pro",
    desc: "+ direct DC Starlink feed + redundant cellular failover + extended telemetry",
  },
};

export const MOUNTS: ReadonlyArray<Mount> = [
  "CART",
  "TRAILER",
  "STATIONARY",
  "PELICAN CASE",
];

export type Addon = {
  id: string;
  label: string;
  price: number;
  desc: string;
};

export const ADDONS: ReadonlyArray<Addon> = [
  {
    id: "solar",
    label: "600 W folding solar array",
    price: 880,
    desc: "Two 300 W bifacial panels + MPPT cabling — cuts engine duty further",
  },
  {
    id: "trailer",
    label: "Heated battery jacket",
    price: 240,
    desc: "Active heaters for sub-zero starts down to −20 °C",
  },
  {
    id: "extra",
    label: "Extended fuel kit",
    price: 1240,
    desc: "Larger external tank + dual quick-disconnect for months between fills",
  },
  {
    id: "evkit",
    label: "EV-Backup Kit",
    price: 680,
    desc: "32 A portable Level 2 EVSE (J1772 + NACS adapter) + grounding rod — turns the unit into an emergency EV charger.",
  },
];

const ADDON_BY_ID = new Map(ADDONS.map((a) => [a.id, a] as const));

export function isTier(v: unknown): v is Tier {
  return v === "BASE" || v === "PRO";
}

export function isMount(v: unknown): v is Mount {
  return MOUNTS.includes(v as Mount);
}

export function computeTotal(
  tier: Tier,
  selectedAddonIds: ReadonlyArray<string>,
): number {
  const addonsTotal = selectedAddonIds.reduce((sum, id) => {
    const a = ADDON_BY_ID.get(id);
    return sum + (a ? a.price : 0);
  }, 0);
  return TIERS[tier].price + addonsTotal;
}

export function buildSummary(
  tier: Tier,
  mount: Mount,
  selectedAddonIds: ReadonlyArray<string>,
): string {
  const addonLabels = selectedAddonIds
    .map((id) => ADDON_BY_ID.get(id)?.label)
    .filter((l): l is string => !!l);
  const parts = [TIERS[tier].label, `mount: ${mount}`];
  if (addonLabels.length) parts.push(`add-ons: ${addonLabels.join(", ")}`);
  return parts.join(" · ");
}
