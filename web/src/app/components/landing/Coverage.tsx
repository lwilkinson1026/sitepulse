type Drive = { city: string; time: string; tier: string; tier1: boolean };

const DRIVE_TIMES: ReadonlyArray<Drive> = [
  { city: "Spokane", time: "40 min", tier: "TIER 1", tier1: true },
  { city: "Silver Valley (Kellogg / Wallace)", time: "45 min", tier: "TIER 1", tier1: true },
  { city: "Sandpoint / Bonners Ferry", time: "1.5 h", tier: "TIER 1", tier1: true },
  { city: "Lewiston / Clarkston", time: "1.75 h", tier: "TIER 1", tier1: true },
  { city: "Missoula", time: "2.5 h", tier: "TIER 1", tier1: true },
  { city: "Tri-Cities", time: "3.5 h", tier: "TIER 2", tier1: false },
  { city: "Boise", time: "7.5 h", tier: "PICKUP", tier1: false },
];

const TIER_1 = ["IDAHO", "EASTERN WASHINGTON", "WESTERN MONTANA"];
const TIER_2 = ["CENTRAL WA", "SOUTHERN IDAHO", "CENTRAL MT"];

/** Schematic service map — deliberately abstract, not a real projection. */
function ServiceMap() {
  const cities: ReadonlyArray<readonly [number, number, string, number, number]> = [
    [200, 195, "SPOKANE", 196, 188],
    [285, 180, "SILVER VALLEY", 285, 174],
    [270, 130, "SANDPOINT", 270, 124],
    [215, 270, "LEWISTON", 215, 286],
    [360, 230, "MISSOULA", 360, 224],
    [130, 240, "TRI-CITIES", 130, 256],
  ];

  return (
    <div
      className="relative aspect-[5/4] border overflow-hidden"
      style={{ borderColor: "var(--line-strong)", background: "#050505" }}
    >
      <div className="grid-bg absolute inset-0" style={{ opacity: 0.5 }} />

      <div className="mono absolute top-4 left-5 text-[10px] tracking-[.2em] text-[var(--mute)]">
        ID · WA · MT
      </div>
      <div className="mono absolute top-4 right-5 text-[10px] tracking-[.2em] text-[var(--mute)]">
        SERVICE MAP
      </div>

      <svg
        viewBox="0 0 500 400"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Schematic service map centred on Coeur d'Alene, Idaho, showing a three-hour full-service radius and an outer pickup-or-freight ring"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <radialGradient id="tier1grad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <circle
          cx="250"
          cy="200"
          r="140"
          fill="url(#tier1grad)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
        />
        <circle
          cx="250"
          cy="200"
          r="260"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        <line x1="240" y1="200" x2="260" y2="200" stroke="rgba(255,255,255,0.8)" />
        <line x1="250" y1="190" x2="250" y2="210" stroke="rgba(255,255,255,0.8)" />
        <circle cx="250" cy="200" r="4" fill="white" />

        <g fill="rgba(255,255,255,0.6)">
          {cities.map(([cx, cy, name]) => (
            <circle key={name} cx={cx} cy={cy} r="2" />
          ))}
        </g>
        <g
          className="mono"
          style={{ fill: "rgba(255,255,255,0.7)", fontSize: 9, letterSpacing: ".1em" }}
        >
          {cities.map(([, , name, tx, ty]) => (
            <text key={name} x={tx} y={ty}>
              {name}
            </text>
          ))}
        </g>

        <g>
          <text
            x="258"
            y="220"
            className="mono"
            style={{ fill: "white", fontSize: 10, fontWeight: 700, letterSpacing: ".12em" }}
          >
            COEUR D&apos;ALENE
          </text>
          <text
            x="258"
            y="232"
            className="mono"
            style={{ fill: "rgba(255,255,255,0.5)", fontSize: 8, letterSpacing: ".14em" }}
          >
            HQ
          </text>
        </g>
      </svg>

      <div className="absolute bottom-4 left-5 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 border"
            style={{
              borderColor: "rgba(255,255,255,0.5)",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <span className="mono text-[10px] tracking-[.12em] text-[var(--mute)]">
            3H RADIUS · FULL SERVICE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 border border-dashed"
            style={{ borderColor: "rgba(255,255,255,0.3)" }}
          />
          <span className="mono text-[10px] tracking-[.12em] text-[var(--mute)]">
            TIER 2 · PICKUP
          </span>
        </div>
      </div>
    </div>
  );
}

export function Coverage() {
  return (
    <section className="section" id="coverage">
      <div className="wrap">
        <div className="section-hd">
          <span className="idx">05 / COVERAGE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start">
          <div>
            <h2
              className="section-h2 mb-6"
              style={{ fontSize: "clamp(34px, 5vw, 56px)" }}
            >
              A <span style={{ color: "var(--mute)" }}>three-hour</span> delivered radius.
            </h2>
            <p className="text-[var(--mute)] text-[17px] leading-[1.55] m-0 mb-8">
              Everything inside is full-service — we deliver, install, monitor, and refuel.
              Everything outside is customer pickup or freight, priced separately.
            </p>

            <div className="mb-8">
              <div className="mono text-[10.5px] tracking-[.18em] mb-3.5">
                TIER 1 · FULL-SERVICE
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {TIER_1.map((r) => (
                  <span key={r} className="badge" style={{ color: "var(--paper)" }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="mono text-[10.5px] tracking-[.18em] text-[var(--mute)] mb-3.5">
                TIER 2 · PICKUP OR FREIGHT
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {TIER_2.map((r) => (
                  <span key={r} className="badge">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 border-t pt-5" style={{ borderColor: "var(--line)" }}>
              <div className="eyebrow mb-4">FROM COEUR D&apos;ALENE, ID</div>
              {DRIVE_TIMES.map((d) => (
                <div
                  key={d.city}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-2.5 border-b"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="text-[14px]">{d.city}</span>
                  <span className="num text-[13px] text-[var(--mute)]">{d.time}</span>
                  <span
                    className="mono text-[9.5px] tracking-[.14em]"
                    style={{ color: d.tier1 ? "var(--paper)" : "var(--mute)" }}
                  >
                    {d.tier}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <ServiceMap />
        </div>

        <div
          className="mt-10 px-6 py-5 border-l-2"
          style={{
            borderColor: "var(--paper)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <p className="m-0 text-[14px] text-[var(--mute)] leading-[1.55] max-w-[900px]">
            <span className="text-[var(--paper)] font-semibold">
              We don&apos;t cover Oregon.
            </span>{" "}
            The parts of Oregon that need this are 8–9 hours away across the Cascades.
            Delivered service there would cost more than the box. If you&apos;re on that
            side, we can talk about freight — but it&apos;s not the same product.
          </p>
        </div>
      </div>
    </section>
  );
}
