import { Eyebrow } from "./Eyebrow";

const ICON_PROPS = {
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  fill: "none",
  stroke: "#FFFFFF",
  strokeWidth: 1.5,
} as const;

const BatteryIcon = () => (
  <svg {...ICON_PROPS}>
    <rect x="6" y="11" width="26" height="20" />
    <rect x="32" y="17" width="3" height="8" fill="#FFFFFF" />
    <rect x="9" y="14" width="6" height="14" fill="#FFFFFF" opacity=".3" />
    <rect x="16" y="14" width="6" height="14" fill="#FFFFFF" opacity=".3" />
    <rect x="23" y="14" width="6" height="14" fill="#FFFFFF" opacity=".3" />
  </svg>
);

const DishIcon = () => (
  <svg {...ICON_PROPS}>
    <circle cx="20" cy="20" r="14" />
    <circle cx="20" cy="20" r="9" />
    <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
    <path d="M20 6 L20 2 M20 38 L20 34 M6 20 L2 20 M38 20 L34 20" />
  </svg>
);

const GenIcon = () => (
  <svg {...ICON_PROPS}>
    <rect x="6" y="9" width="28" height="22" rx="1" />
    <circle cx="14" cy="20" r="4" />
    <circle cx="14" cy="20" r="1.5" fill="#FFFFFF" />
    <path d="M22 16 L30 16 M22 20 L28 20 M22 24 L30 24" />
  </svg>
);

type PillarItem = {
  tag: string;
  title: string;
  copy: string;
  stats: ReadonlyArray<readonly [string, string]>;
  icon: React.ReactNode;
};

const ITEMS: ReadonlyArray<PillarItem> = [
  {
    tag: "01 / BATTERY",
    title: "1.54 kWh LFP pack.",
    copy: "30 Ah lithium iron phosphate at 48 V nominal, 22 lb with active BMS. Cell-level protection, optional sub-zero heaters. Runs Starlink Mini for 40–48 hours of pure silence between starts.",
    stats: [
      ["48 V", "Nominal"],
      ["30 Ah", "Capacity"],
      ["22 lb", "Weight"],
      ["BMS", "Cell-level protect"],
    ],
    icon: <BatteryIcon />,
  },
  {
    tag: "02 / CONNECTIVITY",
    title: "Starlink Mini, integrated.",
    copy: "Dish, router, and cable all inside. Powered on a dedicated circuit (or optional direct DC for max efficiency). Cellular failover keeps telemetry alive if Starlink ever drops.",
    stats: [
      ["~25 W", "Avg draw"],
      ["3.5 lb", "Mini kit"],
      ["DC OPT", "Direct feed"],
      ["LTE", "Failover"],
    ],
    icon: <DishIcon />,
  },
  {
    tag: "03 / ENGINE",
    title: "DLE 170cc · 17.5 HP twin.",
    copy: "Gas twin paired with a high-output starter generator delivers up to 10–12 kW on demand. Auto-starts when load exceeds the inverter for 45 s; otherwise idle. External quick-disconnect fuel tank — no built-in tank, no spillage.",
    stats: [
      ["17.5 HP", "Twin cyl"],
      ["10–12 kW", "Peak"],
      ["~1.1", "gal/hr running"],
      ["<60 dB", "Enclosed"],
    ],
    icon: <GenIcon />,
  },
];

function Pillar({ tag, title, copy, stats, icon }: PillarItem) {
  return (
    <div className="bg-black p-10 lift">
      <div className="flex items-start justify-between">
        <div className="mono text-[11px] tracking-[.2em] text-[var(--hi)]">
          {tag}
        </div>
        <div>{icon}</div>
      </div>
      <h3 className="display mt-12 text-[34px] tracking-[-.03em] leading-[1.1]">
        {title}
      </h3>
      <p className="mt-5 text-[15px] leading-[1.6] text-zinc-400">{copy}</p>
      <div
        className="mt-10 grid grid-cols-2 gap-y-6 gap-x-4 pt-8 border-t"
        style={{ borderColor: "var(--line)" }}
      >
        {stats.map(([n, l]) => (
          <div key={l}>
            <div className="display text-[28px] tracking-[-.03em] leading-none">
              {n}
            </div>
            <div className="mt-2 mono text-[10px] uppercase tracking-[.16em] text-zinc-500">
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Pillars() {
  return (
    <section
      id="unit"
      className="relative py-32 border-b"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8">
        <Eyebrow num="01" label="THE UNIT" />
        <h2
          className="display-x mt-6 leading-[.95] tracking-[-.045em] max-w-[1100px]"
          style={{ fontSize: "clamp(44px, 7vw, 96px)" }}
        >
          Three systems.
          <br />
          One quiet box.
        </h2>
        <p className="mt-8 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
          The hybrid stack swaps power source automatically — silent battery
          first, Starlink always connected, the engine only when load truly
          demands it. No switches. No downtime.
        </p>

        <div
          className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-px"
          style={{ background: "var(--line-strong)" }}
        >
          {ITEMS.map((it) => (
            <Pillar key={it.tag} {...it} />
          ))}
        </div>
      </div>
    </section>
  );
}
