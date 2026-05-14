const ITEMS = [
  "4,000 W pure sine",
  "8 kW surge",
  "1.54 kWh LFP",
  "30 Ah · 48 V",
  "Starlink Mini",
  "DLE 170cc · 17.5 HP",
  "10–12 kW peak",
  "48 hr silent",
  "IP65 sealed",
  "−20 °C to +50 °C",
  "~90 lb dry",
  "External fuel tank",
  "Cellular failover",
  "App + OTA updates",
];

const Diamond = () => (
  <span className="inline-block w-1.5 h-1.5 rotate-45 bg-[var(--hi)]" />
);

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section
      className="border-y overflow-hidden py-7"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="marquee-track flex gap-12 nowrap">
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-12">
            <span className="display text-[28px] tracking-[-.02em] text-zinc-300">
              {t}
            </span>
            <Diamond />
          </div>
        ))}
      </div>
    </section>
  );
}
