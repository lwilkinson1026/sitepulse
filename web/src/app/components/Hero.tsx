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
        <video
          src="/assets/hero.mp4"
          poster="/assets/hero-lifestyle.png"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Sitepulse 2400W Hybrid Inverter in field operation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 70%, rgba(0,0,0,.65) 100%)",
          }}
        />

        {/* TOP-LEFT: unit identity */}
        <div className="absolute top-6 left-6 mono text-[10px] tracking-[.22em] text-zinc-300 uppercase">
          <div>UNIT-001 · BOZEMAN PLANT</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="pulse-dot" />
            <span className="text-[var(--hi)]">LIVE TELEMETRY</span>
          </div>
        </div>

        {/* TOP-RIGHT: meters */}
        <div className="absolute top-6 right-6 w-[220px]">
          <div className="mono text-[10px] tracking-[.18em] text-zinc-200 uppercase flex justify-between">
            <span>Battery SOC</span>
            <span className="text-[var(--hi)]">87%</span>
          </div>
          <div className="mt-1.5 h-[3px] bg-white/15">
            <div
              className="h-full bg-[var(--hi)] meter-fill"
              style={{ width: "87%" }}
            />
          </div>
          <div className="mt-3 mono text-[10px] tracking-[.18em] text-zinc-200 uppercase flex justify-between">
            <span>Load</span>
            <span className="text-[var(--run)]">26 W</span>
          </div>
          <div className="mt-1.5 h-[3px] bg-white/15">
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

        {/* BOTTOM-LEFT: chassis spec */}
        <div className="absolute bottom-6 left-6 mono text-[10px] tracking-[.22em] text-zinc-300 uppercase">
          <div>~90 LB DRY</div>
          <div className="mt-1">IP65 · −20°C TO +50°C</div>
        </div>

        {/* BOTTOM-RIGHT: service status */}
        <div className="absolute bottom-6 right-6 mono text-[10px] tracking-[.22em] text-zinc-300 uppercase text-right">
          <div className="text-zinc-100">CYCLE 2,418 / 6,000</div>
          <div className="mt-1">NEXT SVC: 2,082 H</div>
        </div>

        {/* corner ticks */}
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
      </div>
      <div className="mt-3 mono text-[10px] tracking-[.22em] text-zinc-500 uppercase text-center">
        FIG. 01 · SITEPULSE V1 · 2400W HYBRID INVERTER · 90 LB DRY · IP65
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
