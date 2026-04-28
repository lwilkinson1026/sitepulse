function CornerTicks() {
  type Pos = {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  const Tick = ({ pos }: { pos: Pos }) => (
    <div className="absolute w-3 h-3" style={{ ...pos, borderColor: "var(--hi)" }}>
      {pos.top !== undefined && pos.left !== undefined && (
        <>
          <div className="absolute left-0 top-0 h-full w-px bg-[var(--hi)]" />
          <div className="absolute left-0 top-0 w-full h-px bg-[var(--hi)]" />
        </>
      )}
      {pos.top !== undefined && pos.right !== undefined && (
        <>
          <div className="absolute right-0 top-0 h-full w-px bg-[var(--hi)]" />
          <div className="absolute right-0 top-0 w-full h-px bg-[var(--hi)]" />
        </>
      )}
      {pos.bottom !== undefined && pos.left !== undefined && (
        <>
          <div className="absolute left-0 bottom-0 h-full w-px bg-[var(--hi)]" />
          <div className="absolute left-0 bottom-0 w-full h-px bg-[var(--hi)]" />
        </>
      )}
      {pos.bottom !== undefined && pos.right !== undefined && (
        <>
          <div className="absolute right-0 bottom-0 h-full w-px bg-[var(--hi)]" />
          <div className="absolute right-0 bottom-0 w-full h-px bg-[var(--hi)]" />
        </>
      )}
    </div>
  );
  return (
    <>
      <Tick pos={{ top: -1, left: -1 }} />
      <Tick pos={{ top: -1, right: -1 }} />
      <Tick pos={{ bottom: -1, left: -1 }} />
      <Tick pos={{ bottom: -1, right: -1 }} />
    </>
  );
}

function HeroProductImage() {
  return (
    <div className="relative">
      <div
        className="aspect-[21/9] relative overflow-hidden border"
        style={{ borderColor: "var(--line-strong)", background: "#000" }}
      >
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 grid grid-cols-12">
          {/* LEFT: telemetry rail */}
          <div
            className="col-span-4 p-8 border-r flex flex-col justify-between"
            style={{ borderColor: "var(--line)" }}
          >
            <div>
              <div className="mono text-[10px] tracking-[.22em] text-zinc-500 uppercase">
                UNIT-001 · BOZEMAN PLANT
              </div>
              <div className="mt-2 mono text-[10px] tracking-[.22em] uppercase flex items-center gap-2">
                <span className="pulse-dot" />
                <span className="text-[var(--hi)]">LIVE TELEMETRY</span>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <div className="mono text-[10px] tracking-[.18em] text-zinc-400 uppercase flex justify-between">
                  <span>Battery SOC</span>
                  <span className="text-[var(--hi)]">87%</span>
                </div>
                <div className="mt-1.5 h-[3px] bg-white/10">
                  <div
                    className="h-full bg-[var(--hi)] meter-fill"
                    style={{ width: "87%" }}
                  />
                </div>
              </div>
              <div>
                <div className="mono text-[10px] tracking-[.18em] text-zinc-400 uppercase flex justify-between">
                  <span>Load</span>
                  <span className="text-[var(--run)]">26 W</span>
                </div>
                <div className="mt-1.5 h-[3px] bg-white/10">
                  <div
                    className="h-full meter-fill"
                    style={{
                      width: "18%",
                      background: "var(--run)",
                      animationDelay: "-1s",
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="mono text-[10px] tracking-[.18em] text-zinc-400 uppercase flex justify-between">
                  <span>Engine</span>
                  <span>STANDBY</span>
                </div>
                <div className="mt-1.5 h-[3px] bg-white/10">
                  <div
                    className="h-full"
                    style={{
                      width: "2%",
                      background: "rgba(255,255,255,.4)",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mono text-[10px] tracking-[.18em] text-zinc-500 uppercase grid grid-cols-2 gap-y-1.5">
              <span>Cycle</span>
              <span className="text-zinc-300 text-right">2,418 / 6,000</span>
              <span>Next svc</span>
              <span className="text-right">2,082 H</span>
              <span>Uplink</span>
              <span className="text-[var(--hi)] text-right">STARLINK</span>
              <span>Env</span>
              <span className="text-right">14°C</span>
            </div>
          </div>
          {/* RIGHT: product card */}
          <div className="col-span-8 relative">
            <div
              className="absolute"
              style={{
                left: "6%",
                right: "6%",
                top: "8%",
                bottom: "8%",
                background: "#000",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/product-hero-v2.jpg"
                alt="Sitepulse 2400W Hybrid Inverter"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <span
              className="absolute top-3 left-3 w-4 h-4 border-l border-t"
              style={{ borderColor: "var(--line-strong)" }}
            />
            <span
              className="absolute top-3 right-3 w-4 h-4 border-r border-t"
              style={{ borderColor: "var(--line-strong)" }}
            />
            <span
              className="absolute bottom-3 left-3 w-4 h-4 border-l border-b"
              style={{ borderColor: "var(--line-strong)" }}
            />
            <span
              className="absolute bottom-3 right-3 w-4 h-4 border-r border-b"
              style={{ borderColor: "var(--line-strong)" }}
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 mono text-[10px] tracking-[.22em] text-zinc-500 uppercase whitespace-nowrap">
              FIG. 01 · SITEPULSE V1 · 90 LB DRY · IP65
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const HEADLINE = {
  eyebrow: "REMOTE HYBRID POWER · STARLINK MINI · TRUE HYBRID",
  sub: "A 90-lb hybrid power system that keeps Starlink Mini connected for weeks on one tank. Battery runs the radio. The 170 cc engine only kicks in 23 minutes a day.",
};

const HERO_STATS: ReadonlyArray<readonly [string, string]> = [
  ["1.54", "kWh LFP battery"],
  ["48 hr", "Silent, Starlink only"],
  ["12 kW", "Peak, engine running"],
  ["~13 gal", "Fuel per month"],
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative pt-[68px] overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      <div className="absolute inset-0 grid-bg" />
      <div className="stars" />
      <div
        className="nebula"
        style={{ width: 780, height: 780, left: "-200px", top: "15%" }}
      />
      <div
        className="nebula"
        style={{
          width: 520,
          height: 520,
          right: "-100px",
          top: "45%",
          opacity: 0.25,
        }}
      />

      <div
        className="orbit"
        style={{
          width: 1600,
          height: 1600,
          left: "50%",
          top: "18%",
          transform: "translateX(-50%)",
          opacity: 0.25,
        }}
      />
      <div
        className="orbit"
        style={{
          width: 1100,
          height: 1100,
          left: "50%",
          top: "30%",
          transform: "translateX(-50%)",
          opacity: 0.2,
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-8">
        <div className="mt-12 flex items-center gap-3 mono text-[11px] tracking-[.18em] text-zinc-500 uppercase">
          <span className="pulse-dot" />
          <span>SHIPPING Q3 · MADE IN BOZEMAN, MT · 5-YEAR WARRANTY</span>
        </div>

        <div className="mt-10 mono text-[12px] tracking-[.22em] text-[var(--hi)] uppercase">
          {HEADLINE.eyebrow}
        </div>

        <h1
          className="display-x mt-6 leading-[.92] max-w-[1100px]"
          style={{ fontSize: "clamp(64px, 10vw, 144px)" }}
        >
          Silent for days.
          <br />
          <span style={{ color: "var(--hi)" }} className="text-glow">
            Online forever.
          </span>
        </h1>

        <p className="mt-10 max-w-[640px] text-[17px] leading-[1.65] text-zinc-400">
          {HEADLINE.sub}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#config" className="btn btn-cy">
            RESERVE FROM $100 <span>→</span>
          </a>
          <a href="#runs" className="btn btn-ghost">
            SEE IT RUN
          </a>
          <span className="mono text-[11px] uppercase tracking-[.18em] text-zinc-500 ml-3">
            Refundable · Ships Q3 · Free freight
          </span>
        </div>

        <div className="mt-20 relative">
          <HeroProductImage />
          <CornerTicks />
        </div>

        <div
          className="mt-12 mb-24 grid grid-cols-2 md:grid-cols-4 border-t border-b"
          style={{ borderColor: "var(--line-strong)" }}
        >
          {HERO_STATS.map(([n, l]) => (
            <div
              key={l}
              className="px-6 py-7 border-r last:border-r-0"
              style={{ borderColor: "var(--line-strong)" }}
            >
              <div className="display text-[44px] tracking-[-.04em] leading-none">
                {n}
              </div>
              <div className="mt-2 mono text-[11px] uppercase tracking-[.16em] text-zinc-500">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
