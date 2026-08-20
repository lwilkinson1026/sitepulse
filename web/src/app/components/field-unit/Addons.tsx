type Addon = {
  name: string;
  note: string;
  draw: string;
  /** Share of the daily energy budget, as displayed. */
  pct: string;
  pctBar: number;
  /** Highlighted when the add-on is expensive enough to think twice about. */
  flagged?: boolean;
  price: string;
};

const ADDONS: ReadonlyArray<Addon> = [
  {
    name: "App-controlled outlets + alerts",
    note: "Pure margin. Zero watts. Start here.",
    draw: "0 W",
    pct: "none",
    pctBar: 0,
    price: "$49",
  },
  {
    name: "Site camera + event recording",
    note: "24/7 IP camera with edge storage",
    draw: "25 W",
    pct: "16%",
    pctBar: 16,
    price: "$99",
  },
  {
    name: "LED work lighting",
    note: "4 h/day duty cycle",
    draw: "~17 W avg",
    pct: "10%",
    pctBar: 10,
    price: "$39",
  },
  {
    name: "Weather / environmental sensors",
    note: "Temp · humidity · barometric · wind",
    draw: "5 W",
    pct: "3%",
    pctBar: 3,
    price: "$79",
  },
  {
    name: "Water filtration (creek/well/tank)",
    note: "SHURflo pump + Viqua UV. Filtration only.",
    draw: "26–82 W intermittent + 17 W",
    pct: "1–3%",
    pctBar: 3,
    price: "$149",
  },
  {
    name: "Freeze protection (heat trace + tank pad)",
    note: "Binding winter constraint. Spec it before filtration.",
    draw: "100 W winter",
    pct: "⚠ 63%",
    pctBar: 63,
    flagged: true,
    price: "$99",
  },
  {
    name: "Second unit — runtime + redundancy",
    note: 'N+1. Not "4 kW." Two 2 kW islands. If one fails the site stays up.',
    draw: "—",
    pct: "doubles silent",
    pctBar: 100,
    price: "$900",
  },
];

const FLAG_COLOR = "#fbbf24";
const GRID = "grid grid-cols-[2fr_1fr_1.2fr_1fr]";

export function Addons() {
  return (
    <section className="section" id="addons">
      <div className="wrap">
        <div className="section-hd">
          <span className="idx">04 / ADD-ONS</span>
        </div>

        <h2
          className="section-h2 mb-6 max-w-[900px]"
          style={{ fontSize: "clamp(34px, 5vw, 56px)" }}
        >
          Priced in dollars <span style={{ color: "var(--mute)" }}>and</span> watts.
        </h2>
        <p className="max-w-[720px] text-[var(--mute)] text-[17px] leading-[1.55] m-0 mb-14">
          Every add-on eats into the same daily energy budget as your instruments. We show
          the cost in both currencies. If a percent is highlighted, that&apos;s the one you
          should think twice about.
        </p>

        <div className="border overflow-x-auto" style={{ borderColor: "var(--line-strong)" }}>
          <div className="min-w-[760px]">
            <div className={GRID}>
              <div className="th">Add-on</div>
              <div className="th">Draw</div>
              <div className="th">Share of daily budget</div>
              <div className="th text-right">Monthly</div>
            </div>

            {ADDONS.map((a) => {
              const color = a.flagged ? FLAG_COLOR : "var(--paper)";
              return (
                <div
                  key={a.name}
                  className={`${GRID} border-t items-center`}
                  style={{ borderColor: "var(--line)" }}
                >
                  <div className="cell">
                    <div className="text-[15px] font-medium">{a.name}</div>
                    <div className="mono text-[10.5px] text-[var(--mute)] mt-1 tracking-[.06em]">
                      {a.note}
                    </div>
                  </div>
                  <div className="cell num text-[13px] text-[var(--mute)]">{a.draw}</div>
                  <div className="cell">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-1 h-1 relative overflow-hidden"
                        style={{ background: "var(--line)" }}
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0"
                          style={{ width: `${a.pctBar}%`, background: color }}
                        />
                      </div>
                      <span
                        className="num text-[12px] min-w-[44px] text-right"
                        style={{ color, fontWeight: a.flagged ? 700 : 500 }}
                      >
                        {a.pct}
                      </span>
                    </div>
                  </div>
                  <div className="cell num text-[18px] font-semibold text-right">
                    {a.price}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border p-7" style={{ borderColor: "var(--line-strong)" }}>
            <div className="mono text-[10.5px] tracking-[.18em] text-[var(--mute)] mb-3">
              DROPPED — AND WHY
            </div>
            <h3 className="text-[22px] m-0 mb-4 font-bold tracking-[-.01em]">
              Atmospheric water generation
            </h3>
            <p className="text-[var(--mute)] text-[14px] leading-[1.6] m-0 mb-4">
              Best-case energy intensity is{" "}
              <span className="num text-[var(--paper)]">0.3 kWh per litre</span>. One gallon
              a day is a third of the entire budget. In a North Idaho winter it doesn&apos;t
              degrade — it stops: at{" "}
              <span className="num text-[var(--paper)]">5 °C / 40 % RH</span> the dew point
              is <span className="num text-[var(--paper)]">−7.5 °C</span> and the coil makes
              frost, not water.
            </p>
            <div className="mono text-[10.5px] text-[var(--mute)] tracking-[.1em]">
              SOURCE / EPA LCA · WATERGEN + ECOLOBLUE
            </div>
          </div>

          <div className="border p-7" style={{ borderColor: "var(--line-strong)" }}>
            <div className="mono text-[10.5px] tracking-[.18em] mb-3">KEPT — AND WHY</div>
            <h3 className="text-[22px] m-0 mb-4 font-bold tracking-[-.01em]">
              Filtration from an existing source
            </h3>
            <p className="text-[var(--mute)] text-[14px] leading-[1.6] m-0 mb-4">
              A SHURflo pump at{" "}
              <span className="num text-[var(--paper)]">26–82 W intermittent</span> plus a
              Viqua UV at <span className="num text-[var(--paper)]">17 W</span> is{" "}
              <span className="num text-[var(--paper)]">0.02–0.4 kWh/day</span> — one to
              three percent of budget. Spec heat trace <em>before</em> filtration; it&apos;s
              the binding constraint in winter.
            </p>
            <div className="mono text-[10.5px] text-[var(--mute)] tracking-[.1em]">
              CREEK · WELL · TANK
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
