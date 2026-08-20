const COLUMNS = [
  "Trench in grid",
  "Solar + battery",
  "Generator",
  "Go without",
  "Sitepulse",
] as const;

type Row = { label: string; cells: readonly [string, string, string, string, string] };

const ROWS: ReadonlyArray<Row> = [
  {
    label: "Time to live",
    cells: ["Months", "Days – weeks", "Hours", "—", "Same week"],
  },
  { label: "Winter", cells: ["Fine", "Browns out", "Fine", "—", "Fine"] },
  { label: "Noise", cells: ["Silent", "Silent", "Constant", "—", "Silent ~90%"] },
  {
    label: "Refuel / service",
    cells: ["None", "Battery swaps", "Weekly truck roll", "—", "Scheduled off telemetry"],
  },
  {
    label: "Footprint",
    cells: ["Trench + permits", "1,000 W of panel", "Trailer", "—", "90 lb box"],
  },
  {
    label: "You find out it’s down",
    cells: ["—", "When data stops", "When data stops", "Always", "Before it happens"],
  },
];

const GRID = "grid grid-cols-[1.3fr_repeat(5,1fr)]";

export function Comparison() {
  return (
    <section className="section" id="options">
      <div className="wrap">
        <div className="section-hd">
          <span className="idx">02 / COMPARISON</span>
        </div>

        <h2
          className="section-h2 mb-6 max-w-[900px]"
          style={{ fontSize: "clamp(34px, 5vw, 56px)" }}
        >
          If you need power somewhere there isn&apos;t any,
          <br />
          <span style={{ color: "var(--mute)" }}>you&apos;ve got four bad choices.</span>
        </h2>

        <p className="max-w-[720px] text-[var(--mute)] text-[17px] leading-[1.55] m-0 mb-14">
          Trench, solar, generator, or go without. Here&apos;s what each of them actually
          looks like when the job is to keep a small instrument alive for a month with
          nobody driving out.
        </p>

        <div
          className="border overflow-x-auto"
          style={{ borderColor: "var(--line-strong)" }}
        >
          <div className="min-w-[900px]">
            <div className={GRID}>
              <div className="th" />
              {COLUMNS.map((c) => (
                <div key={c} className={c === "Sitepulse" ? "th hi" : "th"}>
                  {c}
                </div>
              ))}
            </div>

            {ROWS.map((row) => (
              <div
                key={row.label}
                className={`${GRID} border-t`}
                style={{ borderColor: "var(--line)" }}
              >
                <div className="cell mono text-[11px] tracking-[.16em] uppercase text-[var(--mute)]">
                  {row.label}
                </div>
                {row.cells.map((cell, i) => (
                  <div
                    key={i}
                    className={
                      i === row.cells.length - 1
                        ? "cell hi text-[14px] font-semibold"
                        : "cell text-[14px]"
                    }
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-[40px_1fr] gap-6 max-w-[900px]">
          <div className="w-0.5 bg-[var(--paper)] justify-self-end" />
          <div>
            <p className="text-[22px] leading-[1.4] m-0 tracking-[-.01em]">
              Met One&apos;s own manual says powering a single{" "}
              <span className="num font-semibold">50-watt</span> dust monitor off-grid
              takes <span className="num font-semibold">290–1,010 W of solar panel</span>{" "}
              plus <span className="num font-semibold">seven 110 Ah batteries</span> — and
              North Idaho in December is the 1,010 W end.
            </p>
            <div className="mono text-[10.5px] tracking-[.18em] text-[var(--mute)] mt-4">
              SOURCE / MET ONE E-BAM OPERATING MANUAL
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
